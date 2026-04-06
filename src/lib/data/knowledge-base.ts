/**
 * VETGL Knowledge Base
 * Extracted from Greenlight Pet ER epidemiological data (March 2026)
 * Contains 478 cases from emergency room presentations
 */

export interface LocationData {
  name: string;
  cases: number;
  percentage: number;
}

export interface EmergencyCondition {
  rank: number;
  condition: string;
  count: number;
}

export interface MedicationData {
  highAcceptance: string[];
  universalAcceptance: string[];
}

export interface DiagnosticsData {
  bloodWork: number;
  urinalysis: number;
  imaging: number;
  ocular: number;
}

export interface ProceduresData {
  minor: number;
  advanced: number;
  surgical: number;
}

export interface KnowledgeBase {
  organization: string;
  date: string;
  locations: LocationData[];
  totalCases: number;
  demographics: {
    canine: number;
    feline: number;
    other: number;
  };
  commonBreeds: string[];
  topEmergencies: EmergencyCondition[];
  medications: MedicationData;
  diagnostics: DiagnosticsData;
  procedures: ProceduresData;
}

export const KNOWLEDGE_BASE: KnowledgeBase = {
  organization: 'Greenlight Pet ER',
  date: 'Março 2026',
  locations: [
    { name: 'Lake Nona FL', cases: 238, percentage: 49.8 },
    { name: 'The Woodlands TX', cases: 179, percentage: 37.4 },
    { name: 'Plantation FL', cases: 61, percentage: 12.8 },
    { name: 'Ocoee FL', cases: 0, percentage: 0 },
    { name: 'Jacksonville FL', cases: 0, percentage: 0 },
  ],
  totalCases: 478,
  demographics: {
    canine: 78,
    feline: 21,
    other: 1,
  },
  commonBreeds: [
    'Chihuahua',
    'Dachshund',
    'German Shepherd',
    'Poodle',
    'Yorkshire',
    'Golden Retriever',
    'Labrador',
    'Shih Tzu',
    'French Bulldog',
  ],
  topEmergencies: [
    { rank: 1, condition: 'Diarrhea', count: 32 },
    { rank: 2, condition: 'Heart murmur', count: 32 },
    { rank: 3, condition: 'Vomiting', count: 29 },
    { rank: 4, condition: 'Euthanasia/QOL', count: 28 },
    { rank: 5, condition: 'Seizures', count: 25 },
    { rank: 6, condition: 'Gastroenteritis', count: 24 },
    { rank: 7, condition: 'Foreign body ingestion', count: 23 },
    { rank: 8, condition: 'Anorexia', count: 18 },
    { rank: 9, condition: 'Trauma', count: 18 },
    { rank: 10, condition: 'Urolithiasis', count: 18 },
    { rank: 11, condition: 'Lethargy', count: 17 },
    { rank: 12, condition: 'Kidney disease', count: 16 },
    { rank: 13, condition: 'Pain', count: 14 },
    { rank: 14, condition: 'UTI', count: 13 },
    { rank: 15, condition: 'Otitis externa', count: 12 },
  ],
  medications: {
    highAcceptance: [
      'Propofol 90%',
      'Omeprazol 85.7%',
      'Cytopoint 83.3%',
      'Cerenia/Maropitant 80.5%',
      'Convenia 80%',
      'Butorfanol 80%',
      'Buprenorfina 80%',
      'Metadona 75%',
      'Famotidina 71.4%',
      'Gabapentina 44%',
    ],
    universalAcceptance: [
      'Manitol',
      'LRS',
      'Euthasol',
      'Dexametasona SP',
      'Fenobarbital',
      'NSAIDs',
      'Lidocaína',
      'Alfaxalona',
      'Propofol',
      'Ampicilina',
      'Convenia',
      'Activated Charcoal',
      'Pentobarbital',
      'Enrofloxacina',
      'Cefpodoxima',
      'Metoclopramida',
      'Ondansetrona',
      'Sucralfato',
    ],
  },
  diagnostics: {
    bloodWork: 61.5,
    urinalysis: 57.9,
    imaging: 50,
    ocular: 50,
  },
  procedures: {
    minor: 74.1,
    advanced: 51.7,
    surgical: 20,
  },
};

/**
 * Get top emergencies from the knowledge base
 * Ordered by frequency
 */
export function getTopEmergencies(limit: number = 10): EmergencyCondition[] {
  return KNOWLEDGE_BASE.topEmergencies.slice(0, limit);
}

/**
 * Get high-acceptance medications
 * These have >75% acceptance rate in clinical use
 */
export function getHighAcceptanceMedications(): string[] {
  return KNOWLEDGE_BASE.medications.highAcceptance;
}

/**
 * Get universally accepted medications
 * These are accepted across different clinical scenarios
 */
export function getUniversalAcceptanceMedications(): string[] {
  return KNOWLEDGE_BASE.medications.universalAcceptance;
}

/**
 * Get emergency distribution by location
 */
export function getEmergenciesByLocation(): LocationData[] {
  return KNOWLEDGE_BASE.locations.filter((loc) => loc.cases > 0);
}

/**
 * Check if a condition is in the top emergencies
 */
export function isTopEmergency(condition: string): boolean {
  return KNOWLEDGE_BASE.topEmergencies.some(
    (e) => e.condition.toLowerCase() === condition.toLowerCase()
  );
}

/**
 * Get rank of an emergency condition
 */
export function getEmergencyRank(condition: string): number | null {
  const emergency = KNOWLEDGE_BASE.topEmergencies.find(
    (e) => e.condition.toLowerCase() === condition.toLowerCase()
  );
  return emergency ? emergency.rank : null;
}

export default KNOWLEDGE_BASE;
