import type { RxItem } from '../types/prescription';

export interface AIRecommendation {
  diagnosis: string;
  items: Array<Omit<RxItem, 'id'> & { reason: string }>;
  warnings: string[];
}

// This is a mock function that simulates an AI backend.
// It uses simple keyword matching to generate recommendations.
export const aiRecommend = (input: {
  symptoms: string;
  age?: number;
  allergies?: string[];
}): Promise<AIRecommendation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const symptoms = input.symptoms.toLowerCase();
      let response: AIRecommendation = {
        diagnosis: 'Uncertain. Clinical correlation advised.',
        items: [],
        warnings: [],
      };

      // Red flag checks
      if (symptoms.includes('chest pain') || symptoms.includes('shortness of breath') || symptoms.includes('breathing difficulty')) {
        response.warnings.push('URGENT: Chest pain or shortness of breath requires immediate medical attention. Go to ER.');
        return resolve(response);
      }
      if (symptoms.includes('severe bleeding') || symptoms.includes('uncontrolled bleeding')) {
        response.warnings.push('URGENT: Severe bleeding requires immediate medical attention.');
        return resolve(response);
      }

      // Simple keyword-based logic
      if (symptoms.includes('fever') && (symptoms.includes('headache') || symptoms.includes('body ache'))) {
        response.diagnosis = 'Viral Fever';
        response.items.push({
          medicine: 'Paracetamol',
          dosage: { strength: '650 mg', route: 'oral', frequency: 'TID after food', durationDays: 3, instructions: 'If fever persists' },
          reason: 'For fever and pain relief.',
        });
      }
      
      if (symptoms.includes('sore throat') || symptoms.includes('throat pain')) {
         response.diagnosis = response.diagnosis.startsWith('Viral') ? 'Viral Pharyngitis' : 'Pharyngitis';
         response.items.push({
           medicine: 'Ibuprofen',
           dosage: { strength: '400 mg', route: 'oral', frequency: 'BD after food', durationDays: 3, instructions: 'For throat pain' },
           reason: 'Anti-inflammatory for throat pain.',
         });
      }

      if (symptoms.includes('cough') && symptoms.includes('dry')) {
        response.diagnosis = 'Dry Cough / Allergic Bronchitis';
        response.items.push({
          medicine: 'Levocetirizine',
          dosage: { strength: '5 mg', route: 'oral', frequency: 'OD at night', durationDays: 5 },
          reason: 'Antihistamine for allergic cough.',
        });
      }
      
      if (symptoms.includes('loose motion') || symptoms.includes('diarrhea')) {
        response.diagnosis = 'Acute Gastroenteritis';
        response.items.push(
          {
            medicine: 'Oral Rehydration Salts (ORS)',
            dosage: { strength: 'sachet', route: 'oral', frequency: 'As needed', durationDays: 2, instructions: 'Mix in 1L water and sip frequently' },
            reason: 'To prevent dehydration.',
          },
          {
            medicine: 'Zinc Sulfate',
            dosage: { strength: '20 mg', route: 'oral', frequency: 'OD', durationDays: 14 },
            reason: 'To reduce duration and severity of diarrhea.',
          }
        );
      }

      if (response.items.length === 0) {
        response.warnings.push('Symptoms are non-specific. Please add medication manually based on clinical examination.');
      }

      resolve(response);
    }, 1200); // Simulate network delay
  });
};
