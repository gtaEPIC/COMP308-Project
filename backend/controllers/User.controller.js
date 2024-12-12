const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// JWT handling
const SECRET = process.env.SECRET || "Super Secret";

function createToken(user) {
    return jwt.sign({ id: user.id, username: user.username, type: user.type }, SECRET, {
        expiresIn: '1h'
    });
}

function verifyToken(token) {
    if (!token) {
        throw new Error('Token is required');
    }

    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

// Create a new user
const createUser = async (_, args) => {
    const { username, password, type } = args;

    // Check if username already exists
    if (await User.findOne({ username })) {
        throw new Error('Username already exists');
    }
    const user = new User(args);
    user.save();
    return "Created";
};

// Read all users
const readUsers = async (_, __, { user }) => {
    if (!user || user.type !== 'nurse') {
        throw new Error('Unauthorized: Only nurses can view users');
    }

    return User.find();
};

// Read a user by ID
const readUser = async (_, { id }, { user }) => {
    if (!user) {
        throw new Error('Unauthorized');
    }

    return User.findById(id);
};

// Read a user by username
const readUserByUsername = async (_, { username }, { user }) => {
    if (!user) {
        throw new Error('Unauthorized');
    }

    return User.findOne({ username });
};

// Login
const login = async (_, { username, password }, { res }) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid username or password');
    }

    const token = createToken(user);
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

    return { token };
};

// Logout
const logout = async (_, __, { res }) => {
    res.clearCookie('token');
    return "Logged out";
};

// Create Motivational Tip
const createTip = async (_, { tip, patient }, { user }) => {
    if (!user || user.type !== 'nurse') {
        throw new Error('Unauthorized: Only nurses can create tips');
    }

    const patientUser = await User.findOne({ _id: patient });
    if (!patientUser) {
        throw new Error('Patient not found');
    }

    patientUser.tips = patientUser.tips || [];
    patientUser.tips.push(tip);

    await patientUser.save();

    return "Tip added successfully";
};

module.exports = {
    createUser,
    readUsers,
    readUser,
    readUserByUsername,
    login,
    logout,
    verifyToken,
    createToken,
    createTip,
};
