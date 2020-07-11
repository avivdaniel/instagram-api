const Post = require('../models/post');
class Posts {
    async getAllPosts(req, res) {
        try {
            const posts = await Post.find();
            res.json(posts);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async create(req, res) {
        const post = new Post({
            userId: req.user._id,
            image: req.file.filename,
            title: req.body.title
        });
        try {
            const createdPost = await post.save();
            res.status(201).json(createdPost);
        } catch (err) {
            res.status(400).json(err);
        }
    }

    async addLike(req, res) {
        try {
            const post = await Post.findOneAndUpdate({
                _id: req.params.id
            }, {
                $addToSet: {
                    likes: req.user._id
                }
            }, {
                new: true, //set the new option to true to return the document after update was applied.
            });
        } catch (err) {
            res.status(500).json(err);
        }

    }

    async unlike(req, res) {
        if (req.user._id.toString() !== req.params.userId) {
            res.sendStatus(403);
            return;
        }
        try {
            const post = await Post.findOneAndDelete({
                _id: req.params.id
            }, {
                $pull: { //The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
                    likes: req.user._id
                }
            }, {
                new: true,
            });
        } catch (err) {
            res.status(500).json(err);
        }

    }

}

module.exports = new Posts();