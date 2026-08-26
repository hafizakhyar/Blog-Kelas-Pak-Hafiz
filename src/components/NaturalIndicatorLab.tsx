import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlaskConical, Sparkles, RefreshCw, Droplets, Info, Check, ArrowRight } from 'lucide-react';
import { NATURAL_INDICATORS, TEST_SOLUTIONS } from '../data/mockData';
import { NaturalIndicator, TestSolution } from '../types';

export const NaturalIndicatorLab: React.FC = () => {
  const [selectedIndicator, setSelectedIndicator] = useState<NaturalIndicator>(NATURAL_INDICATORS[0]);
  const [selectedSolution, setSelectedSolution] = useState<TestSolution | null>(null);
  const [isReacting, setIsReacting] = useState(false);

  const handleTestSolution = (sol: TestSolution) => {
    setIsReacting(true);
    setSelectedSolution(sol);
    setTimeout(() => {
      setIsReacting(false);
    }, 450);
  };

  const handleReset = () => {
    setSelectedSolution(null);
  };

  // Determine current beaker liquid color based on indicator + solution
  const getCurrentLiquidColor = () => {
    if (!selectedSolution) {
      return selectedIndicator.normalColorHex;
    }
    if (selectedSolution.type === 'acid') {
      return selectedIndicator.acidColorHex;
    }
    if (selectedSolution.type === 'base') {
      return selectedIndicator.baseColorHex;
    }
    return selectedIndicator.neutralColorHex;
  };

  const getLiquidName = () => {
    if (!selectedSolution) {
      return `${selectedIndicator.name} (Kondisi Awal)`;
    }
    if (selectedSolution.type === 'acid') {
      return `${selectedIndicator.name} + ${selectedSolution.name} → Warna ${selectedIndicator.acidColor}`;
    }
    if (selectedSolution.type === 'base') {
      return `${selectedIndicator.name} + ${selectedSolution.name} → Warna ${selectedIndicator.baseColor}`;
    }
    return `${selectedIndicator.name} + ${selectedSolution.name} → Warna ${selectedIndicator.neutralColor}`;
  };

  return (
    <section id="lab-maya" className="py-16 sm:py-20 bg-[#EBF5FF]/50 relative border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
            <span className="uppercase tracking-wider text-[11px] text-[#0284C7] font-bold">Simulasi Interaktif Kimia Dapur</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-light font-heading text-[#0F172A] tracking-tight">
            Laboratorium Maya <span className="font-semibold text-[#0284C7]">Indikator Alami</span>
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-3 leading-relaxed">
            Pilih ekstrak bahan dapur alami khas Nusantara, lalu teteskan larutan uji asam atau basa untuk melihat perubahan spektrum warnanya secara langsung!
          </p>
        </div>

        {/* Interactive Lab Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: Select Natural Indicator (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-[24px] p-6 shadow-xs border border-[#E2E8F0] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  1. Pilih Ekstrak Alami
                </h3>
                <span className="text-[11px] font-bold text-[#0284C7]">3 Bahan Organik</span>
              </div>

              <div className="space-y-3">
                {NATURAL_INDICATORS.map((ind) => {
                  const isSelected = selectedIndicator.id === ind.id;
                  return (
                    <button
                      key={ind.id}
                      onClick={() => {
                        setSelectedIndicator(ind);
                        setSelectedSolution(null);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-[#F4F8FC] border-[#0284C7] shadow-2xs'
                          : 'bg-white border-[#E2E8F0] hover:border-[#0284C7]/50 hover:bg-[#F4F8FC]'
                      }`}
                    >
                      {/* Color dot */}
                      <span
                        className="w-5 h-5 rounded-full shrink-0 mt-0.5 border border-black/10 shadow-2xs"
                        style={{ backgroundColor: ind.normalColorHex }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[#0F172A] truncate">
                            {ind.name}
                          </h4>
                          {isSelected && <Check className="w-4 h-4 text-[#0284C7]" />}
                        </div>
                        <p className="text-[11px] text-[#64748B] italic mt-0.5">
                          {ind.latinName}
                        </p>
                        <div className="text-[11px] text-[#334155] mt-1 font-medium line-clamp-1">
                          Pigmen: {ind.activeCompound}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Indicator Explainer Box */}
            <div className="mt-6 p-4 rounded-xl bg-[#F4F8FC] border border-[#E2E8F0] text-xs text-[#64748B]">
              <div className="font-semibold text-[#0F172A] mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#0284C7]" />
                Karakteristik Senyawa
              </div>
              <p className="text-[11px] leading-relaxed text-[#64748B]">
                {selectedIndicator.description}
              </p>
            </div>
          </div>

          {/* Center Column: Virtual Beaker Reaction (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-[24px] p-6 shadow-xs border border-[#E2E8F0] flex flex-col items-center justify-between text-center relative overflow-hidden">
            
            {/* Top Status */}
            <div className="w-full flex items-center justify-between mb-2 pb-2 border-b border-[#E2E8F0]">
              <span className="text-xs font-semibold text-[#64748B]">
                Gelas Kimia 100 mL
              </span>
              {selectedSolution && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs text-[#0284C7] hover:text-[#0369A1] font-medium transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Visual Beaker with Liquid */}
            <div className="relative my-6 w-48 h-56 flex items-center justify-center">
              
              {/* Glass Beaker Container */}
              <div className="w-40 h-52 border-4 border-[#CBD5E1] border-t-0 rounded-b-3xl relative overflow-hidden bg-[#F4F8FC] backdrop-blur-xs flex flex-col justify-end shadow-inner">
                
                {/* Measurement Ticks on Beaker */}
                <div className="absolute left-2 top-8 text-[9px] font-mono text-[#0284C7] space-y-5 select-none pointer-events-none">
                  <div>— 80 mL</div>
                  <div>— 60 mL</div>
                  <div>— 40 mL</div>
                  <div>— 20 mL</div>
                </div>

                {/* Animated Liquid Level */}
                <motion.div
                  key={`${selectedIndicator.id}-${selectedSolution?.id || 'none'}`}
                  initial={{ height: '55%', opacity: 0.8 }}
                  animate={{
                    height: selectedSolution ? '70%' : '55%',
                    backgroundColor: getCurrentLiquidColor(),
                    opacity: 1
                  }}
                  transition={{ duration: 0.5 }}
                  className="w-full rounded-b-2xl relative shadow-md"
                >
                  {/* Subtle liquid surface shine */}
                  <div className="absolute top-0 inset-x-0 h-2 bg-white/30 rounded-full blur-[1px]" />
                  
                  {/* Bubbles animation when reacting */}
                  {isReacting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: 3, duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-around"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-white/70 animate-bounce delay-75" />
                      <span className="w-1 h-1 rounded-full bg-white/70 animate-bounce delay-150" />
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Pipette Dropper Animation */}
              {isReacting && (
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  className="absolute top-2 left-1/2 -translate-x-1/2 text-slate-700 pointer-events-none"
                >
                  <Droplets className="w-6 h-6 text-[#0284C7] animate-pulse" />
                </motion.div>
              )}
            </div>

            {/* Reaction Title & Description */}
            <div className="w-full">
              <div className="text-xs font-bold text-[#0F172A] mb-1 leading-snug">
                {getLiquidName()}
              </div>
              <div className="text-[11px] text-[#64748B]">
                {selectedSolution
                  ? `pH Terukur: ~${selectedSolution.pH} (${selectedSolution.type === 'acid' ? 'Asam' : selectedSolution.type === 'base' ? 'Basa' : 'Netral'})`
                  : 'Pilih larutan uji di sebelah kanan untuk memulai reaksi.'}
              </div>
            </div>
          </div>

          {/* Right Column: Add Test Solution (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-[24px] p-6 shadow-xs border border-[#E2E8F0] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  2. Teteskan Larutan Uji
                </h3>
                <span className="text-[11px] font-bold text-[#0284C7]">5 Sampel</span>
              </div>

              <div className="space-y-2.5">
                {TEST_SOLUTIONS.map((sol) => {
                  const isSelected = selectedSolution?.id === sol.id;
                  const isAcid = sol.type === 'acid';
                  const isBase = sol.type === 'base';

                  return (
                    <button
                      key={sol.id}
                      onClick={() => handleTestSolution(sol)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                          : 'bg-white border-[#E2E8F0] hover:border-[#0284C7] hover:bg-[#F4F8FC] text-[#334155]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : isAcid
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isBase
                              ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          pH {sol.pH}
                        </span>
                        <div className="truncate">
                          <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#0F172A]'}`}>
                            {sol.name}
                          </div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-[#64748B]'}`}>
                            {sol.householdExample}
                          </div>
                        </div>
                      </div>
                      
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-md shrink-0 transition-colors ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#F4F8FC] text-[#64748B] group-hover:bg-[#0284C7] group-hover:text-white'
                      }`}>
                        Uji Tetes
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Summary Tip */}
            <div className="mt-5 pt-3 border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center justify-between">
              <span>Ingin LKPD praktikum lengkap?</span>
              <a
                href="#modul"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('modul');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                  try {
                    window.history.pushState(null, '', '#modul');
                  } catch {
                    window.location.hash = '#modul';
                  }
                }}
                className="font-bold text-[#0284C7] hover:text-[#0369A1] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Unduh LKPD</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
