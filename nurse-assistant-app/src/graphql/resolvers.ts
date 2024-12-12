import { IResolvers } from '@graphql-tools/utils';
import IndexController from '../controllers/index';

class AIService {
  static async analyzeSymptoms(symptoms: string[]): Promise<string[]> {
    // Example AI logic using a mock model
    // In a real-world scenario, you would load a pre-trained model and use it to analyze the symptoms
    const mockModel = {
      predict: (input: string[]) => {
      // Mock prediction logic
      if (input.includes('fever')) {
        return ['Flu', 'Common Cold'];
      } else if (input.includes('headache')) {
        return ['Migraine', 'Tension Headache'];
      } else {
        return ['Unknown Condition'];
      }
      },
    };

    const conditions = mockModel.predict(symptoms);
    // This should use a deep learning model and publicly available datasets
   
    return ['Condition1', 'Condition2'];
  }
}

const indexController = new IndexController();

const resolvers: IResolvers = {
  Query: {
    getMedicalConditions: async (_: any, { symptoms }: { symptoms: string }) => {
      const conditions = await AIService.analyzeSymptoms([symptoms]);
      return conditions;
    },
  },
  Mutation: {
    addSymptoms: async (_: any, { symptoms }: { symptoms: string }) => {
      const conditions = await AIService.analyzeSymptoms([symptoms]);
      // Logic to save symptoms can be added here if needed
      return conditions;
    },
  },
  advisePatient: async ({ symptoms }: { symptoms: string[] }) => {
    return indexController.advisePatient(symptoms);
  },
};


export default AIService;