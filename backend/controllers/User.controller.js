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
    return jwt.verify(token, SECRET);
}

// Create a new user

const createUser = async (_, args) => {
    if (await User.findOne({ username: args.username })) {
        throw new Error('Username already exists');
    }
    const user = new User(args);
    user.save();
    return "Created";
}

// Read all users

const readUsers = async (_, __, {user}) => {
    if (!user) {
        throw new Error('Unauthorized');
    }
    return User.find();
}

// Read a user by ID

const readUser = async (_, {id}, {user}) => {
    if (!user) {
        throw new Error('Unauthorized');
    }
    return User.findById(id);
}

// Read a user by username

const readUserByUsername = async (_, {username}, {user}) => {
    if (!user) {
        throw new Error('Unauthorized');
    }
    return User.findOne({ username });
}


// Login
const login = async (_, {username, password}, {res}) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('User not found');
    }
    // Use bcrypt to compare the password
    if (await bcrypt.compare(password, user.password)) {
        user.password = undefined;
        const token = createToken(user);
        res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 3600000) });
        return {token};
    } else {
        throw new Error('Incorrect password');
    }
}

// Logout
const logout = async (_, __, {res}) => {
    res.clearCookie('token');
    return "Logged out";
}

// Create Motivational Tip
const createTip = async (_, {tip, patient}, {user}) => {
    if (!user) {
        throw new Error('Unauthorized');
    }
    if (user.type !== 'nurse') {
        throw new Error('Unauthorized');
    }
    const patientUser = await User.findOne({ _id: patient });
    patientUser.tips.push(tip);
    patientUser.save();
    return "Tip added";
}

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
}