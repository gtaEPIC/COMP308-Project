import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers';

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
}));

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql');
});