export interface Symptom {
  id: string;
  name: string;
}

export interface MedicalCondition {
  id: string;
  name: string;
  description: string;
  symptoms: Symptom[];
}

export interface AIResponse {
  conditions: MedicalCondition[];
  advice: string;
}