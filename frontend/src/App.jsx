// frontend/src/App.jsx
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
    extractedDVs: [], // NEW: DVs extracted by AI from hypotheses
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
      // Prepare data for QSF generation with automatic randomization
      const exportData = {
        study: {
          title: surveyData.researchQuestion || 'Research Survey',
          description: surveyData.researchQuestion
        },
        hypotheses: surveyData.hypothesis,
        dependentVariables: surveyData.dependentVariables,
        demographics: surveyData.demographics,
        exportSettings: {
          format: 'qsf',
          includeTemplates: {
            consent: true,
            demographics: true,
            debrief: true
          },
          demographicOptions: {}
        },
        // Always enable randomization for better research design
        randomization: {
          betweenBlocks: { 
            enabled: true,
            type: 'full',
            fixedBlocks: ['consent', 'demographics', 'debrief']
          },
          withinBlocks: { 
            enabled: true,
            blockSettings: {}
          }
        }
      };

      // Build demographic options based on selected demographics
      surveyData.demographics.forEach(demo => {
        const demoLower = demo.toLowerCase();
        switch(demoLower) {
          case 'age':
            exportData.exportSettings.demographicOptions.age = { 
              type: 'numeric', 
              validation: { min: 18, max: 100 } 
            };
            break;
          case 'gender':
            exportData.exportSettings.demographicOptions.gender = { 
              type: 'multiple_choice', 
              options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] 
            };
            break;
          case 'ethnicity':
            exportData.exportSettings.demographicOptions.ethnicity = { 
              type: 'multiple_choice', 
              options: ['White/Caucasian', 'Black/African American', 'Hispanic/Latino', 'Asian', 'Native American', 'Pacific Islander', 'Other', 'Prefer not to say'] 
            };
            break;
          case 'education':
            exportData.exportSettings.demographicOptions.education = { 
              type: 'multiple_choice', 
              options: ['Less than high school', 'High school diploma/GED', 'Some college', 'Bachelor\'s degree', 'Master\'s degree', 'Doctoral degree', 'Professional degree'] 
            };
            break;
          case 'income':
            exportData.exportSettings.demographicOptions.income = { 
              type: 'multiple_choice', 
              options: ['Less than $25,000', '$25,000-$49,999', '$50,000-$74,999', '$75,000-$99,999', '$100,000-$149,999', '$150,000 or more', 'Prefer not to say'] 
            };
            break;
          case 'location':
            exportData.exportSettings.demographicOptions.location = { 
              type: 'text',
              placeholder: 'City, State/Country'
            };
            break;
          case 'relationship status':
            exportData.exportSettings.demographicOptions['relationship status'] = { 
              type: 'multiple_choice', 
              options: ['Single', 'In a relationship', 'Married', 'Divorced', 'Widowed', 'Prefer not to say'] 
            };
            break;
          case 'employment':
            exportData.exportSettings.demographicOptions.employment = { 
              type: 'multiple_choice', 
              options: ['Full-time', 'Part-time', 'Self-employed', 'Unemployed', 'Student', 'Retired', 'Other'] 
            };
            break;
        }
      });

      // Set up within-block randomization for each DV
      if (surveyData.dependentVariables) {
        surveyData.dependentVariables.forEach(dv => {
          exportData.randomization.withinBlocks.blockSettings[`dv_${dv.id}`] = {
            randomizeQuestions: true,
            randomizeOptions: false
          };
        });
      }

      console.log('Sending survey data to QSF generator:', exportData);

      const response = await fetch('/api/generate-qsf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surveyData: exportData })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${surveyData.researchQuestion?.replace(/[^a-z0-9]/gi, '_') || 'survey'}.qsf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        return { success: true };
      } else {
        const errorText = await response.text();
        console.error('Export failed:', errorText);
        return { success: false, error: errorText };
      }
    } catch (error) {
      console.error('Error generating survey:', error);
      return { success: false, error: error.message };
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