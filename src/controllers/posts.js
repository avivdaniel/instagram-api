const Post = require('../models/post');
const fs = require('fs');
const makeUniqueImageName = require('../utils/unique');
class Posts {

    async create(req, res) {
        const base64Data = req.body.image;
        const base64Image = base64Data.split(';base64,').pop();
        const imageName = makeUniqueImageName();
        fs.writeFile("public/posts/" + imageName, base64Image, 'base64', err => {
            if (err) console.log(err);
        });

        const post = new Post({
            user: req.user._id,
            image: imageName,
            title: req.body.title
        });


        try {
            const createdPost = await post.save();
            res.status(201).json(createdPost);
            console.log(post)
        } catch (err) {
            res.status(400).json(err);
        }
    }

    async getAll(req, res) {
        try {
            const posts = await Post.find()
                .populate('user', ['_id', 'avatar', 'username'])
                .populate('comments', ['_id'])
                .sort({ createdAt: req.query.sort });
            res.json(posts);
        } catch (err) {
            res.sendStatus(400);
        }
    }

    async getPostById(req, res) {
        try {
            const post = await Post.findById(req.params.id)
                .populate('user', ['avatar', 'username']);
            if (!post) {
                res.sendStatus(404);
            }
            res.json(post);
        } catch (err) {
            res.sendStatus(500);
        }
    }

    async like(req, res) {
        try {
            const post = await Post.findOneAndUpdate({
                _id: req.params.id
            }, {
                $addToSet: {
                    likes: req.user._id
                }
            }, {
                new: true
            });
            res.json(post);
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
            const post = await Post.findOneAndUpdate({
                _id: req.params.id
            }, {
                $pull: {
                    likes: req.user._id
                }
            }, {
                new: true
            });
            res.json(post);
        } catch (err) {
            res.status(500).json(err);
        }
    }


}

module.exports = new Posts();