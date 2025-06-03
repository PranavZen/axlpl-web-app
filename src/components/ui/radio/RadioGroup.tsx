import React from 'react';
import FormikRadioButton from './FormikRadioButton';
import './RadioGroup.scss';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  label?: string;
  className?: string;
  variant?: 'default' | 'card' | 'inline';
  direction?: 'horizontal' | 'vertical';
  required?: boolean;
  helpText?: string;
  onCustomChange?: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  label,
  className = '',
  variant = 'default',
  direction = 'horizontal',
  required = false,
  helpText,
  onCustomChange,
}) => {
  return (
    <div className={`radio-group ${direction} ${className}`}>
      {label && (
        <div className="radio-group-label">
          <label className="form-label">
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </label>
          {helpText && (
            <div className="radio-group-help-text">
              {helpText}
            </div>
          )}
        </div>
      )}
      
      <div className={`radio-group-options ${direction}`}>
        {options.map((option) => (
          <div key={option.value} className="radio-group-option">
            <FormikRadioButton
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              label={option.label}
              variant={variant}
              disabled={option.disabled}
              onCustomChange={onCustomChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
