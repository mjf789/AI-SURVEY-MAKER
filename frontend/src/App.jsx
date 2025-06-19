import React, { useState } from 'react';
import BuilderPanel from './components/BuilderPanel';
import GlobalStyles from './components/GlobalStyles';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [surveyData, setSurveyData] = useState({
    // Removed studyType since we're not using it anymore
    researchQuestion: '',
    hypothesis: [], // Array format for multiple hypotheses
    extractedVariables: { iv: [], dv: [], population: '' },
    dependentVariables: [], // For the dependent variables step
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
    if (currentStep < 5) {
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
      // Format hypotheses for the API
      const hypothesesText = Array.isArray(surveyData.hypothesis) 
        ? surveyData.hypothesis.map((h, i) => `H${i + 1}: ${h.text}`).join('\n')
        : surveyData.hypothesis;

      // Format dependent variables for the API
      const dvText = surveyData.dependentVariables.map(dv => {
        const opsText = dv.operationalizations.map(op => 
          `  - ${op.scaleName} (${op.method === 'pdf' ? 'PDF' : 'Text'})`
        ).join('\n');
        return `${dv.name}:\n${opsText}`;
      }).join('\n\n');

      const description = `
        Research Question: ${surveyData.researchQuestion}
        Hypotheses: ${hypothesesText}
        Dependent Variables: 
        ${dvText}
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

  return (
    <>
      <GlobalStyles />
      <div className="h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black font-inter overflow-hidden relative">
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

        {/* Main container */}
        <div className="relative mx-auto h-screen px-4 flex flex-col">
          <BuilderPanel 
            currentStep={currentStep}
            surveyData={surveyData}
            updateSurveyData={updateSurveyData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onGenerateSurvey={handleGenerateSurvey}
            showPreview={false}
          />
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.1); }
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </div>
    </>
  );
}

export default App;