import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QuestionnairePart, RatingValue, AnswersState } from '../types';
import { RATING_OPTIONS } from '../data/questionnaire';
import { VISUAL_ASSETS } from '../assets/visuals';

interface PartCardViewProps {
  part: QuestionnairePart;
  answers: AnswersState;
  onAnswerChange: (questionId: number, value: RatingValue) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstPart: boolean;
}

export function PartCardView({
  part,
  answers,
  onAnswerChange,
  onNext,
  onPrev,
  isFirstPart,
}: PartCardViewProps) {
  // Map parts directly to the provided image assets
  const getPartImage = (partNumber: number) => {
    switch (partNumber) {
      case 1:
        return { src: VISUAL_ASSETS.pionBleu, alt: 'Pion bleu - Le dirigeant au centre du jeu' };
      case 2:
        return { src: VISUAL_ASSETS.crayon, alt: 'Crayon - Les règles du jeu' };
      case 3:
        return { src: VISUAL_ASSETS.sablier, alt: 'Sablier - Les sujets en cours' };
      case 4:
        return { src: VISUAL_ASSETS.carton, alt: 'Carton - Côté supply' };
      default:
        return { src: VISUAL_ASSETS.pionBleu, alt: 'Partie du questionnaire' };
    }
  };

  const answeredCount = part.questions.filter((q) => answers[q.id] !== undefined).length;
  const isPartComplete = answeredCount === part.questions.length;
  const partVisual = getPartImage(part.partNumber);

  return (
    <motion.div
      key={part.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <div className="bg-white border border-[#ebdcd0] rounded-2xl p-4 sm:p-6 shadow-xs">
        {/* Header of Part: clean illustration directly displayed on transparent background without container */}
        <div className="flex items-center justify-between border-b border-[#f2eae1] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={partVisual.src}
              alt={partVisual.alt}
              referrerPolicy="no-referrer"
              className="w-8 sm:w-9 h-8 sm:h-9 object-contain shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#d06a4c]">
                  Partie {part.partNumber}
                </span>
                <span className="text-[#a8a199] text-xs">•</span>
                <span className="text-xs text-[#746f68]">
                  {answeredCount} / 4 répondue{answeredCount > 1 ? 's' : ''}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#132438] leading-snug">
                {part.title}
              </h2>
              {part.introText && (
                <p className="text-xs text-[#746f68] mt-0.5 leading-snug">
                  {part.introText}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* The 4 questions: comfortable reading, compact cards */}
        <div className="space-y-3 sm:space-y-3.5">
          {part.questions.map((question) => {
            const currentVal = answers[question.id];
            const isAnswered = currentVal !== undefined;

            return (
              <div
                key={question.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-150 ${
                  isAnswered
                    ? 'bg-[#faf7f2]/70 border-[#ded3c2]'
                    : 'bg-white border-[#ecdcd0]'
                }`}
              >
                {/* Question title & subtle number badge */}
                <div className="flex items-start gap-2.5 mb-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#fbeee9] border border-[#f4ded6] text-[#b85437] text-xs font-bold shrink-0 mt-0.5">
                    {question.number}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-semibold text-[#132438] leading-snug">
                      « {question.text.replace(/«|»/g, '').trim()} »
                    </p>
                    {/* Explanatory subtext in smaller font */}
                    <p className="text-xs text-[#746f68] mt-0.5 leading-relaxed">
                      {question.helpText}
                    </p>
                  </div>
                </div>

                {/* 4 Answer buttons: same height, clean selection state, no numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {RATING_OPTIONS.map((opt) => {
                    const isSelected = currentVal === opt.value;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onAnswerChange(question.id, opt.value)}
                        className={`flex items-center justify-center px-2 py-2 sm:py-2.5 h-10 rounded-lg border text-center transition-all duration-150 cursor-pointer select-none text-xs sm:text-sm ${
                          isSelected
                            ? 'bg-[#132438] border-[#132438] text-white font-semibold shadow-2xs ring-2 ring-[#d06a4c]/40'
                            : 'bg-white hover:bg-[#faf7f2] border-[#e4dacf] hover:border-[#d06a4c]/50 text-[#132438] font-normal'
                        }`}
                      >
                        <span className="truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons: compact, harmonious */}
        <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-[#f2eae1]">
          {!isFirstPart ? (
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#132438] bg-[#f4eee5] hover:bg-[#e9e1d5] rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onNext}
            disabled={!isPartComplete}
            className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg shadow-2xs transition-all cursor-pointer ${
              isPartComplete
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
