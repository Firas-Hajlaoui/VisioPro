// Système de codification ISO 9001
// Format: [DEPT]-[TYPE]-[ANNEE]-[NUMERO]


export const generateCode = (department: string, type: string, counter: number): string => {
  const year = new Date().getFullYear();
  const paddedCounter = String(counter).padStart(4, '0');
  return `${department}-${type}-${year}-${paddedCounter}`;
};

// Codes des départements
export const DEPT_CODES = {
  RH: 'RH',
  FORMATION: 'DF',
  INGENIERIE: 'DI',
  PROJET: 'DP',

} as const;

// Types de documents
export const DOC_TYPES = {
  // RH
  EMPLOYEE: 'EMP',
  TEMPS_TRAVAIL: 'TT',
  CONGE: 'CG',
  AUTORISATION: 'AUT',
  NOTE_DE_FRAIS: 'NDF',
  // Formation
  SESSION: 'SES',
  EVALUATION: 'EVA',
  // Ingénierie
  INTERVENTION: 'INT',
  RAPPORT: 'RPT',
  // Projet
  DEVIS: 'DEV',
  FICHE_INTERVENTION: 'FI',
  DOC_TECHNIQUE: 'DT',
  BACKUP: 'BKP',
} as const;

// Générer un code unique pour chaque type de formulaire
export const generateFormCode = (
  dept: keyof typeof DEPT_CODES,
  type?: keyof typeof DOC_TYPES // 👈 rendu optionnel
): string => {
  const counter = Math.floor(Math.random() * 9999) + 1; // Simulated - in real app, use DB sequence
  const docTypeCode = type ? DOC_TYPES[type] : 'GEN'; // Valeur par défaut si aucun type
  return generateCode(DEPT_CODES[dept], docTypeCode, counter);
};
