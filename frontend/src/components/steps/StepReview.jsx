import React, { useState } from 'react';
import { Button } from '../ui/button';
import { FiCheck, FiFileText, FiUsers, FiClipboard, FiLayers, FiLoader, FiExternalLink, FiZap, FiShield } from 'react-icons/fi';

const StepReview = ({ surveyData, onGenerateSurvey }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation
    setTimeout(async () => {
      await onGenerateSurvey();
      setGeneratedUrl('https://qualtrics.com/survey/SV_abc123...');
      setIsGenerating(false);
    }, 3000);
  };

  const sections = [
    {
      icon: FiFileText,
      title: 'Study Design',
      color: 'blue',
      items: [
        { label: 'Type', value: surveyData.studyType || 'Not specified', highlight: true },
        { label: 'Research Question', value: surveyData.researchQuestion || 'Not specified' },
        { label: 'Hypothesis', value: surveyData.hypothesis || 'Not specified' }
      ]
    },
    {
      icon: FiClipboard,
      title: 'Primary Measure',
      color: 'purple',
      items: [
        { label: 'Scale', value: surveyData.primaryDV.name || 'Not specified', highlight: true },
        { label: 'Items', value: `${surveyData.primaryDV.items.length} questions` },
        { label: 'Order', value: surveyData.primaryDV.randomizeItems ? 'Randomized' : 'Fixed' }
      ]
    },
    {
      icon: FiLayers,
      title: 'Exploratory Measures',
      color: 'green',
      items: surveyData.exploratoryDVs.length > 0 
        ? surveyData.exploratoryDVs.map(dv => ({
            label: dv.name,
            value: `${dv.items.length} items`
          }))
        : [{ label: 'Status', value: 'None added' }]
    },
    {
      icon: FiUsers,
      title: 'Demographics',
      color: 'orange',
      items: [
        { label: 'Variables', value: surveyData.demographics.join(', ') || 'None selected' },
        { label: 'Position', value: 'Start of survey' }
      ]
    }
  ];

  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30'
  };

  return (
    <div className="w-full animate-fadeIn">
      <div className="mb-12 text-center">
        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-none">
          Review & Generate
        </h2>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Review sections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className={`
                  group relative rounded-2xl backdrop-blur-md 
                  bg-gradient-to-br ${colorClasses[section.color]}
                  border-2 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/30 to-transparent rounded-2xl" />
                
                <div className="relative z-10 p-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xl">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-start gap-3">
                        <span className="text-zinc-400 text-sm">{item.label}</span>
                        <span className={`
                          text-sm text-right flex-1
                          ${item.highlight ? 'text-white font-medium' : 'text-zinc-300'}
                        `}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Survey flow visualization */}
        <div className="rounded-2xl backdrop-blur-md bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <FiZap className="w-5 h-5 text-yellow-400" />
            Survey Flow
          </h3>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {['Consent', 'Demographics', 'Measures', 'Debrief'].map((step, index) => (
              <div key={index} className="relative z-10 text-center">
                <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl flex items-center justify-center border border-white/20">
                  <span className="text-white font-semibold">{index + 1}</span>
                </div>
                <span className="text-xs text-zinc-400">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features info */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: FiShield, title: 'IRB Compliant', desc: 'Standard consent & debrief' },
            { icon: FiZap, title: 'Smart Randomization', desc: 'Minimize order effects' },
            { icon: FiFileText, title: 'Export Ready', desc: 'Qualtrics QSF format' }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl flex items-center justify-center">
                <feature.icon className="w-7 h-7 text-zinc-400" />
              </div>
              <h4 className="text-base font-medium text-white mb-1">{feature.title}</h4>
              <p className="text-xs text-zinc-500">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Generate button or success state */}
        {!generatedUrl ? (
          <div className="text-center">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`
                relative px-10 py-5 text-lg font-semibold rounded-xl
                transition-all duration-500 transform
                ${isGenerating 
                  ? 'bg-zinc-800 text-zinc-400 cursor-wait' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <FiLoader className="inline-block mr-3 animate-spin" />
                  Generating Your Survey...
                </>
              ) : (
                <>
                  <FiCheck className="inline-block mr-3" />
                  Generate Qualtrics Survey
                </>
              )}
            </Button>
            
            {isGenerating && (
              <div className="mt-6 max-w-md mx-auto">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-progress" />
                </div>
                <p className="text-sm text-zinc-500 mt-3">Creating your professional survey...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center animate-slideIn">
            <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-md border-2 border-green-500/30">
              <FiCheck className="w-14 h-14 mx-auto mb-3 text-green-400" />
              <h3 className="text-2xl font-bold text-white mb-3">Survey Generated!</h3>
              <p className="text-zinc-300 mb-5">Your Qualtrics survey is ready to use</p>
              
              <div className="bg-black/20 rounded-lg p-3 mb-5">
                <p className="text-xs text-zinc-400 mb-1">Survey URL:</p>
                <p className="text-white font-mono break-all text-sm">{generatedUrl}</p>
              </div>
              
              <Button
                className="bg-white text-zinc-900 hover:bg-zinc-100 px-6 py-3 text-base font-medium rounded-lg"
              >
                <FiExternalLink className="mr-2" />
                Open in Qualtrics
              </Button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        .animate-progress {
          animation: progress 3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StepReview;