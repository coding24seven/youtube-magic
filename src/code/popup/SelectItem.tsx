import { ChangeEvent } from "react";

interface Props {
  name: string;
  checked: boolean;
  title: string;
  handleSelectChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SelectItem = ({ name, checked, title, handleSelectChange }: Props) => {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleSelectChange}
        />
        {title}
      </label>
    </li>
  );
};

export default SelectItem;
