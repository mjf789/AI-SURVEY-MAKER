import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { FiFileText, FiUpload, FiClipboard, FiHash, FiShuffle } from 'react-icons/fi';

const StepPrimaryDV = ({ primaryDV, updateSurveyData }) => {
  const [focusedField, setFocusedField] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file upload logic here
  };

  return (
    <div className="w-full animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight leading-none">
          Primary Dependent Variable
        </h2>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Main card container - reduced max width */}
        <div className="rounded-2xl backdrop-blur-md bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 overflow-hidden">
          <div className="bg-gradient-to-br from-zinc-900/50 to-transparent">
            {/* Header section */}
            <div className="px-6 pt-6 pb-4 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl">
                    <FiClipboard className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Scale Configuration</h3>
                  </div>
                </div>
                
                {/* Stats badges */}
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/10">
                    <span className="text-xs text-zinc-400">
                      <FiHash className="inline w-3 h-3 mr-1" />
                      {primaryDV.items.length} items
                    </span>
                  </div>
                  {primaryDV.randomizeItems && (
                    <div className="px-2.5 py-1 rounded-full bg-blue-500/10 backdrop-blur-xl border border-blue-500/30">
                      <span className="text-xs text-blue-400">
                        <FiShuffle className="inline w-3 h-3 mr-1" />
                        Randomized
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content sections */}
            <div className="p-6 space-y-5">
              {/* Scale Name Input */}
              <div className={`
                relative rounded-xl transition-all duration-300
                ${focusedField === 'name' 
                  ? 'bg-gradient-to-br from-blue-500/5 to-transparent shadow-lg' 
                  : 'bg-white/[0.02] hover:bg-white/[0.03]'
                }
                p-5 border ${focusedField === 'name' ? 'border-blue-500/30' : 'border-white/5'}
              `}>
                <Label className="text-base font-medium text-white mb-2.5 block">
                  Scale Name
                </Label>
                <Input
                  type="text"
                  value={primaryDV.name}
                  onChange={(e) => updateSurveyData('primaryDV', { ...primaryDV, name: e.target.value })}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g., Rosenberg Self-Esteem Scale"
                  className={`
                    w-full px-4 py-3 text-base
                    bg-white/[0.03] backdrop-blur-xl
                    border-2 rounded-lg transition-all duration-300
                    placeholder:text-zinc-600 text-white
                    ${focusedField === 'name'
                      ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
                      : 'border-white/10 hover:border-white/20'
                    }
                  `}
                />
              </div>

              {/* Scale Items Textarea */}
              <div className={`
                relative rounded-xl transition-all duration-300
                ${focusedField === 'items' 
                  ? 'bg-gradient-to-br from-blue-500/5 to-transparent shadow-lg' 
                  : 'bg-white/[0.02] hover:bg-white/[0.03]'
                }
                p-5 border ${focusedField === 'items' ? 'border-blue-500/30' : 'border-white/5'}
              `}>
                <div className="flex items-center justify-between mb-2.5">
                  <Label className="text-base font-medium text-white">
                    Scale Items
                  </Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateSurveyData('primaryDV', { 
                      ...primaryDV, 
                      randomizeItems: !primaryDV.randomizeItems 
                    })}
                    className={`
                      text-xs transition-all duration-300
                      ${primaryDV.randomizeItems 
                        ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20' 
                        : 'text-zinc-500 hover:text-white hover:bg-white/[0.05]'
                      }
                    `}
                  >
                    <FiShuffle className="mr-1.5" />
                    Randomize Order
                  </Button>
                </div>
                <Textarea
                  value={primaryDV.items.join('\n')}
                  onChange={(e) => updateSurveyData('primaryDV', { 
                    ...primaryDV, 
                    items: e.target.value.split('\n').filter(item => item.trim()) 
                  })}
                  onFocus={() => setFocusedField('items')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Paste your scale items above, one per line"
                  rows={8}
                  className={`
                    w-full px-4 py-3 text-base
                    bg-white/[0.03] backdrop-blur-xl
                    border-2 rounded-lg transition-all duration-300
                    placeholder:text-zinc-600 text-white
                    resize-none
                    ${focusedField === 'items'
                      ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
                      : 'border-white/10 hover:border-white/20'
                    }
                  `}
                />
                <p className="text-xs text-zinc-500 mt-2">
                  {primaryDV.items.length === 0 
                    ? 'No items yet' 
                    : `${primaryDV.items.length} item${primaryDV.items.length !== 1 ? 's' : ''} added`
                  }
                </p>
              </div>

              {/* File Upload Section */}
              <div className="text-center text-sm text-zinc-500 py-3">
                or
              </div>

              <div 
                className={`
                  group relative rounded-xl transition-all duration-300 cursor-pointer
                  ${isDragging 
                    ? 'bg-blue-500/10 border-blue-500/50 scale-[1.02]' 
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.03] hover:border-white/20'
                  }
                  border-2 border-dashed p-8
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <div className={`
                    inline-flex p-4 rounded-xl mb-3 transition-all duration-300
                    ${isDragging 
                      ? 'bg-blue-500/20 scale-110' 
                      : 'bg-white/[0.05] group-hover:bg-white/[0.08] group-hover:scale-105'
                    }
                  `}>
                    <FiUpload className={`
                      w-8 h-8 transition-all duration-300
                      ${isDragging ? 'text-blue-400' : 'text-zinc-500 group-hover:text-white'}
                    `} />
                  </div>
                  <p className="text-base font-medium text-white mb-1">
                    Upload PDF containing your scale
                  </p>
                  <p className="text-sm text-zinc-500 mb-3">
                    Drag and drop or click to browse
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/[0.05] border-white/20 text-white hover:bg-white/[0.08] hover:border-white/30"
                  >
                    <FiFileText className="mr-2 w-4 h-4" />
                    Choose File
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StepPrimaryDV;