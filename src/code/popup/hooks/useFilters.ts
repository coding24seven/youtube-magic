import { ChangeEvent, useEffect, useState } from "react";
import { loadFilters, toggleFilter } from "../../browser-api";
import { FilterNames } from "../../types";

const initialFiltersSelectState: Record<FilterNames, boolean> = {
  [FilterNames.Watched]: false,
  [FilterNames.MembersOnly]: false,
};

export const useFilters = () => {
  const [filterSelect, setFilterSelect] = useState(initialFiltersSelectState);

  useEffect(() => {
    async function setFilters() {
      for (const filterName of Object.values(FilterNames)) {
        const isEnabled = (await loadFilters())[filterName];
        setFilterSelect((prev) => ({ ...prev, [filterName]: isEnabled }));
      }
    }
    void setFilters();
  }, []);

  const handleFiltersChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const filterName = name as FilterNames;
    void toggleFilter(filterName);
    setFilterSelect((prev) => ({ ...prev, [name]: checked }));
  };

  return { filterSelect, handleFiltersChange };
};
