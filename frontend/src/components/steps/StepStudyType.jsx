import React from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { FiBarChart2, FiActivity } from 'react-icons/fi';

const StepStudyType = ({ studyType, updateSurveyData }) => {
  return (
    <div className="w-full animate-fadeIn">
      <div className="mb-16 text-center pt-8">
        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-none">
          What type of study are you conducting?
        </h2>
      </div>
      
      <div className="max-w-5xl mx-auto px-4">
        <RadioGroup 
          value={studyType} 
          onValueChange={(value) => updateSurveyData('studyType', value)}
          className="grid md:grid-cols-2 gap-6"
        >
          {[
            {
              value: 'correlational',
              icon: FiBarChart2,
              title: 'Correlational Study',
              description: 'Examine relationships between variables without manipulation. Perfect for exploring natural associations and patterns in your data.'
            },
            {
              value: 'experimental',
              icon: FiActivity,
              title: 'Experimental Study',
              description: 'Manipulate variables to test causal relationships. Ideal for testing hypotheses with random assignment and control conditions.'
            }
          ].map((option) => {
            const Icon = option.icon;
            const isSelected = studyType === option.value;
            
            return (
              <Label 
                key={option.value}
                htmlFor={option.value} 
                className="group relative block cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
              >
                <div className={`
                  relative overflow-hidden rounded-2xl h-full min-h-[280px]
                  backdrop-blur-md transition-all duration-500
                  ${isSelected 
                    ? 'bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20' 
                    : 'bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20'
                  }
                `}>
                  {/* Background gradient effect */}
                  <div className={`
                    absolute inset-0 opacity-0 transition-opacity duration-500
                    ${isSelected ? 'opacity-100' : 'group-hover:opacity-50'}
                  `}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-8 h-full flex flex-col">
                    {/* Icon */}
                    <div className={`
                      mb-6 p-4 rounded-xl inline-flex self-start transition-all duration-500
                      ${isSelected 
                        ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 shadow-lg' 
                        : 'bg-white/5 group-hover:bg-white/10'
                      }
                    `}>
                      <Icon className={`
                        w-8 h-8 transition-all duration-500
                        ${isSelected ? 'text-blue-400' : 'text-white/70 group-hover:text-white/90'}
                      `} />
                    </div>

                    {/* Title */}
                    <h3 className={`
                      text-2xl font-bold mb-3 transition-all duration-500
                      ${isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'}
                    `}>
                      {option.title}
                    </h3>

                    {/* Description */}
                    <p className={`
                      text-base leading-relaxed transition-all duration-500
                      ${isSelected ? 'text-white/80' : 'text-white/60 group-hover:text-white/70'}
                    `}>
                      {option.description}
                    </p>

                    {/* Radio button (hidden but functional) */}
                    <RadioGroupItem 
                      value={option.value} 
                      id={option.value} 
                      className="sr-only" 
                    />

                    {/* Selection indicator */}
                    <div className={`
                      mt-auto pt-6 flex items-center gap-2 transition-all duration-500
                      ${isSelected ? 'opacity-100' : 'opacity-0'}
                    `}>
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      <span className="text-sm text-blue-400 font-medium">Selected</span>
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
};

export default StepStudyType;