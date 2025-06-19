import React from 'react';

const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Study Type' },
    { number: 2, label: 'Hypotheses' },
    { number: 3, label: 'Dependent Variables' },
    { number: 4, label: 'Demographics' },
    { number: 5, label: 'Review & Generate' }
  ];

  return (
    <div className="flex items-center justify-between relative">
      {/* Progress line background */}
      <div className="absolute left-0 right-0 top-5 h-0.5 bg-white/10" />
      
      {/* Active progress line */}
      <div 
        className="absolute left-0 top-5 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700 ease-out"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />
      
      {/* Step indicators */}
      {steps.map((step) => (
        <div key={step.number} className="relative z-10 text-center">
          <div 
            className={`
              w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center
              transition-all duration-500 transform
              ${currentStep >= step.number 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30' 
                : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
              }
            `}
          >
            <span className="text-sm font-semibold">{step.number}</span>
          </div>
          <span className={`
            text-xs transition-all duration-300
            ${currentStep >= step.number ? 'text-white' : 'text-zinc-600'}
          `}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;