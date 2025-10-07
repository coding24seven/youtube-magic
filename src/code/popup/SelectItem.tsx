import { ChangeEvent } from "react";

interface Props {
  name: string;
  checked: boolean;
  title: string;
  handleOptionChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SelectItem = ({ name, checked, title, handleOptionChange }: Props) => {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleOptionChange}
        />
        {title}
      </label>
    </li>
  );
};

export default SelectItem;
