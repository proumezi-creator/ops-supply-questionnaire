export type RatingValue = 0 | 1 | 2 | 3;

export interface Question {
  id: number;
  number: number;
  text: string;
  helpText: string;
}

export type CategoryId = 'dirigeant' | 'regles' | 'sujets' | 'supply';

export interface QuestionnairePart {
  id: CategoryId;
  partNumber: number;
  title: string;
  shortLabel: string;
  cardName: string;
  iconName: 'crown' | 'compass' | 'hourglass' | 'boxes';
  questions: Question[];
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
}

export interface AnswersState {
  [questionId: number]: RatingValue;
}

export interface QuestionnaireSubmissionPayload {
  timestamp: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  supplyFilterAnswer: 'Oui' | 'Non';
  q1Text: string;
  q2Text: string;
  q3Text: string;
  q4Text: string;
  scoreDirigeant: number;
  q5Text: string;
  q6Text: string;
  q7Text: string;
  q8Text: string;
  scoreRegles: number;
  q9Text: string;
  q10Text: string;
  q11Text: string;
  q12Text: string;
  scoreSujets: number;
  q13Text: string;
  q14Text: string;
  q15Text: string;
  q16Text: string;
  scoreSupply: string; // number as string or "Non concerné"
  scoreTotal: number;
  scoreMaxApplicable: number;
  dominantCategory: string;
  openAnswer: string;
  status: string; // "À traiter"
  answers?: Record<string, string>;
  scores?: {
    dirigeant: number;
    regles: number;
    sujets: number;
    supply: string;
    total: number;
    maxApplicable: number;
  };
}
