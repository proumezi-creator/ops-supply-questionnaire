/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { BoardTrack } from './components/BoardTrack';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PartCardView } from './components/PartCardView';
import { SupplyFilterStep } from './components/SupplyFilterStep';
import { OpenQuestionAndContactStep } from './components/OpenQuestionAndContactStep';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { EmbedHelperModal } from './components/EmbedHelperModal';
import { QUESTIONNAIRE_PARTS, getRatingLabel } from './data/questionnaire';
import { GOOGLE_SCRIPT_WEBAPP_URL } from './config';
import { sendGmailNotification } from './services/gmail';
import {
  AnswersState,
  RatingValue,
  ContactInfo,
  QuestionnaireSubmissionPayload,
} from './types';

export default function App() {
  // Step 0 = Welcome
  // Step 1 = Part 1 (Dirigeant)
  // Step 2 = Part 2 (Règles)
  // Step 3 = Part 3 (Sujets)
  // Step 4 = Filter Supply (Oui / Non)
  // Step 5 = Part 4 (Supply) [if filter = Yes]
  // Step 6 = Open Question & Contact
  // Step 7 = Confirmation
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Completed steps tracking
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Answers state
  const [answers, setAnswers] = useState<AnswersState>(() => {
    try {
      const saved = sessionStorage.getItem('ops_answers_v2');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Supply filter: 'yes' | 'no' | null
  const [supplyFilter, setSupplyFilter] = useState<'yes' | 'no' | null>(() => {
    try {
      return (sessionStorage.getItem('ops_supply_filter') as 'yes' | 'no') || null;
    } catch {
      return null;
    }
  });

  // Open question answer
  const [openAnswer, setOpenAnswer] = useState<string>(() => {
    try {
      return sessionStorage.getItem('ops_open_answer_v2') || '';
    } catch {
      return '';
    }
  });

  // Contact info
  const [contact, setContact] = useState<ContactInfo>(() => {
    try {
      const saved = sessionStorage.getItem('ops_contact_v2');
      return saved
        ? JSON.parse(saved)
        : {
            firstName: '',
            lastName: '',
            company: '',
            email: '',
            phone: '',
          };
    } catch {
      return {
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        phone: '',
      };
    }
  });

  // UI modals & submission state
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [showEmbedHelper, setShowEmbedHelper] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const topAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.has('embed_tools') || params.has('admin') || params.has('edit')) {
          setShowEmbedHelper(true);
        }
      }
    } catch {}
  }, []);

  // Sync state to sessionStorage so user never loses answers
  useEffect(() => {
    try {
      sessionStorage.setItem('ops_answers_v2', JSON.stringify(answers));
    } catch {}
  }, [answers]);

  useEffect(() => {
    try {
      if (supplyFilter) {
        sessionStorage.setItem('ops_supply_filter', supplyFilter);
      }
    } catch {}
  }, [supplyFilter]);

  useEffect(() => {
    try {
      sessionStorage.setItem('ops_open_answer_v2', openAnswer);
    } catch {}
  }, [openAnswer]);

  useEffect(() => {
    try {
      sessionStorage.setItem('ops_contact_v2', JSON.stringify(contact));
    } catch {}
  }, [contact]);

  // Smooth scroll to top function
  const scrollToTop = () => {
    // Window scroll for mobile / iframe robustness
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (topAnchorRef.current) {
      topAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const markStepCompleted = (stepNum: number) => {
    setCompletedSteps((prev) => (prev.includes(stepNum) ? prev : [...prev, stepNum]));
  };

  // Answer change handler
  const handleAnswerChange = (questionId: number, value: RatingValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleContactChange = (field: keyof ContactInfo, val: string) => {
    setContact((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  // Navigation handlers
  const handleStart = () => {
    setCurrentStep(1);
    scrollToTop();
  };

  const handleNextFromPart1 = () => {
    markStepCompleted(1);
    setCurrentStep(2);
    scrollToTop();
  };

  const handleNextFromPart2 = () => {
    markStepCompleted(2);
    setCurrentStep(3);
    scrollToTop();
  };

  const handleNextFromPart3 = () => {
    markStepCompleted(3);
    setCurrentStep(4); // Filter question
    scrollToTop();
  };

  const handleNextFromFilter = () => {
    markStepCompleted(4);
    if (supplyFilter === 'yes') {
      setCurrentStep(5); // Go to Supply part
    } else {
      setCurrentStep(6); // Skip Supply, go straight to Open question & Contact
    }
    scrollToTop();
  };

  const handleNextFromPart4 = () => {
    markStepCompleted(5);
    setCurrentStep(6); // Open question & Contact
    scrollToTop();
  };

  const handlePrevStep = () => {
    if (currentStep === 1) {
      setCurrentStep(0);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 4) {
      setCurrentStep(3);
    } else if (currentStep === 5) {
      setCurrentStep(4);
    } else if (currentStep === 6) {
      // If supplyFilter was 'no', jump back to filter (4), else to supply (5)
      if (supplyFilter === 'yes') {
        setCurrentStep(5);
      } else {
        setCurrentStep(4);
      }
    }
    scrollToTop();
  };

  const handleSelectTrackStep = (stepId: number) => {
    setCurrentStep(stepId);
    scrollToTop();
  };

  const handleReset = () => {
    if (
      Object.keys(answers).length > 0 &&
      !window.confirm('Voulez-vous recommencer le questionnaire à zéro ? Vos réponses actuelles seront effacées.')
    ) {
      return;
    }
    setAnswers({});
    setSupplyFilter(null);
    setOpenAnswer('');
    setContact({
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phone: '',
    });
    setCompletedSteps([]);
    try {
      sessionStorage.removeItem('ops_answers_v2');
      sessionStorage.removeItem('ops_supply_filter');
      sessionStorage.removeItem('ops_open_answer_v2');
      sessionStorage.removeItem('ops_contact_v2');
    } catch {}
    setCurrentStep(0);
    scrollToTop();
  };

  // Internal calculations for Pauline & Google Sheets
  const calculateInternalScores = (): QuestionnaireSubmissionPayload => {
    // Score Part 1: Dirigeant
    const scoreDirigeant = [1, 2, 3, 4].reduce(
      (sum, qId) => sum + (answers[qId] !== undefined ? answers[qId] : 0),
      0
    );

    // Score Part 2: Règles
    const scoreRegles = [5, 6, 7, 8].reduce(
      (sum, qId) => sum + (answers[qId] !== undefined ? answers[qId] : 0),
      0
    );

    // Score Part 3: Sujets
    const scoreSujets = [9, 10, 11, 12].reduce(
      (sum, qId) => sum + (answers[qId] !== undefined ? answers[qId] : 0),
      0
    );

    // Score Part 4: Supply (or Non concerné)
    let scoreSupplyStr = 'Non concerné';
    let numericScoreSupply = 0;
    let scoreMaxApplicable = 36;

    if (supplyFilter === 'yes') {
      numericScoreSupply = [13, 14, 15, 16].reduce(
        (sum, qId) => sum + (answers[qId] !== undefined ? answers[qId] : 0),
        0
      );
      scoreSupplyStr = String(numericScoreSupply);
      scoreMaxApplicable = 48;
    }

    const scoreTotal =
      scoreDirigeant +
      scoreRegles +
      scoreSujets +
      (supplyFilter === 'yes' ? numericScoreSupply : 0);

    // Identify dominant category
    const candidates = [
      { name: 'Le dirigeant au centre du jeu', score: scoreDirigeant },
      { name: 'Les règles du jeu', score: scoreRegles },
      { name: 'Les sujets en jeu', score: scoreSujets },
    ];
    if (supplyFilter === 'yes') {
      candidates.push({ name: 'Côté supply', score: numericScoreSupply });
    }

    // Sort descending
    candidates.sort((a, b) => b.score - a.score);
    const dominantCategory = candidates[0].name;

    const q1Text = getRatingLabel(answers[1]);
    const q2Text = getRatingLabel(answers[2]);
    const q3Text = getRatingLabel(answers[3]);
    const q4Text = getRatingLabel(answers[4]);
    const q5Text = getRatingLabel(answers[5]);
    const q6Text = getRatingLabel(answers[6]);
    const q7Text = getRatingLabel(answers[7]);
    const q8Text = getRatingLabel(answers[8]);
    const q9Text = getRatingLabel(answers[9]);
    const q10Text = getRatingLabel(answers[10]);
    const q11Text = getRatingLabel(answers[11]);
    const q12Text = getRatingLabel(answers[12]);
    const q13Text = supplyFilter === 'yes' ? getRatingLabel(answers[13]) : 'Non concerné';
    const q14Text = supplyFilter === 'yes' ? getRatingLabel(answers[14]) : 'Non concerné';
    const q15Text = supplyFilter === 'yes' ? getRatingLabel(answers[15]) : 'Non concerné';
    const q16Text = supplyFilter === 'yes' ? getRatingLabel(answers[16]) : 'Non concerné';

    return {
      timestamp: new Date().toISOString(),
      // Coordonnées
      firstName: contact.firstName.trim(),
      lastName: contact.lastName.trim(),
      company: contact.company.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim(),
      supplyFilterAnswer: supplyFilter === 'yes' ? 'Oui' : 'Non',

      // Les 16 réponses textuelles
      q1Text,
      q2Text,
      q3Text,
      q4Text,
      scoreDirigeant,
      q5Text,
      q6Text,
      q7Text,
      q8Text,
      scoreRegles,
      q9Text,
      q10Text,
      q11Text,
      q12Text,
      scoreSujets,
      q13Text,
      q14Text,
      q15Text,
      q16Text,

      // Scores
      scoreSupply: scoreSupplyStr,
      scoreTotal,
      scoreMaxApplicable,
      dominantCategory,

      // Question ouverte
      openAnswer: openAnswer.trim(),
      status: 'À traiter',

      // Objets structurés additionnels pour compatibilité totale avec tout script Apps Script
      answers: {
        q1: q1Text,
        q2: q2Text,
        q3: q3Text,
        q4: q4Text,
        q5: q5Text,
        q6: q6Text,
        q7: q7Text,
        q8: q8Text,
        q9: q9Text,
        q10: q10Text,
        q11: q11Text,
        q12: q12Text,
        q13: q13Text,
        q14: q14Text,
        q15: q15Text,
        q16: q16Text,
      },
      scores: {
        dirigeant: scoreDirigeant,
        regles: scoreRegles,
        sujets: scoreSujets,
        supply: scoreSupplyStr,
        total: scoreTotal,
        maxApplicable: scoreMaxApplicable,
      },
    };
  };

  // Submit questionnaire to Pauline via Google Apps Script Webhook (HTTP POST)
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const targetUrl = GOOGLE_SCRIPT_WEBAPP_URL.trim();

    if (!targetUrl) {
      setIsSubmitting(false);
      setSubmitError(
        "Une erreur de configuration temporaire empêche l'envoi du questionnaire. Veuillez réessayer dans quelques instants."
      );
      return;
    }

    const payload = calculateInternalScores();
    const postBody = JSON.stringify(payload);

    try {
      console.log('Envoi HTTP POST vers le webhook Google Apps Script :', targetUrl);

      let postSuccess = false;
      let errorDetail = '';

      // 1. Envoi de la requête HTTP POST
      try {
        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: postBody,
        });

        if (response.ok) {
          try {
            const data = await response.json();
            if (data && data.status === 'error') {
              throw new Error(data.message || 'Le script Apps Script a renvoyé une erreur.');
            }
          } catch (jsonErr: any) {
            if (jsonErr?.message && jsonErr.message.includes('Le script Apps Script')) {
              throw jsonErr;
            }
          }
          postSuccess = true;
        } else {
          throw new Error(`Le webhook a répondu avec le statut HTTP ${response.status}`);
        }
      } catch (fetchErr: any) {
        // En cas de politique CORS restrictive sur la redirection 302 d'Apps Script dans certains navigateurs,
        // le mode no-cors garantit la transmission de la requête POST et l'exécution de doPost sur le serveur.
        try {
          await fetch(targetUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8',
            },
            body: postBody,
            mode: 'no-cors',
          });
          postSuccess = true;
        } catch (fallbackErr: any) {
          errorDetail =
            fetchErr?.message ||
            fallbackErr?.message ||
            'Erreur réseau lors de la communication avec Google Apps Script.';
        }
      }

      if (!postSuccess) {
        throw new Error(
          errorDetail ||
            'Impossible d’envoyer les données au webhook Google Apps Script.'
        );
      }

      // Envoi Gmail direct si un compte est connecté
      try {
        await sendGmailNotification(payload);
      } catch (gmailErr) {
        console.warn('Note Gmail direct:', gmailErr);
      }

      // Tout s'est bien déroulé : passage à l'écran de confirmation
      setCurrentStep(7);
      scrollToTop();
    } catch (err: any) {
      setSubmitError(
        err?.message ||
          'Une erreur est survenue lors de l’envoi. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const part1 = QUESTIONNAIRE_PARTS[0];
  const part2 = QUESTIONNAIRE_PARTS[1];
  const part3 = QUESTIONNAIRE_PARTS[2];
  const part4 = QUESTIONNAIRE_PARTS[3];

  return (
    <div className="min-h-screen bg-[#faf7f2] py-4 sm:py-6 px-3 sm:px-5 md:px-6 text-[#132438]">
      <div ref={topAnchorRef} />
      <main className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <Header
          onReset={handleReset}
          onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
          showEmbedButton={showEmbedHelper}
          hasStarted={currentStep > 0 && currentStep < 7}
        />

        {/* Board Game Track Bar (Hidden on welcome and confirmation screens) */}
        <BoardTrack
          currentStep={currentStep}
          showSupplyPart={supplyFilter === 'yes'}
          onSelectStep={handleSelectTrackStep}
          completedSteps={completedSteps}
        />

        {/* STEP 0: Welcome Screen */}
        {currentStep === 0 && (
          <WelcomeScreen onStart={handleStart} />
        )}

        {/* STEP 1: Part 1 - Le dirigeant est encore au centre du jeu */}
        {currentStep === 1 && (
          <PartCardView
            part={part1}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onNext={handleNextFromPart1}
            onPrev={handlePrevStep}
            isFirstPart={true}
          />
        )}

        {/* STEP 2: Part 2 - Les règles du jeu ne sont pas toujours claires */}
        {currentStep === 2 && (
          <PartCardView
            part={part2}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onNext={handleNextFromPart2}
            onPrev={handlePrevStep}
            isFirstPart={false}
          />
        )}

        {/* STEP 3: Part 3 - Certains sujets restent trop longtemps en jeu */}
        {currentStep === 3 && (
          <PartCardView
            part={part3}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onNext={handleNextFromPart3}
            onPrev={handlePrevStep}
            isFirstPart={false}
          />
        )}

        {/* STEP 4: Question filtre avant la Supply */}
        {currentStep === 4 && (
          <SupplyFilterStep
            value={supplyFilter}
            onChange={(val) => setSupplyFilter(val)}
            onNext={handleNextFromFilter}
            onPrev={handlePrevStep}
          />
        )}

        {/* STEP 5: Part 4 - Côté supply, il manque parfois quelques cartes */}
        {currentStep === 5 && (
          <PartCardView
            part={part4}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onNext={handleNextFromPart4}
            onPrev={handlePrevStep}
            isFirstPart={false}
          />
        )}

        {/* STEP 6: Question ouverte & Coordonnées */}
        {currentStep === 6 && (
          <OpenQuestionAndContactStep
            openAnswer={openAnswer}
            onOpenAnswerChange={setOpenAnswer}
            contact={contact}
            onContactChange={handleContactChange}
            onSubmit={handleSubmit}
            onPrev={handlePrevStep}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        )}

        {/* STEP 7: Confirmation Screen (NO scores, exact Pauline text) */}
        {currentStep === 7 && (
          <ConfirmationScreen />
        )}

        {/* Discreet footer */}
        <footer className="mt-8 text-center text-xs text-[#746f68] border-t border-[#ebdcd0] pt-4 pb-3">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span>© {new Date().getFullYear()} OPS Supply</span>
            <span>•</span>
            <span>Organisation & Supply Chain</span>
            {showEmbedHelper && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setIsEmbedModalOpen(true)}
                  className="text-[#d06a4c] hover:underline cursor-pointer"
                >
                  Intégrer ce questionnaire
                </button>
              </>
            )}
          </div>
        </footer>
      </main>

      {/* Modals */}
      {showEmbedHelper && (
        <EmbedHelperModal
          isOpen={isEmbedModalOpen}
          onClose={() => setIsEmbedModalOpen(false)}
        />
      )}
    </div>
  );
}
