import React, { useState } from 'react';
import { FiArrowRight, FiCheck, FiLayers, FiZap, FiBarChart2, FiFileText, FiUsers, FiClipboard, FiSend } from 'react-icons/fi';

const StepWelcome = ({ onGetStarted, updateSurveyData }) => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const handleGetStarted = () => {
    // Auto-skip to the next step
    onGetStarted();
  };

  const features = [
    {
      icon: FiZap,
      title: 'AI-Powered',
      description: 'Natural language processing understands your study design'
    },
    {
      icon: FiLayers,
      title: 'Smart Structure',
      description: 'Automatically creates appropriate question types and scales'
    },
    {
      icon: FiBarChart2,
      title: 'Professional Results',
      description: 'IRB-compliant surveys ready for data collection'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Describe Your Research',
      description: 'Tell us about your research question and what you want to measure',
      icon: FiFileText
    },
    {
      number: '02',
      title: 'Add Your Variables',
      description: 'Specify your dependent variables and any scales you want to use',
      icon: FiClipboard
    },
    {
      number: '03',
      title: 'Select Demographics',
      description: 'Choose which demographic information to collect',
      icon: FiUsers
    },
    {
      number: '04',
      title: 'Generate & Deploy',
      description: 'Get a working Qualtrics survey link in seconds',
      icon: FiSend
    }
  ];

  return (
    <div className="w-full animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center mb-12 pt-8">
        <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-none">
          Welcome to AI Survey Maker
        </h1>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
          Transform your social psychology research ideas into professional Qualtrics surveys using AI. 
          No coding or survey design experience required.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`
                  relative group rounded-2xl p-8 transition-all duration-500
                  backdrop-blur-md border cursor-pointer
                  ${hoveredFeature === index 
                    ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/50 scale-105 shadow-2xl shadow-blue-500/20' 
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]'
                  }
                `}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`
                    mb-4 p-4 rounded-xl transition-all duration-500
                    ${hoveredFeature === index 
                      ? 'bg-gradient-to-br from-blue-500/30 to-blue-600/20' 
                      : 'bg-white/[0.05]'
                    }
                  `}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-400">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-y-1/2 hidden lg:block" />
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative group">
                  <div className="flex flex-col items-center text-center">
                    {/* Step number */}
                    <div className="mb-4 relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/30 transition-all duration-500">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 text-xs font-bold text-blue-400">{step.number}</span>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Example Section */}
      <div className="max-w-5xl mx-auto px-4 mb-16">
        <div className="rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-md border border-white/10 p-8">
          <h3 className="text-xl font-semibold text-white mb-4">Example Input</h3>
          <div className="bg-zinc-900/50 rounded-lg p-6 mb-6 font-mono text-sm text-zinc-300">
            "I want to study how social media use affects self-esteem in college students. 
            I need demographics (age, gender, year in school), a measure of daily social media usage, 
            and the Rosenberg Self-Esteem Scale."
          </div>
          <div className="flex items-center gap-4">
            <FiCheck className="w-5 h-5 text-green-400" />
            <span className="text-zinc-400">Generates a complete survey with consent, all specified measures, and debrief</span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <button
          onClick={handleGetStarted}
          className="group px-12 py-5 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-3 mx-auto"
        >
          Get Started
          <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="mt-4 text-sm text-zinc-500">No credit card required • Free to use</p>
      </div>
    </div>
  );
};

export default StepWelcome;