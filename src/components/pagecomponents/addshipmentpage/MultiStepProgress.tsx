import React from 'react';

interface Step {
  title: string;
  subtitle: string;
  icon: string;
}

interface MultiStepProgressProps {
  steps: Step[];
  currentStep: number;
}

const MultiStepProgress: React.FC<MultiStepProgressProps> = ({ steps, currentStep }) => {
  const progressPercentage = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="multi-step-progress">
      <div className="progress-container" style={{ '--progress-width': `${progressPercentage}%` } as React.CSSProperties}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div key={index} className="progress-step">
              <div className={`step-circle ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                {isCompleted ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="step-label">
                <div className={`step-title ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  {step.title}
                </div>
                <div className="step-subtitle">{step.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiStepProgress;
