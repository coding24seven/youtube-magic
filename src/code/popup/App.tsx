import { useEffect, useState } from "react";
import {
  extensionShouldRunOnCurrentPageType,
  isExtensionEnabled,
  toggleExtensionIsEnabled,
} from "../browser-api";
import Options from "./Options";
import { VideoCount } from "./VideoCount";
import { FilterNames, ViewOptionNames } from "../types";
import { useVideoCounts } from "./hooks/useVideoCounts";
import { useFilters } from "./hooks/useFilters";
import { useOptions } from "./hooks/useOptions";

export interface SelectItemConfig {
  name: FilterNames | ViewOptionNames;
  checked: boolean;
  title: string;
}

const { Watched, MembersOnly } = FilterNames;
const { VideoNumbersAreShown } = ViewOptionNames;

const App = () => {
  const [extensionShouldRunOnPageType, setExtensionShouldRunOnPageType] =
    useState(false);
  const [extensionIsEnabled, setExtensionIsEnabled] = useState(true);
  const { videoCount, hiddenVideoCount } = useVideoCounts();
  const { filterSelect, handleFiltersChange } = useFilters();
  const { optionSelect, handleOptionsChange } = useOptions();
  const handleExtensionToggle = () => {
    setExtensionIsEnabled((isEnabled) => !isEnabled);
    void toggleExtensionIsEnabled();
  };

  useEffect(() => {
    async function init() {
      const run = await extensionShouldRunOnCurrentPageType();
      setExtensionShouldRunOnPageType(run);
      if (!run) return;

      const isEnabled = await isExtensionEnabled();
      setExtensionIsEnabled(isEnabled);
      if (!isEnabled) return;
    }

    void init();
  }, []);

  if (!extensionShouldRunOnPageType) {
    return (
      <p id="extension-should-not-run">
        This extension is not meant to run on this page
      </p>
    );
  }

  const filtersConfig: SelectItemConfig[] = [
    {
      name: Watched,
      checked: filterSelect.watched,
      title: "Watched",
    },
    {
      name: MembersOnly,
      checked: filterSelect.membersOnly,
      title: "Members Only",
    },
  ];
  const optionsConfig: SelectItemConfig[] = [
    {
      name: VideoNumbersAreShown,
      checked: optionSelect.videoNumbersAreShown,
      title: "Video Numbers",
    },
  ];

  return (
    <>
      <button id="toggle-filter" onClick={handleExtensionToggle}>
        {extensionIsEnabled ? "Disable YouTube Magic" : "Enable YouTube Magic"}
      </button>
      {extensionIsEnabled && (
        <>
          <Options
            heading="Filters"
            itemsConfig={filtersConfig}
            handleSelectChange={handleFiltersChange}
          />
          <Options
            heading="Options"
            itemsConfig={optionsConfig}
            handleSelectChange={handleOptionsChange}
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
