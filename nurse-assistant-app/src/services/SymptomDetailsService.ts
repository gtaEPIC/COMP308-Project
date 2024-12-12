import AIService from '../services/AIService';
import axios from 'axios';



    class SymptomDetailsService {
        async fetchDetails(symptom: string): Promise<string> {
            try {
                const response = await axios.get(`https://api.example.com/symptoms/${symptom}`);
                return response.data.details;
            } catch (error) {
                console.error('Error fetching symptom details:', error);
                throw new Error('Could not fetch symptom details');
                }
            }
            
        }

  

class IndexController {
  async processSymptoms(symptoms: string[]): Promise<string[]> {
    // Logic to process symptoms and return possible medical conditions
    const aiService = new AIService();
    const conditions = await aiService.analyzeSymptoms(symptoms);
    return conditions;
  }

  async getSymptomDetails(symptom: string): Promise<string> {
    // Logic to get details about a specific symptom
    const symptomDetailsService = new SymptomDetailsService();
    const details = await symptomDetailsService.fetchDetails(symptom);
    return details;
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