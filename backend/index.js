const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import GraphQL schema and controllers
const { schema } = require('./schema');
const { verifyToken } = require('./controllers/User.controller');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware for logging HTTP requests
app.use(morgan("dev"));

// CORS Configuration
const corsOptions = {
    origin: ['http://localhost:5173', 'https://comp308-project-frontend.onrender.com'],
    credentials: true,
};
app.use(cors(corsOptions));

// Parse incoming JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// GraphQL Middleware
app.use('/graphql', graphqlHTTP((req, res) => {
    let user = null;

    // Extract token from headers or cookies
    const token = req.headers.authorization?.split(" ")[1] || req.cookies['token'] || null;

    if (token) {
        try {
            user = verifyToken(token); // Decode the token to retrieve user info
        } catch (err) {
            console.error("Token verification failed:", err.message);
        }
    }

    return {
        schema,
        graphiql: true, // Enable GraphiQL for development
        context: { req, res, user },
    };
}));

// Connect to MongoDB
const mongoUri = process.env.MONGO_DB || 'mongodb://localhost:27017/comp308-vitals';
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
