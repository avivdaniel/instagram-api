const Post = require('../models/post');
class Posts {
    async create(req, res) {
        const userId = req.user._id;
        const newPost = new Post({ ...req.body, userId });
        console.log(newPost)
        try {
            const postCreated = await newPost.save()
            res.status(201).json(postCreated);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new Posts();