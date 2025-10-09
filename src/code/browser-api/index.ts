/* `browser.tabs` API is only available from background and popup scripts */
/* `browser.storage` API is available from all scripts */

import {
  MessagePayload,
  State,
  StateChanges,
  UpdateIconProperties,
  UpdateStateProperties,
} from "./types";
import YouTube from "../utils/youtube";
import { FilterNames, ViewOptionNames } from "../types";
import Tab = browser.tabs.Tab;

const youTube = new YouTube();

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

export async function isFilterEnabled(filterName: FilterNames) {
  return !!(await loadState()).filters?.[filterName];
}

export async function toggleFilter(filterName: FilterNames) {
  const { filters } = await loadState();

  return setState({
    filters: { ...filters, [filterName]: !filters[filterName] },
  });
}

export async function isOptionEnabled(optionName: ViewOptionNames) {
  return !!(await loadState()).options?.[optionName];
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
  payload: MessagePayload,
) {
  if (typeof activeTabId !== "number") {
    console.error("missing activeTabId");

    return;
  }

  await browser.tabs.sendMessage(activeTabId, payload);
}

export async function update({
  extensionIsEnabled,
  browserEvent,
  activeTab,
}: UpdateStateProperties) {
  const isEnabled = extensionIsEnabled || (await isExtensionEnabled());
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
      extensionIsEnabled: isEnabled,
      tabId,
      currentYouTubePageType: currentYouTubePageType,
    });
  }

  void updateExtensionIcon({ extensionIsEnabled: isEnabled, tabUrl: tabUrl });
}

export async function updateExtensionIcon({
  extensionIsEnabled,
  tabUrl,
}: UpdateIconProperties) {
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
  callbackListener: (changes: any) => void,
) {
  const listener = async (changes: StateChanges, area: string) => {
    console.info("storage.onChanged, changes:", changes);

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

  return () => {
    browser.storage.onChanged.removeListener(listener);
  };
}
