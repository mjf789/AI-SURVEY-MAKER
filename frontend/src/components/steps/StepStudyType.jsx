import React from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { FiBarChart2, FiActivity } from 'react-icons/fi';

const StepStudyType = ({ studyType, updateSurveyData }) => {
  return (
    <div className="w-full animate-fadeIn">
      <div className="mb-12 text-center">
        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-none">
          What type of study are you conducting?
        </h2>
      </div>
      
      <div className="max-w-5xl mx-auto px-4">
        {/* Glass container wrapper */}
        <div className="rounded-3xl backdrop-blur-md bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 overflow-hidden">
          <div className="bg-gradient-to-br from-zinc-900/50 to-transparent p-10">
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
                        ? 'bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-transparent shadow-xl shadow-blue-500/20 border-2 border-blue-500/50' 
                        : 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-black/20'
                      }
                    `}>
                      {/* Content */}
                      <div className="relative z-10 p-8 h-full flex flex-col">
                        {/* Radio button */}
                        <RadioGroupItem 
                          value={option.value} 
                          id={option.value} 
                          className={`
                            absolute top-6 right-6 border-2 transition-all duration-300
                            ${isSelected 
                              ? 'border-blue-400 bg-blue-500 text-white scale-110' 
                              : 'border-white/30 text-transparent hover:border-white/50'
                            }
                          `}
                        />
                        
                        {/* Icon container */}
                        <div className={`
                          inline-flex p-4 rounded-xl mb-6 backdrop-blur-xl transition-all duration-500
                          ${isSelected 
                            ? 'bg-gradient-to-br from-blue-500/30 to-blue-600/20 shadow-lg shadow-blue-500/20' 
                            : 'bg-white/[0.05] group-hover:bg-white/[0.08] group-hover:shadow-lg'
                          }
                        `}>
                          <Icon className={`
                            w-10 h-10 transition-all duration-500
                            ${isSelected ? 'text-blue-400' : 'text-white/70 group-hover:text-white'}
                          `} />
                        </div>
                        
                        {/* Text content */}
                        <h3 className={`
                          text-2xl font-semibold mb-3 transition-all duration-300
                          ${isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'}
                        `}>
                          {option.title}
                        </h3>
                        
                        <p className={`
                          text-base leading-relaxed transition-all duration-300
                          ${isSelected ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-400'}
                        `}>
                          {option.description}
                        </p>
                      </div>
                      
                      {/* Hover glow effect */}
                      <div className={`
                        absolute inset-0 rounded-2xl transition-opacity duration-500
                        ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                      `}>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" />
                      </div>
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StepStudyType;