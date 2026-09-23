import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { PAULINE_EMAIL } from '../config';
import { QuestionnaireSubmissionPayload } from '../types';

export const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));
// Force consent prompt so refresh/offline token can be granted if needed
provider.setCustomParameters({
  prompt: 'consent',
});

let isSigningIn = false;
let cachedAccessToken: string | null = null;
let currentUser: User | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    currentUser = user;
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token might need re-fetch or login
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Impossible de récupérer le jeton d’accès Google.');
    }

    cachedAccessToken = credential.accessToken;
    currentUser = result.user;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Erreur de connexion Google:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  currentUser = null;
};

/**
 * Base64URL encoder conforming to RFC 4648 § 5
 */
function encodeBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Encode string for RFC 2047 MIME Header (UTF-8 subject)
 */
function encodeMimeSubject(subject: string): string {
  const bytes = new TextEncoder().encode(subject);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `=?UTF-8?B?${btoa(binary)}?=`;
}

/**
 * Construit le corps du mail de notification exactement comme demandé
 */
export function buildNotificationEmailContent(payload: QuestionnaireSubmissionPayload): {
  subject: string;
  body: string;
} {
  const firstName = payload.firstName.trim();
  const lastName = payload.lastName.trim();
  const company = payload.company.trim();
  const email = payload.email.trim();
  const phone = payload.phone && payload.phone.trim() ? payload.phone.trim() : 'Non renseigné';

  const scoreSupplyDisplay =
    payload.supplyFilterAnswer === 'Non' || payload.scoreSupply === 'Non concerné'
      ? 'Non concerné'
      : `${payload.scoreSupply}/12`;

  const openAnswerDisplay =
    payload.openAnswer && payload.openAnswer.trim()
      ? payload.openAnswer.trim()
      : '(Aucune précision renseignée)';

  const subject = `Nouveau questionnaire OPS Supply – ${firstName} ${lastName} – ${company}`;

  const body =
`Bonjour Pauline,

Un nouveau questionnaire « Où en est la partie chez vous ? » vient d’être complété.

Prénom : ${firstName}
Nom : ${lastName}
Entreprise : ${company}
Email : ${email}
Téléphone : ${phone}

Score dirigeant : ${payload.scoreDirigeant}/12
Score règles du jeu : ${payload.scoreRegles}/12
Score sujets : ${payload.scoreSujets}/12
Score supply : ${scoreSupplyDisplay}

Score total : ${payload.scoreTotal} / ${payload.scoreMaxApplicable}

Sujet à regarder en premier :
${openAnswerDisplay}

Réponses détaillées :
Q1 : ${payload.q1Text || 'Non répondu'}
Q2 : ${payload.q2Text || 'Non répondu'}
Q3 : ${payload.q3Text || 'Non répondu'}
Q4 : ${payload.q4Text || 'Non répondu'}
Q5 : ${payload.q5Text || 'Non répondu'}
Q6 : ${payload.q6Text || 'Non répondu'}
Q7 : ${payload.q7Text || 'Non répondu'}
Q8 : ${payload.q8Text || 'Non répondu'}
Q9 : ${payload.q9Text || 'Non répondu'}
Q10 : ${payload.q10Text || 'Non répondu'}
Q11 : ${payload.q11Text || 'Non répondu'}
Q12 : ${payload.q12Text || 'Non répondu'}
Q13 : ${payload.q13Text || 'Non concerné'}
Q14 : ${payload.q14Text || 'Non concerné'}
Q15 : ${payload.q15Text || 'Non concerné'}
Q16 : ${payload.q16Text || 'Non concerné'}`;

  return { subject, body };
}

/**
 * Envoie un email via l'API Gmail de Google
 */
export async function sendGmailNotification(
  payload: QuestionnaireSubmissionPayload,
  token?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) {
    return { success: false, error: 'Non authentifié à Gmail' };
  }

  const { subject, body } = buildNotificationEmailContent(payload);

  const emailLines = [
    `To: ${PAULINE_EMAIL}`,
    `Subject: ${encodeMimeSubject(subject)}`,
    `Reply-To: ${payload.email}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'MIME-Version: 1.0',
    '',
    body,
  ];

  const raw = encodeBase64Url(emailLines.join('\r\n'));

  try {
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const errMsg = errJson?.error?.message || `Erreur HTTP ${res.status}`;
      return { success: false, error: errMsg };
    }

    const data = await res.json();
    return { success: true, messageId: data.id };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur réseau lors de l’envoi Gmail' };
  }
}
