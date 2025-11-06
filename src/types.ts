import React from 'react';

export type UserRole = 'patient' | 'doctor';

export type Page = 
  | 'Dashboard' 
  | 'Budget Planner' 
  | 'Symptom Tracker' 
  | 'Bed Finder' 
  | 'Medicine Checker'
  | 'Medical Records'
  | 'Appointments'
  | 'Insurance Validator'
  | 'Follow-up Center'
  | 'Profile'
  // Doctor Pages
  | 'Doctor Dashboard'
  | 'AI Prescription'
  | 'Follow-ups';


export interface NavItem {
  id: Page;
  labelKey: string;
  icon: React.ElementType;
  showInNav: boolean;
}

export interface TreatmentTest {
  name: string;
  cost: number;
  lab: string;
  priority: 'high' | 'medium' | 'low';
  why_needed: string;
}

export interface BrandOption {
  name: string;
  price: number;
}

export interface TreatmentMedicine {
  generic_name: string;
  brand_options: BrandOption[];
  dosage: string;
  frequency: string;
  duration: string;
}

export interface TreatmentPlan {
  diagnosis_suggestion: string;
  tests: TreatmentTest[];
  medicines: TreatmentMedicine[];
  consultation: {
    type: string;
    cost: number;
  };
  total_cost: number;
  remaining_budget: number;
  follow_up_recommendation: string;
}

export interface SymptomAIAnalysis {
  notes: string;
  infection_risk: 'low' | 'medium' | 'high';
  advice: string[];
}

export interface PhotoEntry {
  id: number;
  date: Date;
  imageUrl: string; // data URL during session
  patientNotes: string;
  aiAnalysis?: SymptomAIAnalysis;
  isLoading: boolean;
}
