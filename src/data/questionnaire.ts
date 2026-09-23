import { QuestionnairePart, RatingValue } from '../types';

export interface RatingOption {
  value: RatingValue;
  label: string;
}

export const RATING_OPTIONS: RatingOption[] = [
  {
    value: 0,
    label: 'Pas du tout',
  },
  {
    value: 1,
    label: 'De temps en temps',
  },
  {
    value: 2,
    label: 'Souvent',
  },
  {
    value: 3,
    label: 'Clairement oui',
  },
];

export const QUESTIONNAIRE_PARTS: QuestionnairePart[] = [
  {
    id: 'dirigeant',
    partNumber: 1,
    title: 'Le dirigeant est encore au centre du jeu',
    shortLabel: 'Dirigeant au centre',
    cardName: 'Le dirigeant au centre du jeu',
    iconName: 'crown',
    questions: [
      {
        id: 1,
        number: 1,
        text: 'Trop de décisions remontent encore jusqu’à moi.',
        helpText: 'Par exemple : une validation, un choix de priorité ou une petite décision attend encore votre feu vert.',
      },
      {
        id: 2,
        number: 2,
        text: 'Je passe beaucoup de temps à gérer les urgences.',
        helpText: 'Un appel, un imprévu ou une demande arrive, et ce que vous aviez prévu passe régulièrement après.',
      },
      {
        id: 3,
        number: 3,
        text: 'Certains sujets avancent uniquement si je les relance.',
        helpText: 'Sans votre rappel ou votre intervention, certains dossiers peuvent facilement rester en attente.',
      },
      {
        id: 4,
        number: 4,
        text: 'J’ai du mal à dégager du temps pour prendre du recul ou développer l’entreprise.',
        helpText: 'Le quotidien prend tellement de place qu’il reste peu de temps pour réfléchir, anticiper ou développer.',
      },
    ],
  },
  {
    id: 'regles',
    partNumber: 2,
    title: 'Les règles du jeu ne sont pas toujours claires',
    shortLabel: 'Règles du jeu',
    cardName: 'Les règles du jeu',
    iconName: 'compass',
    questions: [
      {
        id: 5,
        number: 5,
        text: 'On ne sait pas toujours clairement qui fait quoi.',
        helpText: 'Certaines tâches, décisions ou responsabilités peuvent passer d’une personne à une autre sans règle vraiment claire.',
      },
      {
        id: 6,
        number: 6,
        text: 'Certaines infos restent dans la tête d’une seule personne.',
        helpText: 'Quand cette personne n’est pas disponible, retrouver l’information ou savoir quoi faire devient plus compliqué.',
      },
      {
        id: 7,
        number: 7,
        text: 'Les infos sont dispersées entre plusieurs fichiers.',
        helpText: 'Excel, mails, papier, messagerie, différents outils… il faut parfois chercher avant de retrouver la bonne information.',
      },
      {
        id: 8,
        number: 8,
        text: 'Certaines façons de faire pourraient être simplifiées ou mieux partagées.',
        helpText: 'Certaines étapes sont peut-être répétées, peu documentées ou réalisées différemment selon les personnes.',
      },
    ],
  },
  {
    id: 'sujets',
    partNumber: 3,
    title: 'Certains sujets restent trop longtemps en jeu',
    shortLabel: 'Sujets en jeu',
    cardName: 'Certains sujets restent trop longtemps en jeu',
    iconName: 'hourglass',
    questions: [
      {
        id: 9,
        number: 9,
        text: 'Des projets démarrent mais perdent ensuite leur rythme.',
        helpText: 'On commence avec de bonnes intentions, puis le quotidien reprend le dessus et le sujet ralentit.',
      },
      {
        id: 10,
        number: 10,
        text: 'Les priorités changent souvent et bousculent ce qui était prévu.',
        helpText: 'Une nouvelle urgence ou demande peut régulièrement remettre en question le programme prévu.',
      },
      {
        id: 11,
        number: 11,
        text: 'Il n’est pas toujours simple de savoir où en sont les sujets.',
        helpText: 'Il faut parfois demander, vérifier ou relancer pour savoir ce qui est terminé, en cours ou bloqué.',
      },
      {
        id: 12,
        number: 12,
        text: 'La coordination entre l’équipe, les prestataires ou les différents métiers prend beaucoup d’énergie.',
        helpText: 'Faire circuler les informations, obtenir les réponses et garder tout le monde dans la même direction demande du temps.',
      },
    ],
  },
  {
    id: 'supply',
    partNumber: 4,
    title: 'Côté supply, il manque parfois quelques cartes',
    shortLabel: 'Côté supply',
    cardName: 'Côté supply, il manque parfois quelques cartes',
    iconName: 'boxes',
    questions: [
      {
        id: 13,
        number: 13,
        text: 'Je manque de visibilité sur les stocks ou les besoins à venir.',
        helpText: 'Il n’est pas toujours évident de savoir précisément ce qui reste disponible ou ce qu’il faudra commander prochainement.',
      },
      {
        id: 14,
        number: 14,
        text: 'Le suivi des fournisseurs et des commandes me prend beaucoup de temps.',
        helpText: 'Commandes, confirmations, délais, relances ou changements fournisseurs reviennent régulièrement dans votre quotidien.',
      },
      {
        id: 15,
        number: 15,
        text: 'La coordination de la supply pourrait être plus fluide.',
        helpText: 'Une information tardive ou un changement sur un maillon peut rapidement avoir des conséquences sur le reste.',
      },
      {
        id: 16,
        number: 16,
        text: 'Les retards, ruptures ou changements de planning sont souvent gérés au dernier moment.',
        helpText: 'Une solution est généralement trouvée, mais parfois avec beaucoup d’énergie et dans l’urgence.',
      },
    ],
  },
];

export const SUPPLY_FILTER_QUESTION = {
  text: 'Votre entreprise achète, stocke, produit ou expédie des produits physiques ?',
  helpText: 'Par exemple : matières premières, bouteilles, cartons, composants, marchandises ou produits finis.',
};

export const OPEN_QUESTION = {
  title: 'Quel sujet mériterait qu’on s’y attarde en premier ?',
  helpText: 'Si vous pouviez régler un seul sujet aujourd’hui, lequel vous enlèverait le plus gros caillou de la chaussure ?',
  placeholder: 'Exemple : le temps passé sur les relances, l’absence de consignes claires pour les commandes, les imprévus permanents...',
};

export const TRANSPARENCY_TEXT =
  'Vos réponses vont maintenant m’être transmises. Je les regarderai dans leur ensemble avant de vous faire un retour personnel par email.';

export const CONFIDENTIALITY_NOTICE =
  'Vos coordonnées et vos réponses sont utilisées uniquement pour traiter votre demande et vous recontacter à ce sujet.';

export const SUBMIT_BUTTON_TEXT = 'Envoyer mes réponses à Pauline';

export const CONFIRMATION_DATA = {
  title: 'C’est dans la boîte !',
  paragraphs: [
    'Merci, j’ai bien reçu vos réponses.',
    'Je vais les regarder dans leur ensemble, pas seulement additionner les cases.',
    'Je vous ferai un retour personnel par email sur ce qui ressort et sur le sujet qui mérite, à mon sens, qu’on s’y attarde en premier.',
    'Gardez un œil sur votre boîte mail.',
  ],
  signature: 'Pauline',
  buttonText: 'Revenir au site',
};

export function getRatingLabel(val: RatingValue | undefined): string {
  if (val === undefined) return 'Non répondu';
  const opt = RATING_OPTIONS.find((o) => o.value === val);
  return opt ? opt.label : '';
}
