import { useState, useEffect } from 'react';
import {
  addBrowserStorageListener,
  loadVideoCount,
  loadHiddenVideoCount,
} from '../../browser-api';
import { StateChanges } from '../../browser-api/types';

export const useVideoCounts = () => {
  const [videoCount, setVideoCount] = useState(0);
  const [hiddenVideoCount, setHiddenVideoCount] = useState(0);

  useEffect(() => {
    async function loadCounts() {
      setVideoCount((await loadVideoCount()) || 0);
      setHiddenVideoCount((await loadHiddenVideoCount()) || 0);
    }
    void loadCounts();
  }, []);

  useEffect(() => {
    const listener = (changes: StateChanges) => {
      if (changes.videoCount) {
        setVideoCount(changes.videoCount.newValue);
      }
      if (changes.hiddenVideoCount) {
        setHiddenVideoCount(changes.hiddenVideoCount.newValue);
      }
    };

    addBrowserStorageListener('onChanged', listener);

    return () => {
      /* no need to remove listener as `browser.storage.onChanged` is global to the extension and does not leak memory across popup instances since a popup reloads fresh each time you open it. */
    };
  }, []);

  return { videoCount, hiddenVideoCount };
};
