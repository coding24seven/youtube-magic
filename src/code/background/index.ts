import { addBrowserStorageListener, update } from "../browser-api";
import { debounceUpdate } from "./utils";
import { BrowserEvents } from "../content/events";
import { StateChanges } from "../browser-api/types";

console.info("background script running");

// Update when the active tab changes
browser.tabs.onActivated.addListener(async (info) => {
  console.info("browser.tabs.onActivated, info:", info);
  void update({
    browserEvent: BrowserEvents.TabsOnActivated,
  });
});

/* As this fires multiple times when url changes within the same tab, or page is reloaded, debouncing is employed. Atm it updates extension icon only and is ignored in content script */
const getDebouncedTab = debounceUpdate(100);
browser.tabs.onUpdated.addListener(async (_tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    const lastTab = await getDebouncedTab(tab);
    console.info("browser.tabs.onUpdated, tab:", lastTab, changeInfo);
    void update({
      browserEvent: BrowserEvents.TabsOnUpdated,
      activeTab: lastTab,
    });
  }
});

// Update when the storage state changes
addBrowserStorageListener("onChanged", async (changes: StateChanges) => {
  const browserEvent = BrowserEvents.StorageOnChanged;
  const updatableChanges = [
    changes.extensionIsEnabled,
    changes.filters,
    changes.options,
  ];

  const noUpdatableChangesMade = !updatableChanges.some((hasChanged) =>
    Boolean(hasChanged),
  );

  if (noUpdatableChangesMade) {
    return;
  }

  const updateProperties = {
    browserEvent,
    ...(changes.extensionIsEnabled && {
      extensionIsEnabled: changes.extensionIsEnabled.newValue,
    }),
    ...(changes.filters && {
      filters: changes.filters.newValue,
    }),
    ...(changes.options && {
      options: changes.options.newValue,
    }),
  };

  void update(updateProperties);
});
