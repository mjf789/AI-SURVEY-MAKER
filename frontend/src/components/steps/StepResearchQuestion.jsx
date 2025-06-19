import React, { useState, useEffect } from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { FiTrendingUp, FiAlertCircle, FiPlus, FiTrash2, FiEdit3, FiCheck, FiX, FiZap } from 'react-icons/fi';

const StepResearchQuestion = ({ researchQuestion, hypothesis, extractedDVs: extractedDVsProp, updateSurveyData, lastExtractedHypothesisHash }) => {
  const [focusedField, setFocusedField] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newHypothesis, setNewHypothesis] = useState('');
  const [editText, setEditText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedDVs, setExtractedDVs] = useState(extractedDVsProp || []);
  
  // Convert hypothesis to array format if it's a string
  const hypotheses = Array.isArray(hypothesis) ? hypothesis : (hypothesis ? [{ id: 1, text: hypothesis }] : []);

  // Helper to get a hash of the hypotheses array (by text)
  const getHypothesesHash = (hyps) => JSON.stringify(hyps.map(h => h.text));

  // Extract DVs only if hypotheses have changed (using hash from parent)
  useEffect(() => {
    const currentHash = getHypothesesHash(hypotheses);
    if (
      hypotheses.length > 0 &&
      currentHash !== lastExtractedHypothesisHash
    ) {
      extractDVsFromHypotheses(currentHash);
    } else if (hypotheses.length === 0 && lastExtractedHypothesisHash !== '') {
      setExtractedDVs([]);
      updateSurveyData('extractedDVs', []);
      updateSurveyData('dependentVariables', []);
      updateSurveyData('lastExtractedHypothesisHash', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hypotheses, lastExtractedHypothesisHash]);

  // If extractedDVsProp changes (e.g., on first mount), sync to local state
  useEffect(() => {
    if (Array.isArray(extractedDVsProp)) {
      setExtractedDVs(extractedDVsProp);
    }
  }, [extractedDVsProp]);

  const extractDVsFromHypotheses = async (hashToSet) => {
    if (hypotheses.length === 0) return;
    setIsExtracting(true);
    try {
      const response = await fetch('/api/extract-dvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          hypotheses: hypotheses.map(h => h.text) 
        })
      });
      if (response.ok) {
        const data = await response.json();
        const newExtractedDVs = data.extraction?.uniqueDVs || [];
        const newDependentVariables = newExtractedDVs.map(dv => ({
          id: dv.id,
          name: dv.name,
          operationalizations: []
        }));
        // Only update if values actually changed
        if (JSON.stringify(newExtractedDVs) !== JSON.stringify(extractedDVsProp)) {
          setExtractedDVs(newExtractedDVs);
          updateSurveyData('extractedDVs', newExtractedDVs);
        }
        if (JSON.stringify(newDependentVariables) !== JSON.stringify([])) {
          updateSurveyData('dependentVariables', newDependentVariables);
        }
        if (hashToSet !== lastExtractedHypothesisHash) {
          updateSurveyData('lastExtractedHypothesisHash', hashToSet);
        }
      }
    } catch (error) {
      console.error('Error extracting DVs:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddHypothesis = () => {
    if (newHypothesis.trim()) {
      const newHypothesesArray = [
        ...hypotheses,
        {
          id: Date.now(),
          text: newHypothesis.trim()
        }
      ];
      updateSurveyData('hypothesis', newHypothesesArray);
      setNewHypothesis('');
      setIsAdding(false);
    }
  };

  const handleEditHypothesis = (id) => {
    const hyp = hypotheses.find(h => h.id === id);
    setEditText(hyp.text);
    setEditingId(id);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      const updatedHypotheses = hypotheses.map(h => 
        h.id === editingId ? { ...h, text: editText.trim() } : h
      );
      updateSurveyData('hypothesis', updatedHypotheses);
      setEditingId(null);
      setEditText('');
    }
  };

  const handleDeleteHypothesis = (id) => {
    const updatedHypotheses = hypotheses.filter(h => h.id !== id);
    updateSurveyData('hypothesis', updatedHypotheses);
  };

  return (
    <div className="w-full animate-fadeIn">
      <div className="mb-12 text-center">
        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-none">
          Define Your Hypotheses
        </h2>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          State your predicted relationships between variables
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Hypotheses Section */}
        <div className={`
          relative rounded-2xl transition-all duration-500
          ${focusedField === 'hypothesis' 
            ? 'bg-gradient-to-br from-blue-500/5 to-transparent shadow-xl' 
            : 'bg-white/[0.02] hover:bg-white/[0.03]'
          }
          p-10 border ${focusedField === 'hypothesis' ? 'border-blue-500/30' : 'border-white/5'}
        `}>
          {/* Icon and label */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className={`
                p-5 rounded-xl backdrop-blur-xl transition-all duration-500
                ${focusedField === 'hypothesis'
                  ? 'bg-gradient-to-br from-blue-500/30 to-blue-600/20 shadow-lg shadow-blue-500/20'
                  : 'bg-white/[0.05] hover:bg-white/[0.08]'
                }
              `}>
                <FiTrendingUp className={`
                  w-10 h-10 transition-all duration-500
                  ${focusedField === 'hypothesis' ? 'text-blue-400' : 'text-white/70'}
                `} />
              </div>
              <div>
                <Label className="text-3xl font-semibold text-white">
                  Research Hypotheses
                </Label>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* AI Extraction Status */}
              {isExtracting && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg">
                  <FiZap className="w-4 h-4 text-blue-400 animate-pulse" />
                  <span className="text-sm text-blue-300">AI extracting DVs...</span>
                </div>
              )}
              
              {!isAdding && (
                <Button
                  onClick={() => setIsAdding(true)}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-300 flex items-center gap-2"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Hypothesis
                </Button>
              )}
            </div>
          </div>

          {/* Existing hypotheses */}
          {hypotheses.length > 0 && (
            <div className="space-y-4 mb-6">
              {hypotheses.map((hyp, index) => (
                <div key={hyp.id} className="group relative">
                  {editingId === hyp.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="min-h-[120px] w-full px-5 py-4 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-blue-500/50 text-white !text-xl md:!text-xl placeholder:text-white/40 focus:border-blue-400/70 transition-all duration-300"
                        placeholder="Edit your hypothesis..."
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveEdit}
                          className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm flex items-center gap-1.5"
                        >
                          <FiCheck className="w-3.5 h-3.5" />
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingId(null);
                            setEditText('');
                          }}
                          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm flex items-center gap-1.5"
                        >
                          <FiX className="w-3.5 h-3.5" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-base font-medium text-blue-400">H{index + 1}</span>
                        </div>
                        <p className="text-white/90 flex-1 leading-relaxed text-lg">{hyp.text}</p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditHypothesis(hyp.id)}
                            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200"
                            type="button"
                          >
                            <FiEdit3 className="w-4 h-4 text-white/60 hover:text-white/90" />
                          </button>
                          <button
                            onClick={() => handleDeleteHypothesis(hyp.id)}
                            className="p-1.5 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                            type="button"
                          >
                            <FiTrash2 className="w-4 h-4 text-white/60 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add new hypothesis form */}
          {isAdding && (
            <div className="space-y-4">
              <Textarea
                value={newHypothesis}
                onChange={(e) => setNewHypothesis(e.target.value)}
                onFocus={() => setFocusedField('hypothesis')}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g., We hypothesize that higher social media usage will be associated with lower self-reported well-being scores"
                className="min-h-[140px] w-full px-5 py-4 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-blue-500/50 text-white !text-xl md:!text-xl placeholder:text-white/40 focus:border-blue-400/70 transition-all duration-300"
                autoFocus
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleAddHypothesis}
                  disabled={!newHypothesis.trim()}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-white/5 disabled:text-white/30 text-blue-400 border border-blue-500/30 disabled:border-white/10 rounded-lg transition-all duration-300 flex items-center gap-2"
                >
                  <FiCheck className="w-4 h-4" />
                  Add Hypothesis
                </Button>
                <Button
                  onClick={() => {
                    setIsAdding(false);
                    setNewHypothesis('');
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded-lg transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Helper text */}
          {hypotheses.length === 0 && !isAdding && (
            <div className="mt-8 flex items-start gap-2">
              <FiAlertCircle className="w-5 h-5 text-blue-400/70 mt-0.5 flex-shrink-0" />
              <p className="text-base text-white/50">
                You can add multiple hypotheses for complex studies.
              </p>
            </div>
          )}

          {/* Extracted DVs Preview */}
          {extractedDVs.length > 0 && (
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
              <div className="flex items-center gap-2 mb-4">
                <FiZap className="w-5 h-5 text-green-400" />
                <h4 className="text-lg font-semibold text-white">AI-Extracted Dependent Variables</h4>
              </div>
              <div className="flex flex-wrap gap-3">
                {extractedDVs.map((dv) => (
                  <span
                    key={dv.id}
                    className="px-4 py-2 bg-white/10 rounded-lg text-white/90 border border-white/20"
                  >
                    {dv.name}
                  </span>
                ))}
              </div>
              <p className="text-sm text-zinc-400 mt-3">
                These variables will be available for operationalization in the next step
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepResearchQuestion;