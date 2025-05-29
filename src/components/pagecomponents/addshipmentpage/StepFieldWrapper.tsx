import React from "react";
import { ErrorMessage, Field } from "formik";
import Input from "../../ui/input/Input";
import Label from "../../ui/label/Label";

interface StepFieldWrapperProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  as?: any;
  component?: any;
  children?: React.ReactNode;
  disabled?: boolean;
}

const StepFieldWrapper = ({
  name,
  label,
  type = "text",
  placeholder,
  as = Input,
  children,
  disabled = false,
}: StepFieldWrapperProps) => (
  <>
    <Label className="form-label innerLabel" htmlFor={name} text={label} />
    {children ? (
      // Render children as-is for now, we'll handle id in the parent components
      <div>{children}</div>
    ) : (
      <Field
        name={name}
        id={name}
        as={as}
        type={type}
        placeholder={placeholder}
        className="form-control innerFormControll"
        disabled={disabled}
      />
    )}
    <ErrorMessage name={name} component="div" className="errorText" />
  </>
);

export default StepFieldWrapper;