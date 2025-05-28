import React from "react";
import Select, { SingleValue, Options } from "react-select";

type OptionType = {
  value: string;
  label: string;
};

type SingleSelectProps = {
  options: Options<OptionType>; // Array of options
  value: SingleValue<OptionType>; // Single selected value
  onChange: (selected: SingleValue<OptionType>) => void; // Change handler
  placeholder?: string; // Optional placeholder
};

const SingleSelect: React.FC<SingleSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "",
}) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="basic-single-select"
      classNamePrefix="select"
      isMulti={false} // <-- Important: Disable multi-select
    />
  );
};

export default SingleSelect;
