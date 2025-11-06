export type Dosage = {
  strength: string; // e.g., "500 mg"
  route: 'oral' | 'topical' | 'inhalation' | 'injection' | 'other';
  frequency: string; // human-readable: "BD", "TID", "once daily"
  durationDays: number;
  instructions?: string; // "after food", etc.
};

export type RxItem = {
  id: string; // uuid
  medicine: string; // generic name
  dosage: Dosage;
};

export type Prescription = {
  patientId?: string;
  diagnosis?: string;
  items: RxItem[];
  notes?: string;
};

export interface AIRecommendation {
  diagnosis: string;
  items: Array<Omit<RxItem, 'id'> & { reason: string }>;
  warnings: string[];
}
