const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
// GraphQL schema
const {schema} = require('./schema');
const {verifyToken} = require('./controllers/User.controller');
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID } = require('graphql');



const EmergencyAlert = require('../../models/EmergencyAlert');

const createAlert = async (parent, args, context) => {
  const { patientId } = args;
  const existingAlert = await EmergencyAlert.findOne({ patient: patientId });
  if (existingAlert) throw new Error("You already have an active alert");

  const alert = new EmergencyAlert({ patient: patientId });
  await alert.save();
  return alert;
};

const resolveAlert = async (parent, args, context) => {
  const { id } = args;
  const alert = await EmergencyAlert.findById(id);
  if (!alert) throw new Error("Alert not found");

  await alert.remove();
  return "Alert resolved";
};

module.exports = { createAlert, resolveAlert };

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      alert: {
        type: EmergencyAlertType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) {
          // Resolve logic for fetching an alert by ID
        }
      }
    }
  });
  
  const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createAlert: {
        type: EmergencyAlertType,
        args: {
          patientId: { type: GraphQLID }
        },
        resolve: createAlert
      },
      resolveAlert: {
        type: GraphQLString,
        args: {
          id: { type: GraphQLID }
        },
        resolve: resolveAlert
      }
    }
  });
  
  module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
  });
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/graphql', graphqlHTTP((req, res) => ({
    schema,
    graphiql: true,
    context: {
        req,
        res,
        user: (() => {
            const token = req.headers.authorization || req.cookies['token'] || null;
            if (!token) return null;
            return verifyToken(token);
        })()
    }
})));


app.use(morgan("dev"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost:27017/comp308-vitals', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});