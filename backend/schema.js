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

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        type: { type: GraphQLString },
        vitals: {
            type: new GraphQLList(VitalsType),
        },
        tips: {
            type: new GraphQLList(GraphQLString),
        }
    })
});

const LoginType = new GraphQLObjectType({
    name: 'Login',
    fields: () => ({
        token: { type: GraphQLString }
    })
});

// Queries
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // User Queries
        GetUsers: {
            type: new GraphQLList(UserType),
            args: { },
            resolve(a, b, c) {
                return readUsers(a, b, c);
            }
        },
        GetUserById: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(a, b, c) {
                return readUser(a, b, c);
            }
        },
        GetUserByUsername: {
            type: UserType,
            args: { username: { type: GraphQLString } },
            resolve(a, b, c) {
                return readUserByUsername(a, b, c);
            }
        },

        GetMe: {
            type: UserType,
            resolve(_, __, {req}) {
                return verifyToken(req.headers.authorization || req.cookies['token'] || null);
            }
        },

        // Vitals Queries
        GetVitals: {
            type: new GraphQLList(VitalsType),
            args: { patient: { type: GraphQLID } },
            resolve(a, b, c) {
                return readVitalsByPatientId(a, b, c);
            }
        },

        // Emergency Alert Queries
        alert: {
            type: EmergencyAlertType,
            args: { id: { type: GraphQLID } },
            resolve(a, b, c) {
                return getAlert(a, b, c);
            }
        },
        allAlerts: {
            type: new GraphQLList(EmergencyAlertType),
            resolve(a, b, c) {
                return getAllAlerts(a, b, c);
            }
        }
    }
});

// Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // User Mutations
        AddUser: {
            type: GraphQLString,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                type: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(a, b, c) {
                return createUser(a, b, c);
            }
        },
        Login: {
            type: LoginType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(a, b, c) {
                return login(a, b, c);
            }
        },
        Logout: {
            type: GraphQLString,
            resolve(a, b, c) {
                return logout(a, b, c);
            }
        },
        CreateTip: {
            type: GraphQLString,
            args: {
                patient: { type: new GraphQLNonNull(GraphQLID) },
                tip: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(a, b, c) {
                return createTip(a, b, c);
            }
        },

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
});


module.exports = {
    schema: new GraphQLSchema({
        query: RootQuery,
        mutation: Mutation
    })
};