import AIService from '../services/AIService';

export const formatSymptoms = (symptoms: string[]): string => {
  return symptoms.map(symptom => symptom.trim()).join(', ');
};

export const validateSymptoms = (symptoms: string[]): boolean => {
  return symptoms.length > 0 && symptoms.every(symptom => typeof symptom === 'string');
};

class IndexController {
  async processSymptoms(symptoms: string[]): Promise<string[]> {
    return AIService.analyzeSymptoms(symptoms);
  }

  async advisePatient(symptoms: string[]): Promise<string> {
    const conditions = await this.processSymptoms(symptoms);
    if (conditions.length > 0) {
      return `Possible conditions: ${conditions.join(', ')}. Please consult a doctor.`;
    } else {
      return 'No significant conditions detected. However, if symptoms persist, please see a doctor.';
    }
  }
}

export default IndexController;