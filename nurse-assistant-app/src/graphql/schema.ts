import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema } from 'graphql';
import AIService from '../services/AIService';
import IndexController from '../controllers/index';

const aiService = new AIService();
const indexController = new IndexController();

const MedicalConditionType = new GraphQLObjectType({
  name: 'MedicalCondition',
  fields: {
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getConditions: {
      type: new GraphQLList(MedicalConditionType),
      args: { symptoms: { type: GraphQLString } },
      resolve: async (_, { symptoms }) => {
        const conditions = await aiService.processSymptoms(symptoms);
        return conditions;
      },
    },
    advisePatient: {
      type: GraphQLString,
      args: {
        symptoms: { type: new GraphQLList(GraphQLString) }
      },
      resolve: async (_: any, args: { [argName: string]: any }, context: { resolvers: any }) => {
        return indexController.advisePatient(args.symptoms);
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: QueryType
});

export default schema;