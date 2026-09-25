import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, Loader2, Shield, Lock, AlertCircle } from 'lucide-react';
import { ContactInfo } from '../types';
import {
  OPEN_QUESTION,
  TRANSPARENCY_TEXT,
  CONFIDENTIALITY_NOTICE,
  SUBMIT_BUTTON_TEXT,
} from '../data/questionnaire';

interface OpenQuestionAndContactStepProps {
  openAnswer: string;
  onOpenAnswerChange: (val: string) => void;
  contact: ContactInfo;
  onContactChange: (field: keyof ContactInfo, val: string) => void;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

export function OpenQuestionAndContactStep({
  openAnswer,
  onOpenAnswerChange,
  contact,
  onContactChange,
  onSubmit,
  onPrev,
  isSubmitting,
  submitError,
}: OpenQuestionAndContactStepProps) {
  const [formErrors, setFormErrors] = useState<{
    firstName?: string;
    lastName?: string;
    company?: string;
    email?: string;
  }>({});

  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleValidateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof formErrors = {};

    if (!contact.firstName.trim()) {
      errors.firstName = 'Veuillez renseigner votre prénom.';
    }
    if (!contact.lastName.trim()) {
      errors.lastName = 'Veuillez renseigner votre nom.';
    }
    if (!contact.company.trim()) {
      errors.company = 'Veuillez renseigner le nom de votre entreprise.';
    }
    if (!contact.email.trim()) {
      errors.email = 'Veuillez renseigner votre adresse email.';
    } else if (!isValidEmail(contact.email)) {
      errors.email = 'Veuillez renseigner une adresse email valide.';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      onSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <form onSubmit={handleValidateAndSubmit}>
        <div className="bg-white border border-[#ebdcd0] rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
          {/* Section 1: Question ouverte */}
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#d06a4c] mb-1">
              <span>Dernière étape</span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#132438] mb-1.5">
              « {OPEN_QUESTION.title} »
            </h2>
            <p className="text-xs text-[#746f68] leading-relaxed mb-3">
              {OPEN_QUESTION.helpText}
            </p>

            <textarea
              rows={3}
              value={openAnswer}
              onChange={(e) => onOpenAnswerChange(e.target.value)}
              placeholder={OPEN_QUESTION.placeholder}
              className="w-full text-xs sm:text-sm p-3 rounded-xl bg-[#faf7f2] border border-[#e4dacf] text-[#132438] placeholder:text-[#a8a199] focus:outline-none focus:ring-2 focus:ring-[#d06a4c]/30 focus:border-[#d06a4c] transition-all resize-y"
            />
          </div>

          <hr className="border-[#f2eae1]" />

          {/* Section 2: Coordonnées */}
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#132438] mb-1">
              Vos coordonnées
            </h3>
            <p className="text-xs text-[#746f68] mb-3.5">
              Ces informations me permettront de vous adresser mon retour personnel par email.
            </p>

            {/* Honeypot field (hidden from real users, catches bots) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_pot"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {/* Prénom */}
              <div>
                <label className="block text-xs font-semibold text-[#132438] mb-1">
                  Prénom <span className="text-[#d06a4c]">*</span>
                </label>
                <input
                  type="text"
                  value={contact.firstName}
                  onChange={(e) => onContactChange('firstName', e.target.value)}
                  placeholder="Jean"
                  required
                  className={`w-full text-xs sm:text-sm p-2.5 rounded-lg bg-[#faf7f2] border transition-all ${
                    formErrors.firstName
                      ? 'border-[#c65d3b] focus:ring-2 focus:ring-[#c65d3b]/30'
                      : 'border-[#e4dacf] focus:border-[#d06a4c] focus:ring-2 focus:ring-[#d06a4c]/30'
                  }`}
                />
                {formErrors.firstName && (
                  <p className="text-[11px] text-[#c65d3b] mt-0.5">
                    {formErrors.firstName}
                  </p>
                )}
              </div>

              {/* Nom */}
              <div>
                <label className="block text-xs font-semibold text-[#132438] mb-1">
                  Nom <span className="text-[#d06a4c]">*</span>
                </label>
                <input
                  type="text"
                  value={contact.lastName}
                  onChange={(e) => onContactChange('lastName', e.target.value)}
                  placeholder="Dupont"
                  required
                  className={`w-full text-xs sm:text-sm p-2.5 rounded-lg bg-[#faf7f2] border transition-all ${
                    formErrors.lastName
                      ? 'border-[#c65d3b] focus:ring-2 focus:ring-[#c65d3b]/30'
                      : 'border-[#e4dacf] focus:border-[#d06a4c] focus:ring-2 focus:ring-[#d06a4c]/30'
                  }`}
                />
                {formErrors.lastName && (
                  <p className="text-[11px] text-[#c65d3b] mt-0.5">
                    {formErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {/* Entreprise */}
              <div>
                <label className="block text-xs font-semibold text-[#132438] mb-1">
                  Entreprise <span className="text-[#d06a4c]">*</span>
                </label>
                <input
                  type="text"
                  value={contact.company}
                  onChange={(e) => onContactChange('company', e.target.value)}
                  placeholder="Domaine / Entreprise"
                  required
                  className={`w-full text-xs sm:text-sm p-2.5 rounded-lg bg-[#faf7f2] border transition-all ${
                    formErrors.company
                      ? 'border-[#c65d3b] focus:ring-2 focus:ring-[#c65d3b]/30'
                      : 'border-[#e4dacf] focus:border-[#d06a4c] focus:ring-2 focus:ring-[#d06a4c]/30'
                  }`}
                />
                {formErrors.company && (
                  <p className="text-[11px] text-[#c65d3b] mt-0.5">
                    {formErrors.company}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#132438] mb-1">
                  Adresse email <span className="text-[#d06a4c]">*</span>
                </label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => onContactChange('email', e.target.value)}
                  placeholder="contact@exemple.fr"
                  required
                  className={`w-full text-xs sm:text-sm p-2.5 rounded-lg bg-[#faf7f2] border transition-all ${
                    formErrors.email
                      ? 'border-[#c65d3b] focus:ring-2 focus:ring-[#c65d3b]/30'
                      : 'border-[#e4dacf] focus:border-[#d06a4c] focus:ring-2 focus:ring-[#d06a4c]/30'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-[11px] text-[#c65d3b] mt-0.5">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Téléphone (facultatif) */}
            <div className="max-w-sm">
              <label className="block text-xs font-semibold text-[#132438] mb-1">
                Téléphone <span className="text-[#746f68] font-normal">(Facultatif)</span>
              </label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => onContactChange('phone', e.target.value)}
                placeholder="06 12 34 56 78"
                className="w-full text-xs sm:text-sm p-2.5 rounded-lg bg-[#faf7f2] border border-[#e4dacf] focus:border-[#d06a4c] focus:ring-2 focus:ring-[#d06a4c]/30 transition-all"
              />
            </div>
          </div>

          {/* Section 3: Transparence avant envoi & Confidentialité */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#faf7f2] border border-[#ebdcd0] space-y-1.5 text-xs text-[#746f68] leading-relaxed">
            <div className="flex items-start gap-2 text-[#132438] font-medium">
              <Shield className="w-3.5 h-3.5 text-[#d06a4c] shrink-0 mt-0.5" />
              <p>{TRANSPARENCY_TEXT}</p>
            </div>
            <div className="flex items-start gap-2 text-[11px] text-[#746f68]">
              <Lock className="w-3 h-3 text-[#746f68] shrink-0 mt-0.5" />
              <p>{CONFIDENTIALITY_NOTICE}</p>
            </div>
          </div>

          {/* Submission Error Banner */}
          {submitError && (
            <div className="p-3 rounded-lg bg-[#fbeee9] border border-[#f4ded6] text-[#b85437] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{submitError}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#f2eae1]">
            <button
              type="button"
              onClick={onPrev}
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-[#132438] bg-[#f4eee5] hover:bg-[#e9e1d5] rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modifier mes réponses</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-lg shadow-2xs transition-all ${
                isSubmitting
                  ? 'bg-[#d06a4c]/80 text-white cursor-wait'
                  : 'bg-[#d06a4c] hover:bg-[#b85437] text-white cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Envoi en cours à Pauline...</span>
                </>
              ) : (
                <>
                  <span>{SUBMIT_BUTTON_TEXT}</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
