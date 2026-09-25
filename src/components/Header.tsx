import { RotateCcw, Share2 } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenEmbedModal?: () => void;
  showEmbedButton?: boolean;
  hasStarted: boolean;
}

export function Header({
  onReset,
  onOpenEmbedModal,
  showEmbedButton = false,
  hasStarted,
}: HeaderProps) {
  return (
    <header className="w-full mb-3 sm:mb-4 border-b border-[#ebdcd0] pb-2.5 sm:pb-3">
      <div className="flex items-center justify-between gap-3">
        {/* Brand identity: Pure typographic brand "OPS SUPPLY" + "Questionnaire" badge */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <span className="text-sm sm:text-base font-bold tracking-[0.16em] text-[#132438] uppercase select-none shrink-0 font-sans">
            OPS SUPPLY
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-[#925543] bg-[#fbf0ec] border border-[#f2ded6] px-2 py-0.5 rounded-full shrink-0 select-none leading-none">
            Questionnaire
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {hasStarted && (
            <button
              type="button"
              onClick={onReset}
              title="Recommencer depuis le début"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#746f68] hover:text-[#132438] bg-[#f4eee5] hover:bg-[#ebdcd0] rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Recommencer</span>
            </button>
          )}

          {showEmbedButton && onOpenEmbedModal && (
            <button
              type="button"
              onClick={onOpenEmbedModal}
              title="Intégrer sur votre site"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#132438] bg-white border border-[#ebdcd0] hover:border-[#d06a4c] rounded-md shadow-2xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3 h-3 text-[#d06a4c]" />
              <span className="hidden sm:inline">Intégrer</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
