import React from 'react';
import { FiSmartphone, FiArrowRight } from 'react-icons/fi';

const PreviewPanel = ({ surveyData, currentStep }) => {
  const renderQuestion = (question, index) => {
    return (
      <div key={index} className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
        <p className="text-sm font-medium text-white mb-2">{question.text}</p>
        {question.type === 'MC' && (
          <div className="space-y-1.5">
            {question.choices?.map((choice, i) => (
              <label key={i} className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-300 cursor-pointer">
                <input type="radio" name={`q${index}`} className="w-3 h-3" />
                <span>{choice}</span>
              </label>
            ))}
          </div>
        )}
        {question.type === 'TE' && (
          <input 
            type="text" 
            className="w-full mt-2 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded text-xs text-white placeholder:text-zinc-600"
            placeholder="Type your answer..."
          />
        )}
      </div>
    );
  };

  const getDemoQuestions = () => {
    return surveyData.demographics.map((demo, index) => ({
      text: `What is your ${demo.toLowerCase()}?`,
      type: demo === 'Age' ? 'TE' : 'MC',
      choices: demo === 'Gender' ? ['Male', 'Female', 'Non-binary', 'Prefer not to say'] :
               demo === 'Education' ? ['High School', "Bachelor's", "Master's", 'PhD'] :
               ['Option 1', 'Option 2', 'Option 3']
    }));
  };

  const getPrimaryDVQuestions = () => {
    return surveyData.primaryDV.items.slice(0, 3).map((item, index) => ({
      text: item,
      type: 'MC',
      choices: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
    }));
  };

  return (
    <div className="h-full rounded-r-3xl bg-gradient-to-br from-zinc-900/95 via-zinc-900/90 to-zinc-900/80 backdrop-blur-xl border-r border-t border-b border-white/10 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiSmartphone className="w-4 h-4 text-zinc-400" />
              <h3 className="text-sm font-medium text-white">Live Preview</h3>
            </div>
            <span className="text-xs text-zinc-500">Participant View</span>
          </div>
        </div>

        {/* Survey Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="p-6">
            {/* Survey Title */}
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-white mb-1">
                {surveyData.studyType ? `${surveyData.studyType.charAt(0).toUpperCase() + surveyData.studyType.slice(1)} Study` : 'Psychology Study'}
              </h2>
              <p className="text-xs text-zinc-400">Please answer all questions honestly</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">Step {currentStep} of 6</p>
            </div>

            {/* Dynamic Content Based on Current Step */}
            <div className="space-y-4">
              {currentStep === 1 && (
                <div className="text-center py-8">
                  <p className="text-sm text-zinc-400">Study type will determine survey structure</p>
                </div>
              )}

              {currentStep === 2 && surveyData.researchQuestion && (
                <div className="p-4 bg-white/[0.03] rounded-lg border border-white/10">
                  <p className="text-xs text-zinc-500 mb-2">Research Focus:</p>
                  <p className="text-sm text-white">{surveyData.researchQuestion.substring(0, 100)}...</p>
                </div>
              )}

              {currentStep >= 3 && surveyData.demographics.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Demographics</h3>
                  {getDemoQuestions().slice(0, 2).map((q, i) => renderQuestion(q, i))}
                </div>
              )}

              {currentStep >= 3 && surveyData.primaryDV.items.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-white mb-3">{surveyData.primaryDV.name || 'Primary Scale'}</h3>
                  {getPrimaryDVQuestions().map((q, i) => renderQuestion(q, i + 10))}
                  {surveyData.primaryDV.items.length > 3 && (
                    <p className="text-xs text-zinc-500 mt-2">... and {surveyData.primaryDV.items.length - 3} more questions</p>
                  )}
                </div>
              )}
            </div>

            {/* Next Button */}
            <div className="mt-8 mb-4">
              <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2">
                Next
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-zinc-900/50">
          <p className="text-xs text-zinc-500 text-center">
            Powered by Qualtrics • IRB Approved
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;