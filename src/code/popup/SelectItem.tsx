import { ChangeEvent } from "react";

interface Props {
  name: string;
  checked: boolean;
  title: string;
  handleSelectChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SelectItem = ({ name, checked, title, handleSelectChange }: Props) => {
  return (
    <li className="youtube-magic-popup__select-item">
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
