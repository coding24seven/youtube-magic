import {
  addBrowserStorageListener,
  extensionShouldRunOnCurrentPage,
  isExtensionEnabled,
  loadHiddenVideoCount,
  loadVideoCount,
  toggleExtensionIsEnabled,
} from "../browser-api";
import { selectors } from "./selectors";
import {
  getExtensionShouldNotRunElement,
  getToggleFilterButton,
  hideElement,
  hideVideoCounts,
  setButtonText,
  setHiddenVideoCountElementText,
  setVideoCountElementText,
  showElement,
  showVideoCounts,
} from "./elements";
import { StateChanges } from "../browser-api/types";

async function main() {
  const popupElement = await getPopupElement();

  if (popupElement?.matches(`#${selectors.toggleFilterButtonId}`)) {
    await addEventListeners(popupElement);
  }
}

async function addEventListeners(buttonElement: HTMLElement) {
  buttonElement.addEventListener("click", toggleExtensionIsEnabled);

  // Update when the storage state changes, while popup is open
  addBrowserStorageListener("onChanged", async (changes: StateChanges) => {
    if (changes.extensionIsEnabled) {
      const extensionIsEnabled = changes.extensionIsEnabled.newValue;
      await setButtonText({
        buttonElement,
        extensionIsEnabled,
      });
    } else if (changes.videoCount) {
      setVideoCountElementText(changes.videoCount.newValue);
    } else if (changes.hiddenVideoCount) {
      setHiddenVideoCountElementText(changes.hiddenVideoCount.newValue);
    }

    (await isExtensionEnabled()) ? showVideoCounts() : hideVideoCounts();
  });
}

async function getPopupElement() {
  const toggleFilterButton = getToggleFilterButton();
  const extensionShouldNotRunElement = getExtensionShouldNotRunElement();

  if (!extensionShouldNotRunElement) {
    console.error("required HTML elements not found in popup.html");

    return;
  }

  if (await extensionShouldRunOnCurrentPage()) {
    hideElement(extensionShouldNotRunElement);
    showElement(toggleFilterButton);

    await setButtonText({ buttonElement: toggleFilterButton });

    if (await isExtensionEnabled()) {
      setVideoCountElementText((await loadVideoCount()) || 0);
      setHiddenVideoCountElementText((await loadHiddenVideoCount()) || 0);
      showVideoCounts();
    } else {
      hideVideoCounts();
    }

    return toggleFilterButton;
  } else {
    hideElement(toggleFilterButton);
    hideVideoCounts();
    showElement(extensionShouldNotRunElement);

    return extensionShouldNotRunElement;
  }
}

void main();
