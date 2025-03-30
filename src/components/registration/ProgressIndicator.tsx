
import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div 
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm
                ${index + 1 <= currentStep 
                  ? 'bg-cyber-primary text-white' 
                  : 'bg-cyber-dark border border-cyber-primary/30 text-muted-foreground'}
              `}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div className={`h-0.5 w-full flex-1 ${index + 1 < currentStep ? 'bg-cyber-primary' : 'bg-cyber-dark border-cyber-primary/20'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>User Details</span>
        <span>Create Password</span>
        <span>Complete</span>
      </div>
    </div>
  );
};

export default ProgressIndicator;
