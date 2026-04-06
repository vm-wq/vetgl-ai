/**
 * VETGL Clinical Protocols
 * Extracted from Greenlight Pet ER standard operating procedures
 * Contains emergency protocols and quick action references
 */

export interface Protocol {
  id: string;
  name: string;
  description: string;
  content: string;
}

export interface QuickAction {
  text: string;
  icon: string;
  action: string;
}

export const DEFAULT_PROTOCOLS: Protocol[] = [
  {
    id: 'triage',
    name: 'Emergency Triage GLP',
    description: 'ABCDE assessment and rapid urgency classification.',
    content: `Primary Assessment:
A - Airway
B - Breathing
C - Circulation
D - Disability (neurological)
E - Exposure (additional injuries)

Urgency Classification:
1 - Immediate (life threatening)
2 - Urgent (next hours)
3 - Semi-urgent (next 24h)
4 - Non-urgent (elective)`,
  },
  {
    id: 'pain',
    name: 'Pain Protocol - Analgesia GLP',
    description: 'Multimodal approach with high-acceptance medications.',
    content: `Multimodal Analgesia:
- Propofol (90% acceptance)
- Buprenorphine/Methadone
- NSAIDs (universally accepted)
- Gabapentin (44% acceptance)
- Lidocaine (universally accepted)

Protocol: Combine opioids + NSAIDs + additional modalities as needed.`,
  },
  {
    id: 'gi',
    name: 'GI Emergency - Vomiting/Diarrhea',
    description: 'Cerenia, Omeprazole management and fluid support.',
    content: `GI Protocol:
- Cerenia/Maropitant 80.5% acceptance
- Omeprazole 85.7% acceptance
- IV Fluids (LRS - universally accepted)
- Monitoring: PCV, plasma protein
- Diet: NPO initially, then gradually
- Consider blood work + urinalysis`,
  },
  {
    id: 'toxin',
    name: 'Toxin/Foreign Body',
    description: 'Toxic exposure and foreign body protocol.',
    content: `Toxin:
- Activated Charcoal (universally accepted)
- Decontamination
- Symptomatic support

Foreign Body:
- Imaging (50% acceptance)
- Consider surgery if obstruction confirmed
- Surgery (20% acceptance)
- Perioperative support`,
  },
  {
    id: 'sedation',
    name: 'Emergency Sedation/Anesthesia',
    description: 'Propofol, Alfaxalone protocols and airway management.',
    content: `Sedation/Anesthesia:
- Propofol 90% acceptance (universally accepted)
- Alfaxalone (universally accepted)
- Monitoring: ECG, SPO2, ETCO2, BP
- Airway: equipment ready
- Reversal: flumazenil if needed
- Recovery: quiet environment`,
  },
  {
    id: 'compassionate',
    name: 'Compassionate Care & Financial',
    description:
      'Humanitarian care for critically ill patients with financial limitations.',
    content: `COMPASSIONATE CARE SOP:
- Emergency stabilization BEFORE financial discussion
- Services: PCV, BG, IV Catheter, Fluids, Analgesia, O2, BP, AFAST/TFAST
- If owner cannot pay: offer humane euthanasia + cremation
- 10% discount on total bill
- ALWAYS approach with empathy`,
  },
  {
    id: 'emergencysigns',
    name: 'Emergency Signs Identification',
    description: 'Quick identification of critical signs in dogs and cats.',
    content: `EMERGENCY SIGNS:

DOGS:
- Respiratory distress
- Severe bleeding
- Seizures
- Distended abdomen
- Pale gums
- Not eating 24h+

CATS:
- Open-mouth breathing (ALWAYS emergency)
- Straining to urinate (esp. males)
- Sudden hind limb paralysis
- Not eating 24h+`,
  },
  {
    id: 'continuous',
    name: 'Greenlight Continuous Evaluation',
    description: 'Weekly self-evaluation program for clinical team.',
    content: `GREENLIGHT EVALUATION PROGRAM:

9 Sections:
1. Operational Consistency
2. Technical Execution
3. Culture & Team
4. Client Experience
5. Record Quality
6. Equipment & Facilities
7. Financial Performance
8. Professional Development
9. Overall Assessment`,
  },
  {
    id: 'gdv',
    name: 'GDV - Bloat Recognition & Stabilization',
    description: 'GDV/Bloat recognition and stabilization (Dr. Joni Shimp, CVMMP).',
    content: `GDV RECOGNITION & STABILIZATION:

RED FLAGS:
- Distended, tense abdomen
- Unproductive retching
- Excessive salivation
- Restlessness/discomfort
- Tachycardia, weak pulse
- Pale mucous membranes

DIAGNOSIS:
- Trocarization vs Radiographs
- Right lateral RX: "double bubble" sign

STABILIZATION:
- Bilateral IV access
- Aggressive IV fluids (LRS shock bolus)
- Gastric decompression (orogastric tube or trocarization)
- Monitor ECG (arrhythmias common)
- Analgesia: Methadone or Butorphanol

SURGERY:
- Confirmed GDV = urgent surgery
- Stabilize BEFORE transfer
- Never attempt de-rotation without surgery`,
  },
  {
    id: 'toxintriage',
    name: 'Toxin Triage - First 15 Minutes',
    description:
      'Toxin exposure protocol in first 15 min (Dr. Joni Shimp, CVMMP).',
    content: `TOXIN TRIAGE - FIRST 15 MINUTES:

COMMON TOXINS:
- Grapes/Raisins: nephrotoxic
- Xylitol: hypoglycemia + hepatotoxicity
- Chocolate: theobromine (cardiotoxic)
- Rodenticides: anticoagulants or bromethalin
- Lily (cats): fulminant nephrotoxicity
- Cannabis/THC: CNS depression
- Human NSAIDs: GI + renal

EMESIS:
- Within 1-2h of ingestion
- Conscious and alert patient
- Apomorphine (dogs): 0.03-0.04 mg/kg IV
- H2O2 3% (dogs): 1-2 mL/kg PO
- DO NOT induce: corrosives, hydrocarbons, depressed patient
- CATS: Dexmedetomidine 7 mcg/kg IM alternative

ANTIDOTES:
- Activated Charcoal (universal)
- Vitamin K1 (anticoagulant rodenticides)
- N-Acetylcysteine (acetaminophen)
- IV Lipid Emulsion (lipophilic toxins)
- Atropine (organophosphates)
- Ethanol/Fomepizole (ethylene glycol)`,
  },
  {
    id: 'respiratory',
    name: 'Respiratory Distress Protocol',
    description:
      'Respiratory distress assessment and management (Dr. Joni Shimp, CVMMP).',
    content: `RESPIRATORY DISTRESS:

DIFFERENTIATE:
- Upper airway: stridor, inspiratory effort
- Lower airway: wheezes, expiratory effort
- Pleural space: rapid shallow breathing, diminished sounds

IMMEDIATE APPROACH:
- Supplemental O2 BEFORE any manipulation
- Light sedation if stress worsens condition
- DO NOT lay in lateral recumbency if in distress
- Minimum stress = maximum survival

SEDATION + O2:
- Butorphanol 0.2 mg/kg IM
- O2 flow-by or mask
- If needed: Propofol for emergency intubation

PLEURAL:
- Emergency thoracocentesis for effusion/pneumothorax
- TFAST for rapid assessment`,
  },
  {
    id: 'blockedcat',
    name: 'Blocked Cat - FLUTD/Urethral Obstruction',
    description:
      'Blocked cat stabilization before catheterization (Dr. Joni Shimp, CVMMP).',
    content: `BLOCKED CAT - PRE-CATHETERIZATION STABILIZATION:

IDENTIFICATION:
- Male cat straining to urinate
- Vocalization, licking genitalia
- Large, tense bladder on palpation
- Lethargy, vomiting, anorexia

HYPERKALEMIA EMERGENCY:
- Immediate ECG: bradycardia? Peaked T waves?
- If K+ > 7 or ECG changes:
  * Calcium Gluconate 10%: 0.5-1 mL/kg slow IV
  * Regular Insulin 0.25 U/kg IV + 50% Dextrose
  * NaHCO3: 1 mEq/kg slow IV

FLUIDS:
- NaCl 0.9% (AVOID LRS if hyperkalemic!)
- Bolus: 10-20 mL/kg if dehydrated/shocked

DECOMPRESSION:
- Cystocentesis if bladder very distended
- Gentle, 22G needle`,
  },
  {
    id: 'seizures',
    name: 'Seizures - Emergency Management',
    description:
      'Seizure and status epilepticus management (Dr. Joni Shimp, CVMMP).',
    content: `SEIZURES - EMERGENCY MANAGEMENT:

DIFFERENTIATE:
- First seizure vs Status epilepticus
- Status = seizure > 5 min or multiple without recovery

PROTOCOL:
1. Diazepam 0.5-1 mg/kg IV (or per rectum)
2. If no response in 5 min: repeat diazepam
3. If persists: Midazolam 0.2-0.3 mg/kg IM/IV
4. Refractory: Levetiracetam (Keppra) 20-60 mg/kg IV
5. Last resort: Propofol CRI 0.1-0.6 mg/kg/min

MONITOR:
- Temperature (hyperthermia common)
- Glucose (hypoglycemia can cause seizures)
- Electrolytes
- Intracranial pressure

ICP MANAGEMENT:
- Head elevated 15-30°
- Mannitol 0.5-1 g/kg IV over 15-20 min
- Avoid jugular for collection`,
  },
  {
    id: 'trauma',
    name: 'Trauma - ABCDE Protocol',
    description: 'ABCDE protocol for trauma cases (HBC, bite, fall).',
    content: `TRAUMA - EXPANDED ABCDE:

A - AIRWAY: Check obstruction, intubate if needed, emergency tracheostomy
B - BREATHING: Auscultate all lung fields, thoracocentesis if pneumothorax, O2
C - CIRCULATION: Bilateral IV, shock fluids LRS 60-90 mL/kg/h dogs 40-60 cats, PCV/TS q30min, AFAST
D - DISABILITY: Consciousness level, pupillary reflex, spinal reflexes
E - EXPOSURE: Full skin exam, open wounds, exposed fractures, splinting

STABILIZATION:
- Robert Jones bandage for limb fractures
- Direct compression for external hemorrhage
- DO NOT remove penetrating objects in the field`,
  },
  {
    id: 'dka',
    name: 'DKA & Diabetic Crises',
    description:
      'Diabetic ketoacidosis and hypoglycemia management (Dr. Joni Shimp, CVMMP).',
    content: `DIABETIC CRISES:

DKA:
- Signs: vomiting, dehydration, Kussmaul breathing, ketotic breath
- Glucose usually > 300 mg/dL
- Positive ketonuria/ketonemia

FLUID PROTOCOL:
- NaCl 0.9% fluid of choice
- Correct dehydration over 12-24h
- Supplement K+ (hypokalemia common!)
- Add dextrose when glucose < 250

INSULIN:
- Regular Insulin CRI: 0.05-0.1 U/kg/h
- Monitor glucose q1-2h
- Reduce rate as glucose falls
- Transition to long-acting when stable

HYPOGLYCEMIA:
- Glucose < 60 mg/dL = emergency
- Diluted 50% Dextrose: 0.5-1 mL/kg IV
- If no IV: honey/syrup on gums
- Investigate: insulinoma, sepsis, hepatic failure`,
  },
  {
    id: 'hge',
    name: 'HGE vs Parvo - Differentiation & Treatment',
    description:
      'Hemorrhagic gastroenteritis vs Parvo differentiation and management.',
    content: `HGE vs PARVO:

DIFFERENTIATION:
- Parvo: unvaccinated puppy, leukopenia, SNAP+
- HGE: adult, elevated PCV (>55%), "raspberry jam"

RAPID TESTS:
- SNAP Parvo test
- PCV/TS (HGE: high PCV with low protein)
- CBC (Parvo: lymphopenia/neutropenia)

HGE TREATMENT:
- Aggressive IV fluids
- Cerenia (Maropitant) 1 mg/kg IV SID
- Omeprazole 1 mg/kg IV BID
- Ampicillin 22 mg/kg IV TID if fever

PARVO TREATMENT:
- ISOLATION! Highly contagious
- IV fluids (LRS + KCl + Dextrose)
- Cerenia + Ampicillin + Enrofloxacin
- Early nutritional support`,
  },
  {
    id: 'stabilize',
    name: 'Stabilize & Ship',
    description: 'When and how to stabilize and transfer to referral hospital.',
    content: `STABILIZE & SHIP:

1. IV access (catheter)
2. Resuscitation fluids if needed
3. Analgesia (NEVER ship in pain)
4. Supplemental O2 if in distress
5. Splinting/bandaging if trauma
6. Document all treatments

PRIORITY DIAGNOSTICS:
- PCV/TS/Glucose/BUN
- AFAST/TFAST if available
- ECG if arrhythmia suspected

COMMUNICATION:
- Call receiving hospital BEFORE transfer
- Inform: species, complaint, treatments, vitals
- Send records/results
- Estimated arrival time`,
  },
  {
    id: 'collapse',
    name: 'Acute Collapse',
    description:
      'Neurological, cardiac, and hypovolemic collapse differentiation.',
    content: `ACUTE COLLAPSE:

NEUROLOGICAL: Seizures, ataxia, head tilt, abnormal reflexes
CARDIAC: Arrhythmia, new murmur, pale/cyanotic, weak pulse
HYPOVOLEMIC: Hemorrhage, severe dehydration, tachycardia, CRT > 2s

POINT-OF-CARE DIAGNOSTICS:
- Glucose (hypoglycemia = immediately treatable)
- Lactate (perfusion)
- PCV/TS (anemia/hemorrhage)
- ECG
- AFAST: "belly tap changes everything"

IMMEDIATE:
- Supplemental O2
- IV access
- Fluids if hypovolemic
- NOT aggressive fluids if cardiac
- Treat specific cause identified`,
  },
  {
    id: 'fast',
    name: 'FAST Ultrasound - Rapid Protocol',
    description: 'Veterinary FAST protocol for abdominal and thoracic assessment.',
    content: `FAST ULTRASOUND:

AFAST (Abdominal) - 4 scan points:
1. Diaphragmatic-hepatic (DH)
2. Spleno-renal (SR)
3. Cysto-colic (CC)
4. Hepato-renal (HR)

TFAST (Thoracic):
- Bilateral assessment
- Pleural effusion
- Pneumothorax: absence of "glide sign"
- Pericardial effusion

INTERPRETATION:
- Free fluid = potential surgical emergency
- Quantify: small/moderate/large volume
- Serial: repeat q30 min if unstable`,
  },
  {
    id: 'ivaccess',
    name: 'Venous Access & Fluid Therapy',
    description: 'Venous access techniques and fluid management.',
    content: `VENOUS ACCESS & FLUID THERAPY:

PERIPHERAL: Cephalic (most common), Lateral saphenous, Auricular (emergency)
CENTRAL: Jugular for CRI, PVC monitoring

FLUID RATES:
- Shock dogs: 60-90 mL/kg/h (give in 1/4 boluses)
- Shock cats: 40-60 mL/kg/h
- Maintenance: 2-3 mL/kg/h

FLUID TYPES:
- LRS: choice for majority
- NaCl 0.9%: hyperkalemia, DKA
- Colloids: low albumin, large losses
- Dextrose 2.5-5%: hypoglycemia

INFUSION PUMPS:
- Always use for medication CRI
- Calculate rate: volume/time
- Monitor: weight, RR, hydration`,
  },
  {
    id: 'anesthesia',
    name: 'Anesthesia & Monitoring',
    description: 'Anesthetic protocols and surgical patient monitoring.',
    content: `ANESTHESIA & MONITORING:

PRE-ANESTHETIC:
- Butorphanol 0.2-0.4 mg/kg IM + Dexmedetomidine 2-5 mcg/kg IM
- Methadone 0.3-0.5 mg/kg IM (moderate-severe pain)
- Gabapentin 10-20 mg/kg PO (2h before)

INDUCTION:
- Propofol 4-6 mg/kg IV (90% acceptance)
- Alfaxalone 2-3 mg/kg IV
- Titrate to effect!

INTUBATION:
- Dogs: laryngoscope, visualize epiglottis
- Cats: CAUTION laryngospasm, use topical lidocaine
- Confirm: capnography

MONITORING:
- Continuous ECG, SpO2 > 95%, ETCO2 35-45, MAP > 60, Temperature

COMPLICATIONS:
- Hypotension: fluids + ephedrine
- Bradycardia: atropine 0.02-0.04 mg/kg IV
- Hypothermia: active warming`,
  },
  {
    id: 'cpr',
    name: 'CPR & RECOVER',
    description: 'CPR checklist and RECOVER resuscitation protocol.',
    content: `CPR & RECOVER:

CRASH CART: ET tubes, laryngoscope, epinephrine 1:1000, atropine, vasopressin, Ambu bag, defibrillator

PROTOCOL: C-A-B
- Compressions 100-120/min
- Ventilation 10 breaths/min
- 2-min uninterrupted cycles

DRUGS:
- Epinephrine: 0.01 mg/kg IV q3-5min
- Atropine: 0.04 mg/kg IV (bradycardia/asystole)
- Vasopressin: 0.8 U/kg IV

WHEN TO STOP:
- ROSC = success
- No response after 20 min = poor prognosis
- Communicate with owner during process`,
  },
  {
    id: 'painmgmt',
    name: 'Pain Management - Emergency Analgesia',
    description: 'Multimodal pain management in veterinary emergencies.',
    content: `PAIN MANAGEMENT:

ASSESSMENT: Glasgow Scale (dogs) / Grimace Scale (cats)

FIRST LINE:
- Butorphanol 0.2-0.4 mg/kg IV/IM (rapid)
- Buprenorphine 0.02 mg/kg IV/IM
- Methadone 0.3-0.5 mg/kg IM

SECOND LINE:
- NSAIDs (if no renal/GI contraindication)
- Gabapentin 10-20 mg/kg PO BID

LOCAL:
- Lidocaine blocks, splash blocks

CRI:
- Fentanyl 2-5 mcg/kg/h
- Lidocaine CRI (dogs only): 25-50 mcg/kg/min
- Ketamine CRI: 2-10 mcg/kg/min

MULTIMODAL: Combine opioids + NSAIDs + local + gabapentin`,
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  { text: 'Seizure', icon: '⚡', action: 'seizure' },
  { text: 'Blocked Cat', icon: '🐱', action: 'flutd' },
  { text: 'Trauma ABCDE', icon: '🚨', action: 'trauma' },
  { text: 'GDV / Bloat', icon: '🔴', action: 'gdv' },
  { text: 'Resp. Distress', icon: '💨', action: 'respiratory' },
  { text: 'Toxin', icon: '☠️', action: 'poison' },
  { text: 'Collapse', icon: '⬇️', action: 'collapse' },
  { text: 'DKA', icon: '💉', action: 'dka' },
  { text: 'HGE vs Parvo', icon: '🦠', action: 'hge' },
  { text: 'CPR', icon: '❤️', action: 'cpr' },
  { text: 'Pain', icon: '💊', action: 'pain' },
  { text: 'Bleeding', icon: '🩸', action: 'bleeding' },
];

/**
 * Get a protocol by ID
 */
export function getProtocolById(id: string): Protocol | undefined {
  return DEFAULT_PROTOCOLS.find((p) => p.id === id);
}

/**
 * Search protocols by name or description
 */
export function searchProtocols(query: string): Protocol[] {
  const lowerQuery = query.toLowerCase();
  return DEFAULT_PROTOCOLS.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get a quick action by action ID
 */
export function getQuickActionById(action: string): QuickAction | undefined {
  return QUICK_ACTIONS.find((qa) => qa.action === action);
}

export default {
  DEFAULT_PROTOCOLS,
  QUICK_ACTIONS,
  getProtocolById,
  searchProtocols,
  getQuickActionById,
};
