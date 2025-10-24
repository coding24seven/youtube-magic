import { useState } from 'react';
import Options from './Options';
import { VideoCount } from './VideoCount';
import { FilterNames, ViewOptionNames } from '../types';
import { useVideoCounts } from './hooks/useVideoCounts';
import { useFilters } from './hooks/useFilters';
import { useOptions } from './hooks/useOptions';
import { useExtensionIsEnabled } from './hooks/useExtensionIsEnabled';
import { useExtensionCanRun } from './hooks/useExtensionCanRun';

export interface SelectItemConfig {
  name: FilterNames | ViewOptionNames;
  checked: boolean;
  title: string;
}

const { Watched, MembersOnly } = FilterNames;
const { VideoNumbersAreShown } = ViewOptionNames;

const App = () => {
  useState(false);
  const { extensionCanRunOnPageType } = useExtensionCanRun();
  const { extensionIsEnabled, handleExtensionToggle } = useExtensionIsEnabled();
  const { videoCount, hiddenVideoCount } = useVideoCounts();
  const { filterSelect, handleFiltersChange } = useFilters();
  const { optionSelect, handleOptionsChange } = useOptions();

  if (!extensionCanRunOnPageType) {
    return (
      <p className="youtube-magic-popup__extension-should-not-run">
        This extension is not meant to run on this page
      </p>
    );
  }

  const filtersConfig: SelectItemConfig[] = [
    {
      name: Watched,
      checked: filterSelect.watched,
      title: 'Watched',
    },
    {
      name: MembersOnly,
      checked: filterSelect.membersOnly,
      title: 'Members Only',
    },
  ];
  const optionsConfig: SelectItemConfig[] = [
    {
      name: VideoNumbersAreShown,
      checked: optionSelect.videoNumbersAreShown,
      title: 'Video Numbers',
    },
  ];

  return (
    <>
      <button
        className="youtube-magic-popup__toggle-extension"
        onClick={handleExtensionToggle}
      >
        {extensionIsEnabled ? 'Disable YouTube Magic' : 'Enable YouTube Magic'}
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
