import React from 'react';
import { Checkbox } from '../ui/checkbox';
import { FiUser, FiCalendar, FiBook, FiUsers, FiDollarSign, FiMapPin, FiHeart, FiBriefcase } from 'react-icons/fi';

const StepDemographics = ({ demographics, updateSurveyData }) => {
  const demographicOptions = [
    { 
      value: 'Age', 
      label: 'Age', 
      icon: FiCalendar, 
      description: 'Participant age or age range',
      color: 'blue'
    },
    { 
      value: 'Gender', 
      label: 'Gender', 
      icon: FiUser, 
      description: 'Gender identity',
      color: 'purple'
    },
    { 
      value: 'Education', 
      label: 'Education', 
      icon: FiBook, 
      description: 'Highest level of education',
      color: 'green'
    },
    { 
      value: 'Ethnicity', 
      label: 'Ethnicity', 
      icon: FiUsers, 
      description: 'Racial/ethnic background',
      color: 'orange'
    },
    { 
      value: 'Income', 
      label: 'Income', 
      icon: FiDollarSign, 
      description: 'Household income range',
      color: 'emerald'
    },
    { 
      value: 'Location', 
      label: 'Location', 
      icon: FiMapPin, 
      description: 'Geographic location',
      color: 'red'
    },
    { 
      value: 'Relationship Status', 
      label: 'Relationship Status', 
      icon: FiHeart, 
      description: 'Current relationship status',
      color: 'pink'
    },
    { 
      value: 'Employment', 
      label: 'Employment', 
      icon: FiBriefcase, 
      description: 'Employment status',
      color: 'indigo'
    }
  ];

  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 shadow-blue-500/10',
    purple: 'from-purple-500/20 to-purple-600/10 shadow-purple-500/10',
    green: 'from-green-500/20 to-green-600/10 shadow-green-500/10',
    orange: 'from-orange-500/20 to-orange-600/10 shadow-orange-500/10',
    emerald: 'from-emerald-500/20 to-emerald-600/10 shadow-emerald-500/10',
    red: 'from-red-500/20 to-red-600/10 shadow-red-500/10',
    pink: 'from-pink-500/20 to-pink-600/10 shadow-pink-500/10',
    indigo: 'from-indigo-500/20 to-indigo-600/10 shadow-indigo-500/10'
  };
  
  const borderColorClasses = {
    blue: 'border-blue-500/30',
    purple: 'border-purple-500/30',
    green: 'border-green-500/30',
    orange: 'border-orange-500/30',
    emerald: 'border-emerald-500/30',
    red: 'border-red-500/30',
    pink: 'border-pink-500/30',
    indigo: 'border-indigo-500/30'
  };
  
  const handleToggle = (value) => {
    if (demographics.includes(value)) {
      updateSurveyData('demographics', demographics.filter(d => d !== value));
    } else {
      updateSurveyData('demographics', [...demographics, value]);
    }
  };
  
  return (
    <div className="w-full animate-fadeIn">
      <div className="mb-12 text-center">
        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-none">
          Demographic Information
        </h2>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Grid of demographic options - adjusted for better sizing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {demographicOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = demographics.includes(option.value);
            
            return (
              <div
                key={option.value}
                onClick={() => handleToggle(option.value)}
                className={`
                  group relative rounded-2xl backdrop-blur-md transition-all duration-500 cursor-pointer overflow-hidden
                  ${isSelected 
                    ? `border-2 ${borderColorClasses[option.color]} scale-[1.02] shadow-xl` 
                    : 'border border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-black/20 hover:scale-[1.01]'
                  }
                `}
              >
                {/* Background gradient */}
                {!isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-white/[0.01] rounded-2xl" />
                )}
                
                {/* Glassmorphism base */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/30 to-transparent rounded-2xl" />
                
                {/* Selected background overlay */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-2xl">
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[option.color]} rounded-2xl`} />
                  </div>
                )}
                
                <div className="relative z-10 p-6 flex items-start gap-4">
                  {/* Checkbox */}
                  <div className="pt-0.5">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(option.value)}
                      className={`
                        w-5 h-5 rounded-md border-2 transition-all duration-300
                        ${isSelected 
                          ? 'bg-white text-zinc-900 border-white' 
                          : 'border-white/30 text-transparent hover:border-white/50'
                        }
                      `}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`
                        p-2.5 rounded-lg backdrop-blur-xl transition-all duration-500
                        ${isSelected 
                          ? 'bg-white/20 shadow-lg' 
                          : 'bg-white/[0.05] group-hover:bg-white/[0.08]'
                        }
                      `}>
                        <Icon className={`
                          w-5 h-5 transition-all duration-500
                          ${isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'}
                        `} />
                      </div>
                      <h3 className={`
                        text-lg font-semibold transition-all duration-300
                        ${isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'}
                      `}>
                        {option.label}
                      </h3>
                    </div>
                    <p className={`
                      text-sm transition-all duration-300
                      ${isSelected ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-400'}
                    `}>
                      {option.description}
                    </p>
                  </div>
                </div>

                {/* Hover/selected glow */}
                <div className={`
                  absolute inset-0 rounded-2xl transition-opacity duration-500
                  ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selection summary */}
        <div className={`
          rounded-2xl backdrop-blur-md p-5 transition-all duration-500
          ${demographics.length > 0 
            ? 'bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20' 
            : 'bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10'
          }
        `}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-base font-medium ${demographics.length > 0 ? 'text-white' : 'text-zinc-500'}`}>
                {demographics.length === 0 
                  ? 'No demographics selected' 
                  : `${demographics.length} demographic${demographics.length === 1 ? '' : 's'} selected`
                }
              </p>
              {demographics.length > 0 && (
                <p className="text-sm text-zinc-400 mt-1">
                  These will appear at the beginning of your survey
                </p>
              )}
            </div>
            {demographics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {demographics.map(demo => (
                  <span 
                    key={demo}
                    className="px-2.5 py-1 rounded-full bg-white/10 text-xs text-white border border-white/20"
                  >
                    {demo}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Warning for no selection */}
        {demographics.length === 0 && (
          <div className="mt-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent backdrop-blur-md border border-amber-500/20 p-4">
            <p className="text-amber-300 flex items-center gap-2 text-sm">
              <span className="text-lg">⚠️</span>
              Please select at least one demographic variable to collect
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        /* Hide any default browser elements */
        input[type="range"]::-webkit-slider-thumb {
          display: none;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default StepDemographics;