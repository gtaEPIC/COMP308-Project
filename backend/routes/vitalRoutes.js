const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../controllers/User.controller');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema');

router.post('/patient/:patientId/newvital', authenticateUser, authorizeRole('nurse'), graphqlHTTP({
  schema,
  graphiql: false,
  customFormatErrorFn: (err) => ({ message: err.message })
}));

module.exports = router;