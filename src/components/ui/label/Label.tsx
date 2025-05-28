import React from "react";
import "./Label.scss";
interface LabelProps {
  htmlFor: string;
  text: string;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ htmlFor, text, className }) => {
  return (
    <label htmlFor={htmlFor} className={className}>
      {text}
    </label>
  );
};

export default Label;
