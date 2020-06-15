const mongoose = require('mongoose');

const User = new mongoose.model('User', {
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    avater: String,
    createdAt: {
        type: Date,
        default: () => new Date()
    }

});


module.exports = User;