import { useEffect, useState } from 'react';
import { extensionCanRunOnCurrentPageType } from '../../browser-api';

export const useExtensionCanRun = () => {
  const [extensionCanRunOnPageType, setExtensionCanRunOnPageType] =
    useState(false);

  useEffect(() => {
    async function init() {
      setExtensionCanRunOnPageType(await extensionCanRunOnCurrentPageType());
    }
    void init();
  }, []);

  return {
    extensionCanRunOnPageType,
  };
};
