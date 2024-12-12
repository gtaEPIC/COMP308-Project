export interface MedicalCondition {
  id: number;
  name: string;
  symptoms: string[];
  description: string;
}

export interface SymptomInput {
  symptoms: string[];
}

export interface AIResponse {
  conditions: MedicalCondition[];
  advice: string;
}