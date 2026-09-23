import { useState } from 'react';
import { X, Copy, Check, Code, ExternalLink, Globe } from 'lucide-react';

interface EmbedHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmbedHelperModal({ isOpen, onClose }: EmbedHelperModalProps) {
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
  
  const iframeSnippet = `<iframe
  src="${currentUrl}"
  width="100%"
  height="780"
  style="border: none; border-radius: 16px; overflow: hidden;"
  title="OPS Supply - Où en est la partie chez vous ?"
  loading="lazy"
  allow="clipboard-write"
></iframe>`;

  const copyToClipboard = (text: string, isIframe: boolean) => {
    navigator.clipboard.writeText(text);
    if (isIframe) {
      setCopiedIframe(true);
      setTimeout(() => setCopiedIframe(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#132438]/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-[#e9e1d5] rounded-3xl p-6 sm:p-7 shadow-xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#746f68] hover:text-[#132438] hover:bg-[#faf7f2] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#fbeee9] text-[#d06a4c] flex items-center justify-center">
            <Code className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#132438]">
            Intégrer sur votre site (Google Sites)
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#746f68] leading-relaxed mb-5">
          Ce questionnaire fonctionne de façon 100% autonome, sans base de données requise, et s’adapte parfaitement aux téléphones et écrans d’ordinateurs.
        </p>

        {/* Option 1: Code Iframe pour Google Sites */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#132438] flex items-center gap-1.5">
              <span>Code iframe à insérer</span>
              <span className="text-[10px] font-normal text-[#746f68]">(Google Sites &gt; Intégrer &gt; Code)</span>
            </label>
            <button
              type="button"
              onClick={() => copyToClipboard(iframeSnippet, true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#d06a4c] hover:text-[#b85437]"
            >
              {copiedIframe ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#22543d]" />
                  <span className="text-[#22543d]">Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-[11px] font-mono bg-[#faf7f2] border border-[#e2d8cb] p-3 rounded-xl overflow-x-auto text-[#132438] leading-normal">
            {iframeSnippet}
          </pre>
        </div>

        {/* Option 2: Direct URL */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#132438] flex items-center gap-1.5">
              <span>Lien direct</span>
              <span className="text-[10px] font-normal text-[#746f68]">(Google Sites &gt; Intégrer &gt; Par URL)</span>
            </label>
            <button
              type="button"
              onClick={() => copyToClipboard(currentUrl, false)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#d06a4c] hover:text-[#b85437]"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#22543d]" />
                  <span className="text-[#22543d]">Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier l’URL</span>
                </>
              )}
            </button>
          </div>
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="w-full text-xs font-mono bg-[#faf7f2] border border-[#e2d8cb] px-3 py-2 rounded-xl text-[#132438]"
          />
        </div>

        {/* Instructions */}
        <div className="p-3 rounded-xl bg-[#faf7f2] border border-[#e9e1d5] text-[11px] text-[#746f68] space-y-1">
          <p className="font-semibold text-[#132438]">Étapes rapides sur Google Sites :</p>
          <ol className="list-decimal pl-4 space-y-0.5">
            <li>Sur votre page Google Sites, cliquez sur « Intégrer » dans le panneau droit.</li>
            <li>Choisissez « Code d'intégration » et collez le code ci-dessus (ou « À partir du Web » avec l'URL).</li>
            <li>Ajustez la largeur du bloc pour l'aligner avec le reste de votre page.</li>
          </ol>
        </div>

        <div className="mt-5 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#132438] text-white text-xs font-semibold rounded-xl hover:bg-[#1e3550] transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
