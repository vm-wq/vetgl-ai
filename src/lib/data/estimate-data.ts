export interface EstimateService {
  id: string;
  name: string;
  category: string;
  price_low: number;
  price_high: number;
  description?: string;
}

export interface EstimateServiceLegacy {
  name: string;
  low: number;
  high: number;
}

export interface EstimateCategory {
  [key: string]: EstimateServiceLegacy[];
}

export const SERVICE_CATEGORIES = [
  'Consulta',
  'Diagnóstico Laboratorial',
  'Diagnóstico por Imagem',
  'Cirurgia',
  'Hospitalização',
  'Medicamentos',
  'Procedimentos',
  'Emergência',
  'Vacinação',
  'Odontologia',
] as const;

export const SERVICES_CATALOG: EstimateService[] = [
  // Consulta
  { id: 'consul-1', name: 'Consulta de Emergência', category: 'Consulta', price_low: 150, price_high: 250 },
  { id: 'consul-2', name: 'Consulta Especializada', category: 'Consulta', price_low: 200, price_high: 350 },
  { id: 'consul-3', name: 'Reavaliação', category: 'Consulta', price_low: 80, price_high: 150 },

  // Diagnóstico Laboratorial
  { id: 'lab-1', name: 'Hemograma Completo (CBC)', category: 'Diagnóstico Laboratorial', price_low: 50, price_high: 120 },
  { id: 'lab-2', name: 'Bioquímica Sérica (10 parâmetros)', category: 'Diagnóstico Laboratorial', price_low: 80, price_high: 200 },
  { id: 'lab-3', name: 'Urinálise Completa', category: 'Diagnóstico Laboratorial', price_low: 40, price_high: 90 },
  { id: 'lab-4', name: 'Coagulograma', category: 'Diagnóstico Laboratorial', price_low: 60, price_high: 150 },
  { id: 'lab-5', name: 'Gasometria Arterial', category: 'Diagnóstico Laboratorial', price_low: 50, price_high: 120 },
  { id: 'lab-6', name: 'Teste Rápido 4Dx (Ehrlichia/Dirofilaria/Lyme/Anaplasma)', category: 'Diagnóstico Laboratorial', price_low: 80, price_high: 150 },
  { id: 'lab-7', name: 'T4 Total', category: 'Diagnóstico Laboratorial', price_low: 40, price_high: 100 },
  { id: 'lab-8', name: 'Cortisol Basal', category: 'Diagnóstico Laboratorial', price_low: 50, price_high: 120 },
  { id: 'lab-9', name: 'Citologia', category: 'Diagnóstico Laboratorial', price_low: 60, price_high: 150 },
  { id: 'lab-10', name: 'Cultura e Antibiograma', category: 'Diagnóstico Laboratorial', price_low: 80, price_high: 200 },
  { id: 'lab-11', name: 'Teste FIV/FeLV (gatos)', category: 'Diagnóstico Laboratorial', price_low: 60, price_high: 120 },
  { id: 'lab-12', name: 'Procalcitonina/PCR', category: 'Diagnóstico Laboratorial', price_low: 70, price_high: 160 },

  // Diagnóstico por Imagem
  { id: 'img-1', name: 'Radiografia (2 projeções)', category: 'Diagnóstico por Imagem', price_low: 100, price_high: 250 },
  { id: 'img-2', name: 'Ultrassonografia Abdominal', category: 'Diagnóstico por Imagem', price_low: 150, price_high: 350 },
  { id: 'img-3', name: 'Ecocardiograma', category: 'Diagnóstico por Imagem', price_low: 200, price_high: 450 },
  { id: 'img-4', name: 'FAST Ultrasound (Emergência)', category: 'Diagnóstico por Imagem', price_low: 80, price_high: 200 },
  { id: 'img-5', name: 'Tomografia Computadorizada', category: 'Diagnóstico por Imagem', price_low: 500, price_high: 1500 },

  // Cirurgia
  { id: 'surg-1', name: 'Castração (Cão macho)', category: 'Cirurgia', price_low: 200, price_high: 500 },
  { id: 'surg-2', name: 'OVH (Cão fêmea)', category: 'Cirurgia', price_low: 300, price_high: 700 },
  { id: 'surg-3', name: 'Cirurgia Corpo Estranho GI', category: 'Cirurgia', price_low: 1500, price_high: 4000 },
  { id: 'surg-4', name: 'Reparo Lacerações', category: 'Cirurgia', price_low: 200, price_high: 800 },
  { id: 'surg-5', name: 'Cistotomia', category: 'Cirurgia', price_low: 1000, price_high: 3000 },

  // Hospitalização
  { id: 'hosp-1', name: 'Diária UTI', category: 'Hospitalização', price_low: 200, price_high: 600 },
  { id: 'hosp-2', name: 'Diária Internação', category: 'Hospitalização', price_low: 100, price_high: 300 },
  { id: 'hosp-3', name: 'Monitoração Contínua (12h)', category: 'Hospitalização', price_low: 150, price_high: 400 },

  // Emergência
  { id: 'emer-1', name: 'Estabilização Emergência', category: 'Emergência', price_low: 200, price_high: 500 },
  { id: 'emer-2', name: 'Acesso Venoso + Fluidoterapia', category: 'Emergência', price_low: 80, price_high: 200 },
  { id: 'emer-3', name: 'Oxigenoterapia', category: 'Emergência', price_low: 50, price_high: 150 },
  { id: 'emer-4', name: 'Transfusão Sanguínea', category: 'Emergência', price_low: 300, price_high: 800 },
  { id: 'emer-5', name: 'Ressuscitação Cardiopulmonar', category: 'Emergência', price_low: 300, price_high: 700 },

  // Procedimentos
  { id: 'proc-1', name: 'Sondagem Uretral', category: 'Procedimentos', price_low: 100, price_high: 300 },
  { id: 'proc-2', name: 'Lavagem Gástrica', category: 'Procedimentos', price_low: 150, price_high: 400 },
  { id: 'proc-3', name: 'Drenagem Torácica', category: 'Procedimentos', price_low: 200, price_high: 500 },
  { id: 'proc-4', name: 'Abdominocentese', category: 'Procedimentos', price_low: 100, price_high: 300 },
  { id: 'proc-5', name: 'Curativo/Bandagem', category: 'Procedimentos', price_low: 30, price_high: 100 },
];

