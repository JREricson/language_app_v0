import { ChangeEvent } from "react";
import { Dropdown, Form } from "react-bootstrap";

export interface DropDownFormItem {
  display_str: string;
  value: string;
}

export interface DropDownMenuOptions {
  items: DropDownFormItem[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  default_option?: string;
}

const DropDownFormSelection: React.FC<DropDownMenuOptions> = ({
  items,
  onChange,
  default_option,
}) => {
  return (
    <Dropdown>
      <Form.Select aria-label="Default select example" onChange={onChange}>
        {items.map((item) => (
          <option
            key={item.display_str}
            value={item.value}
            selected={default_option === item.value}
          >
            {item.display_str}
          </option>
        ))}
      </Form.Select>
    </Dropdown>
  );
};

export default DropDownFormSelection;
