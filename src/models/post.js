const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const Post = new mongoose.model('Post', {
    userId: {
        type: String,
        required: true,
    },
    title: String,
    image: {
        type: String,
        require: true,
    },
    likes: [ObjectId],
    createdAt: {
        type: Date,
        default: () => new Date()
    }
});


module.exports = Post;