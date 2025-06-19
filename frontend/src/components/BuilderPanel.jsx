import React from 'react';
import { Button } from './ui/button';
import ProgressSteps from './ProgressSteps';
import StepStudyType from './steps/StepStudyType';
import StepResearchQuestion from './steps/StepResearchQuestion';
import StepExploratoryDVs from './steps/StepExploratoryDVs';
import StepDemographics from './steps/StepDemographics';
import StepReview from './steps/StepReview';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const BuilderPanel = ({ 
  currentStep, 
  surveyData, 
  updateSurveyData, 
  onNext, 
  onPrevious,
  onGenerateSurvey
}) => {
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <StepStudyType 
          studyType={surveyData.studyType}
          updateSurveyData={updateSurveyData}
        />;
      case 2:
        return <StepResearchQuestion 
          researchQuestion={surveyData.researchQuestion}
          hypothesis={surveyData.hypothesis}
          updateSurveyData={updateSurveyData}
        />;
      case 3:
        return <StepExploratoryDVs 
          exploratoryDVs={surveyData.dependentVariables}
          updateSurveyData={updateSurveyData}
        />;
      case 4:
        return <StepDemographics 
          demographics={surveyData.demographics}
          updateSurveyData={updateSurveyData}
        />;
      case 5:
        return <StepReview 
          surveyData={surveyData}
          onGenerateSurvey={onGenerateSurvey}
        />;
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch(currentStep) {
      case 1:
        return surveyData.studyType !== '';
      case 2:
        // Updated to check for at least one hypothesis in the array
        const hypotheses = Array.isArray(surveyData.hypothesis) ? surveyData.hypothesis : [];
        return hypotheses.length > 0 && hypotheses.some(h => h.text && h.text.trim() !== '');
      case 3:
        return true; // Optional - can proceed without DVs
      case 4:
        return surveyData.demographics.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Large glass container wrapper - now with controlled dimensions */}
      <div className="flex-1 w-full max-w-[95%] mx-auto rounded-3xl backdrop-blur-md bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 overflow-hidden">
        <div className="bg-gradient-to-br from-zinc-900/50 to-transparent h-full flex flex-col p-12">
          {/* Progress indicator inside glass container */}
          <div className="mb-12 shrink-0">
            <ProgressSteps currentStep={currentStep} />
          </div>

          {/* Main content area with proper scrolling */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-4">
            {renderStep()}
          </div>

          {/* Navigation buttons at bottom of glass container */}
          <div className="flex justify-between items-center pt-8 pb-4 border-t border-white/5 shrink-0">
            <Button
              onClick={onPrevious}
              disabled={currentStep === 1}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all duration-300
                flex items-center gap-2 text-white
                ${currentStep === 1 
                  ? 'opacity-50 cursor-not-allowed bg-white/5' 
                  : 'bg-white/10 hover:bg-white/20 hover:scale-105'
                }
              `}
            >
              <FiArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={onNext}
                disabled={!canProceed()}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-300
                  flex items-center gap-2 text-white
                  ${!canProceed()
                    ? 'opacity-50 cursor-not-allowed bg-white/5' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25'
                  }
                `}
              >
                Next
                <FiArrowRight className="w-4 h-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPanel;