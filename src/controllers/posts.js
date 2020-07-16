const Post = require('../models/post');
class Posts {


    async create(req, res) {
        console.log(req.body)
        // var imageBuffer = req.file.buffer;
        // var imageBuffer = req.file;

        // var imageName = 'public/posts/map.png';
        // console.log(imageBuffer);

        res.send('hey')
        // fs.createWriteStream(imageName).write(imageBuffer);

        // const post = new Post({
        //     user: req.user._id,
        //     image: req.file.filename,
        //     description: req.body.description
        // });


        // try {
        //     const createdPost = await post.save();
        //     res.status(201).json(createdPost);
        // } catch (err) {
        //     res.status(400).json(err);
        // }
    }

    async getAll(req, res) {
        try {
            const posts = await Post.find()
                .populate('user', ['_id', 'avatar', 'username'])
                .sort({ createdAt: req.query.sort });
                res.json(posts);
        } catch (err) {
            res.sendStatus(400);
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
                $pull: { //The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
                    likes: req.user._id
                }
            }, {
                new: true //set the new option to true to return the document after update was applied.
            });
            res.json(post);
        } catch (err) {
            res.status(500).json(err);
        }
    }


}

module.exports = new Posts();