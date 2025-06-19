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
        {/* Glass container wrapper */}
        <div className="rounded-3xl backdrop-blur-md bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 overflow-hidden">
          <div className="bg-gradient-to-br from-zinc-900/50 to-transparent p-10">
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
                      w-full min-h-[120px] px-6 py-4 text-lg
                      bg-white/[0.03] backdrop-blur-xl
                      border-2 rounded-xl transition-all duration-300
                      placeholder:text-zinc-600 text-white
                      ${focusedField === 'question'
                        ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
                        : 'border-white/10 hover:border-white/20'
                      }
                    `}
                  />
                  {/* Character count */}
                  <div className="absolute bottom-4 right-4 text-xs text-zinc-600">
                    {researchQuestion.length} characters
                  </div>
                </div>

                {/* Helper text */}
                <div className="mt-4 flex items-start gap-2">
                  <FiAlertCircle className="w-4 h-4 text-zinc-500 mt-0.5" />
                  <p className="text-sm text-zinc-500">
                    Be specific about your variables and population of interest
                  </p>
                </div>
              </div>

              {/* Hypothesis Section */}
              <div className={`
                relative rounded-2xl transition-all duration-500
                ${focusedField === 'hypothesis' 
                  ? 'bg-gradient-to-br from-blue-500/5 to-transparent shadow-xl' 
                  : 'bg-white/[0.02] hover:bg-white/[0.03]'
                }
                p-6 border ${focusedField === 'hypothesis' ? 'border-blue-500/30' : 'border-white/5'}
              `}>
                {/* Icon and label */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`
                    p-4 rounded-xl backdrop-blur-xl transition-all duration-500
                    ${focusedField === 'hypothesis'
                      ? 'bg-gradient-to-br from-blue-500/30 to-blue-600/20 shadow-lg shadow-blue-500/20'
                      : 'bg-white/[0.05] hover:bg-white/[0.08]'
                    }
                  `}>
                    <FiTrendingUp className={`
                      w-8 h-8 transition-all duration-500
                      ${focusedField === 'hypothesis' ? 'text-blue-400' : 'text-white/70'}
                    `} />
                  </div>
                  <div>
                    <Label className="text-xl font-semibold text-white flex items-center gap-2">
                      Hypothesis
                      <span className="text-sm font-normal text-zinc-500">(Optional)</span>
                    </Label>
                  </div>
                </div>

                {/* Textarea */}
                <div className="relative">
                  <Textarea
                    value={hypothesis}
                    onChange={(e) => updateSurveyData('hypothesis', e.target.value)}
                    onFocus={() => setFocusedField('hypothesis')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="e.g., Higher social media usage will be associated with lower well-being scores"
                    className={`
                      w-full min-h-[100px] px-6 py-4 text-lg
                      bg-white/[0.03] backdrop-blur-xl
                      border-2 rounded-xl transition-all duration-300
                      placeholder:text-zinc-600 text-white
                      ${focusedField === 'hypothesis'
                        ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
                        : 'border-white/10 hover:border-white/20'
                      }
                    `}
                  />
                </div>
              </div>
            </div>
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

export default StepResearchQuestion;