// Legacy format for backward compatibility
export const ESTIMATE_SERVICES: EstimateCategory = {
  diagnostics: [
    { name: 'CBC/Chemistry Panel', low: 150, high: 250 },
    { name: 'PCV/TS/BG (Point of Care)', low: 45, high: 75 },
    { name: 'Urinalysis', low: 50, high: 80 },
    { name: 'Fecal Test', low: 35, high: 55 },
    { name: 'SNAP Test (Parvo/4Dx/FeLV-FIV)', low: 60, high: 95 },
    { name: 'Radiographs (2 views)', low: 200, high: 350 },
    { name: 'Radiographs (3 views)', low: 280, high: 450 },
    { name: 'Abdominal Ultrasound', low: 300, high: 500 },
    { name: 'AFAST/TFAST', low: 150, high: 250 },
    { name: 'ECG', low: 100, high: 175 },
    { name: 'Blood Pressure', low: 40, high: 65 },
    { name: 'Cytology', low: 80, high: 150 },
    { name: 'Culture & Sensitivity', low: 150, high: 250 },
    { name: 'Lactate', low: 35, high: 60 },
  ],
  procedures: [
    { name: 'Emergency Exam', low: 125, high: 175 },
    { name: 'IV Catheter Placement', low: 75, high: 125 },
    { name: 'IV Fluid Therapy (per day)', low: 100, high: 200 },
    { name: 'Oxygen Therapy (per hour)', low: 50, high: 100 },
    { name: 'Wound Care/Bandage', low: 100, high: 250 },
    { name: 'Thoracocentesis', low: 200, high: 400 },
    { name: 'Abdominocentesis', low: 150, high: 300 },
    { name: 'Gastric Decompression', low: 200, high: 400 },
    { name: 'Urinary Catheterization', low: 200, high: 350 },
    { name: 'Emesis Induction', low: 75, high: 125 },
    { name: 'Activated Charcoal Administration', low: 50, high: 100 },
    { name: 'Blood Transfusion', low: 400, high: 800 },
    { name: 'CPR', low: 300, high: 600 },
  ],
  surgery: [
    { name: 'Foreign Body Surgery (GI)', low: 2500, high: 5000 },
    { name: 'GDV Surgery (Gastropexy)', low: 4000, high: 7000 },
    { name: 'Laceration Repair', low: 300, high: 800 },
    { name: 'Abscess Drain/Flush', low: 200, high: 500 },
    { name: 'Emergency C-Section', low: 3000, high: 5500 },
    { name: 'Amputation', low: 2000, high: 4000 },
    { name: 'Splenectomy', low: 2500, high: 5000 },
  ],
  hospitalization: [
    { name: 'Hospitalization (per day)', low: 400, high: 800 },
    { name: 'ICU Care (per day)', low: 800, high: 1500 },
    { name: 'Monitoring (per shift)', low: 150, high: 300 },
    { name: 'Feeding Tube Placement', low: 200, high: 400 },
  ],
  medications: [
    { name: 'Injectable Medications (per dose)', low: 15, high: 75 },
    { name: 'Oral Medications (take-home)', low: 20, high: 60 },
    { name: 'Pain Management Package', low: 75, high: 150 },
    { name: 'Anti-nausea Package', low: 50, high: 100 },
    { name: 'Antibiotic Package', low: 40, high: 100 },
  ],
  endoflife: [
    { name: 'Euthanasia', low: 150, high: 300 },
    { name: 'Communal Cremation', low: 75, high: 150 },
    { name: 'Private Cremation', low: 200, high: 400 },
    { name: 'Paw Print/Clay Impression', low: 30, high: 50 },
  ],
};
