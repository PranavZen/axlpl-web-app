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
  suppressErrors?: boolean;
  id?: string; // Optional custom ID
  labelButton?: React.ReactNode; // Optional button next to label
}

const StepFieldWrapper = ({
  name,
  label,
  type = "text",
  placeholder,
  as = Input,
  children,
  disabled = false,
  suppressErrors = false,
  id,
  labelButton,
}: StepFieldWrapperProps) => {
  // Generate unique ID: use custom ID if provided, otherwise create unique ID from name
  const fieldId = id || `field-${name}`;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Label className="form-label innerLabel" htmlFor={fieldId} text={label} />
        {labelButton && labelButton}
      </div>
      {children ? (
        // Render children with proper ID handling - clone children and pass the fieldId
        <div>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              const childProps = child.props as any;
              return React.cloneElement(child as React.ReactElement<any>, {
                ...childProps,
                id: fieldId
              });
            }
            return child;
          })}
        </div>
      ) : (
        <Field
          name={name}
          id={fieldId}
          type={type}
          placeholder={placeholder}
          className="form-control innerFormControll"
          disabled={disabled}
        >
          {({ field }: any) => (
            <Input
              type={type}
              id={fieldId}
              name={field.name}
              value={field.value || ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error=""
              touched={false}
              placeHolder={placeholder}
              className="form-control innerFormControll"
              disabled={disabled}
            />
          )}
        </Field>
      )}
      {!suppressErrors && (
        <ErrorMessage name={name} component="div" className="errorText" />
      )}
    </>
  );
};

export default StepFieldWrapper;