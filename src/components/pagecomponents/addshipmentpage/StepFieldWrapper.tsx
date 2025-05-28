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
}

const StepFieldWrapper = ({
  name,
  label,
  type = "text",
  placeholder,
  as = Input,
  children,
}: StepFieldWrapperProps) => (
  <>
    <Label className="form-label innerLabel" htmlFor={name} text={label} />
    {children || (
      <Field
        name={name}
        as={as}
        type={type}
        placeholder={placeholder}
        className="form-control innerFormControll"
      />
    )}
    <ErrorMessage name={name} component="div" className="errorText" />
  </>
);

export default StepFieldWrapper;