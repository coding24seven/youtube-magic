import {
  addBrowserStorageListener,
  queryActiveTab,
  updateExtensionIcon,
  updateTabContent,
} from '../browser-api';
import { debounceUpdate } from './utils';
import { BrowserEvents } from '../content/events';
import { StateChanges } from '../browser-api/types';

addBrowserStorageListener('onChanged', async (changes: StateChanges) => {
  if (changes.extensionIsEnabled) {
    void updateExtensionIcon({
      extensionIsEnabled: changes.extensionIsEnabled.newValue,
    });
  }
});

/* when user switches to new tab */
browser.tabs.onActivated.addListener(async (info) => {
  void updateTabContent({
    browserEvent: BrowserEvents.TabsOnActivated,
    previousTabId: info.previousTabId,
  });
});

/* As this fires multiple times when url changes within the same tab, or page is reloaded, debouncing is employed. Atm it updates extension icon only and is ignored in content script */
const getDebouncedTab = debounceUpdate(100);
browser.tabs.onUpdated.addListener(async (_tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    const lastTab = await getDebouncedTab(tab);
    void updateTabContent({
      browserEvent: BrowserEvents.TabsOnUpdated,
      activeTab: lastTab,
    });
  }
});

/*
 * Only one `onMessage` listener can be added, as non-relevant listeners will return `undefined` to `sendMessage` call if they fire first
 * gets tab ids and sends them back to content script
 * `sendResponse` is not used as it requires a callback argument in `browser.runtime.sendMessage`
 */
browser.runtime.onMessage.addListener(
  async (message: { action: 'getTabIds' }, sender, _sendResponse) => {
    if (message.action !== 'getTabIds') {
      throw new Error('actions other than `getTabIds` are not allowed');
    }

    const activeTab = await queryActiveTab();
    const activeTabId = activeTab.id;

    if (!sender.tab) {
      console.info('getTabIds: No tab object exists on sender');
      return { activeTabId };
    }

    return { contentTabId: sender.tab.id, activeTabId };
  },
);

browser.management.onInstalled.addListener((_info) => {
  void updateTabContent({
    browserEvent: BrowserEvents.ManagementOnInstalled,
  });
});
