const mongoose = require("mongoose");

const EmergencyAlertSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  start: { type: Date, default: Date.now },
});

const EmergencyAlert = mongoose.model("EmergencyAlert", EmergencyAlertSchema);

const { GraphQLObjectType, GraphQLID } = require('graphql');

const EmergencyAlertType = new GraphQLObjectType({
  name: 'EmergencyAlert',
  fields: () => ({
    id: { type: GraphQLID },
    patient: { type: GraphQLID }
  })
});

module.exports = { EmergencyAlert, EmergencyAlertType };