const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongoose').Types;

// Import models below


// JWT handling
const SECRET = process.env.SECRET

function createToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET || "Super Secret", {
        expiresIn: '1h'
    });
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET || "Super Secret");
}

// Define your GraphQL types


// Queries
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // Define your queries here
    }
});

// Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Define your mutations here
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});