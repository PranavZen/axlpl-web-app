import React from "react";
import Select, { MultiValue, Options } from "react-select";

type OptionType = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Options<OptionType>; // Array of options
  value: MultiValue<OptionType>; // Selected values
  onChange: (selected: MultiValue<OptionType>) => void; // Change handler
  placeholder?: string; // Optional placeholder
  isLoading?: boolean; // Optional loading state
  id?: string; // Optional id for accessibility
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "",
  isLoading = false,
  id,
}) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      isMulti
      placeholder={placeholder}
      isLoading={isLoading}
      inputId={id}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  );
};

export default MultiSelect;
