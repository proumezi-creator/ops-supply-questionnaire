/**
 * ============================================================================
 * GOOGLE APPS SCRIPT - OPS SUPPLY
 * Envoi d'email de notification pour le questionnaire :
 * « Où en est la partie chez vous ? »
 * ============================================================================
 * 
 * Ce script reçoit les réponses du questionnaire et envoie un email unique
 * de notification à Pauline (contact@ops-supply.com).
 * 
 * IMPORTANT :
 * - AUCUN Google Sheet n'est requis (aucun enregistrement dans un tableur).
 * - AUCUN email n'est envoyé au visiteur / répondant.
 * - Seule Pauline reçoit l'email récapitulatif complet.
 *
 * ----------------------------------------------------------------------------
 * GUIDE DE MISE EN SERVICE (en 5 étapes simples) :
 * ----------------------------------------------------------------------------
 * 1. Rendez-vous sur https://script.google.com avec votre compte Google
 *    et cliquez sur « Nouveau projet » en haut à gauche.
 *    (Vous pouvez nommer le projet « OPS Supply - Envoi Notification »).
 * 
 * 2. Supprimez tout le code déjà présent dans l'éditeur et collez l'intégralité
 *    du code ci-dessous.
 * 
 * 3. Cliquez sur l'icône « Enregistrer » (la disquette en haut).
 * 
 * 4. Cliquez sur le bouton bleu « Déployer » (en haut à droite) > « Nouveau déploiement » :
 *    - Type : Cliquez sur la roue dentée à gauche > Choisissez « Application Web »
 *    - Description : « Envoi email OPS Supply »
 *    - Exécuter en tant que : « Moi (votre adresse Google) »
 *    - Qui a accès : « Tout le monde » (indispensable pour que le questionnaire
 *      puisse envoyer les réponses sans demander de connexion Google aux répondants).
 * 
 * 5. Cliquez sur « Déployer » :
 *    - Google vous demande d'autoriser l'accès : cliquez sur « Autoriser l'accès ».
 *    - Choisissez votre compte Google.
 *    - Si un écran « Google n'a pas validé cette application » s'affiche,
 *      cliquez sur « Paramètres avancés » (en bas à gauche), puis sur
 *      « Accéder à OPS Supply (non sécurisé) », puis cliquez sur « Autoriser ».
 *    - Copiez l'« URL de l'application Web » qui se termine par /exec.
 * 
 * 6. Collez cette URL dans src/config.ts (variable GOOGLE_SCRIPT_WEBAPP_URL)
 *    ou directement dans la fenêtre de configuration de l'application.
 * ============================================================================
 */

const PAULINE_EMAIL = "contact@ops-supply.com";

/**
 * Réception des données du questionnaire lors de la soumission (POST)
 */
function doPost(e) {
  try {
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter;
      }
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("Aucune donnée reçue.");
    }

    // Envoi exclusif de la notification à Pauline (aucun email au répondant)
    sendNotificationToPauline(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Email envoyé avec succès à Pauline" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Erreur dans doPost: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Envoie un email de notification récapitulatif à Pauline
 */
function sendNotificationToPauline(data) {
  const firstName = (data.firstName || "").trim();
  const lastName = (data.lastName || "").trim();
  const company = (data.company || "").trim();
  const email = (data.email || "").trim();
  const phone = (data.phone && data.phone.trim()) ? data.phone.trim() : "Non renseigné";

  const scoreDirigeant = data.scoreDirigeant !== undefined ? data.scoreDirigeant : 0;
  const scoreRegles = data.scoreRegles !== undefined ? data.scoreRegles : 0;
  const scoreSujets = data.scoreSujets !== undefined ? data.scoreSujets : 0;

  let scoreSupplyDisplay = "Non concerné";
  if (data.supplyFilterAnswer === "Oui" || (data.scoreSupply && data.scoreSupply !== "Non concerné")) {
    scoreSupplyDisplay = (data.scoreSupply !== undefined ? data.scoreSupply : 0) + "/12";
  }

  const scoreTotal = data.scoreTotal !== undefined ? data.scoreTotal : 0;
  const scoreMaxApplicable = data.scoreMaxApplicable || (data.supplyFilterAnswer === "Oui" ? 48 : 36);
  const openAnswer = (data.openAnswer && data.openAnswer.trim()) ? data.openAnswer.trim() : "(Aucune précision renseignée)";

  const subject = "Nouveau questionnaire OPS Supply – " + firstName + " " + lastName + " – " + company;

  const body =
"Bonjour Pauline,\n\n" +
"Un nouveau questionnaire « Où en est la partie chez vous ? » vient d’être complété.\n\n" +
"Prénom : " + firstName + "\n" +
"Nom : " + lastName + "\n" +
"Entreprise : " + company + "\n" +
"Email : " + email + "\n" +
"Téléphone : " + phone + "\n\n" +
"Score dirigeant : " + scoreDirigeant + "/12\n" +
"Score règles du jeu : " + scoreRegles + "/12\n" +
"Score sujets : " + scoreSujets + "/12\n" +
"Score supply : " + scoreSupplyDisplay + "\n\n" +
"Score total : " + scoreTotal + " / " + scoreMaxApplicable + "\n\n" +
"Sujet à regarder en premier :\n" +
openAnswer + "\n\n" +
"Réponses détaillées :\n" +
"Q1 : " + (data.q1Text || "Non répondu") + "\n" +
"Q2 : " + (data.q2Text || "Non répondu") + "\n" +
"Q3 : " + (data.q3Text || "Non répondu") + "\n" +
"Q4 : " + (data.q4Text || "Non répondu") + "\n" +
"Q5 : " + (data.q5Text || "Non répondu") + "\n" +
"Q6 : " + (data.q6Text || "Non répondu") + "\n" +
"Q7 : " + (data.q7Text || "Non répondu") + "\n" +
"Q8 : " + (data.q8Text || "Non répondu") + "\n" +
"Q9 : " + (data.q9Text || "Non répondu") + "\n" +
"Q10 : " + (data.q10Text || "Non répondu") + "\n" +
"Q11 : " + (data.q11Text || "Non répondu") + "\n" +
"Q12 : " + (data.q12Text || "Non répondu") + "\n" +
"Q13 : " + (data.q13Text || "Non concerné") + "\n" +
"Q14 : " + (data.q14Text || "Non concerné") + "\n" +
"Q15 : " + (data.q15Text || "Non concerné") + "\n" +
"Q16 : " + (data.q16Text || "Non concerné");

  MailApp.sendEmail({
    to: PAULINE_EMAIL,
    subject: subject,
    body: body,
    replyTo: email || PAULINE_EMAIL
  });
}

/**
 * Test simple pour s'assurer que le WebApp est en ligne
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Application Web d'envoi d'emails OPS Supply opérationnelle." }))
    .setMimeType(ContentService.MimeType.JSON);
}
