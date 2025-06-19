import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { FiTarget, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

const StepResearchQuestion = ({ researchQuestion, hypothesis, updateSurveyData }) => {
  const [focusedField, setFocusedField] = useState(null);

  return (
    <div className="w-full animate-fadeIn">
      <div className="mb-12 text-center">
        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-none">
          Define Your Research Question
        </h2>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="space-y-8">
          {/* Research Question Section */}
          <div className={`
            relative rounded-2xl transition-all duration-500
            ${focusedField === 'question' 
              ? 'bg-gradient-to-br from-blue-500/5 to-transparent shadow-xl' 
              : 'bg-white/[0.02] hover:bg-white/[0.03]'
            }
            p-6 border ${focusedField === 'question' ? 'border-blue-500/30' : 'border-white/5'}
          `}>
            {/* Icon and label */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`
                p-4 rounded-xl backdrop-blur-xl transition-all duration-500
                ${focusedField === 'question'
                  ? 'bg-gradient-to-br from-blue-500/30 to-blue-600/20 shadow-lg shadow-blue-500/20'
                  : 'bg-white/[0.05] hover:bg-white/[0.08]'
                }
              `}>
                <FiTarget className={`
                  w-8 h-8 transition-all duration-500
                  ${focusedField === 'question' ? 'text-blue-400' : 'text-white/70'}
                `} />
              </div>
              <div>
                <Label className="text-xl font-semibold text-white">
                  Research Question
                </Label>
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <Textarea
                value={researchQuestion}
                onChange={(e) => updateSurveyData('researchQuestion', e.target.value)}
                onFocus={() => setFocusedField('question')}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g., How does social media usage frequency relate to self-reported well-being among university students?"
                className={`
                  min-h-[120px] w-full px-4 py-3 rounded-xl
                  bg-white/[0.03] backdrop-blur-sm
                  border transition-all duration-300
                  text-white placeholder:text-white/40
                  ${focusedField === 'question'
                    ? 'border-blue-500/50 bg-white/[0.05]'
                    : 'border-white/10 hover:border-white/20'
                  }
                `}
              />
            </div>

            {/* Helper text */}
            <div className="mt-4 flex items-start gap-2">
              <FiAlertCircle className="w-4 h-4 text-blue-400/70 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-white/50">
                Be specific about your variables and population of interest
              </p>
            </div>
          </div>

          {/* Hypothesis Section */}
          <div className={`
            relative rounded-2xl transition-all duration-500
            ${focusedField === 'hypothesis' 
              ? 'bg-gradient-to-br from-purple-500/5 to-transparent shadow-xl' 
              : 'bg-white/[0.02] hover:bg-white/[0.03]'
            }
            p-6 border ${focusedField === 'hypothesis' ? 'border-purple-500/30' : 'border-white/5'}
          `}>
            {/* Icon and label */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`
                p-4 rounded-xl backdrop-blur-xl transition-all duration-500
                ${focusedField === 'hypothesis'
                  ? 'bg-gradient-to-br from-purple-500/30 to-purple-600/20 shadow-lg shadow-purple-500/20'
                  : 'bg-white/[0.05] hover:bg-white/[0.08]'
                }
              `}>
                <FiTrendingUp className={`
                  w-8 h-8 transition-all duration-500
                  ${focusedField === 'hypothesis' ? 'text-purple-400' : 'text-white/70'}
                `} />
              </div>
              <div>
                <Label className="text-xl font-semibold text-white">
                  Hypothesis
                </Label>
                <p className="text-sm text-white/50 mt-1">Optional</p>
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <Textarea
                value={hypothesis}
                onChange={(e) => updateSurveyData('hypothesis', e.target.value)}
                onFocus={() => setFocusedField('hypothesis')}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g., We hypothesize that higher social media usage will be associated with lower self-reported well-being scores"
                className={`
                  min-h-[120px] w-full px-4 py-3 rounded-xl
                  bg-white/[0.03] backdrop-blur-sm
                  border transition-all duration-300
                  text-white placeholder:text-white/40
                  ${focusedField === 'hypothesis'
                    ? 'border-purple-500/50 bg-white/[0.05]'
                    : 'border-white/10 hover:border-white/20'
                  }
                `}
              />
            </div>

            {/* Helper text */}
            <div className="mt-4 flex items-start gap-2">
              <FiAlertCircle className="w-4 h-4 text-purple-400/70 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-white/50">
                State your predicted relationship between variables
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepResearchQuestion;