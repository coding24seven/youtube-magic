export enum BrowserEvents {
  TabsOnActivated = "browser.tabs.OnActivated" /* user switched to new tab */,
  TabsOnUpdated = "browser.tabs.OnUpdated" /* url changed in the same tab, with or without page reload */,
  StorageOnChanged = "browser.storage.onChanged",
}

export const youTubeEvents = {
  ytNavigateFinish: "yt-navigate-finish",
  ytPageDataUpdated: "yt-page-data-updated",
};

export const customEvents = {
  observedElement: "observedElement",
};
