import { selectors } from "./selectors";
import { isExtensionEnabled } from "../browser-api";

export function getToggleFilterButton() {
  const toggleFilterButton = document.getElementById(
    selectors.toggleFilterButtonId,
  );

  if (!toggleFilterButton) {
    throw new Error("Toggle-filter-button element not found in popup.html");
  }

  return toggleFilterButton;
}

export function getExtensionShouldNotRunElement() {
  const extensionShouldNotRunElement = document.getElementById(
    selectors.extensionShouldNotRunElementId,
  );

  if (!extensionShouldNotRunElement) {
    throw new Error("extension-should-not-run element not found in popup.html");
  }

  return extensionShouldNotRunElement;
}

function getVideoCountElement() {
  const selector = "video-count";
  const videoCountElement = document.getElementById(selector);

  if (!videoCountElement) {
    throw new Error(`Element with id ${selector} not found`);
  }

  return videoCountElement;
}

export async function setButtonText({
  buttonElement,
  extensionIsEnabled,
}: {
  buttonElement: HTMLElement;
  extensionIsEnabled?: boolean | undefined;
}) {
  const enableText = "Hide Watched Videos";
  const disableText = "Show All Videos";

  buttonElement.textContent =
    typeof extensionIsEnabled === "boolean"
      ? extensionIsEnabled
        ? disableText
        : enableText
      : (await isExtensionEnabled())
        ? disableText
        : enableText;
}

export function setVideoCountElementText(value: string | number): void {
  const videoCountElement = getVideoCountElement();
  videoCountElement.textContent = `Videos Total: ${value}`;
}

function getHiddenVideoCountElement() {
  const selector = "hidden-video-count";
  const hiddenVideoCountElement = document.getElementById(selector);

  if (!hiddenVideoCountElement) {
    throw new Error(`Element with id ${selector} not found`);
  }

  return hiddenVideoCountElement;
}

export function setHiddenVideoCountElementText(text: string | number) {
  const hiddenVideoCountElement = getHiddenVideoCountElement();
  hiddenVideoCountElement.textContent = `Videos Hidden: ${text}`;
}

export function showVideoCounts() {
  getVideoCountElement().style.display = "";
  getHiddenVideoCountElement().style.display = "";
}

export function hideVideoCounts() {
  getVideoCountElement().style.display = "none";
  getHiddenVideoCountElement().style.display = "none";
}

export function hideElement(element: HTMLElement) {
  element.style.display = "none";
}

export function showElement(element: HTMLElement) {
  element.style.display = "";
}
