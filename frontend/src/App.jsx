import React, { useState } from 'react';
import BuilderPanel from './components/BuilderPanel';
import PreviewPanel from './components/PreviewPanel';
import GlobalStyles from './components/GlobalStyles';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [surveyData, setSurveyData] = useState({
    studyType: '',
    researchQuestion: '',
    hypothesis: '',
    extractedVariables: { iv: [], dv: [], population: '' },
    primaryDV: {
      name: '',
      items: [],
      responseFormat: '',
      randomizeItems: false
    },
    exploratoryDVs: [],
    demographics: [],
    blocks: [],
    flow: ['consent', 'demographics', 'measures', 'debrief']
  });

  const updateSurveyData = (field, value) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateSurvey = async () => {
    try {
      const description = `
        Study Type: ${surveyData.studyType}
        Research Question: ${surveyData.researchQuestion}
        Primary DV: ${surveyData.primaryDV.name}
        Items: ${surveyData.primaryDV.items.join(', ')}
        Demographics: ${surveyData.demographics.join(', ')}
      `;

      const response = await fetch('/api/generate-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(`Survey created! URL: ${result.surveyUrl}`);
      }
    } catch (error) {
      console.error('Error generating survey:', error);
      alert('Failed to generate survey. Please try again.');
    }
  };

  const showPreview = currentStep >= 3;

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black font-inter overflow-hidden relative">
      {/* Abstract mesh background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mesh" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="1" fill="rgb(59, 130, 246)" opacity="0.5" />
                <circle cx="0" cy="0" r="1" fill="rgb(59, 130, 246)" opacity="0.5" />
                <circle cx="100" cy="0" r="1" fill="rgb(59, 130, 246)" opacity="0.5" />
                <circle cx="0" cy="100" r="1" fill="rgb(59, 130, 246)" opacity="0.5" />
                <circle cx="100" cy="100" r="1" fill="rgb(59, 130, 246)" opacity="0.5" />
              </pattern>
              <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#mesh)" />
            <rect width="100%" height="100%" fill="url(#fade)" />
          </svg>
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse animation-delay-2000" />
      </div>

      {/* Main container with better layout and padding */}
      <div className={`
        relative mx-auto min-h-screen transition-all duration-1000 ease-out
        ${showPreview ? 'max-w-[1920px] px-8' : 'max-w-[1400px] px-12'}
      `}>
        {/* Content wrapper - removed fixed height */}
        <div className="relative flex min-h-screen">
          {/* Builder Panel */}
          <div className={`
            transition-all duration-1000 ease-out
            ${showPreview ? 'w-3/5' : 'w-full'}
          `}>
            <BuilderPanel 
              currentStep={currentStep}
              surveyData={surveyData}
              updateSurveyData={updateSurveyData}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onGenerateSurvey={handleGenerateSurvey}
              showPreview={showPreview}
            />
          </div>

          {/* Preview Panel */}
          <div className={`
            transition-all duration-1000 ease-out transform
            ${showPreview 
              ? 'w-2/5 opacity-100 translate-x-0 scale-100' 
              : 'w-0 opacity-0 translate-x-full scale-95'
            }
          `}>
            {showPreview && (
              <PreviewPanel 
                surveyData={surveyData}
                currentStep={currentStep}
              />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        /* Global scrollbar styles */
        :global(::-webkit-scrollbar) {
          width: 6px;
          height: 6px;
        }
        
        :global(::-webkit-scrollbar-track) {
          background: transparent;
        }
        
        :global(::-webkit-scrollbar-thumb) {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        :global(::-webkit-scrollbar-thumb:hover) {
          background: rgba(255, 255, 255, 0.2);
        }
        
        /* Firefox scrollbar */
        :global(*) {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
        
        /* Disable any range inputs that might appear */
        :global(input[type="range"]) {
          display: none !important;
        }
      `}</style>
      </div>
    </>
  );
}

export default App;