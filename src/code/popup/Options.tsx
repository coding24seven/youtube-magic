import { ChangeEvent } from "react";
import SelectItem from "./SelectItem";
import { SelectItemConfig } from "./App";

interface Props {
  heading: string;
  itemsConfig: SelectItemConfig[];
  handleSelectChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Options = ({ heading, itemsConfig, handleSelectChange }: Props) => {
  return (
    <section>
      <h4 className="select-heading">{heading}:</h4>
      <ul className="select-list">
        {itemsConfig.map(({ name, checked, title }) => (
          <SelectItem
            key={name}
            name={name}
            checked={checked}
            title={title}
            handleSelectChange={handleSelectChange}
          />
        ))}
      </ul>
    </section>
  );
};

export default Options;
