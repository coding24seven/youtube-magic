import { ChangeEvent, useEffect, useState } from "react";
import {
  addBrowserStorageListener,
  extensionShouldRunOnCurrentPageType,
  isExtensionEnabled,
  loadHiddenVideoCount,
  loadVideoCount,
  toggleExtensionIsEnabled,
} from "../browser-api";
import { StateChanges } from "../browser-api/types";
import Options from "./Options";
import { VideoCount } from "./VideoCount";

export interface OptionsConfig {
  name: OptionNames;
  checked: boolean;
  title: string;
}

enum OptionNames {
  Watched = "watched",
  MembersOnly = "membersOnly",
  VideoNumbersAreShown = "videoNumbersAreShown",
}
const { Watched, MembersOnly, VideoNumbersAreShown } = OptionNames;

const initialSelectState: Record<OptionNames, boolean> = {
  [Watched]: false,
  [MembersOnly]: false,
  [VideoNumbersAreShown]: false,
};

const App = () => {
  const [shouldRun, setShouldRun] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [videoCount, setVideoCount] = useState(0);
  const [hiddenVideoCount, setHiddenVideoCount] = useState(0);
  const [select, setSelect] = useState(initialSelectState);

  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    setSelect((previousState) => ({
      ...previousState,
      [name]: checked,
    }));
  };

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
      /* no need to remove listener as `browser.storage.onChanged` is global to the extension and does not leak memory across popup instances since a popup reloads fresh each time you open it. */
    };
  }, []);

  if (!shouldRun) {
    return (
      <p id="extension-should-not-run">
        This extension is not meant to run on this page
      </p>
    );
  }

  const filtersConfig: OptionsConfig[] = [
    {
      name: Watched,
      checked: select.watched,
      title: "Watched",
    },
    {
      name: MembersOnly,
      checked: select.membersOnly,
      title: "Members Only",
    },
  ];
  const optionsConfig: OptionsConfig[] = [
    {
      name: VideoNumbersAreShown,
      checked: select.videoNumbersAreShown,
      title: "Video Numbers",
    },
  ];

  return (
    <>
      <button id="toggle-filter" onClick={toggleExtensionIsEnabled}>
        {isEnabled ? "Disable YouTube Magic" : "Enable YouTube Magic"}
      </button>
      {isEnabled && (
        <>
          <Options
            heading="Filters"
            itemsConfig={filtersConfig}
            handleOptionChange={handleOptionChange}
          />
          <Options
            heading="Options"
            itemsConfig={optionsConfig}
            handleOptionChange={handleOptionChange}
          />
          <VideoCount
            videoCount={videoCount}
            hiddenVideoCount={hiddenVideoCount}
          />
        </>
      )}
    </>
  );
};

export default App;
