<<<<<<< HEAD
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull } = require('graphql');
const { createUser, readUsers, readUser, login, logout, createTip, verifyToken } = require('./controllers/User.controller');
=======
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');
const {readUser, readUsers, readUserByUsername, createUser, login, logout, verifyToken, createTip} = require("./controllers/User.controller");
const {readVitalsByPatientId, createVitals} = require("./controllers/Vitals.controller");
const {EmergencyAlertType} = require("./models/EmergencyAlert");
const {createAlert, resolveAlert, getAllAlerts, getAlert} = require("./controllers/Alert.controller");
const {agenticRAG} = require("./agenticRag");
const { ObjectId } = require('mongoose').Types;

// Import models below

// Define your GraphQL types
const VitalsType = new GraphQLObjectType({
    name: 'Vitals',
    fields: () => ({
        id: { type: GraphQLID },
        patient: { type: UserType },
        user: { type: UserType },
        date: { type: GraphQLString },
        bodyTemp: { type: GraphQLInt },
        heartRate: { type: GraphQLInt },
        bloodPressure: { type: GraphQLInt },
        respiratoryRate: { type: GraphQLInt }
    })
});
>>>>>>> 8d985d8afffce80bb20b27e18729ffdc0a47f9ec

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        type: { type: GraphQLString },
        tips: { type: new GraphQLList(GraphQLString) },
    }),
});

const LoginType = new GraphQLObjectType({
    name: 'Login',
    fields: () => ({
        token: { type: GraphQLString },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        GetUsers: {
            type: new GraphQLList(UserType),
            resolve(parent, args, context) {
                return readUsers(parent, args, context);
            },
        },
        GetMe: {
            type: UserType,
            resolve(_, __, { req }) {
                const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
                return verifyToken(token);
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        AddUser: {
            type: GraphQLString,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                type: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args, context) {
                return createUser(parent, args, context);
            },
        },
        Login: {
            type: LoginType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args, context) {
                return login(parent, args, context);
            },
        },
        Logout: {
            type: GraphQLString,
            resolve(parent, args, context) {
                return logout(parent, args, context);
            },
        },
        CreateTip: {
            type: GraphQLString,
            args: {
                tip: { type: new GraphQLNonNull(GraphQLString) },
                patient: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args, context) {
                return createTip(parent, args, context);
            },
        },
<<<<<<< HEAD
    },
=======

        // Vitals Mutations
        AddVitals: {
            type: VitalsType,
            args: {
                patient: { type: new GraphQLNonNull(GraphQLID) },
                bodyTemp: { type: new GraphQLNonNull(GraphQLInt) },
                heartRate: { type: new GraphQLNonNull(GraphQLInt) },
                bloodPressure: { type: new GraphQLNonNull(GraphQLInt) },
                respiratoryRate: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(a, b, c) {
                return createVitals(a, b, c);
            }
        },

        // Emergency Alert Mutations
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
        },

        // Rag
        AIQuery: {
            type: GraphQLString,
            args: {
                query: { type: GraphQLString }
            },
            resolve: (_, {query}) => {
                return agenticRAG(query);
            }
        }
    }
>>>>>>> 8d985d8afffce80bb20b27e18729ffdc0a47f9ec
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
