import { ChangeEvent } from "react";
import SelectItem from "./SelectItem";
import { OptionsConfig } from "./App";

interface Props {
  heading: string;
  itemsConfig: OptionsConfig[];
  handleOptionChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Options = ({ heading, itemsConfig, handleOptionChange }: Props) => {
  return (
    <section>
      <h4 className="select-heading">{heading}:</h4>
      <ul className="select-list">
        {itemsConfig.map(({ name, checked, title }) => (
          <SelectItem
            name={name}
            checked={checked}
            title={title}
            handleOptionChange={handleOptionChange}
          />
        ))}
      </ul>
    </section>
  );
};

export default Options;
