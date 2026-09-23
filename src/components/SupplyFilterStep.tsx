import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { SUPPLY_FILTER_QUESTION } from '../data/questionnaire';
import { VISUAL_ASSETS } from '../assets/visuals';

interface SupplyFilterStepProps {
  value: 'yes' | 'no' | null;
  onChange: (val: 'yes' | 'no') => void;
  onNext: () => void;
  onPrev: () => void;
}

export function SupplyFilterStep({
  value,
  onChange,
  onNext,
  onPrev,
}: SupplyFilterStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <div className="bg-white border border-[#ebdcd0] rounded-2xl p-4 sm:p-6 shadow-xs">
        {/* Header with carton icon directly on transparent background */}
        <div className="flex items-center gap-3 border-b border-[#f2eae1] pb-3 mb-4">
          <img
            src={VISUAL_ASSETS.carton}
            alt="Carton flux physique"
            referrerPolicy="no-referrer"
            className="w-8 sm:w-9 h-8 sm:h-9 object-contain shrink-0"
          />
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#d06a4c]">
              Étape intermédiaire
            </span>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#132438] leading-snug">
              Votre activité et les produits physiques
            </h2>
          </div>
        </div>

        {/* Question */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#faf7f2] border border-[#ebdcd0] mb-4">
          <p className="text-sm sm:text-base font-serif font-bold text-[#132438] mb-1.5 leading-snug">
            « {SUPPLY_FILTER_QUESTION.text} »
          </p>
          <p className="text-xs text-[#746f68] leading-relaxed">
            {SUPPLY_FILTER_QUESTION.helpText}
          </p>
        </div>

        {/* 2 Choice Buttons: Oui / Non with compact, elegant layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={() => onChange('yes')}
            className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer text-left ${
              value === 'yes'
                ? 'bg-[#132438] border-[#132438] text-white shadow-2xs ring-2 ring-[#d06a4c]/40'
                : 'bg-white hover:bg-[#faf7f2] border-[#e4dacf] hover:border-[#d06a4c]/50 text-[#132438]'
            }`}
          >
            <div>
              <span className="block text-base font-bold">Oui</span>
              <span
                className={`text-xs block mt-0.5 ${
                  value === 'yes' ? 'text-[#fbeee9]' : 'text-[#746f68]'
                }`}
              >
                Nous gérons des stocks, commandes ou flux physiques
              </span>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 ml-3 ${
                value === 'yes'
                  ? 'bg-[#d06a4c] border-[#d06a4c] text-white'
                  : 'border-[#d0c5b5] bg-white'
              }`}
            >
              {value === 'yes' && <Check className="w-3.5 h-3.5" />}
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange('no')}
            className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer text-left ${
              value === 'no'
                ? 'bg-[#132438] border-[#132438] text-white shadow-2xs ring-2 ring-[#d06a4c]/40'
                : 'bg-white hover:bg-[#faf7f2] border-[#e4dacf] hover:border-[#d06a4c]/50 text-[#132438]'
            }`}
          >
            <div>
              <span className="block text-base font-bold">Non</span>
              <span
                className={`text-xs block mt-0.5 ${
                  value === 'no' ? 'text-[#fbeee9]' : 'text-[#746f68]'
                }`}
              >
                Activité 100% services, conseil ou digital
              </span>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 ml-3 ${
                value === 'no'
                  ? 'bg-[#d06a4c] border-[#d06a4c] text-white'
                  : 'border-[#d0c5b5] bg-white'
              }`}
            >
              {value === 'no' && <Check className="w-3.5 h-3.5" />}
            </div>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#f2eae1]">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#132438] bg-[#f4eee5] hover:bg-[#e9e1d5] rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!value}
            className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg shadow-2xs transition-all cursor-pointer ${
              value
                ? 'bg-[#d06a4c] hover:bg-[#b85437] text-white'
                : 'bg-[#e9e1d5] text-[#746f68] cursor-not-allowed opacity-60'
            }`}
          >
            <span>Suivant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
