import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { FiPlus, FiTrash2, FiFileText, FiMove, FiEdit3, FiCheck, FiX } from 'react-icons/fi';

const StepExploratoryDVs = ({ exploratoryDVs, updateSurveyData }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newDV, setNewDV] = useState({ name: '', items: '' });

  const handleAdd = () => {
    if (newDV.name && newDV.items) {
      const items = newDV.items.split('\n').filter(item => item.trim());
      updateSurveyData('exploratoryDVs', [
        ...exploratoryDVs,
        {
          id: Date.now(),
          name: newDV.name,
          items: items,
          randomize: true
        }
      ]);
      setNewDV({ name: '', items: '' });
      setIsAdding(false);
    }
  };

  const handleRemove = (id) => {
    updateSurveyData('exploratoryDVs', exploratoryDVs.filter(dv => dv.id !== id));
  };

  return (
    <div className="w-full animate-fadeIn">
      <div className="mb-12 text-center">
        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-none">
          Exploratory Measures
        </h2>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Empty state */}
        {exploratoryDVs.length === 0 && !isAdding && (
          <div className="rounded-2xl backdrop-blur-md bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 p-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl flex items-center justify-center">
                <FiFileText className="w-10 h-10 text-zinc-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">No exploratory measures yet</h3>
              <p className="text-zinc-500 mb-6 max-w-md mx-auto">
                Add supplementary scales to capture additional constructs or control variables
              </p>
              <Button
                onClick={() => setIsAdding(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-6 py-3 text-base font-medium rounded-lg shadow-lg shadow-blue-500/20"
              >
                <FiPlus className="mr-2 w-4 h-4" />
                Add Your First Measure
              </Button>
            </div>
          </div>
        )}

        {/* Existing measures */}
        <div className="space-y-4">
          {exploratoryDVs.map((dv, index) => (
            <div
              key={dv.id}
              className="group relative rounded-2xl backdrop-blur-md bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-xl hover:shadow-black/20 overflow-hidden"
            >
              {/* Measure content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl">
                      <span className="text-lg font-bold text-blue-400">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{dv.name}</h3>
                      <p className="text-zinc-500 mt-0.5 text-sm">{dv.items.length} items • Randomized order</p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => setEditingId(dv.id)}
                      className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <FiEdit3 className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                    </button>
                    <button
                      onClick={() => handleRemove(dv.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 transition-all duration-300"
                    >
                      <FiTrash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Items preview */}
                <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5">
                  <div className="space-y-2">
                    {dv.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-zinc-600 text-sm mt-0.5">{i + 1}.</span>
                        <p className="text-zinc-400 text-sm">{item}</p>
                      </div>
                    ))}
                    {dv.items.length > 3 && (
                      <p className="text-zinc-600 text-sm italic mt-2">
                        ... and {dv.items.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover effect gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Add new measure form */}
        {isAdding && (
          <div className="rounded-2xl backdrop-blur-md bg-gradient-to-br from-blue-500/10 to-transparent border-2 border-blue-500/30 overflow-hidden animate-slideIn">
            <div className="bg-gradient-to-br from-zinc-900/50 to-transparent p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Add New Measure</h3>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewDV({ name: '', items: '' });
                  }}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <FiX className="w-4 h-4 text-zinc-400 hover:text-white" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium text-white mb-2 block">
                    Scale Name
                  </Label>
                  <Input
                    value={newDV.name}
                    onChange={(e) => setNewDV({ ...newDV, name: e.target.value })}
                    placeholder="e.g., Social Anxiety Scale"
                    className="w-full px-4 py-3 text-base bg-white/[0.03] backdrop-blur-xl border-2 border-white/10 hover:border-white/20 focus:border-blue-500/50 rounded-lg transition-all duration-300 placeholder:text-zinc-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium text-white mb-2 block">
                    Items (one per line)
                  </Label>
                  <Textarea
                    value={newDV.items}
                    onChange={(e) => setNewDV({ ...newDV, items: e.target.value })}
                    placeholder="Enter each item on a new line"
                    className="w-full min-h-[150px] px-4 py-3 text-base bg-white/[0.03] backdrop-blur-xl border-2 border-white/10 hover:border-white/20 focus:border-blue-500/50 rounded-lg transition-all duration-300 placeholder:text-zinc-600 text-white font-mono"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleAdd}
                    disabled={!newDV.name || !newDV.items}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 py-3 text-base font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiCheck className="mr-2" />
                    Add Measure
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false);
                      setNewDV({ name: '', items: '' });
                    }}
                    className="px-6 py-3 bg-white/[0.05] border-white/20 text-white hover:bg-white/[0.08] hover:border-white/30 rounded-lg"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add button when measures exist */}
        {exploratoryDVs.length > 0 && !isAdding && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-white/[0.05] border border-white/20 text-white hover:bg-white/[0.08] hover:border-white/30 px-6 py-3 text-base font-medium rounded-lg transition-all duration-300 hover:scale-105"
            >
              <FiPlus className="mr-2 w-4 h-4" />
              Add Another Measure
            </Button>
          </div>
        )}

        {/* Info banner */}
        {exploratoryDVs.length > 0 && (
          <div className="mt-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-md border border-blue-500/20 p-4">
            <div className="flex items-center gap-2">
              <FiMove className="w-4 h-4 text-blue-400" />
              <p className="text-blue-300 text-sm">
                Measure presentation order will be randomized to minimize order effects
              </p>
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
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StepExploratoryDVs;