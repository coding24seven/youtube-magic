import { useEffect, useState } from "react";
import {
  isExtensionEnabled,
  toggleExtensionIsEnabled,
} from "../../browser-api";

export const useExtensionIsEnabled = () => {
  const [extensionIsEnabled, setExtensionIsEnabled] = useState(true);

  useEffect(() => {
    async function init() {
      setExtensionIsEnabled(await isExtensionEnabled());
    }
    void init();
  }, []);

  const handleExtensionToggle = () => {
    setExtensionIsEnabled((prev) => !prev);
    void toggleExtensionIsEnabled();
  };

  return {
    extensionIsEnabled,
    handleExtensionToggle,
  };
};
