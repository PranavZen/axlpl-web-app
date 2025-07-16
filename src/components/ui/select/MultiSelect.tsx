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
  hasError?: boolean; // Optional error state for styling
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "",
  isLoading = false,
  id,
  hasError = false,
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
      className={`basic-multi-select ${hasError ? 'has-error' : ''}`}
      classNamePrefix="select"
    />
  );
};

export default MultiSelect;
