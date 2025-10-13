/* `browser.tabs` API is only available from background and popup scripts */
/* `browser.storage` API is available from all scripts */

import {
  UpdateProperties,
  MessageToContentPayload,
  State,
  StateChanges,
  UpdateIconProperties,
} from "./types";
import YouTube from "../utils/youtube";
import { FilterNames, ViewOptionNames } from "../types";
import Tab = browser.tabs.Tab;

const youTube = new YouTube();

const initialFilters = {
  watched: true,
  membersOnly: false,
};

const initialOptions = {
  videoNumbersAreShown: false,
};

async function init() {
  const state = await loadState();
  if (!state.filters) {
    state.filters = initialFilters;
    void setState(state);
  }

  if (!state.options) {
    state.options = initialOptions;
    void setState(state);
  }
}

void init();

export function loadState() {
  return browser.storage.local.get() as Promise<State>;
}

export async function setState(state: Partial<State>) {
  return browser.storage.local.set(state);
}

export async function isExtensionEnabled() {
  return !!(await loadState()).extensionIsEnabled;
}

export async function toggleExtensionIsEnabled() {
  return setState({
    extensionIsEnabled: !(await isExtensionEnabled()),
  });
}

export async function loadFilters() {
  return (await loadState()).filters;
}

export async function toggleFilter(filterName: FilterNames) {
  const { filters } = await loadState();

  return setState({
    filters: { ...filters, [filterName]: !filters[filterName] },
  });
}

export async function loadOptions() {
  return (await loadState()).options;
}

export async function toggleOption(optionName: ViewOptionNames) {
  const { options } = await loadState();

  return setState({
    options: { ...options, [optionName]: !options[optionName] },
  });
}

export async function loadVideoCount() {
  return (await loadState()).videoCount;
}

export function updateVideoCount(videoCount: number) {
  return setState({ videoCount });
}

export async function loadHiddenVideoCount() {
  return (await loadState()).hiddenVideoCount;
}

export function updateHiddenVideoCount(hiddenVideoCount: number) {
  return setState({ hiddenVideoCount });
}

export async function queryActiveTab() {
  const browserTabs = (await browser.tabs.query({
    active: true,
    currentWindow: true,
  })) as [Tab];
  const [activeBrowserTab] = browserTabs;

  return activeBrowserTab;
}

export async function sendMessageToContent(
  activeTabId: number | undefined,
  payload: MessageToContentPayload,
) {
  if (typeof activeTabId !== "number") {
    console.error("missing activeTabId");

    return;
  }

  await browser.tabs.sendMessage(activeTabId, payload);
}

/*
 * updates popup icon
 * sends message from background script to content script, on relevant YouTube pages, when user has switched to new tab or url has changed in the same tab
 */
export async function update({ browserEvent, activeTab }: UpdateProperties) {
  const extensionIsEnabled = await isExtensionEnabled();
  void updateExtensionIcon({ extensionIsEnabled });

  if (!extensionIsEnabled) return;

  const tab = activeTab || (await queryActiveTab());
  const tabId = tab.id;
  const tabUrl = tab.url;

  if (!tabId || !tabUrl) {
    throw new Error(`tabId: ${tabId}. tabUrl: ${tabUrl}`);
  }

  const currentYouTubePageType = youTube.getActionablePageType(tabUrl);

  if (currentYouTubePageType) {
    void sendMessageToContent(tabId, {
      browserEvent,
      tabId /* redundant atm */,
    });
  }
}

export async function updateExtensionIcon({
  extensionIsEnabled,
}: UpdateIconProperties) {
  const tab = await queryActiveTab();
  const tabUrl = tab.url;

  const iconPath =
    extensionIsEnabled && (await extensionCanRunOnCurrentPageType(tabUrl))
      ? "media/icons/extension-is-enabled.png"
      : "media/icons/extension-is-disabled.png";
  void browser.browserAction.setIcon({ path: iconPath });
}

export async function extensionCanRunOnCurrentPageType(activeTabUrl?: string) {
  const url = activeTabUrl || (await queryActiveTab()).url;

  if (!url) {
    console.error("missing url for active tab");

    return false;
  }

  return !!youTube.getActionablePageType(url);
}

export function addBrowserStorageListener(
  eventName: "onChanged",
  callbackListener: (changes: StateChanges) => void,
) {
  const listener = async (changes: StateChanges, area: string) => {
    if (area !== "local") {
      return;
    }

    callbackListener(changes);
  };

  switch (eventName) {
    case "onChanged":
      browser.storage.onChanged.addListener(listener);
      break;
    default:
  }
}

/*
 * content script retrieves current-tab id and active tab id from background script, which has access to `browser.tabs`, and compares them
 */
export async function isActiveTab() {
  const { currentTabId, activeTabId } = await browser.runtime.sendMessage({
    action: "getTabIds",
  });
  return (
    !isNaN(currentTabId) && !isNaN(activeTabId) && currentTabId === activeTabId
  );
}
