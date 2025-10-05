import React, { useEffect, useState } from "react";
import {
  addBrowserStorageListener,
  extensionShouldRunOnCurrentPageType,
  isExtensionEnabled,
  loadHiddenVideoCount,
  loadVideoCount,
  toggleExtensionIsEnabled,
} from "../browser-api";
import { StateChanges } from "../browser-api/types";

const App = () => {
  const [shouldRun, setShouldRun] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [videoCount, setVideoCount] = useState(0);
  const [hiddenVideoCount, setHiddenVideoCount] = useState(0);

  useEffect(() => {
    async function init() {
      const run = await extensionShouldRunOnCurrentPageType();
      setShouldRun(run);

      if (!run) return;

      const enabled = await isExtensionEnabled();
      setIsEnabled(enabled);

      if (enabled) {
        setVideoCount((await loadVideoCount()) || 0);
        setHiddenVideoCount((await loadHiddenVideoCount()) || 0);
      }
    }

    void init();
  }, []);

  useEffect(() => {
    const listener = (changes: StateChanges) => {
      if (changes.extensionIsEnabled) {
        setIsEnabled(changes.extensionIsEnabled.newValue);
      }
      if (changes.videoCount) {
        setVideoCount(changes.videoCount.newValue);
      }
      if (changes.hiddenVideoCount) {
        setHiddenVideoCount(changes.hiddenVideoCount.newValue);
      }
    };

    addBrowserStorageListener("onChanged", listener);

    return () => {
      /* no need to remove listener as `browser.storage.onChanged` is global to the extension and does not leak memory across popup instances since popups reload fresh each time you open them. */
    };
  }, []);

  if (!shouldRun) {
    return (
      <p id="extension-should-not-run">
        This extension is not meant to run on this page
      </p>
    );
  }

  return (
    <>
      <button id="toggle-filter" onClick={toggleExtensionIsEnabled}>
        {isEnabled ? "Disable YouTube Magic" : "Enable YouTube Magic"}
      </button>
      {isEnabled && (
        <>
          <p id="video-count">Videos Total: {videoCount}</p>
          <p id="hidden-video-count">Videos Hidden: {hiddenVideoCount}</p>
        </>
      )}
    </>
  );
};

export default App;
