import { motion } from 'motion/react';
import { MailCheck, ArrowRight } from 'lucide-react';
import { CONFIRMATION_DATA } from '../data/questionnaire';

// URL fixe et directe du site OPS Supply
const OPS_SUPPLY_URL = 'https://www.ops-supply.com';

export function ConfirmationScreen() {
  const handleReturnToSite = () => {
    try {
      if (window.top) {
        window.top.location.href = OPS_SUPPLY_URL;
        return;
      }
    } catch {
      // In case of iframe security restriction
    }
    window.location.href = OPS_SUPPLY_URL;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="bg-white border border-[#ebdcd0] rounded-2xl p-5 sm:p-7 shadow-xs max-w-2xl mx-auto text-center sm:text-left">
        {/* Icon: discreet, refined */}
        <div className="w-10 h-10 rounded-xl bg-[#fbeee9] border border-[#f4ded6] text-[#d06a4c] flex items-center justify-center mb-4 mx-auto sm:mx-0 shadow-2xs">
          <MailCheck className="w-5 h-5" />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#132438] mb-3 tracking-tight">
          « {CONFIRMATION_DATA.title} »
        </h2>

        {/* Message */}
        <div className="space-y-3 text-xs sm:text-sm text-[#132438]/85 leading-relaxed bg-[#faf7f2] border border-[#ebdcd0] p-4 sm:p-5 rounded-xl mb-5">
          {CONFIRMATION_DATA.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
          <p className="font-serif font-semibold text-[#132438] pt-1 text-sm sm:text-base">
            {CONFIRMATION_DATA.signature}
          </p>
        </div>

        {/* Return Button */}
        <div className="text-center sm:text-left">
          <a
            href={OPS_SUPPLY_URL}
            target="_top"
            onClick={(e) => {
              e.preventDefault();
              handleReturnToSite();
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#132438] hover:bg-[#1e3550] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-2xs transition-all duration-150 cursor-pointer group no-underline"
          >
            <span>{CONFIRMATION_DATA.buttonText}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#d06a4c] group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
