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
  suppressErrorMessage?: boolean; // Only suppress error message, keep error styling
  id?: string; // Optional custom ID
  labelButton?: React.ReactNode; // Optional button next to label
  errors?: any; // Formik errors object
  touched?: any; // Formik touched object
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
  suppressErrorMessage = false,
  id,
  labelButton,
  errors,
  touched,
}: StepFieldWrapperProps) => {
  // Generate unique ID: use custom ID if provided, otherwise create unique ID from name
  const fieldId = id || `field-${name}`;

  // Check if this field has an error and is touched
  // For styling: only suppress if suppressErrors is true (backward compatibility)
  const hasErrorForStyling = !suppressErrors && errors && touched && errors[name] && touched[name];
  
  // For error message display: suppress if either suppressErrors OR suppressErrorMessage is true
  const showErrorMessage = !suppressErrors && !suppressErrorMessage && errors && touched && errors[name] && touched[name];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Label className="form-label innerLabel" htmlFor={fieldId} text={label} />
        {labelButton && labelButton}
      </div>
      {children ? (
        // Render children with proper ID handling and error state - clone children and pass the fieldId, hasError
        <div>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              const childProps = child.props as any;
              const childType = child.type as any;
              
              // Check if it's a regular input element or a custom component
              const isInputElement = typeof childType === 'string' && childType === 'input';
              const isDivElement = typeof childType === 'string' && childType === 'div';
              const componentName = childType?.name || childType?.displayName || '';
              const shouldPassHasError = childType && 
                (typeof childType !== 'string') && // Not a DOM element like 'input', 'div', etc.
                (componentName === 'SingleSelect' || 
                 componentName === 'MultiSelect' ||
                 componentName.includes('Select')); // More flexible matching for select components
              
              const extraProps: any = { id: fieldId };
              
              // Pass hasError to custom components
              if (shouldPassHasError) {
                extraProps.hasError = hasErrorForStyling;
              }
              
              // For regular input elements, add error classes directly
              if (isInputElement && hasErrorForStyling) {
                const currentClassName = childProps.className || '';
                extraProps.className = `${currentClassName} input-error has-error`.trim();
              }
              
              // For div elements, recursively handle their children (like position-relative wrapper)
              if (isDivElement && hasErrorForStyling && childProps.children) {
                const modifiedChildren = React.Children.map(childProps.children, (grandChild) => {
                  if (React.isValidElement(grandChild) && grandChild.type === 'input') {
                    const grandChildProps = grandChild.props as any;
                    const currentClassName = grandChildProps.className || '';
                    return React.cloneElement(grandChild as React.ReactElement<any>, {
                      ...grandChildProps,
                      className: `${currentClassName} input-error has-error`.trim()
                    });
                  }
                  return grandChild;
                });
                extraProps.children = modifiedChildren;
              }
              
              return React.cloneElement(child as React.ReactElement<any>, {
                ...childProps,
                ...extraProps
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
              error={hasErrorForStyling ? errors[name] : ""}
              touched={hasErrorForStyling}
              placeHolder={placeholder}
              className="form-control innerFormControll"
              disabled={disabled}
            />
          )}
        </Field>
      )}
      {showErrorMessage && (
        <ErrorMessage name={name} component="div" className="errorText" />
      )}
    </>
  );
};

export default StepFieldWrapper;