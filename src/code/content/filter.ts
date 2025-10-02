import { BrowserEvents, customEvents, youTubeEvents } from "./events";
import Observer, {
  EmittedNodeEventHandler,
  ObservedElementDetail,
} from "./observer";
import { YouTubePageTypes } from "./types";
import Element from "./element";
import { MessagePayload } from "../browser-api/types";
import {
  isExtensionEnabled,
  updateHiddenVideoCount,
  updateVideoCount,
} from "../browser-api";
import { debounce } from "../utils";
import { selectors } from "./selectors";
import YouTube from "../utils/youtube";
import Dom from "./dom";

export interface Options {
  watchedFilterEnabled: boolean;
  membersOnlyFilterEnabled: boolean;
  showVideoNumbers: boolean;
}

export default class Filter {
  watchedFilterEnabled: boolean = true;
  membersOnlyFilterEnabled: boolean = true;
  videoElementsHidden = new Set();
  youTube = new YouTube();
  element = new Element();
  updateVideoCount = debounce(() => {
    void updateVideoCount(this.element.videoCount);
    void updateHiddenVideoCount(this.element.hiddenVideoCount);
  }, 100);
  numberVideos = debounce(async () => {
    if (
      (await isExtensionEnabled()) &&
      this.options.showVideoNumbers &&
      process.env.NODE_ENV === "development"
    ) {
      this.options.showVideoNumbers && this.element.numberVideos();
    }
  }, 100);

  cleanUpProcedures: (() => void)[] = [];

  public constructor(public options: Options) {
    this.watchedFilterEnabled = this.options.watchedFilterEnabled;
    this.membersOnlyFilterEnabled = this.options.membersOnlyFilterEnabled;

    this.addYtNavigateFinishEventListener();
    this.establishCommunicationWithBackground();
  }

  get youTubePageType() {
    const pageType = this.youTube.getActionablePageType(window.location.href);

    if (!pageType) {
      throw new Error("YouTubePageType not found.");
    }

    return pageType;
  }

  private cleanUp() {
    this.cleanUpProcedures.forEach((procedure) => {
      procedure();
    });

    if (this.cleanUpProcedures.length) {
      console.info("Clean up done");
      this.cleanUpProcedures = [];
    } else {
      console.info(`Nothing to clean up`);
    }
  }

  private async run(pageType: YouTubePageTypes) {
    console.info(`*** Running filter on ${pageType} ***`);

    this.element.pageType = pageType;
    const contents = await this.element.waitForAndGetAndSetContents();
    const { videoElementTagName } = this.element;
    this.addContentsObserver(contents, videoElementTagName);
    this.addChipsListener();

    this.cleanUpProcedures.push(
      () => {
        this.videoElementsHidden.clear();
        console.info(
          `Cleared the Set of ${this.videoElementsHidden.size} hidden video elements`,
        );
      },
      () => {
        if (
          this.options.showVideoNumbers &&
          process.env.NODE_ENV === "development" &&
          contents
        ) {
          const unNumberedVideoCount = this.element.unNumberVideos();
          console.info(
            `Removed ${unNumberedVideoCount} ${selectors.videoNumberClass} elements from the DOM`,
          );
        }
      },
    );

    await this.filterLoadedVideos();
  }

  addContentsObserver(
    contents: HTMLElement,
    videoElementTagName: string | undefined,
  ) {
    if (!videoElementTagName) {
      throw new Error(
        `video element tag name must not be ${videoElementTagName}`,
      );
    }

    const handler: EmittedNodeEventHandler = (event) => {
      this.processNode(event.detail, videoElementTagName);
      this.updateVideoCount();
      this.numberVideos();
    };

    const eventBus = new EventTarget();
    const args: [string, EventListener] = [
      customEvents.observedElement,
      handler as EventListener,
    ];

    eventBus.addEventListener(...args);
    this.cleanUpProcedures.push(() => {
      eventBus.removeEventListener(...args);
    });

    const observer: Observer = new Observer(contents, eventBus, [
      `.${selectors.videoNumberClass}`,
    ]);
    observer.activate();
    this.cleanUpProcedures.push(() => {
      observer.deactivate();
    });
  }

