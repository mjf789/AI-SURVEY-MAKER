import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { FiPlus, FiTrash2, FiFileText, FiUpload, FiEdit3, FiCheck, FiX, FiFile } from 'react-icons/fi';

const StepExploratoryDVs = ({ exploratoryDVs: dependentVariables, updateSurveyData }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newDV, setNewDV] = useState({ name: '', operationalizations: [] });
  const [addingOperationalization, setAddingOperationalization] = useState(null);
  const [newOperationalization, setNewOperationalization] = useState({ scaleName: '', method: 'text', content: '' });

  const handleAddDV = () => {
    if (newDV.name && newDV.operationalizations.length > 0) {
      updateSurveyData('dependentVariables', [
        ...dependentVariables,
        {
          id: Date.now(),
          name: newDV.name,
          operationalizations: newDV.operationalizations
        }
      ]);
      setNewDV({ name: '', operationalizations: [] });
      setIsAdding(false);
    }
  };

  const handleAddOperationalization = () => {
    if (newOperationalization.scaleName && newOperationalization.content) {
      if (addingOperationalization === 'new') {
        // Adding to new DV
        setNewDV({
          ...newDV,
          operationalizations: [
            ...newDV.operationalizations,
            { ...newOperationalization, id: Date.now() }
          ]
        });
      } else {
        // Adding to existing DV
        const updatedDVs = dependentVariables.map(dv => {
          if (dv.id === addingOperationalization) {
            return {
              ...dv,
              operationalizations: [
                ...dv.operationalizations,
                { ...newOperationalization, id: Date.now() }
              ]
            };
          }
          return dv;
        });
        updateSurveyData('dependentVariables', updatedDVs);
      }
      setNewOperationalization({ scaleName: '', method: 'text', content: '' });
      setAddingOperationalization(null);
    }
  };

  const handleRemoveDV = (id) => {
    updateSurveyData('dependentVariables', dependentVariables.filter(dv => dv.id !== id));
  };

  const handleRemoveOperationalization = (dvId, opId) => {
    if (dvId === 'new') {
      setNewDV({
        ...newDV,
        operationalizations: newDV.operationalizations.filter(op => op.id !== opId)
      });
    } else {
      const updatedDVs = dependentVariables.map(dv => {
        if (dv.id === dvId) {
          return {
            ...dv,
            operationalizations: dv.operationalizations.filter(op => op.id !== opId)
          };
        }
        return dv;
      });
      updateSurveyData('dependentVariables', updatedDVs);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setNewOperationalization({
        ...newOperationalization,
        content: file.name,
        file: file
      });
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      <div className="mb-12 text-center">
        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-none">
          Dependent Variables
        </h2>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          Define your outcome measures and their operationalizations
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Empty state */}
        {dependentVariables.length === 0 && !isAdding && (
          <div className="rounded-2xl backdrop-blur-md bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 p-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl flex items-center justify-center">
                <FiFileText className="w-10 h-10 text-zinc-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">No dependent variables yet</h3>
              <p className="text-zinc-500 mb-6 max-w-md mx-auto">
                Add variables to measure your study outcomes
              </p>
              <Button
                onClick={() => setIsAdding(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-6 py-3 text-base font-medium rounded-lg shadow-lg shadow-blue-500/20"
              >
                <FiPlus className="mr-2 w-4 h-4" />
                Add Your First Variable
              </Button>
            </div>
          </div>
        )}

        {/* Existing DVs */}
        <div className="space-y-6">
          {dependentVariables.map((dv, index) => (
            <div
              key={dv.id}
              className="group relative rounded-2xl backdrop-blur-md bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
            >
              <div className="p-8">
                {/* DV Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10">
                      <span className="text-lg font-bold text-green-400">DV{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white">{dv.name}</h3>
                      <p className="text-zinc-400 mt-1">{dv.operationalizations.length} operationalization{dv.operationalizations.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDV(dv.id)}
                    className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                  >
                    <FiTrash2 className="w-4 h-4 text-white/60 hover:text-red-400" />
                  </button>
                </div>

                {/* Operationalizations */}
                <div className="space-y-4 mb-4">
                  {dv.operationalizations.map((op, opIndex) => (
                    <div key={op.id} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-400">{opIndex + 1}</span>
                            </div>
                            <h4 className="text-lg font-medium text-white">{op.scaleName}</h4>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-zinc-400">
                            {op.method === 'pdf' ? (
                              <>
                                <FiFile className="w-4 h-4" />
                                <span>PDF: {op.content}</span>
                              </>
                            ) : (
                              <>
                                <FiFileText className="w-4 h-4" />
                                <span>Text content provided</span>
                              </>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveOperationalization(dv.id, op.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                        >
                          <FiTrash2 className="w-3.5 h-3.5 text-white/60 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add operationalization button */}
                {addingOperationalization !== dv.id && (
                  <Button
                    onClick={() => setAddingOperationalization(dv.id)}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300"
                  >
                    <FiPlus className="mr-2 w-4 h-4" />
                    Add Operationalization
                  </Button>
                )}

                {/* Add operationalization form */}
                {addingOperationalization === dv.id && (
                  <div className="space-y-4 p-5 rounded-xl bg-white/[0.03] border border-blue-500/30">
                    <div>
                      <Label className="text-base font-medium text-white mb-2 block">
                        Scale Name
                      </Label>
                      <Input
                        value={newOperationalization.scaleName}
                        onChange={(e) => setNewOperationalization({ ...newOperationalization, scaleName: e.target.value })}
                        placeholder="e.g., Social Interaction Anxiety Scale (SIAS)"
                        className="w-full px-4 py-3 text-base bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-blue-500/50 rounded-lg text-white placeholder:text-zinc-500"
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium text-white mb-2 block">
                        Scale Content
                      </Label>
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => setNewOperationalization({ ...newOperationalization, method: 'text' })}
                          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                            newOperationalization.method === 'text'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-white/5 text-white/60 border border-white/10'
                          }`}
                        >
                          <FiFileText className="inline mr-2 w-4 h-4" />
                          Paste Text
                        </button>
                        <button
                          onClick={() => setNewOperationalization({ ...newOperationalization, method: 'pdf' })}
                          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                            newOperationalization.method === 'pdf'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-white/5 text-white/60 border border-white/10'
                          }`}
                        >
                          <FiUpload className="inline mr-2 w-4 h-4" />
                          Upload PDF
                        </button>
                      </div>

                      {newOperationalization.method === 'text' ? (
                        <Textarea
                          value={newOperationalization.content}
                          onChange={(e) => setNewOperationalization({ ...newOperationalization, content: e.target.value })}
                          placeholder="Paste the scale items here (raw text is fine - our AI will format it)"
                          className="w-full min-h-[150px] px-4 py-3 text-base bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-blue-500/50 rounded-lg text-white placeholder:text-zinc-500"
                        />
                      ) : (
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                            id={`file-upload-${dv.id}`}
                          />
                          <label
                            htmlFor={`file-upload-${dv.id}`}
                            className="flex items-center justify-center w-full p-8 border-2 border-dashed border-white/20 hover:border-white/30 rounded-lg cursor-pointer transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.03]"
                          >
                            {newOperationalization.content ? (
                              <div className="text-center">
                                <FiFile className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                                <p className="text-white">{newOperationalization.content}</p>
                                <p className="text-sm text-zinc-500 mt-1">Click to change file</p>
                              </div>
                            ) : (
                              <div className="text-center">
                                <FiUpload className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                                <p className="text-white">Click to upload PDF</p>
                                <p className="text-sm text-zinc-500 mt-1">Contains scale items</p>
                              </div>
                            )}
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleAddOperationalization}
                        disabled={!newOperationalization.scaleName || !newOperationalization.content}
                        className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 py-2.5 rounded-lg disabled:opacity-50"
                      >
                        <FiCheck className="mr-2 w-4 h-4" />
                        Add Scale
                      </Button>
                      <Button
                        onClick={() => {
                          setAddingOperationalization(null);
                          setNewOperationalization({ scaleName: '', method: 'text', content: '' });
                        }}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add new DV form */}
          {isAdding && (
            <div className="rounded-2xl backdrop-blur-md bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Add New Variable</h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium text-white mb-2 block">
                    Variable Name
                  </Label>
                  <Input
                    value={newDV.name}
                    onChange={(e) => setNewDV({ ...newDV, name: e.target.value })}
                    placeholder="e.g., Social Anxiety"
                    className="w-full px-4 py-3 text-lg bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-blue-500/50 rounded-lg text-white placeholder:text-zinc-500"
                  />
                </div>

                {/* Operationalizations for new DV */}
                {newDV.operationalizations.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-white block">
                      Operationalizations
                    </Label>
                    {newDV.operationalizations.map((op, index) => (
                      <div key={op.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{op.scaleName}</p>
                            <p className="text-sm text-zinc-400">
                              {op.method === 'pdf' ? `PDF: ${op.content}` : 'Text content'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveOperationalization('new', op.id)}
                            className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <FiTrash2 className="w-3.5 h-3.5 text-white/60 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add operationalization to new DV */}
                {addingOperationalization !== 'new' && (
                  <Button
                    onClick={() => setAddingOperationalization('new')}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-dashed border-white/20 hover:border-white/30 rounded-xl transition-all duration-300"
                  >
                    <FiPlus className="mr-2 w-4 h-4" />
                    Add Operationalization
                  </Button>
                )}

                {/* Operationalization form for new DV */}
                {addingOperationalization === 'new' && (
                  <div className="space-y-4 p-5 rounded-xl bg-white/[0.03] border border-blue-500/30">
                    <div>
                      <Label className="text-base font-medium text-white mb-2 block">
                        Scale Name
                      </Label>
                      <Input
                        value={newOperationalization.scaleName}
                        onChange={(e) => setNewOperationalization({ ...newOperationalization, scaleName: e.target.value })}
                        placeholder="e.g., Social Interaction Anxiety Scale (SIAS)"
                        className="w-full px-4 py-3 text-base bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-blue-500/50 rounded-lg text-white placeholder:text-zinc-500"
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium text-white mb-2 block">
                        Scale Content
                      </Label>
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => setNewOperationalization({ ...newOperationalization, method: 'text' })}
                          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                            newOperationalization.method === 'text'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-white/5 text-white/60 border border-white/10'
                          }`}
                        >
                          <FiFileText className="inline mr-2 w-4 h-4" />
                          Paste Text
                        </button>
                        <button
                          onClick={() => setNewOperationalization({ ...newOperationalization, method: 'pdf' })}
                          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                            newOperationalization.method === 'pdf'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-white/5 text-white/60 border border-white/10'
                          }`}
                        >
                          <FiUpload className="inline mr-2 w-4 h-4" />
                          Upload PDF
                        </button>
                      </div>

                      {newOperationalization.method === 'text' ? (
                        <Textarea
                          value={newOperationalization.content}
                          onChange={(e) => setNewOperationalization({ ...newOperationalization, content: e.target.value })}
                          placeholder="Paste the scale items here (raw text is fine - our AI will format it)"
                          className="w-full min-h-[150px] px-4 py-3 text-base bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-blue-500/50 rounded-lg text-white placeholder:text-zinc-500"
                        />
                      ) : (
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload-new"
                          />
                          <label
                            htmlFor="file-upload-new"
                            className="flex items-center justify-center w-full p-8 border-2 border-dashed border-white/20 hover:border-white/30 rounded-lg cursor-pointer transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.03]"
                          >
                            {newOperationalization.content ? (
                              <div className="text-center">
                                <FiFile className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                                <p className="text-white">{newOperationalization.content}</p>
                                <p className="text-sm text-zinc-500 mt-1">Click to change file</p>
                              </div>
                            ) : (
                              <div className="text-center">
                                <FiUpload className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                                <p className="text-white">Click to upload PDF</p>
                                <p className="text-sm text-zinc-500 mt-1">Contains scale items</p>
                              </div>
                            )}
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleAddOperationalization}
                        disabled={!newOperationalization.scaleName || !newOperationalization.content}
                        className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 py-2.5 rounded-lg disabled:opacity-50"
                      >
                        <FiCheck className="mr-2 w-4 h-4" />
                        Add Scale
                      </Button>
                      <Button
                        onClick={() => {
                          setAddingOperationalization(null);
                          setNewOperationalization({ scaleName: '', method: 'text', content: '' });
                        }}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action buttons for new DV */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAddDV}
                    disabled={!newDV.name || newDV.operationalizations.length === 0}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 py-3 text-base font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiCheck className="mr-2" />
                    Add Variable
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAdding(false);
                      setNewDV({ name: '', operationalizations: [] });
                      setAddingOperationalization(null);
                      setNewOperationalization({ scaleName: '', method: 'text', content: '' });
                    }}
                    className="px-6 py-3 bg-white/[0.05] border-white/20 text-white hover:bg-white/[0.08] hover:border-white/30 rounded-lg"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add button when DVs exist */}
        {dependentVariables.length > 0 && !isAdding && (
          <div className="mt-8 text-center">
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-white/[0.05] border border-white/20 text-white hover:bg-white/[0.08] hover:border-white/30 px-6 py-3 text-base font-medium rounded-lg transition-all duration-300 hover:scale-105"
            >
              <FiPlus className="mr-2 w-4 h-4" />
              Add Another Variable
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepExploratoryDVs;