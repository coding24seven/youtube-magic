import { ChangeEvent, useEffect, useState } from "react";
import { loadOptions, toggleOption } from "../../browser-api";
import { ViewOptionNames } from "../../types";

const initialOptionsSelectState: Record<ViewOptionNames, boolean> = {
  [ViewOptionNames.VideoNumbersAreShown]: false,
};

export const useOptions = () => {
  const [optionSelect, setOptionSelect] = useState(initialOptionsSelectState);

  useEffect(() => {
    async function setOptions() {
      for (const optionName of Object.values(ViewOptionNames)) {
        const isEnabled = (await loadOptions())[optionName];
        setOptionSelect((prev) => ({ ...prev, [optionName]: isEnabled }));
      }
    }
    void setOptions();
  }, []);

  const handleOptionsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const optionName = name as ViewOptionNames;
    void toggleOption(optionName);
    setOptionSelect((prev) => ({ ...prev, [name]: checked }));
  };

  return { optionSelect, handleOptionsChange };
};
