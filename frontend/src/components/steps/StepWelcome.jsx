import React, { useState } from 'react';
import { FiArrowRight, FiFileText, FiUpload, FiSettings, FiSend } from 'react-icons/fi';

const StepWelcome = ({ onGetStarted, updateSurveyData }) => {
  const handleGetStarted = () => {
    // Auto-skip to the next step
    onGetStarted();
  };

  const workflowCards = [
    {
      number: '01',
      icon: FiFileText,
      title: 'Describe Your Hypothesis',
      description: 'Explain your research hypothesis and what relationships you want to test between variables'
    },
    {
      number: '02',
      icon: FiUpload,
      title: 'Upload Your Measures',
      description: 'Upload or select validated measurement scales and questionnaires for your study'
    },
    {
      number: '03',
      icon: FiSettings,
      title: 'Configure Settings',
      description: 'Select demographics, add memory checks, and customize your survey requirements'
    },
    {
      number: '04',
      icon: FiSend,
      title: 'Generate Your Survey',
      description: 'Create a complete, IRB-ready Qualtrics survey with all your specifications'
    }
  ];

  return (
    <div className="w-full animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center mb-12 pt-8">
        <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-none">
          Welcome to Walter
        </h1>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
          Generate a first draft of your Qualtrics survey in seconds.
        </p>
      </div>

      {/* Combined Features/How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="
                  relative group rounded-2xl p-8 
                  backdrop-blur-md border cursor-pointer
                  bg-white/[0.02] border-white/10 
                  transition-all duration-300 ease-out transform-gpu
                  hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-blue-600/10 
                  hover:border-blue-500/50 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20
                  transform origin-center
                "
              >
                {/* Step number badge */}
                <span className="absolute -top-2 -right-2 text-xs font-bold text-blue-400">
                  {card.number}
                </span>
                
                <div className="flex flex-col items-center text-center">
                  <div className="
                    mb-4 p-4 rounded-xl 
                    bg-white/[0.05] 
                    transition-all duration-300 ease-out
                    group-hover:bg-gradient-to-br group-hover:from-blue-500/30 group-hover:to-blue-600/20
                  ">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-zinc-400">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <button
          onClick={handleGetStarted}
          className="group px-12 py-5 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-3 mx-auto"
        >
          Get Started
          <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
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

export default StepWelcome;