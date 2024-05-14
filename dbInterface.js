    Install necessary Node.js packages:

bash

npm install mongoose

Code for dbInterface.js
javascript

const mongoose = require('mongoose');

// Load environment variables (if using dotenv to manage them)
require('dotenv').config();

// MongoDB Connection URL
const dbConnectionURL = process.env.MONGO_URI;

// Establish MongoDB connection using Mongoose
mongoose.connect(dbConnectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connection established.'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose Schema for Users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Create a Mongoose Model based on the schema
const User = mongoose.model('User', userSchema);

// Function to add a new user to the database
async function addUser(userData) {
    const newUser = new User(userData);
    return await newUser.save();
}

// Function to find a user by username
async function findUserByUsername(username) {
    return await User.findOne({ username });
}

// Function to update a user's data
async function updateUser(username, updates) {
    return await User.findOneAndUpdate({ username }, updates, { new: true });
}

// Function to delete a user
async function deleteUser(username) {
    return await User.findOneAndDelete({ username });
}

module.exports = {
    addUser,
    findUserByUsername,
    updateUser,
    deleteUser
};

