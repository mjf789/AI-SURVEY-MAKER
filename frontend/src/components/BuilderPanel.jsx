import React from 'react';
import { Button } from './ui/button';
import ProgressSteps from './ProgressSteps';
import StepStudyType from './steps/StepStudyType';
import StepResearchQuestion from './steps/StepResearchQuestion';
import StepPrimaryDV from './steps/StepPrimaryDV';
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
  onGenerateSurvey,
  showPreview 
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
        return <StepPrimaryDV 
          primaryDV={surveyData.primaryDV}
          updateSurveyData={updateSurveyData}
        />;
      case 4:
        return <StepExploratoryDVs 
          exploratoryDVs={surveyData.exploratoryDVs}
          updateSurveyData={updateSurveyData}
        />;
      case 5:
        return <StepDemographics 
          demographics={surveyData.demographics}
          updateSurveyData={updateSurveyData}
        />;
      case 6:
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
        return surveyData.researchQuestion.trim() !== '';
      case 3:
        return surveyData.primaryDV.name.trim() !== '' && 
               surveyData.primaryDV.items.length > 0;
      case 4:
        return true;
      case 5:
        return surveyData.demographics.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className={`
      min-h-screen flex flex-col backdrop-blur-xl
      ${showPreview 
        ? 'bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-transparent rounded-l-3xl border-l border-t border-b border-white/10' 
        : ''
      }
    `}>
      <div className={`flex-1 flex flex-col ${showPreview ? 'p-10' : 'p-16'}`}>
        {/* Progress indicator */}
        <div className="mb-12">
          <ProgressSteps currentStep={currentStep} />
        </div>
        
        {/* Main content area - made scrollable with custom scrollbar */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
          <div className={`w-full min-h-full ${showPreview ? 'px-4' : 'max-w-7xl mx-auto px-4'}`}>
            <div key={currentStep} className="animate-stepFade pb-8">
              {renderStep()}
            </div>
          </div>
        </div>
        
        {/* Navigation - sticky at bottom */}
        <div className="flex gap-6 pt-8 mt-auto">
          {currentStep > 1 && (
            <Button 
              variant="ghost" 
              onClick={onPrevious}
              className="group flex items-center px-8 py-4 text-zinc-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <FiArrowLeft className="mr-3 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="font-medium">Previous</span>
            </Button>
          )}
          {currentStep < 6 ? (
            <Button 
              onClick={onNext}
              disabled={!canProceed()}
              className={`
                group flex items-center ml-auto px-8 py-4 rounded-xl font-medium
                transition-all duration-300 transform
                ${canProceed()
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 border border-blue-400/20'
                  : 'bg-zinc-800/50 text-zinc-600 border border-zinc-700/50 cursor-not-allowed'
                }
              `}
            >
              <span>Continue</span>
              <FiArrowRight className={`
                ml-3 transition-all duration-300
                ${canProceed() ? 'group-hover:translate-x-1' : ''}
              `} />
            </Button>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        @keyframes stepFade {
          from { 
            opacity: 0; 
            transform: translateY(10px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        .animate-stepFade {
          animation: stepFade 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BuilderPanel;