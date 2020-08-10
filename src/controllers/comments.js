const Comment = require('../models/comment');
const Post = require('../models/post');
const config = require('../config/env/index');

class Comments {

    async create(req, res) {

        const comment = new Comment({
            user: req.user._id,
            postId: req.params.id,
            content: req.body.content
        });

        try {
            const newComment = await comment.save();
            await newComment.populate('user', ['avatar', 'username']).execPopulate();
            const refPost = await Post.findById(newComment.postId)
            await refPost.comments.push(newComment._id)
            await refPost.save();
            res.status(201).json(newComment);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }

    async getAll(req, res) {
        try {
            const comments = await Comment.find({
                postId: req.params.id
            })
                .populate('user', ['avatar', 'username']);
            res.json(comments);
        } catch (err) {
            console.log(err);
            res.sendStatus(400);
        }
    }
}

module.exports = new Comments();