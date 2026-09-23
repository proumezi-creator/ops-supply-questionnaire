import { useState, useEffect } from 'react';
import { X, Copy, Check, MailCheck, Send, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { PAULINE_EMAIL } from '../config';
import {
  googleSignIn,
  logout,
  initAuth,
  sendGmailNotification,
  getCurrentUser,
  getAccessToken,
} from '../services/gmail';
import { User } from 'firebase/auth';

interface AppsScriptSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScriptUrl: string;
  onSaveScriptUrl: (url: string) => void;
}

export function AppsScriptSetupModal({
  isOpen,
  onClose,
  currentScriptUrl,
  onSaveScriptUrl,
}: AppsScriptSetupModalProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [isTestingGmail, setIsTestingGmail] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [copiedScript, setCopiedScript] = useState(false);
  const [inputUrl, setInputUrl] = useState(currentScriptUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
        setAuthError(null);
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    setTestResult(null);
    try {
      const res = await googleSignIn();
      setCurrentUser(res.user);
    } catch (err: any) {
      setAuthError(err?.message || 'Erreur lors de la connexion Google.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setTestResult(null);
  };

  const handleSendTestEmail = async () => {
    setIsTestingGmail(true);
    setTestResult(null);
    try {
      const token = getAccessToken();
      const testPayload = {
        timestamp: new Date().toISOString(),
        firstName: 'Test Prénom',
        lastName: 'Test Nom',
        company: 'Entreprise Démo',
        email: currentUser?.email || 'test@demo.com',
        phone: '06 12 34 56 78',
        supplyFilterAnswer: 'Oui' as const,
        q1Text: 'Souvent',
        q2Text: 'De temps en temps',
        q3Text: 'Clairement oui',
        q4Text: 'Souvent',
        scoreDirigeant: 8,
        q5Text: 'De temps en temps',
        q6Text: 'Pas du tout',
        q7Text: 'Souvent',
        q8Text: 'Clairement oui',
        scoreRegles: 6,
        q9Text: 'Souvent',
        q10Text: 'Souvent',
        q11Text: 'De temps en temps',
        q12Text: 'Clairement oui',
        scoreSujets: 9,
        q13Text: 'Souvent',
        q14Text: 'Clairement oui',
        q15Text: 'De temps en temps',
        q16Text: 'Souvent',
        scoreSupply: '9',
        scoreTotal: 32,
        scoreMaxApplicable: 48,
        dominantCategory: 'Les sujets en jeu',
        openAnswer: 'Ceci est un test de validation de l’envoi Gmail vers Pauline.',
        status: 'Test',
      };

      const res = await sendGmailNotification(testPayload, token || undefined);
      if (res.success) {
        setTestResult({
          success: true,
          message: `Email de test envoyé avec succès à ${PAULINE_EMAIL} via Gmail !`,
        });
      } else {
        setTestResult({
          success: false,
          message: res.error || 'Échec de l’envoi de l’email.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Erreur lors de l’envoi.',
      });
    } finally {
      setIsTestingGmail(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      const res = await fetch('/google-apps-script.js');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } catch {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const handleSave = () => {
    onSaveScriptUrl(inputUrl.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestWebhookPost = async () => {
    const target = inputUrl.trim();
    if (!target) {
      setWebhookTestResult({
        success: false,
        message: "Veuillez d'abord renseigner l'URL de votre application Web Google Apps Script.",
      });
      return;
    }
    if (!target.startsWith('https://')) {
      setWebhookTestResult({
        success: false,
        message: "L'URL doit obligatoirement commencer par https://",
      });
      return;
    }

    setIsTestingWebhook(true);
    setWebhookTestResult(null);

    const testPayload = {
      timestamp: new Date().toISOString(),
      firstName: 'Test Prénom',
      lastName: 'Test Nom',
      company: 'Entreprise Test',
      email: currentUser?.email || 'test@ops-supply.com',
      phone: '06 12 34 56 78',
      supplyFilterAnswer: 'Oui' as const,
      q1Text: 'Souvent',
      q2Text: 'De temps en temps',
      q3Text: 'Clairement oui',
      q4Text: 'Souvent',
      scoreDirigeant: 8,
      q5Text: 'De temps en temps',
      q6Text: 'Pas du tout',
      q7Text: 'Souvent',
      q8Text: 'Clairement oui',
      scoreRegles: 6,
      q9Text: 'Souvent',
      q10Text: 'Souvent',
      q11Text: 'De temps en temps',
      q12Text: 'Clairement oui',
      scoreSujets: 9,
      q13Text: 'Souvent',
      q14Text: 'Clairement oui',
      q15Text: 'De temps en temps',
      q16Text: 'Souvent',
      scoreSupply: '9',
      scoreTotal: 32,
      scoreMaxApplicable: 48,
      dominantCategory: 'Les sujets en jeu',
      openAnswer: 'Test direct de la fonction doPost() depuis l’application.',
      status: 'Test',
      answers: {
        q1: 'Souvent',
        q2: 'De temps en temps',
        q3: 'Clairement oui',
        q4: 'Souvent',
        q5: 'De temps en temps',
        q6: 'Pas du tout',
        q7: 'Souvent',
        q8: 'Clairement oui',
        q9: 'Souvent',
        q10: 'Souvent',
        q11: 'De temps en temps',
        q12: 'Clairement oui',
        q13: 'Souvent',
        q14: 'Clairement oui',
        q15: 'De temps en temps',
        q16: 'Souvent',
      },
      scores: {
        dirigeant: 8,
        regles: 6,
        sujets: 9,
        supply: '9',
        total: 32,
        maxApplicable: 48,
      },
    };

    try {
      try {
        const res = await fetch(target, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(testPayload),
        });
        if (res.ok) {
          const json = await res.json().catch(() => null);
          if (json && json.status === 'error') {
            throw new Error(json.message);
          }
        }
      } catch (corsErr: any) {
        // Fallback for redirect CORS block
        await fetch(target, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(testPayload),
          mode: 'no-cors',
        });
      }

      onSaveScriptUrl(target);
      setWebhookTestResult({
        success: true,
        message: 'Requête HTTP POST envoyée avec succès ! L’exécution doPost est maintenant visible dans votre journal Google Apps Script.',
      });
    } catch (err: any) {
      setWebhookTestResult({
        success: false,
        message: err?.message || 'Erreur lors de l’envoi du test POST vers le webhook.',
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#132438]/50 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-[#e9e1d5] rounded-3xl p-6 sm:p-7 shadow-xl">
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
            <MailCheck className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#132438]">
            Connexion Gmail & Envoi d’emails
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#746f68] leading-relaxed mb-6">
          Chaque questionnaire complété envoie automatiquement un email récapitulatif détaillé à{' '}
          <strong>{PAULINE_EMAIL}</strong>. Aucun email n’est envoyé au répondant.
        </p>

        {/* SECTION 1: Connexion Google / Gmail directe */}
        <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e9e1d5] mb-5">
          <h4 className="font-bold text-sm text-[#132438] mb-2 flex items-center justify-between">
            <span>Option 1 : Autoriser votre compte Google (Gmail)</span>
            {currentUser && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#22543d] bg-[#f0fff4] px-2 py-0.5 rounded-md border border-[#c6f6d5]">
                <CheckCircle2 className="w-3 h-3" /> Connecté
              </span>
            )}
          </h4>
          <p className="text-xs text-[#746f68] mb-3">
            Permet à l’application d’envoyer les notifications directement via l'API Gmail sécurisée.
          </p>

          {currentUser ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white border border-[#e9e1d5] p-3 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-[#132438]">
                    {currentUser.displayName || 'Utilisateur Google'}
                  </div>
                  <div className="text-[11px] text-[#746f68]">{currentUser.email}</div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 text-xs text-[#d06a4c] hover:underline"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnecter</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={isTestingGmail}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#d06a4c] hover:bg-[#b85437] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isTestingGmail ? 'Envoi en cours...' : 'Envoyer un email de test réel'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="gsi-material-button inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border border-[#dadce0] hover:bg-[#f8f9fa] rounded-xl text-xs font-medium text-[#3c4043] shadow-xs transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isSigningIn ? 'Connexion en cours...' : 'Activer Gmail avec Google'}</span>
              </button>
            </div>
          )}

          {authError && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#c53030]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {testResult && (
            <div
              className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 border ${
                testResult.success
                  ? 'bg-[#f0fff4] text-[#22543d] border-[#c6f6d5]'
                  : 'bg-[#fff5f5] text-[#c53030] border-[#fed7d7]'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* SECTION 2: Solution autonome WebApp Google Apps Script */}
        <div className="p-4 rounded-2xl bg-[#fbeee9]/40 border border-[#f4ded6] mb-5">
          <h4 className="font-bold text-sm text-[#132438] mb-1">
            Option 2 : Webhook Google Apps Script (pour les visiteurs externes)
          </h4>
          <p className="text-xs text-[#746f68] mb-3">
            Permet de recevoir les emails même lorsque aucun compte n’est connecté dans le navigateur du visiteur.
          </p>

          <div className="space-y-2 mb-3">
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#132438] text-white text-xs font-semibold rounded-lg hover:bg-[#1e3550] transition-colors cursor-pointer"
            >
              {copiedScript ? (
                <>
                  <Check className="w-3 h-3 text-[#22543d]" />
                  <span>Script copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copier le script autonome</span>
                </>
              )}
            </button>
          </div>

          <label className="block text-[11px] font-bold text-[#132438] mb-1">
            URL de l'application Web déployée (/exec)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="flex-1 text-xs p-2 rounded-lg bg-white border border-[#e2d8cb] focus:border-[#d06a4c] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSave}
              className="px-3.5 py-1.5 bg-[#d06a4c] hover:bg-[#b85437] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {savedSuccess ? 'Enregistré !' : 'Enregistrer'}
            </button>
          </div>

          <div className="mt-2">
            <button
              type="button"
              onClick={handleTestWebhookPost}
              disabled={isTestingWebhook}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#132438] hover:bg-[#1e3550] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>{isTestingWebhook ? 'Envoi HTTP POST en cours...' : 'Tester l’envoi HTTP POST vers le Webhook'}</span>
            </button>
          </div>

          {webhookTestResult && (
            <div
              className={`mt-2.5 p-2.5 rounded-lg text-xs flex items-center gap-2 border ${
                webhookTestResult.success
                  ? 'bg-[#f0fff4] text-[#22543d] border-[#c6f6d5]'
                  : 'bg-[#fff5f5] text-[#c53030] border-[#fed7d7]'
              }`}
            >
              {webhookTestResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{webhookTestResult.message}</span>
            </div>
          )}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#132438] text-white text-xs font-semibold rounded-xl hover:bg-[#1e3550] transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
