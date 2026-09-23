import { motion } from 'motion/react';
import { Play, Clock, UserCheck } from 'lucide-react';
import { APP_CONFIG } from '../config';
import { VISUAL_ASSETS } from '../assets/visuals';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
    >
      <div className="bg-white border border-[#ebdcd0] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fbeee9] border border-[#f4ded6] text-[#b85437] text-xs font-semibold mb-2.5">
            <Clock className="w-3.5 h-3.5 text-[#d06a4c]" />
            <span>5 minutes chrono • Pour dirigeants de TPE et PME</span>
          </div>

          {/* Title and subtitle - solely displayed here */}
          <h1 className="text-xl sm:text-2xl lg:text-[25px] font-serif font-bold text-[#132438] leading-snug tracking-tight mb-1">
            « {APP_CONFIG.appTitle.replace(/«|»/g, '').trim()} »
          </h1>

          <p className="text-xs sm:text-sm font-medium text-[#d06a4c] mb-3">
            {APP_CONFIG.appSubtitle}
          </p>

          {/* Compact explanatory block */}
          <div className="text-xs sm:text-[13px] text-[#132438]/85 leading-relaxed space-y-1 mb-4">
            <p>
              Répondez simplement à partir de votre quotidien. Il n’y a pas de bonne ou de mauvaise réponse.
            </p>
            <p>
              À la fin, vos réponses me seront transmises. Je les regarderai personnellement avant de vous faire un retour par email.
            </p>
          </div>

          {/* 4 Pillars: transparent illustrations directly rendered, slightly larger, no box containers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 mb-5 pt-3 border-t border-[#f2eae1]">
            <div className="flex items-center gap-3">
              <img
                src={VISUAL_ASSETS.pionBleu}
                alt="Pion bleu"
                referrerPolicy="no-referrer"
                className="w-9 sm:w-10 h-9 sm:h-10 object-contain shrink-0"
              />
              <span className="text-xs sm:text-sm font-medium text-[#132438]">
                1. Le dirigeant au centre du jeu
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={VISUAL_ASSETS.crayon}
                alt="Crayon - Les règles du jeu"
                referrerPolicy="no-referrer"
                className="w-9 sm:w-10 h-9 sm:h-10 object-contain shrink-0"
              />
              <span className="text-xs sm:text-sm font-medium text-[#132438]">
                2. Les règles du jeu
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={VISUAL_ASSETS.sablier}
                alt="Sablier"
                referrerPolicy="no-referrer"
                className="w-9 sm:w-10 h-9 sm:h-10 object-contain shrink-0"
              />
              <span className="text-xs sm:text-sm font-medium text-[#132438]">
                3. Les sujets en cours
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={VISUAL_ASSETS.carton}
                alt="Carton de livraison"
                referrerPolicy="no-referrer"
                className="w-9 sm:w-10 h-9 sm:h-10 object-contain shrink-0"
              />
              <span className="text-xs sm:text-sm font-medium text-[#132438]">
                4. Côté supply (si applicable)
              </span>
            </div>
          </div>

          {/* CTA & reassurance */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#132438] hover:bg-[#1e3550] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-2xs transition-all duration-150 cursor-pointer group"
            >
              <span>Commencer la partie</span>
              <Play className="w-3.5 h-3.5 fill-current text-[#d06a4c] group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-[#746f68] px-1">
              <UserCheck className="w-3.5 h-3.5 text-[#22543d]" />
              <span>Lecture humaine et retour direct par Pauline</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
