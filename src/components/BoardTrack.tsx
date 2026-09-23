import { motion } from 'motion/react';

interface BoardTrackProps {
  currentStep: number;
  showSupplyPart?: boolean;
  onSelectStep?: (step: number) => void;
  completedSteps?: number[];
}

const STEP_INFO: Record<number, { stepNumber: number; name: string }> = {
  1: { stepNumber: 1, name: 'Le dirigeant au centre du jeu' },
  2: { stepNumber: 2, name: 'Les règles du jeu' },
  3: { stepNumber: 3, name: 'Les sujets en cours' },
  4: { stepNumber: 4, name: 'Filtre Supply' },
  5: { stepNumber: 5, name: 'Côté supply' },
  6: { stepNumber: 6, name: 'Coordonnées' },
};

export function BoardTrack({ currentStep }: BoardTrackProps) {
  if (currentStep === 0 || currentStep === 7) {
    return null;
  }

  const info = STEP_INFO[currentStep] || {
    stepNumber: currentStep,
    name: 'Étape en cours',
  };

  const stepNumber = info.stepNumber;
  const progressPercent = Math.min(100, Math.round((stepNumber / 6) * 100));

  return (
    <div className="w-full bg-[#f4eee5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 mb-3 shadow-2xs">
      <div className="flex items-center justify-between text-xs font-medium mb-1.5">
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold text-[#d06a4c] shrink-0">
            Étape {stepNumber} sur 6
          </span>
          <span className="text-[#a8a199]">•</span>
          <span className="font-semibold text-[#132438] truncate">
            {info.name}
          </span>
        </div>
        <span className="text-xs font-semibold text-[#746f68] shrink-0 ml-2">
          {progressPercent}%
        </span>
      </div>

      <div className="relative w-full h-1.5 bg-[#e8ded1] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#d06a4c] to-[#b85437] rounded-full"
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
