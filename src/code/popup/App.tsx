import { ChangeEvent, useEffect, useState } from "react";
import {
  extensionShouldRunOnCurrentPageType,
  isExtensionEnabled,
  isFilterEnabled,
  isOptionEnabled,
  toggleExtensionIsEnabled,
  toggleFilter,
  toggleOption,
} from "../browser-api";
import Options from "./Options";
import { VideoCount } from "./VideoCount";
import { FilterNames, ViewOptionNames } from "../types";
import { useVideoCounts } from "./hooks/useVideoCounts";

export interface SelectItemConfig {
  name: FilterNames | ViewOptionNames;
  checked: boolean;
  title: string;
}

const { Watched, MembersOnly } = FilterNames;
const { VideoNumbersAreShown } = ViewOptionNames;

const initialFiltersSelectState: Record<FilterNames, boolean> = {
  [Watched]: false,
  [MembersOnly]: false,
};

const initialOptionsSelectState: Record<ViewOptionNames, boolean> = {
  [VideoNumbersAreShown]: false,
};

const App = () => {
  const [extensionShouldRunOnPageType, setExtensionShouldRunOnPageType] =
    useState(false);
  const [extensionIsEnabled, setExtensionIsEnabled] = useState(true);
  const [filterSelect, setFilterSelect] = useState(initialFiltersSelectState);
  const [optionSelect, setOptionSelect] = useState(initialOptionsSelectState);
  const { videoCount, hiddenVideoCount } = useVideoCounts();

  const handleExtensionToggle = () => {
    setExtensionIsEnabled((isEnabled) => !isEnabled);
    void toggleExtensionIsEnabled();
  };

  const handleFiltersChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const filterName = name as FilterNames;

    void toggleFilter(filterName);

    setFilterSelect((previousState) => ({
      ...previousState,
      [name]: checked,
    }));
  };

  const handleOptionsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const optionName = name as ViewOptionNames;

    void toggleOption(optionName);

    setOptionSelect((previousState) => ({
      ...previousState,
      [name]: checked,
    }));
  };

  useEffect(() => {
    async function init() {
      const run = await extensionShouldRunOnCurrentPageType();
      setExtensionShouldRunOnPageType(run);
      if (!run) return;

      const isEnabled = await isExtensionEnabled();
      setExtensionIsEnabled(isEnabled);
      if (!isEnabled) return;

      for (const filterName of Object.values(FilterNames)) {
        const isEnabled = await isFilterEnabled(filterName);

        setFilterSelect((previousState) => ({
          ...previousState,
          [filterName]: isEnabled,
        }));
      }

      for (const optionName of Object.values(ViewOptionNames)) {
        const isEnabled = await isOptionEnabled(optionName);

        setOptionSelect((previousState) => ({
          ...previousState,
          [optionName]: isEnabled,
        }));
      }
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