  private processNode(
    detail: ObservedElementDetail,
    videoElementTagName: string,
  ) {
    const { element, action } = detail;
    const triggeringElement = element;

    switch (action) {
      case "addedNodes":
        const videoElement = Dom.getAncestor(
          videoElementTagName,
          triggeringElement,
        );

        if (
          !videoElement ||
          this.videoElementsHidden.has(videoElement) ||
          !this.shouldHideVideo(triggeringElement)
        ) {
          return;
        }

        this.hideVideo(videoElement);
        break;
      case "removedNodes":
        const triggeringElementIsVideo = triggeringElement.matches(
          selectors.video[this.youTubePageType],
        );

        if (triggeringElementIsVideo) {
          this.videoElementsHidden.delete(triggeringElement);
        }
        break;
      default:
    }
  }

  /**
   * @param element - can be a video element or an element inside a video. The element and its children are checked recursively for the presence of elements that indicate the video should get hidden, based on the enabled filters
   */
  private shouldHideVideo(element: HTMLElement) {
    if (this.watchedFilterEnabled && this.element.hasProgressBar(element)) {
      return true;
    }

    return (
      this.membersOnlyFilterEnabled && this.element.hasMembersOnlyBadge(element)
    );
  }

  private hideVideo(video: HTMLElement) {
    Dom.setVisibility(video, true);
    this.videoElementsHidden.add(video);
  }

  private showVideo(video: HTMLElement) {
    Dom.setVisibility(video, false);
  }

  private async filterLoadedVideos() {
    for (const video of this.element.videos) {
      if ((await isExtensionEnabled()) && this.shouldHideVideo(video)) {
        this.hideVideo(video);
      } else {
        this.showVideo(video);
      }
    }

    this.updateVideoCount();
    this.numberVideos();
  }

  private addChipsListener() {
    const handler = async (event: Event) => {
      const chipHasBeenClicked = this.element.hasChipBeenClicked(event);

      if (chipHasBeenClicked) {
        this.cleanUp();

        if (await isExtensionEnabled()) {
          void this.run(this.youTubePageType);
        }
      }
    };

    const args: [string, EventListener, AddEventListenerOptions] = [
      "click",
      handler,
      { capture: true } /* bubble has event propagation stopped */,
    ];
    document.addEventListener(...args);
    this.cleanUpProcedures.push(() => {
      document.removeEventListener(...args);
    });
  }

  /* url changed within a tab, by clicking on link or reloading page */
  /* There is no straightforward way to determine when new-page videos have fully replaced previous-page videos on SPA (non-page-reload) navigation. erroneously, YouTube dispatches this event before DOM mutations have completed, which means that at this point the contents element may contain stale video elements from previous url, and video count is usually incorrect until the DOM stops mutating, which is not predictable because long pauses may occur between mutations. Mutation Observer addresses this issue. */
  private addYtNavigateFinishEventListener() {
    const handler = async (event: Event) => {
      console.info(youTubeEvents.ytNavigateFinish, "event:", event);

      this.cleanUp();

      try {
        if (await isExtensionEnabled()) {
          void this.run(this.youTubePageType);
        }
      } catch (e) {
        console.info(
          `Page type missing initially means extension should not run on this page`,
        );
      }
    };

    window.addEventListener(youTubeEvents.ytNavigateFinish, handler);
  }

  private establishCommunicationWithBackground() {
    // Listen for toggle messages initiated by popup and by background script, which are sent while on YouTubePageTypes pages only
    browser.runtime.onMessage.addListener(
      async (message: MessagePayload, _sender, _sendResponse) => {
        const {
          tabId,
          extensionIsEnabled,
          browserEvent,
          currentYouTubePageType,
        } = message;

        console.info("tabId:", tabId);
        console.info("browser event:", browserEvent);

        if (
          currentYouTubePageType &&
          extensionIsEnabled &&
          [
            BrowserEvents.StorageOnChanged /* extension just toggled on */,
            BrowserEvents.TabsOnActivated /* navigated to new tab */,
          ].includes(browserEvent)
        ) {
          this.cleanUp();
          void this.run(currentYouTubePageType);

          return;
        }

        if (
          extensionIsEnabled &&
          BrowserEvents.TabsOnUpdated === browserEvent
        ) {
          /* BrowserEvents.TabsOnUpdated debounced can fire even after youTubeEvents.ytNavigateFinish, on full page reload, which makes it useless for handling any logic */

          return;
        }

        if (
          /* extension just toggled off */
          !extensionIsEnabled &&
          BrowserEvents.StorageOnChanged === browserEvent
        ) {
          await this.filterLoadedVideos();
          this.cleanUp();
        }
      },
    );
  }
}
