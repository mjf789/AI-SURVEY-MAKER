// frontend/src/components/steps/StepReview.jsx
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { FiCheck, FiFileText, FiUsers, FiClipboard, FiLayers, FiLoader, FiExternalLink, FiZap, FiShield, FiDownload } from 'react-icons/fi';

const StepReview = ({ surveyData, onGenerateSurvey }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportResult, setExportResult] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setExportResult(null);
    
    try {
      const result = await onGenerateSurvey();
      
      if (result && result.success) {
        setExportResult({
          success: true,
          message: 'Survey exported successfully! Check your downloads folder.'
        });
      } else {
        setExportResult({
          success: false,
          message: result?.error || 'Failed to generate survey. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error in handleGenerate:', error);
      setExportResult({
        success: false,
        message: 'An error occurred while generating the survey.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Format dependent variables for display
  const formatDependentVariables = () => {
    if (!surveyData.dependentVariables || surveyData.dependentVariables.length === 0) {
      return [{ label: 'Status', value: 'None added' }];
    }
    
    return surveyData.dependentVariables.map(dv => ({
      label: dv.name,
      value: `${dv.operationalizations.length} scale${dv.operationalizations.length !== 1 ? 's' : ''}`,
      expandedItems: dv.operationalizations && dv.operationalizations.length > 0 
        ? dv.operationalizations.map((op, i) => ({
            label: op.scaleName || 'Unnamed scale',
            value: op.method === 'pdf' ? `PDF: ${op.content || 'No file'}` : 'Text content provided'
          }))
        : null
    }));
  };

  // Format hypotheses for display
  const formatHypotheses = () => {
    if (!surveyData.hypothesis) return 'None added';
    
    if (Array.isArray(surveyData.hypothesis)) {
      return `${surveyData.hypothesis.length} hypothesis${surveyData.hypothesis.length !== 1 ? 'es' : ''}`;
    }
    
    // Fallback for old string format
    return '1 hypothesis';
  };

  // Get detailed hypotheses for expanded view
  const getDetailedHypotheses = () => {
    if (!surveyData.hypothesis) return [];
    
    if (Array.isArray(surveyData.hypothesis)) {
      return surveyData.hypothesis.map((h, i) => ({
        label: `H${i + 1}`,
        value: h.text
      }));
    }
    
    // Fallback for old string format
    return [{ label: 'Hypothesis', value: surveyData.hypothesis }];
  };

  // Only show two sections now: Hypotheses/DVs and Demographics
  const sections = [
    {
      icon: FiClipboard,
      title: 'Research Design',
      color: 'blue',
      items: [
        { label: 'Hypotheses', value: formatHypotheses() }
      ],
      expandedItems: Array.isArray(surveyData.hypothesis) && surveyData.hypothesis.length > 0 
        ? getDetailedHypotheses() 
        : null
    },
    {
      icon: FiLayers,
      title: 'Dependent Variables',
      color: 'purple',
      items: formatDependentVariables()
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
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30'
  };

  return (
    <div className="w-full animate-fadeIn">
      <div className="mb-12 text-center">
        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-none">
          Review & Generate
        </h2>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          Export your survey with automatic randomization
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Review sections grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
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
                      <div key={i}>
                        <div className="flex justify-between items-start gap-3">
                          <span className="text-zinc-400 text-sm">{item.label}</span>
                          <span className={`
                            text-sm text-right flex-1
                            ${item.highlight ? 'text-white font-medium' : 'text-zinc-300'}
                          `}>
                            {item.value}
                          </span>
                        </div>
                        
                        {/* Expanded items for DVs with operationalizations */}
                        {item.expandedItems && (
                          <div className="mt-2 pl-4 space-y-1">
                            {item.expandedItems.map((subItem, j) => (
                              <div key={j} className="text-xs">
                                <span className="text-zinc-500">• {subItem.label}:</span>
                                <span className="text-zinc-400 ml-1">{subItem.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Expanded items for multiple hypotheses */}
                    {section.expandedItems && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        {section.expandedItems.map((item, i) => (
                          <div key={i} className="pl-4">
                            <div className="flex items-start gap-2">
                              <span className="text-blue-400 text-xs font-medium shrink-0">{item.label}:</span>
                              <span className="text-zinc-300 text-sm">{item.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
            Survey Flow with Randomization
          </h3>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {['Consent', 'Demographics', 'DV Measures', 'Debrief'].map((step, index) => (
              <div key={index} className="relative z-10 text-center">
                <div className={`w-14 h-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl flex items-center justify-center border border-white/20 ${
                  step === 'DV Measures' ? 'ring-2 ring-purple-500/50' : ''
                }`}>
                  <span className="text-white font-semibold">{index + 1}</span>
                </div>
                <span className="text-xs text-zinc-400">{step}</span>
                {step === 'DV Measures' && (
                  <span className="text-xs text-purple-400 block mt-1">Randomized</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features info */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: FiShield, title: 'IRB Compliant', desc: 'Standard consent & debrief' },
            { icon: FiZap, title: 'Smart Randomization', desc: 'Within & between blocks' },
            { icon: FiFileText, title: 'QSF Format', desc: 'Ready for Qualtrics' }
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

        {/* Generate button or result state */}
        <div className="text-center">
          {!exportResult ? (
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
                <div className="flex items-center gap-3">
                  <FiLoader className="w-5 h-5 animate-spin" />
                  Generating QSF File...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <FiDownload className="w-5 h-5" />
                  Export Survey (QSF)
                </div>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              {/* Result message */}
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl border ${
                exportResult.success 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <FiCheck className={`w-5 h-5 ${
                  exportResult.success ? 'text-green-400' : 'text-red-400'
                }`} />
                <span className={`font-medium ${
                  exportResult.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  {exportResult.message}
                </span>
              </div>
              
              {/* Instructions */}
              {exportResult.success && (
                <div className="bg-zinc-900/50 rounded-xl p-6 border border-white/10 max-w-2xl mx-auto">
                  <h4 className="text-lg font-medium text-white mb-3">Next Steps:</h4>
                  <ol className="space-y-2 text-left">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-400 font-medium">1.</span>
                      <span className="text-zinc-300">Find the QSF file in your downloads folder</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-400 font-medium">2.</span>
                      <span className="text-zinc-300">Log into your Qualtrics account</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-400 font-medium">3.</span>
                      <span className="text-zinc-300">Create a new project → Survey → Import survey</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-400 font-medium">4.</span>
                      <span className="text-zinc-300">Upload the QSF file and your survey is ready!</span>
                    </li>
                  </ol>
                </div>
              )}
              
              {/* Try again button */}
              {exportResult.success && (
                <Button
                  onClick={() => setExportResult(null)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
                >
                  Export Another Copy
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepReview;