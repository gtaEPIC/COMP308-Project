const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');
const {readUser, readUsers, readUserByUsername, createUser, login, logout} = require("./controllers/User.controller");
const { ObjectId } = require('mongoose').Types;

// Import models below

// Define your GraphQL types
const VitalsType = new GraphQLObjectType({
    name: 'Vitals',
    fields: () => ({
        id: { type: GraphQLID },
        patientId: { type: GraphQLID },
        user: { type: GraphQLID },
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
            type: UserType,
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
        }
    }
});


module.exports = {
    schema: new GraphQLSchema({
        query: RootQuery,
        mutation: Mutation
    })
};