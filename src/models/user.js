const mongoose = require('mongoose');

const User = new mongoose.model('User', {
    username: {
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    password: {
        type: String,
        required: true,
        immutable: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    avatar: String,
    createdAt: {
        immutable: true,
        type: Date,
        default: () => new Date()
    },
    bio: String

});


module.exports = User;