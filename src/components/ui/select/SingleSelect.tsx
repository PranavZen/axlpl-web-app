import React from "react";
import Select, { SingleValue, Options } from "react-select";

export type OptionType = {
  value: string;
  label: string;
};

export type SingleSelectProps = {
  options: Options<OptionType>; // Array of options
  value: SingleValue<OptionType>; // Single selected value
  onChange: (selected: SingleValue<OptionType>) => void; // Change handler
  placeholder?: string; // Optional placeholder
  isLoading?: boolean; // Optional loading state
  id?: string; // Optional id for accessibility
  isDisabled?: boolean; // Optional disabled state
};

const SingleSelect: React.FC<SingleSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "",
  isLoading = false,
  id,
  isDisabled = false,
}) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isLoading={isLoading}
      inputId={id}
      isDisabled={isDisabled}
      className="basic-single-select"
      classNamePrefix="select"
      isMulti={false} // <-- Important: Disable multi-select
    />
  );
};

export default SingleSelect;
