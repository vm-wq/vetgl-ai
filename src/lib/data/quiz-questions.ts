export interface QuizQuestion {
  id: string;
  specialty: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  points: number;
  tags?: string[];
}

export const quizQuestions: QuizQuestion[] = [
  // ============ EMERGÊNCIA (30 questions) ============

  // Easy questions
  {
    id: 'emergency-1',
    specialty: 'Emergência',
    difficulty: 'easy',
    question:
      'Um cão apresenta dispneia severa. Qual é o primeiro passo no atendimento?',
    options: [
      'Radiografia de tórax imediata',
      'Oxigenação e estabilização da via aérea',
      'Sedação para diminuir a ansiedade',
      'Tratamento com antibióticos',
    ],
    correct: 1,
    explanation:
      'A sequência ABCDE começa com Airway (vias aéreas). Oxigenação e estabilização são prioritárias antes de diagnóstico.',
    points: 5,
  },
  {
    id: 'emergency-2',
    specialty: 'Emergência',
    difficulty: 'easy',
    question: 'Um gato está com frequência cardíaca de 220 bpm. Qual é o valor normal?',
    options: [
      '60-140 bpm',
      '140-220 bpm',
      '220-300 bpm',
      '>300 bpm',
    ],
    correct: 1,
    explanation: 'Frequência cardíaca normal em gatos é 140-220 bpm. Valores acima podem indicar taquicardia patológica.',
    points: 5,
  },
  {
    id: 'emergency-3',
    specialty: 'Emergência',
    difficulty: 'easy',
    question: 'Qual é o tempo de enchimento capilar (TPC) normal em cães?',
    options: [
      '<1 segundo',
      '1-2 segundos',
      '3-4 segundos',
      '>4 segundos',
    ],
    correct: 1,
    explanation: 'TPC normal é <2 segundos. TPC >2 segundos sugere perfusão inadequada e possível choque.',
    points: 5,
  },
  {
    id: 'emergency-4',
    specialty: 'Emergência',
    difficulty: 'easy',
    question: 'Um cão está em choque. Qual é o primeiro volume de fluido IV para GDV?',
    options: [
      '10 mL/kg',
      '30 mL/kg',
      '90 mL/kg',
      '150 mL/kg',
    ],
    correct: 2,
    explanation: 'Volume de choque em cão é 90 mL/kg. Dar ¼ em 15 minutos, repetir se necessário.',
    points: 5,
  },
  {
    id: 'emergency-5',
    specialty: 'Emergência',
    difficulty: 'easy',
    question: 'Um gato com frequência respiratória de 60/min está com qual problema?',
    options: [
      'Normal',
      'Taquipneia leve',
      'Taquipneia grave',
      'Apneia',
    ],
    correct: 2,
    explanation: 'FR normal em gatos é 20-40/min. FR >40 é taquipneia; >60 é taquipneia grave/respiratória.',
    points: 5,
  },

  // Medium questions
  {
    id: 'emergency-6',
    specialty: 'Emergência',
    difficulty: 'medium',
    question:
      'Um cão de 45kg apresenta sinais de dilatação-torção gástrica (GDV). Qual é o dose de epinefrina IV durante PCR?',
    options: [
      '0.01 mg/kg (0.45 mg)',
      '0.05 mg/kg (2.25 mg)',
      '0.1 mg/kg (4.5 mg)',
      '0.2 mg/kg (9 mg)',
    ],
    correct: 0,
    explanation: 'Dose de epinefrina é 0.01 mg/kg IV, repetida a cada 3-5 min durante PCR.',
    points: 10,
  },
  {
    id: 'emergency-7',
    specialty: 'Emergência',
    difficulty: 'medium',
    question:
      'Um cão foi exposto a anticoagulante rodenticida. Qual é o tratamento apropriado?',
    options: [
      'Vitamina K1 oral a 2.5 mg/kg BID durante 3-4 semanas',
      'Vitamina K2 intravenosa urgente',
      'Plasma fresco congelado como tratamento único',
      'Apenas monitoramento sem tratamento',
    ],
    correct: 0,
    explanation:
      'Vitamina K1 (fitomenadiona) é o tratamento padrão: 2.5-5 mg/kg BID durante 3-4 semanas com recheck PT.',
    points: 10,
  },
  {
    id: 'emergency-8',
    specialty: 'Emergência',
    difficulty: 'medium',
    question:
      'Um gato em parada cardiorrespiratória. A frequência de compressões torácicas recomendada é:',
    options: [
      '80-100 compressões/minuto',
      '100-120 compressões/minuto',
      '120-140 compressões/minuto',
      '140-160 compressões/minuto',
    ],
    correct: 2,
    explanation:
      'Frequência de compressões recomendada para gatos é 120-140 compressões/minuto com razão 30:2 (compressões:ventilações).',
    points: 10,
  },
  {
    id: 'emergency-9',
    specialty: 'Emergência',
    difficulty: 'medium',
    question:
      'Um cão apresenta priapismo após desintoxicação de cocaína. Qual medicação reduz a vasoconstrição?',
    options: [
      'Epinefrina',
      'Efedrina',
      'Xilazina',
      'Fentanil',
    ],
    correct: 2,
    explanation:
      'Xilazina (alfa-2 agonista) causa vasodilatação e reduz priapismo. Trata tanto agitação quanto vasoconstrição.',
    points: 10,
  },
  {
    id: 'emergency-10',
    specialty: 'Emergência',
    difficulty: 'medium',
    question:
      'Um cão em choque apresenta mucosas pálidas, TPC >3s e FC 160. Qual é a classificação de choque?',
    options: [
      'Choque hipovolêmico',
      'Choque cardiogênico',
      'Choque distributivo/séptico',
      'Choque obstrutivo',
    ],
    correct: 0,
    explanation:
      'Mucosas pálidas e TPC prolongado indicam choque hipovolêmico (perfusão periférica baixa). Taquicardia é compensatória.',
    points: 10,
  },

  // Hard questions
  {
    id: 'emergency-11',
    specialty: 'Emergência',
    difficulty: 'hard',
    question:
      'Um cão de 30kg em choque séptico está recebendo dopamina 10 mcg/kg/min. Qual é a taxa em mL/hr usando solução 800 mcg/mL?',
    options: [
      '2.25 mL/hr',
      '4.5 mL/hr',
      '9 mL/hr',
      '22.5 mL/hr',
    ],
    correct: 3,
    explanation:
      'Dose total: 30kg × 10 mcg/kg/min = 300 mcg/min. Concentração: 800 mcg/mL = 0.8 mg/mL. Taxa: 300 mcg/min ÷ 800 mcg/mL × 60 = 22.5 mL/hr',
    points: 20,
  },
  {
    id: 'emergency-12',
    specialty: 'Emergência',
    difficulty: 'hard',
    question:
      'Um gato apresenta toxemia uremática com pH 7.15 (acidose). Qual é a dose apropriada de bicarbonato de sódio?',
    options: [
      '0.3 mEq/kg IV',
      '0.5 mEq/kg IV',
      '1 mEq/kg IV',
      '2 mEq/kg IV',
    ],
    correct: 1,
    explanation:
      'Dose inicial: 0.5-1 mEq/kg IV. Usar apenas após ventilação adequada. Risco de iatrógena alcalose.',
    points: 20,
  },
  {
    id: 'emergency-13',
    specialty: 'Emergência',
    difficulty: 'hard',
    question:
      'Um cão recebe mannitol 1 g/kg IV para edema cerebral. Qual é o mecanismo de ação correto?',
    options: [
      'Reduz pressão arterial',
      'Inibe prostaglandinas',
      'Diurese osmótica (gradiente osmótico)',
      'Bloqueio de canais de cálcio',
    ],
    correct: 2,
    explanation:
      'Mannitol cria gradiente osmótico que puxa água do espaço intersticial para o intravascular, reduzindo ICP.',
    points: 20,
  },
  {
    id: 'emergency-14',
    specialty: 'Emergência',
    difficulty: 'hard',
    question:
      'Durante PCR, a lidocaína IV é administrada para qual tipo de arritmia?',
    options: [
      'Bradicardia',
      'Fibrilação atrial',
      'Fibrilação ventricular',
      'Bloqueio AV 2º grau',
    ],
    correct: 2,
    explanation:
      'Lidocaína é antiarrítmico de classe IB, eficaz para fibrilação/taquicardia ventricular. Dose: 1-2 mg/kg IV bolus.',
    points: 20,
  },
  {
    id: 'emergency-15',
    specialty: 'Emergência',
    difficulty: 'hard',
    question:
      'Um cão em choque anafilático recebe epinefrina. Qual é a via de eleição e concentração?',
    options: [
      'IV 1:10000 (0.1 mg/mL)',
      'IM 1:1000 (1 mg/mL)',
      'SC 1:1000 (1 mg/mL)',
      'Retal 1:100 (10 mg/mL)',
    ],
    correct: 1,
    explanation:
      'Via IM é preferida em anafilaxia (absorção mais confiável). Usar 1:1000 (1 mg/mL). Dose: 0.01 mg/kg IM.',
    points: 20,
  },

  // ============ MEDICINA INTERNA (30 questions) ============

  {
    id: 'internal-1',
    specialty: 'Medicina Interna',
    difficulty: 'easy',
    question:
      'Um gato de 4 anos apresenta poliúria, polidipsia e perda de peso. Qual é o diagnóstico provável?',
    options: [
      'Hipertireoidismo',
      'Diabetes mellitus',
      'Doença renal crônica',
      'Pancreatite',
    ],
    correct: 1,
    explanation:
      'Diabetes mellitus é comum em gatos idosos. Sinais clássicos: poliúria, polidipsia, perda de peso, glicemia >200 mg/dL.',
    points: 5,
  },
  {
    id: 'internal-2',
    specialty: 'Medicina Interna',
    difficulty: 'easy',
    question:
      'Qual é a dose inicial recomendada de levotiroxina (L-T4) em cães com hipotireoidismo?',
    options: [
      '0.01 mg/kg SID',
      '0.02 mg/kg SID',
      '0.05 mg/kg SID',
      '0.1 mg/kg BID',
    ],
    correct: 1,
    explanation:
      'Dose inicial: 0.02 mg/kg SID (≈22 mcg/kg). Reajustar em 6-8 semanas baseado em TSH/T4 livre.',
    points: 5,
  },
  {
    id: 'internal-3',
    specialty: 'Medicina Interna',
    difficulty: 'easy',
    question:
      'Um cão com insuficiência renal crônica (IRRC) apresenta hiperfosfatemia. Qual é o alvo de fósforo sérico?',
    options: [
      '< 3.0 mg/dL',
      '3.0-4.5 mg/dL',
      '4.5-6.0 mg/dL',
      '> 6.0 mg/dL',
    ],
    correct: 1,
    explanation:
      'Alvo: 3.0-4.5 mg/dL em IRRC estágio 3-4. Hiperfosfatemia acelera progressão renal.',
    points: 5,
  },
  {
    id: 'internal-4',
    specialty: 'Medicina Interna',
    difficulty: 'easy',
    question:
      'Qual valor de hemoglobina em um cão indica anemia moderada?',
    options: [
      '<6 g/dL',
      '6-8 g/dL',
      '8-12 g/dL',
      '>12 g/dL',
    ],
    correct: 2,
    explanation:
      'Hemoglobina normal: 12-18 g/dL em cão. Anemia leve: 10-12, moderada: 8-10, severa: <8 g/dL.',
    points: 5,
  },
  {
    id: 'internal-5',
    specialty: 'Medicina Interna',
    difficulty: 'easy',
    question:
      'Um gato apresenta icterícia. Qual órgão frequentemente está afetado?',
    options: [
      'Pulmão',
      'Fígado',
      'Rim',
      'Coração',
    ],
    correct: 1,
    explanation:
      'Icterícia indica hiperbilirrubinemia (>3 mg/dL). Causas: hemólise, hepatopatia, colestase extrahepática.',
    points: 5,
  },

  {
    id: 'internal-6',
    specialty: 'Medicina Interna',
    difficulty: 'medium',
    question:
      'Um cão apresenta PCR total <100/uL com tremores musculares. Qual é o diagnóstico diferencial primário?',
    options: [
      'Trombocitose',
      'Leucemia',
      'Trombocitopenia imunomediada',
      'Reação ao medicamento',
    ],
    correct: 2,
    explanation:
      'PCR <100/uL é trombocitopenia severa. Tremores sugerem hemorragia cerebral. IMTP é causa comum idiopática.',
    points: 10,
  },
  {
    id: 'internal-7',
    specialty: 'Medicina Interna',
    difficulty: 'medium',
    question:
      'Um gato com hipertireoidismo apresenta pressão arterial sistólica de 180 mmHg. Qual é o próximo passo?',
    options: [
      'Iniciar metimazol apenas',
      'Avaliar rim e oftalmologia; considerar amlodipina',
      'Transfusão de sangue',
      'Radioiodo apenas',
    ],
    correct: 1,
    explanation:
      'Hipertireoidismo causa hipertensão. Risco de hipertensão renovascular renal e retinopatia hipertensiva. Amlodipina reduz PA.',
    points: 10,
  },
  {
    id: 'internal-8',
    specialty: 'Medicina Interna',
    difficulty: 'medium',
    question:
      'Um cão apresenta albumina sérica 2.0 g/dL (baixa) e edema periférico. Qual é a causa provável?',
    options: [
      'Hiperalbuminemia',
      'Desnutrição',
      'Perdas GI ou renais (síndrome nefrótica)',
      'Hiperviscosidade',
    ],
    correct: 2,
    explanation:
      'Albumina <2.5 g/dL com edema sugere síndrome nefrótica (perda de proteína na urina) ou enteropatia proteica.',
    points: 10,
  },
  {
    id: 'internal-9',
    specialty: 'Medicina Interna',
    difficulty: 'medium',
    question:
      'Um gato com pancreatite apresenta lipase sérica elevada. Qual achado ultrassonográfico é específico?',
    options: [
      'Pâncreas hiperecóico',
      'Pâncreas isoecóico com liquefação',
      'Hepatomegalia',
      'Espessamento de parede duodenal',
    ],
    correct: 1,
    explanation:
      'Pancreatite: pâncreas edemaciado (isoecóico a hipoecóico), possível liquefação. Ultrassom é moderadamente sensível.',
    points: 10,
  },
  {
    id: 'internal-10',
    specialty: 'Medicina Interna',
    difficulty: 'medium',
    question:
      'Um cão em insuficiência cardíaca congestiva recebe furosemida e tosse. O que significa isso?',
    options: [
      'Dose de furosemida está adequada',
      'Infecção respiratória secundária',
      'Edema pulmonar não controlado',
      'Reação alérgica ao medicamento',
    ],
    correct: 2,
    explanation:
      'Tosse persistente em ICC sugere edema pulmonar em progressão. Aumentar diurético ou adicionar segundo agente (ex: enalapril).',
    points: 10,
  },

  {
    id: 'internal-11',
    specialty: 'Medicina Interna',
    difficulty: 'hard',
    question:
      'Um cão com DRC estágio 4 apresenta potássio de 5.8 mEq/L e ureia 120 mg/dL. Qual é a medida mais urgente?',
    options: [
      'Diálise peritoneal',
      'Gluconato de cálcio IV (antagonista de hipercalemia)',
      'Insulina + dextrose',
      'Furosemida de alta dose',
    ],
    correct: 1,
    explanation:
      'Hipercalemia com uremia → risco de arritmia cardíaca. Gluconato de cálcio estabiliza miocárdio (10-30 min). Depois tratar K com insulina/dextrose.',
    points: 20,
  },
  {
    id: 'internal-12',
    specialty: 'Medicina Interna',
    difficulty: 'hard',
    question:
      'Um gato apresenta hipertireoidismo com T4 livre 8.5 ng/dL (normal 1-4). Qual é o melhor tratamento?',
    options: [
      'Metimazol apenas',
      'Radioiodo ou cirurgia após controle com metimazol',
      'Betabloqueador apenas',
      'Propiltiouracil',
    ],
    correct: 1,
    explanation:
      'Metimazol controla sinais agudos. Radioiodo elimina tecido tiroideo. Cirurgia é alternativa. Betabloqueador trata síntomas mas não doença.',
    points: 20,
  },
  {
    id: 'internal-13',
    specialty: 'Medicina Interna',
    difficulty: 'hard',
    question:
      'Um cão com Doença de Addison apresenta Na 120 mEq/L (hiponatremia). Qual é o tratamento IV?',
    options: [
      'NaCl 0.9% em bolus rápido',
      'NaCl 3% lentamente (0.5 mEq/L/hr)',
      'D5W apenas',
      'Diálise peritoneal de emergência',
    ],
    correct: 1,
    explanation:
      'Hiponatremia grave (<120) requer correção lenta com 3% NaCl IV. Correção rápida causa convulsão. Além disso, usar desoxicorticosterona ou hidrocortisona.',
    points: 20,
  },
  {
    id: 'internal-14',
    specialty: 'Medicina Interna',
    difficulty: 'hard',
    question:
      'Um gato apresenta diabetes mellitus com cetonas na urina. Qual é a complicação?',
    options: [
      'Desidratação simples',
      'Cetoacidose diabética (DKA)',
      'Hipoglicemia',
      'Síndrome hiperosmolar',
    ],
    correct: 1,
    explanation:
      'DKA: hiperglicemia + cetonemia + acidose metabólica. Requer insulina IV, fluidos, eletrólitos. Emergência.',
    points: 20,
  },
  {
    id: 'internal-15',
    specialty: 'Medicina Interna',
    difficulty: 'hard',
    question:
      'Um cão com síndrome de Cushing apresenta albumina baixa, hiperglicemia e pressão elevada. Qual é o melhor diagnóstico?',
    options: [
      'Hipotireoidismo',
      'Diabetes mellitus type 2',
      'Hiperadenocorticismo (síndrome de Cushing)',
      'Neoplasia pancreática',
    ],
    correct: 2,
    explanation:
      'Cushing: poliúria, polidipsia, alopecia, abdome pendente, hiperglicemia, hipertensão. Cortisol elevado é diagnóstico.',
    points: 20,
  },

  // ============ CIRURGIA (25 questions) ============

  {
    id: 'surgery-1',
    specialty: 'Cirurgia',
    difficulty: 'easy',
    question:
      'Um cão apresenta fratura cominutiva de tíbia. Qual é a melhor opção de tratamento?',
    options: [
      'Imobilização com atadura',
      'Fixação interna com placa de compressão',
      'Fixador externo apenas',
      'Amputação',
    ],
    correct: 1,
    explanation:
      'Fraturas comunitivas requerem fixação interna com placa dinâmica para restaurar anatomia. Imobilização é inadequada.',
    points: 5,
  },
  {
    id: 'surgery-2',
    specialty: 'Cirurgia',
    difficulty: 'easy',
    question:
      'Qual é a profundidade correta para inserção de cateter epidural em cães (entre L6-L7)?',
    options: [
      '3-5 mm',
      '5-8 mm',
      '8-12 mm',
      '12-15 mm',
    ],
    correct: 2,
    explanation:
      'Profundidade: ≈8-12 mm em cão de tamanho médio. Usar técnica "loss of resistance".',
    points: 5,
  },
  {
    id: 'surgery-3',
    specialty: 'Cirurgia',
    difficulty: 'easy',
    question:
      'Em uma OSH (ovariosalpingohisterectomia), qual é a ligadura recomendada para vasos ovarianos?',
    options: [
      'Simples com fio absorvível 2-0',
      'Dupla com fio absorvível 3-0 ou 4-0',
      'Sem ligadura, cauterização apenas',
      'Tripla com fio não-absorvível',
    ],
    correct: 1,
    explanation:
      'Dupla ligadura com absorvível (3-0 ou 4-0) reduz hemorragia e granulomas estéreis.',
    points: 5,
  },
  {
    id: 'surgery-4',
    specialty: 'Cirurgia',
    difficulty: 'easy',
    question:
      'Qual é a complicação mais comum após artroplastia de quadril em cães?',
    options: [
      'Infecção profunda aguda',
      'Luxação recorrente',
      'Osteolise e soltura asséptica',
      'Rejeição do implante',
    ],
    correct: 2,
    explanation:
      'Osteolise e soltura asséptica são complicações comuns a longo prazo (10-20% em 5-10 anos).',
    points: 5,
  },
  {
    id: 'surgery-5',
    specialty: 'Cirurgia',
    difficulty: 'easy',
    question:
      'Durante toracotomia lateral, qual intercostal é melhor para acesso ao coração?',
    options: [
      '4ª intercostal',
      '5ª intercostal',
      '6ª intercostal',
      '7ª intercostal',
    ],
    correct: 1,
    explanation:
      '5ª intercostal é padrão para cirurgia cardíaca. Incisão na borda cranial da costela evita vasos/nervo.',
    points: 5,
  },

  {
    id: 'surgery-6',
    specialty: 'Cirurgia',
    difficulty: 'medium',
    question:
      'Um cão necessita de osteotomia pélvica para displasia coxofemoral. Qual é o ângulo femoroacetabular alvo?',
    options: [
      '<30 graus',
      '30-50 graus',
      '>50 graus',
      '>80 graus',
    ],
    correct: 1,
    explanation:
      'Ângulo normal: 30-50°. >50° indica displasia. Osteotomia mira restaurar cobertura acetabular.',
    points: 10,
  },
  {
    id: 'surgery-7',
    specialty: 'Cirurgia',
    difficulty: 'medium',
    question:
      'Um cão apresenta ligamento cruzado cranial (CCL) roto com instabilidade. Qual é a técnica de eleição?',
    options: [
      'Imobilização conservadora',
      'Osteotomia de nivelamento da tíbia (TPLO)',
      'Apenas repouso e fisioterapia',
      'Acupuntura',
    ],
    correct: 1,
    explanation:
      'TPLO é padrão-ouro para CCL roto em cães ativos. Reduz força de cisalhamento e restaura função.',
    points: 10,
  },
  {
    id: 'surgery-8',
    specialty: 'Cirurgia',
    difficulty: 'medium',
    question:
      'Um gato necessita de esofagostomia. Qual é o local de inserção da sonda?',
    options: [
      'Laringe',
      'Clavícula',
      'Cervical/torácico cranial',
      'Estômago',
    ],
    correct: 2,
    explanation:
      'Esofagostomia cervical: incisão no lado esquerdo do pescoço, sonda inserida no esôfago cervical/craniotorácico.',
    points: 10,
  },
  {
    id: 'surgery-9',
    specialty: 'Cirurgia',
    difficulty: 'medium',
    question:
      'Um cão apresenta hérnias abdominais múltiplas. Qual técnica garante melhor cicatrização?',
    options: [
      'Apenas sutura com fio não-absorvível',
      'Malha sintética absorvível',
      'Malha sintética não-absorvível em camadas',
      'Apenas correção fascial sem malha',
    ],
    correct: 2,
    explanation:
      'Malha sintética não-absorvível (polipropileno) em técnica de "tension-free repair" reduz recorrência.',
    points: 10,
  },
  {
    id: 'surgery-10',
    specialty: 'Cirurgia',
    difficulty: 'medium',
    question:
      'Um cão necessita de gastrectomia segmental para úlcera perfurada. Qual é a preocupação técnica?',
    options: [
      'Perdas de sangue mínimas',
      'Vascularização residual e anastomose segura',
      'Tamanho da incisão apenas',
      'Sem preocupações técnicas',
    ],
    correct: 1,
    explanation:
      'Gastrectomia requer preservar vascularização para cicatrização adequada. Anastomose gastrojejunal é padrão.',
    points: 10,
  },

  {
    id: 'surgery-11',
    specialty: 'Cirurgia',
    difficulty: 'hard',
    question:
      'Um cão com nefrolítiase renal necessita de nefrectomia. Qual é o risco pós-operatório primário?',
    options: [
      'Infecção incisional',
      'Insuficiência renal em rim residual único',
      'Hemorragia contínua',
      'Infecção urinária apenas',
    ],
    correct: 1,
    explanation:
      'Risco: função residual do rim contralateral. Se rim contralateral comprometido, nefrolitotomia é preferida.',
    points: 20,
  },
  {
    id: 'surgery-12',
    specialty: 'Cirurgia',
    difficulty: 'hard',
    question:
      'Um gato apresenta hérnia diafragmática com órgãos abdominais no tórax. Qual é a sequência de recuperação pós-op?',
    options: [
      'Retorno à atividade normal em 1 semana',
      'Repouso 6-8 semanas antes de atividade normal',
      'Fisioterapia intensiva imediata',
      'Sem restrição de atividade',
    ],
    correct: 1,
    explanation:
      'Pós-hérnia diafragmática: 6-8 semanas repouso para cicatrização muscular. Evitar atividade que aumente pressão abdominal.',
    points: 20,
  },
  {
    id: 'surgery-13',
    specialty: 'Cirurgia',
    difficulty: 'hard',
    question:
      'Um cão necessita de colecistectomia com colelitíase. Qual é a complicação mais temida imediatamente?',
    options: [
      'Inflamação da incisão',
      'Vazamento biliar pós-operatório',
      'Peritonite',
      'Colangiohepatite',
    ],
    correct: 2,
    explanation:
      'Vazamento biliar → peritonite bacteriana. Requer reoperação. Reparação cuidadosa de ducto biliar é crítica.',
    points: 20,
  },
  {
    id: 'surgery-14',
    specialty: 'Cirurgia',
    difficulty: 'hard',
    question:
      'Um cão com carcinoma de mama apresenta 3 tumores (2 na glândula cranial, 1 na caudal). Qual é a abordagem cirúrgica?',
    options: [
      'Mastectomia ipsilateral simples',
      'Mastectomia radical segmental',
      'Mastectomia ipsilateral total (2 glândulas)',
      'Quimioterapia apenas',
    ],
    correct: 2,
    explanation:
      'Tumores múltiplos em glândulas adjacentes: mastectomia ipsilateral total. Taxanos/quimioterapia adjuvante conforme estadiamento.',
    points: 20,
  },
  {
    id: 'surgery-15',
    specialty: 'Cirurgia',
    difficulty: 'hard',
    question:
      'Um cão com pancreatite aguda severa apresenta necrose. Qual é a indicação de descompressão/drenagem?',
    options: [
      'Todos os casos de pancreatite',
      'Pancreatite leve apenas',
      'Pancreatite aguda necrotizante com abcesso',
      'Nunca é necessário',
    ],
    correct: 2,
    explanation:
      'Pancreatite necrotizante com abcesso: drenagem + debridamento. Suporte clínico é primário em maioria dos casos.',
    points: 20,
  },

  // ============ FARMACOLOGIA (25 questions) ============

  {
    id: 'pharma-1',
    specialty: 'Farmacologia',
    difficulty: 'easy',
    question:
      'Um cão está em propranolol para taquicardia. Qual é a principal contraindicação relativa?',
    options: [
      'Diabetes mellitus',
      'Asma ou DPOC',
      'Hipertensão',
      'Esofagite',
    ],
    correct: 1,
    explanation:
      'Betabloqueadores não-seletivos como propranolol bloqueiam receptores beta-2 dos brônquios, causando broncoconstrição.',
    points: 5,
  },
  {
    id: 'pharma-2',
    specialty: 'Farmacologia',
    difficulty: 'easy',
    question:
      'Qual é a dose correta de amoxicilina-clavulanato para infecção em cão 20kg?',
    options: [
      '11-22 mg/kg BID',
      '22-33 mg/kg BID',
      '33-44 mg/kg TID',
      '44-55 mg/kg BID',
    ],
    correct: 0,
    explanation:
      'Amoxicilina-clavulanato: 11-22 mg/kg BID (dosagem baseada em amoxicilina).',
    points: 5,
  },
  {
    id: 'pharma-3',
    specialty: 'Farmacologia',
    difficulty: 'easy',
    question:
      'Qual AINE é contraindicado em cães com insuficiência renal?',
    options: [
      'Carprofen',
      'Meloxicam',
      'Firocoxib',
      'Todos os acima',
    ],
    correct: 3,
    explanation:
      'Todos os AINEs são potencialmente nefrotóxicos. Evitar em DRC; se necessário, monitorar creatinina.',
    points: 5,
  },
  {
    id: 'pharma-4',
    specialty: 'Farmacologia',
    difficulty: 'easy',
    question:
      'Um gato recebe prednisolona em alta dose. Qual efeito colateral é mais esperado?',
    options: [
      'Neutropenia',
      'Hiperglicemia',
      'Hipercalemia',
      'Trombocitopenia',
    ],
    correct: 1,
    explanation:
      'Corticosteroides causam hiperglicemia via aumento de gliconeogênese. Gatos são muito sensíveis.',
    points: 5,
  },
  {
    id: 'pharma-5',
    specialty: 'Farmacologia',
    difficulty: 'easy',
    question:
      'Qual é a duração máxima segura de fentanil transdérmico em cães?',
    options: [
      '24 horas',
      '48 horas',
      '72 horas',
      '7 dias',
    ],
    correct: 2,
    explanation:
      'Fentanil transdérmico deve ser substituído a cada 72 horas. Remover adesivo anterior antes do novo.',
    points: 5,
  },

  {
    id: 'pharma-6',
    specialty: 'Farmacologia',
    difficulty: 'medium',
    question:
      'Um cão com ICC recebe enalapril. Qual é o mecanismo de ação primário?',
    options: [
      'Bloqueio de canais de cálcio',
      'Inibição de ACE (reduz angiotensina II)',
      'Antagonismo de aldosterona',
      'Betabloqueio',
    ],
    correct: 1,
    explanation:
      'ACE inibidores reduzem produção de angiotensina II, diminuindo vasoconstrição e retenção de água/sódio.',
    points: 10,
  },
  {
    id: 'pharma-7',
    specialty: 'Farmacologia',
    difficulty: 'medium',
    question:
      'Um cão recebe doxiciclina. Qual é a precaução importante em gatos?',
    options: [
      'Sem precaução especial',
      'Risco de hipocalcemia',
      'Risco de esofagite se não der água',
      'Teratogenicidade apenas',
    ],
    correct: 2,
    explanation:
      'Doxiciclina em gatos: risco de esofagite/úlcera esofágica. Sempre dar com água abundante; considerar outras opções.',
    points: 10,
  },
  {
    id: 'pharma-8',
    specialty: 'Farmacologia',
    difficulty: 'medium',
    question:
      'Um cão está em tramadol para dor. Qual é o risco de overdose?',
    options: [
      'Bradicardia apenas',
      'Convulsões',
      'Sem risco significativo',
      'Apenas sedação',
    ],
    correct: 1,
    explanation:
      'Tramadol em overdose: convulsões (inibe recaptação de norepinefrina/serotonina), serotonina. Risco em cães com histórico de convulsões.',
    points: 10,
  },
  {
    id: 'pharma-9',
    specialty: 'Farmacologia',
    difficulty: 'medium',
    question:
      'Um gato recebe metimazol para hipertireoidismo. Qual é o efeito colateral mais grave?',
    options: [
      'Anorexia leve',
      'Agranulocitose',
      'Alopecia',
      'Polidipsia',
    ],
    correct: 1,
    explanation:
      'Metimazol: agranulocitose (raro mas grave), hepatotoxicidade, anorexia, vômito. Monitorar CBC basal e em semana 2.',
    points: 10,
  },
  {
    id: 'pharma-10',
    specialty: 'Farmacologia',
    difficulty: 'medium',
    question:
      'Um cão recebe fluorquinolona e apresenta claudicação em articulações. Qual é a causa?',
    options: [
      'Deficiência de cálcio',
      'Artropatia induzida por fluorquinolona',
      'Anemia',
      'Reação alérgica',
    ],
    correct: 1,
    explanation:
      'Fluorquinolonas (enrofloxacina, marbofloxacina) causam cartilagem danificada, especialmente em cães jovens. Evitar em cães <1 ano.',
    points: 10,
  },

  {
    id: 'pharma-11',
    specialty: 'Farmacologia',
    difficulty: 'hard',
    question:
      'Um cão de 25kg necessita de propofol IV em bolus para anestesia indução (5 mg/kg). Qual é a dose total?',
    options: [
      '50 mg',
      '75 mg',
      '125 mg',
      '250 mg',
    ],
    correct: 2,
    explanation:
      'Dose: 25kg × 5 mg/kg = 125 mg IV bolus lentamente.',
    points: 20,
  },
  {
    id: 'pharma-12',
    specialty: 'Farmacologia',
    difficulty: 'hard',
    question:
      'Um gato em metadona para dor apresenta constipação severa. Qual é o medicamento de eleição?',
    options: [
      'Antibióticos apenas',
      'Lactulose',
      'Loperamida',
      'Bisacodil apenas',
    ],
    correct: 1,
    explanation:
      'Opioides causam constipação via receptores mu intestinais. Lactulose é preferida em gatos (aumenta volume fecal, seguro).',
    points: 20,
  },
  {
    id: 'pharma-13',
    specialty: 'Farmacologia',
    difficulty: 'hard',
    question:
      'Um cão com IRRC está em enrofloxacina (7.5 mg/kg). Qual é a complicação específica neste cenário?',
    options: [
      'Hipoglicemia',
      'Nefrotoxicidade aumentada',
      'Hepatotoxicidade',
      'Sem complicações',
    ],
    correct: 1,
    explanation:
      'Fluorquinolonas em IRRC: acúmulo, nefrotoxicidade aumentada. Usar com cautela; monitorar creatinina. Marbofloxacina tem melhor PK.',
    points: 20,
  },
  {
    id: 'pharma-14',
    specialty: 'Farmacologia',
    difficulty: 'hard',
    question:
      'Um gato apresenta toxicidade por ivermectina (tremores, sedação). Qual é o tratamento?',
    options: [
      'Antídoto específico',
      'Flumazenil IV',
      'Suporte (fluidos, monitoramento) + lipídios IV em casos severos',
      'Queimação de carvão ativado',
    ],
    correct: 2,
    explanation:
      'Ivermectina toxicidade em gatos: sem antídoto específico. Suporte clínico. Lipídios IV em toxicidade severa (lipossolúvel).',
    points: 20,
  },
  {
    id: 'pharma-15',
    specialty: 'Farmacologia',
    difficulty: 'hard',
    question:
      'Um cão recebe cisplatina para linfoma. Qual é o efeito colateral limitante de dose?',
    options: [
      'Alopecia',
      'Anorexia leve',
      'Nefrotoxicidade (ototoxicidade)',
      'Apenas febre',
    ],
    correct: 2,
    explanation:
      'Cisplatina: nefrotoxicidade dose-limitante (ototoxicidade em certos protocolos). Requer hidratação agressiva, monitorar creatinina.',
    points: 20,
  },

  // ============ ANIMAIS EXÓTICOS (20 questions) ============

  {
    id: 'exotic-1',
    specialty: 'Animais Exóticos',
    difficulty: 'easy',
    question:
      'Uma calopsita macho apresenta disúria. Qual é a causa mais comum em psitacídeos?',
    options: [
      'Cistite bacteriana',
      'Hiperplasia do tecido folicular linfóide (TFFL)',
      'Nefrolitíase',
      'Tumor prostático',
    ],
    correct: 1,
    explanation:
      'TFFL é comum em psitacídeos, causa inflamação cloacal. Pode responder a redução fotoperiódica (10-12h luz/dia).',
    points: 5,
  },
  {
    id: 'exotic-2',
    specialty: 'Animais Exóticos',
    difficulty: 'easy',
    question:
      'Um réptil apresenta síndrome do metabolismo mineral ósseo inadequado (MBD). Qual é a causa nutricional primária?',
    options: [
      'Deficiência de vitamina A',
      'Deficiência de vitamina D3 e cálcio inadequado',
      'Excesso de fósforo',
      'Deficiência de vitamina E',
    ],
    correct: 1,
    explanation:
      'MBD: deficiência de vitamina D3 e adequada ingestão de cálcio. Razão Ca:P ideal ≥2:1.',
    points: 5,
  },
  {
    id: 'exotic-3',
    specialty: 'Animais Exóticos',
    difficulty: 'easy',
    question:
      'Qual é a temperatura ambiental correta para alojamento de um Bearded Dragon?',
    options: [
      '20-25°C em todo o enclosure',
      '25-30°C com zona quente de 35-40°C',
      '30-35°C com zona quente de 40-45°C',
      '35-40°C com zona quente de 45-50°C',
    ],
    correct: 1,
    explanation:
      'Bearded Dragons: zona quente 35-40°C, área mais fria 25-30°C. Fotoperiodo 12L:12D é essencial.',
    points: 5,
  },
  {
    id: 'exotic-4',
    specialty: 'Animais Exóticos',
    difficulty: 'easy',
    question:
      'Um coelho apresenta anorexia. Qual é a complicação potencialmente fatal mais comum?',
    options: [
      'Acidose ruminal',
      'Estase GI com proliferação bacteriana',
      'Cetoacidose',
      'Hiperglicemia',
    ],
    correct: 1,
    explanation:
      'Estase GI em coelhos: complicação grave. Anorexia = emergência. Tratamento: fluidos, motilidade (metoclopramida, cisapride), suporte nutricional.',
    points: 5,
  },
  {
    id: 'exotic-5',
    specialty: 'Animais Exóticos',
    difficulty: 'easy',
    question:
      'Uma serpente apresenta espuma nasal/oral. Qual é o diagnóstico diferencial mais importante?',
    options: [
      'Rinite alérgica',
      'Arenavirus/Paramixovírus',
      'Edema pulmonar',
      'Infecção bacteriana leve',
    ],
    correct: 1,
    explanation:
      'Espuma em serpentes sugere virose respiratória (arenavirus, paramixovírus). Frequentemente fatal; requer isolamento.',
    points: 5,
  },

  {
    id: 'exotic-6',
    specialty: 'Animais Exóticos',
    difficulty: 'medium',
    question:
      'Um papagaio apresenta inchaço ao redor dos olhos. Qual é o diagnóstico provável?',
    options: [
      'Conjuntivite alérgica',
      'Sinusite (frequente em psitacídeos)',
      'Trauma ocular',
      'Catarata',
    ],
    correct: 1,
    explanation:
      'Sinusite em psitacídeos: inchaço periocular, desidratação nasal. Causada frequentemente por deficiência vitamínica A, infecção.',
    points: 10,
  },
  {
    id: 'exotic-7',
    specialty: 'Animais Exóticos',
    difficulty: 'medium',
    question:
      'Um iguana apresenta tremores musculares e paresia de membros posteriores. Qual é o diagnóstico?',
    options: [
      'Fratura vertebral',
      'Distrofia muscular',
      'Síndrome de metabolismo mineral ósseo (MBD)',
      'Mielopatia viral',
    ],
    correct: 2,
    explanation:
      'MBD avançada: hipocalcemia causa tetania, convulsões, paresia. Requer cálcio IV, vitamina D3, UVB.',
    points: 10,
  },
  {
    id: 'exotic-8',
    specialty: 'Animais Exóticos',
    difficulty: 'medium',
    question:
      'Um ferrete apresenta prurido severo na cabeça/orelhas. Qual é a causa mais provável?',
    options: [
      'Alergia alimentar',
      'Sarna de orelha (Otodectes cynotis)',
      'Dermatite bacteriana',
      'Alopecia androgênica',
    ],
    correct: 1,
    explanation:
      'Sarna de orelha em furões é comum, causa prurido severo. Tratamento: antiparasitários (ivermectina com cuidado em felinos).',
    points: 10,
  },
  {
    id: 'exotic-9',
    specialty: 'Animais Exóticos',
    difficulty: 'medium',
    question:
      'Um hamster apresenta diarreia aquosa. Qual é a causa mais comum em hamster Sírio?',
    options: [
      'Mudança de dieta',
      'Infecção por Tyzzer (Clostridium piliforme)',
      'Diarreia por estresse',
      'Deficiência de fibra',
    ],
    correct: 1,
    explanation:
      'Hamster Sírio: Tyzzer é causa grave de diarreia hemorrágica, geralmente fatal. Isolamento imediato é crítico.',
    points: 10,
  },
  {
    id: 'exotic-10',
    specialty: 'Animais Exóticos',
    difficulty: 'medium',
    question:
      'Um sapo (Dendrobatidae) apresenta perda de cor e letargia. Qual é o problema de manejo mais provável?',
    options: [
      'Temperatura ambiente muito alta',
      'Umidade inadequada (muito seca)',
      'Falta de enriquecimento',
      'Alimentação deficiente',
    ],
    correct: 1,
    explanation:
      'Anfíbios: pele úmida é crítica. Umidade baixa causa desidratação rápida. Requer substrato úmido (musgo, folhas).',
    points: 10,
  },

  {
    id: 'exotic-11',
    specialty: 'Animais Exóticos',
    difficulty: 'hard',
    question:
      'Um pavão apresenta prolapso cloacal. Qual é o fator predisponente mais comum?',
    options: [
      'Infecção ascídio',
      'Constipação ou diarreia severa',
      'Deficiência nutricional apenas',
      'Trauma acidental',
    ],
    correct: 1,
    explanation:
      'Prolapso cloacal em aves: constipação/diarreia severa causa tenesmo. Requer reposição, limpeza, sutura se necessário.',
    points: 20,
  },
  {
    id: 'exotic-12',
    specialty: 'Animais Exóticos',
    difficulty: 'hard',
    question:
      'Um pogona (Bearded Dragon) apresenta tumores mandibulares bilaterais. Qual é o diagnóstico?',
    options: [
      'Osteossarcoma',
      'Distrofia nutricional secundária (MBD crônica)',
      'Abcesso bacteriano',
      'Metástase pulmonar',
    ],
    correct: 1,
    explanation:
      'MBD crônica: hiperparatiroidismo secundário causa osteodistrofia (inchaço mandibular bilateral). Requer cálcio/vitamina D3 agressivos.',
    points: 20,
  },

  // ============ ANESTESIOLOGIA (20 questions) ============

  {
    id: 'anesth-1',
    specialty: 'Anestesiologia',
    difficulty: 'easy',
    question:
      'Qual é a combinação pré-anestésica ideal para cão de risco baixo (cirurgia eletiva)?',
    options: [
      'Apenas oxigênio',
      'Acepromazina + opioide',
      'Ketamina IV pura',
      'Nenhuma, inducção direta com propofol',
    ],
    correct: 1,
    explanation:
      'Pré-anestesia: acepromazina (anxiolítico) + opioide (analgesia) reduz dose de indutor, oferece analgesia.',
    points: 5,
  },
  {
    id: 'anesth-2',
    specialty: 'Anestesiologia',
    difficulty: 'easy',
    question:
      'Um cão está com frequência cardíaca de 50 bpm durante anestesia inalada. Qual é o próximo passo?',
    options: [
      'Aprofundar anestesia',
      'Reduzir anestésico, considerar atropina ou glicopirrolato IV',
      'Aumentar fluidos IV',
      'Remover animal da anestesia',
    ],
    correct: 1,
    explanation:
      'Bradicardia (<50 bpm) durante anestesia: reduzir concentração, administrar anticolinérgico (atropina 0.02-0.04 mg/kg IV).',
    points: 5,
  },
  {
    id: 'anesth-3',
    specialty: 'Anestesiologia',
    difficulty: 'easy',
    question:
      'Qual é a dose de atropina para bradicardia em cão durante anestesia?',
    options: [
      '0.002 mg/kg IV',
      '0.02 mg/kg IV',
      '0.1 mg/kg IV',
      '0.5 mg/kg IV',
    ],
    correct: 1,
    explanation:
      'Atropina: 0.02-0.04 mg/kg IV para reverter bradicardia. Início rápido (1-2 minutos).',
    points: 5,
  },
  {
    id: 'anesth-4',
    specialty: 'Anestesiologia',
    difficulty: 'easy',
    question:
      'Um gato está em anestesia inalada com isoflurano. Qual é a concentração para manutenção cirúrgica?',
    options: [
      '0.5-1.0%',
      '1.0-1.5%',
      '1.5-2.0%',
      '2.0-3.0%',
    ],
    correct: 2,
    explanation:
      'Isoflurano para manutenção cirúrgica: 1.5-2.0% (≈1 MAC = 1.2-1.6%). Ajustar conforme frequência cardíaca e movimento.',
    points: 5,
  },
  {
    id: 'anesth-5',
    specialty: 'Anestesiologia',
    difficulty: 'easy',
    question:
      'Um cão despertou da anestesia muito rápido após indução com propofol. Qual é a causa?',
    options: [
      'Dose insuficiente de propofol',
      'Vaso extravasamento',
      'Bradicardia grave',
      'Hipertermia maligna',
    ],
    correct: 0,
    explanation:
      'Propofol: duração curta. Despertar rápido sugere dose inadequada de indução ou indução incompleta.',
    points: 5,
  },

  {
    id: 'anesth-6',
    specialty: 'Anestesiologia',
    difficulty: 'medium',
    question:
      'Um cão com doença cardíaca requer anestesia. Qual indutor é mais seguro?',
    options: [
      'Propofol 6 mg/kg',
      'Etomidato 1-2 mg/kg',
      'Ketamina 10 mg/kg',
      'Tiopental 10-15 mg/kg',
    ],
    correct: 1,
    explanation:
      'Etomidato: mínimo efeito cardiovascular, preserva ventilação espontânea. Ideal para cão cardiopata. Evitar em adrenais (inibição).',
    points: 10,
  },
  {
    id: 'anesth-7',
    specialty: 'Anestesiologia',
    difficulty: 'medium',
    question:
      'Um gato sob anestesia apresenta rigidez muscular severa. Qual é o provável agente causador?',
    options: [
      'Isoflurano',
      'Sevoflurano',
      'Ketamina',
      'Propofol',
    ],
    correct: 2,
    explanation:
      'Ketamina causa rigidez muscular (dissociação). Combinar com relaxante (midazolam) ou acepromazina para reduzir.',
    points: 10,
  },
  {
    id: 'anesth-8',
    specialty: 'Anestesiologia',
    difficulty: 'medium',
    question:
      'Um cão necessita de anestesia para limpeza dentária. Qual é o risco primário em boca aberta?',
    options: [
      'Apenas sangramento',
      'Aspiração de água/sangue/restos dentários',
      'Infecção de gengiva',
      'Reação alérgica ao anestésico',
    ],
    correct: 1,
    explanation:
      'Anestesia dental: risco de aspiração. Usar intubação orotraqueal; posição de cabeça Trendelenburg reverso; suction disponível.',
    points: 10,
  },
  {
    id: 'anesth-9',
    specialty: 'Anestesiologia',
    difficulty: 'medium',
    question:
      'Um cão apresenta apneia após indução com propofol. Qual é o manejo imediato?',
    options: [
      'Administrar mais propofol',
      'Intubação e ventilação mecânica com pressão positiva',
      'Naloxona IV',
      'Aguardar até recuperação espontânea',
    ],
    correct: 1,
    explanation:
      'Apneia pós-indução: intubação e ventilação com O2 100%. Propofol é depressor respiratório; ventilação mecânica é essencial.',
    points: 10,
  },
  {
    id: 'anesth-10',
    specialty: 'Anestesiologia',
    difficulty: 'medium',
    question:
      'Um gato sob anestesia com sevoflurano apresenta febre >41°C rapidamente. Qual é a emergência?',
    options: [
      'Infecção séptica',
      'Hipertermia maligna',
      'Reação alérgica ao anestésico',
      'Inflamação da incisão',
    ],
    correct: 1,
    explanation:
      'Hipertermia maligna: elevação rápida de temperatura, rigidez muscular, fibrilação ventricular. Rara em felinos; emergência anestésica grave.',
    points: 10,
  },

  {
    id: 'anesth-11',
    specialty: 'Anestesiologia',
    difficulty: 'hard',
    question:
      'Um cão de 35kg necessita de propofol IV 5 mg/kg para indução. Qual é a dose total em mg?',
    options: [
      '35 mg',
      '70 mg',
      '175 mg',
      '350 mg',
    ],
    correct: 2,
    explanation:
      'Dose: 35kg × 5 mg/kg = 175 mg IV bolus lentamente (30-60 segundos).',
    points: 20,
  },
  {
    id: 'anesth-12',
    specialty: 'Anestesiologia',
    difficulty: 'hard',
    question:
      'Um cão em anestesia apresenta hipotensão (MAP 55 mmHg) durante cirurgia. Qual é a causa mais provável?',
    options: [
      'Hipoglicemia',
      'Aprofundamento excessivo de anestesia inalada',
      'Sangramento cirúrgico mínimo',
      'Convulsão subclinicamente',
    ],
    correct: 1,
    explanation:
      'Hipotensão durante anestesia: reduzir concentração de inalado, aumentar fluidos IV, considerar dopamina/dobutamina se persistir.',
    points: 20,
  },

  // ============ NUTRIÇÃO (15 questions) ============

  {
    id: 'nutri-1',
    specialty: 'Nutrição',
    difficulty: 'easy',
    question:
      'Um cão de 20kg requer quantas calorias diárias para manutenção (vida sedentária)?',
    options: [
      '400 kcal',
      '600 kcal',
      '900 kcal',
      '1200 kcal',
    ],
    correct: 2,
    explanation:
      'RER = 70 × peso^0.75. Para 20kg: RER ≈ 560 kcal. MER sedentário (×1.5) ≈ 840 kcal. Aproximadamente 900 kcal.',
    points: 5,
  },
  {
    id: 'nutri-2',
    specialty: 'Nutrição',
    difficulty: 'easy',
    question:
      'Um cão apresenta alopecia, irritabilidade, fraqueza. Qual vitamina/mineral é provável deficiência?',
    options: [
      'Vitamina A',
      'Vitamina E/Ácidos graxos ômega',
      'Cálcio apenas',
      'Fósforo',
    ],
    correct: 1,
    explanation:
      'Ômega-3/Ômega-6 e vitamina E: essenciais para saúde pele/pelagem. Deficiência causa alopecia, ressecamento, dermatite.',
    points: 5,
  },
  {
    id: 'nutri-3',
    specialty: 'Nutrição',
    difficulty: 'easy',
    question:
      'Um cão com doença renal crônica deve receber qual teor de proteína?',
    options: [
      'Alto (>25%)',
      'Moderado (14-18%)',
      'Baixo (<10%)',
      'Sem restrição',
    ],
    correct: 1,
    explanation:
      'DRC: proteína moderada (AAFCO: 14-18%) para reduzir carga renal mantendo nutrição. Evitar excessiva proteína de baixa qualidade.',
    points: 5,
  },
  {
    id: 'nutri-4',
    specialty: 'Nutrição',
    difficulty: 'easy',
    question:
      'Um gato apresenta vômitos repetidos e letargia. Qual deficiência nutricional é suspeita?',
    options: [
      'Deficiência de taurina',
      'Deficiência de vitamina A',
      'Déficit de cálcio',
      'Excesso de sal',
    ],
    correct: 0,
    explanation:
      'Gatos requerem taurina dietética (aminoácido essencial). Deficiência causa cardiomiopatia dilatada, cegueira, vômitos.',
    points: 5,
  },
  {
    id: 'nutri-5',
    specialty: 'Nutrição',
    difficulty: 'easy',
    question:
      'Um cão obeso (condição 8/9) necessita de quantas calorias para perda de peso segura?',
    options: [
      'RER normal × 1.5',
      'RER normal × 2',
      'RER baseado em peso ideal × 1-1.2',
      'Jejum completo de 1 semana',
    ],
    correct: 2,
    explanation:
      'Perda de peso segura: calcular RER baseado em peso-alvo ideal, multiplicar por 1.0-1.2. Lento e sustentável é melhor.',
    points: 5,
  },

  {
    id: 'nutri-6',
    specialty: 'Nutrição',
    difficulty: 'medium',
    question:
      'Um cão de 40kg com ferimento cirúrgico grave requer quantas calorias para cicatrização ótima?',
    options: [
      'RER × 1.5',
      'RER × 2.0',
      'RER × 3.0',
      'RER × 0.5',
    ],
    correct: 1,
    explanation:
      'Ferimento grave/trauma: RER × 2.0 para suportar síntese de colágeno, cicatrização. Proteína adequada (20-25%) é crítica.',
    points: 10,
  },
  {
    id: 'nutri-7',
    specialty: 'Nutrição',
    difficulty: 'medium',
    question:
      'Um cão apresenta cristais de estruvita na urina. Qual nutriente deve ser restringido?',
    options: [
      'Potássio',
      'Magnésio e fósforo',
      'Sódio',
      'Proteína apenas',
    ],
    correct: 1,
    explanation:
      'Urolitíase estruvita: reduzir magnésio/fósforo, acidificar urina (reduzir pH), aumentar água/micção frequente. Dieta terapêutica essencial.',
    points: 10,
  },
  {
    id: 'nutri-8',
    specialty: 'Nutrição',
    difficulty: 'medium',
    question:
      'Um gato com diabetes mellitus em remissão pode descontinuar insulina se qual condição for mantida?',
    options: [
      'Repouso absoluto',
      'Dieta baixa em carboidrato (alta proteína) e peso corporal ideal',
      'Antibióticos contínuos',
      'Sem condições específicas; insulina deve continuar',
    ],
    correct: 1,
    explanation:
      'Diabetes em gato: remissão possível com dieta baixa carboidrato (<10%), alta proteína. Peso ideal reduz resistência à insulina.',
    points: 10,
  },
  {
    id: 'nutri-9',
    specialty: 'Nutrição',
    difficulty: 'medium',
    question:
      'Um cão com pancreatite aguda necessita de qual suporte nutricional inicial?',
    options: [
      'Dieta gordurosa alta para calor',
      'NPO (nada por via oral); suporte IV apenas; quando comer, dieta baixa em gordura',
      'Alimentação por sonda nasogástrica imediatamente',
      'Alimento seco de alta fibra',
    ],
    correct: 1,
    explanation:
      'Pancreatite aguda: NPO inicial, fluidos IV. Depois introduzir dieta baixa em gordura (<10%) gradualmente.',
    points: 10,
  },
  {
    id: 'nutri-10',
    specialty: 'Nutrição',
    difficulty: 'medium',
    question:
      'Um cão filhote de raça gigante deve receber qual teor de cálcio para crescimento saudável?',
    options: [
      '0.5% de cálcio (baixo)',
      '1.0-1.8% de cálcio (recomendado)',
      '>2.5% de cálcio (muito alto)',
      'Sem restrição',
    ],
    correct: 1,
    explanation:
      'Filhote raça gigante: excesso de cálcio causa osteodistrofia, displasia coxal. Usar alimento formulado para filhote grande.',
    points: 10,
  },

  // ============ COMPORTAMENTO (10 questions) ============

  {
    id: 'behav-1',
    specialty: 'Comportamento',
    difficulty: 'easy',
    question:
      'Um cão apresenta agressão territorial ao portão. Qual é o primeiro passo?',
    options: [
      'Castração apenas',
      'Avaliar causas (medo, proteção) e desensibilização/contracondicionamento',
      'Eutanásia',
      'Internação no canil',
    ],
    correct: 1,
    explanation:
      'Agressão territorial em cão: avaliar motivação (medo vs. proteção). Desensibilização (expor a estimulante em baixa intensidade) + treinamento.',
    points: 5,
  },
  {
    id: 'behav-2',
    specialty: 'Comportamento',
    difficulty: 'easy',
    question:
      'Um gato apresenta micção fora da caixa de areia. Qual é a causa mais comum?',
    options: [
      'Apenas comportamento',
      'Problemas médicos (ITU, FLUTD) ou inadequação da caixa',
      'Ciúmes do novo gato',
      'Tédio apenas',
    ],
    correct: 1,
    explanation:
      'Micção fora da caixa em gato: 50% causa médica (ITU, FLUTD, DRC). 50% comportamental (caixa suja, assustador, insuficiente). Investigar ambos.',
    points: 5,
  },
  {
    id: 'behav-3',
    specialty: 'Comportamento',
    difficulty: 'easy',
    question:
      'Um cão apresenta ansiedade de separação (destrutibilidade quando solitário). Qual tratamento é primeiro?',
    options: [
      'Sedação contínua',
      'Dessensibilização gradual + enriquecimento (brinquedo Kong) + consideração de fluoxetina',
      'Isolamento para "aprender"',
      'Internação permanente',
    ],
    correct: 1,
    explanation:
      'Ansiedade de separação: dessensibilização (sair por curtos períodos, gradualmente aumentar), enriquecimento, ISRS (fluoxetina) se grave.',
    points: 5,
  },
  {
    id: 'behav-4',
    specialty: 'Comportamento',
    difficulty: 'easy',
    question:
      'Um gato arranha agressivamente móveis e pessoas. Qual é o manejo apropriado?',
    options: [
      'Declaw (oniquectomia)',
      'Colocar almofadinhas de arranhadura, podar unhas regularmente, feromônios (Feliway)',
      'Apenas punição',
      'Repouso contínuo',
    ],
    correct: 1,
    explanation:
      'Comportamento de arranhadura natural em gatos. Fornecer postos de arranhadura, cortar unhas, feromônios. Oniquectomia é contraprodu tiva.',
    points: 5,
  },
  {
    id: 'behav-5',
    specialty: 'Comportamento',
    difficulty: 'easy',
    question:
      'Um cão apresenta latidos excessivos noturno. Qual é a investigação primária?',
    options: [
      'Apenas treinamento comportamental',
      'Descartar dor, incontinência, ansiedade, cogitação',
      'Sem investigação necessária',
      'Medicação para dormir apenas',
    ],
    correct: 1,
    explanation:
      'Latidos noturnos: investigar dor (artrite), incontinência urinária, ansiedade de separação, disfunção cognitiva (cão idoso).',
    points: 5,
  },

  {
    id: 'behav-6',
    specialty: 'Comportamento',
    difficulty: 'medium',
    question:
      'Um cão com agressão redirecionada foi mordido pelo gato. Como evitar mais mordidas?',
    options: [
      'Punição física',
      'Separação dos animais, dessensibilização gradual, neutralidade emocional do proprietário',
      'Medicação tranquilizante contínua',
      'Eutanásia preventiva',
    ],
    correct: 1,
    explanation:
      'Agressão redirecionada: cão morde person/gato quando frustrado. Manejo: evitar gatilhos, dessensibilização, ISRS se grave, treinador profissional.',
    points: 10,
  },
  {
    id: 'behav-7',
    specialty: 'Comportamento',
    difficulty: 'medium',
    question:
      'Uma cadela apresenta agressão maternal excessiva. Qual é o fator de risco primário?',
    options: [
      'Apenas genético',
      'Perturbação dos filhotes, medo/ansiedade da mãe, ambiente inadequado',
      'Filhotes em excesso numérico',
      'Sem fator de risco; apenas disposição',
    ],
    correct: 1,
    explanation:
      'Agressão maternal: perturbação frequente, ambiente ameaçador, ansiedade da mãe aumentam agressão. Minimizar perturbações primeiras semanas.',
    points: 10,
  },
  {
    id: 'behav-8',
    specialty: 'Comportamento',
    difficulty: 'medium',
    question:
      'Um cão apresenta fobia a trovão (tremendo, uivando, tentando escapar). Qual terapia é apropriada?',
    options: [
      'Castração',
      'Dessensibilização sistemática (som gravado baixo volume, recompensa) + fármacos ansiolíticos (fluoxetina, trazodona)',
      'Apenas conforto durante tempestade',
      'Isolamento preventivo',
    ],
    correct: 1,
    explanation:
      'Fobia a trovão: dessensibilização com sons gravados de tempestade em baixo volume + treinamento de comportamento incompatível. ISRS crônico se grave.',
    points: 10,
  },
  {
    id: 'behav-9',
    specialty: 'Comportamento',
    difficulty: 'medium',
    question:
      'Um gato apresenta pica (ingestão de não-alimentos, p. ex., borracha). Qual é a investigação urgente?',
    options: [
      'Apenas envenenamento',
      'Descartar deficiência nutricional, gastrite, alopecia psicogênica, estresse ambiental',
      'Sem investigação; apenas observação',
      'Anestesia imediatamente',
    ],
    correct: 1,
    explanation:
      'Pica em gato: investigar anemia (deficiência Fe), IBD, stress. Algumas raças (siamês, oriental) predispostas. Enriquecimento essencial.',
    points: 10,
  },
  {
    id: 'behav-10',
    specialty: 'Comportamento',
    difficulty: 'medium',
    question:
      'Um cão idoso apresenta desorientação noturna e dificuldade de aprendizado. Qual é o diagnóstico comportamental?',
    options: [
      'Agressão dominante',
      'Disfunção cognitiva canina (CDS)',
      'Simplesmente envelhecimento normal',
      'Diabetes apenas',
    ],
    correct: 1,
    explanation:
      'CDS (síndrome de disfunção cognitiva): desorientação, alteração ciclo sono/vigília, demolição. Similar à demência em humanos. Selegilina, dieta alta antioxidante podem ajudar.',
    points: 10,
  },
];

export function getQuestionsBySpecialty(specialty: string): QuizQuestion[] {
  return quizQuestions.filter((q) => q.specialty === specialty);
}

export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion[] {
  return quizQuestions.filter((q) => q.difficulty === difficulty);
}

export function getSpecialties(): string[] {
  const specialties = new Set(quizQuestions.map((q) => q.specialty));
  return Array.from(specialties).sort();
}

export function calculatePoints(difficulty: 'easy' | 'medium' | 'hard'): number {
  switch (difficulty) {
    case 'easy':
      return 5;
    case 'medium':
      return 10;
    case 'hard':
      return 20;
    default:
      return 0;
  }
}
