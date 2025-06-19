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
      <div className="mb-12 text-center">
        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-none">
          Primary Dependent Variable
        </h2>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Main card container */}
        <div className="rounded-3xl backdrop-blur-md bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 overflow-hidden">
          <div className="bg-gradient-to-br from-zinc-900/50 to-transparent">
            {/* Header section */}
            <div className="px-8 pt-8 pb-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl">
                    <FiClipboard className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Scale Configuration</h3>
                  </div>
                </div>
                
                {/* Stats badges */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/10">
                    <span className="text-xs text-zinc-400">
                      <FiHash className="inline w-3 h-3 mr-1" />
                      {primaryDV.items.length} items
                    </span>
                  </div>
                  {primaryDV.randomizeItems && (
                    <div className="px-3 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-xl border border-blue-500/30">
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
            <div className="p-8 space-y-6">
              {/* Scale Name Input */}
              <div className={`
                relative rounded-2xl transition-all duration-500
                ${focusedField === 'name' 
                  ? 'bg-gradient-to-br from-blue-500/5 to-transparent shadow-xl' 
                  : 'bg-white/[0.02] hover:bg-white/[0.03]'
                }
                p-6 border ${focusedField === 'name' ? 'border-blue-500/30' : 'border-white/5'}
              `}>
                <Label className="text-lg font-medium text-white mb-3 block">
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
                    w-full px-6 py-4 text-lg
                    bg-white/[0.03] backdrop-blur-xl
                    border-2 rounded-xl transition-all duration-300
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
                relative rounded-2xl transition-all duration-500
                ${focusedField === 'items' 
                  ? 'bg-gradient-to-br from-blue-500/5 to-transparent shadow-xl' 
                  : 'bg-white/[0.02] hover:bg-white/[0.03]'
                }
                p-6 border ${focusedField === 'items' ? 'border-blue-500/30' : 'border-white/5'}
              `}>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-lg font-medium text-white">
                    Scale Items
                  </Label>
                  <button
                    onClick={() => updateSurveyData('primaryDV', { 
                      ...primaryDV, 
                      randomizeItems: !primaryDV.randomizeItems 
                    })}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                      ${primaryDV.randomizeItems
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-white/[0.05] text-zinc-400 border border-white/10 hover:bg-white/[0.08] hover:text-white'
                      }
                    `}
                  >
                    <FiShuffle className="inline w-4 h-4 mr-2" />
                    Randomize Order
                  </button>
                </div>
                
                <Textarea
                  value={primaryDV.items.join('\n')}
                  onChange={(e) => updateSurveyData('primaryDV', { 
                    ...primaryDV, 
                    items: e.target.value.split('\n').filter(item => item.trim()) 
                  })}
                  onFocus={() => setFocusedField('items')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter each item on a new line:&#10;&#10;1. I feel that I am a person of worth&#10;2. I feel that I have a number of good qualities&#10;3. All in all, I am inclined to think that I am a failure"
                  className={`
                    w-full min-h-[250px] px-6 py-4 text-lg
                    bg-white/[0.03] backdrop-blur-xl
                    border-2 rounded-xl transition-all duration-300
                    placeholder:text-zinc-600 text-white font-mono
                    ${focusedField === 'items'
                      ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
                      : 'border-white/10 hover:border-white/20'
                    }
                  `}
                />
                <p className="mt-3 text-sm text-zinc-500">
                  Paste your scale items above, one per line
                </p>
              </div>

              {/* Upload Section */}
              <div className="relative">
                <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="relative flex justify-center">
                  <span className="px-6 py-2 bg-zinc-900 text-zinc-500 text-sm">or</span>
                </div>
              </div>

              {/* File Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative rounded-2xl border-2 border-dashed transition-all duration-300
                  ${isDragging 
                    ? 'border-blue-500/50 bg-blue-500/5 scale-[1.02]' 
                    : 'border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.03]'
                  }
                  p-8 text-center cursor-pointer group
                `}
              >
                <div className="flex flex-col items-center">
                  <div className={`
                    p-4 rounded-full mb-4 transition-all duration-300
                    ${isDragging 
                      ? 'bg-blue-500/20 scale-110' 
                      : 'bg-white/[0.05] group-hover:bg-white/[0.08] group-hover:scale-105'
                    }
                  `}>
                    <FiUpload className={`
                      w-10 h-10 transition-all duration-300
                      ${isDragging ? 'text-blue-400' : 'text-zinc-500 group-hover:text-white'}
                    `} />
                  </div>
                  <p className="text-lg font-medium text-white mb-2">
                    Upload PDF containing your scale
                  </p>
                  <p className="text-zinc-500 mb-4">
                    Drag and drop or click to browse
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white/[0.05] border-white/20 text-white hover:bg-white/[0.08] hover:border-white/30"
                  >
                    <FiFileText className="mr-2" />
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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        /* Prevent horizontal overflow */
        * {
          max-width: 100%;
          overflow-wrap: break-word;
        }
        
        /* Custom scrollbar for textareas */
        textarea::-webkit-scrollbar {
          width: 4px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        
        textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default StepPrimaryDV;