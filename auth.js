
    Install necessary Node.js packages:

bash

npm install express jsonwebtoken bcryptjs dotenv

Code for auth.js
javascript

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const router = express.Router();

// Mock user database entry
const users = {
    admin: {
        id: "1",
        username: "admin",
        password: "$2a$10$CwTycUXWue0Thq9StjUM0uJ1/DPF.5sACx8Vsgau0G1U9tXZgSf2G", // this is a bcrypt hash for "password"
    }
};

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
}

// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!(username && password)) {
        return res.status(400).send("All input is required");
    }
    const user = users[username];

    if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
            { user_id: user.id, username },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h",
            }
        );

        return res.status(200).json({ token });
    }
    return res.status(400).send("Invalid Credentials");
});

// Example protected route
router.get('/dashboard', verifyToken, (req, res) => {
    res.status(200).send('Welcome to the dashboard');
});

module.exports = router;
