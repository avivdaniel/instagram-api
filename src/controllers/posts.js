const Post = require('../models/post');
var fs = require('fs');
class Posts {

    async create(req, res) {
        /*
            You can use "jpg" extension hardcoded in the output file.
            Don't worry, it will work even if the user will upload a PNG file.
        */
        const makeImageName = () => {
            return Math.random().toString(36).substr(2, 9) + '.jpg';
        }

        const base64Data = req.body.image;
        const base64Image = base64Data.split(';base64,').pop();
        const imageName = makeImageName();
        console.log(imageName);
        fs.writeFile("public/posts/" + imageName, base64Image, 'base64', err => {
            if (err) console.log(err);
        });




        // let imageName = 'public/posts/test.jpg';
        // let image = req.body.image; // base64 string that you get from the frontend
        // const base64Data = image.replace(/^data:image\/png;base64,/, '');
        // // Convert base64 to binary and save it as a file using `fs`
        // require('fs').writeFile(imageName, base64Data, 'base64', function (err) {
        //     console.log(err); // Must handle errors
        // });

        const post = new Post({
            user: req.user._id,
            image: imageName,
            description: req.body.description
        });


        try {
            const createdPost = await post.save();
            console.log(createdPost);
            res.status(201).json(createdPost);
        } catch (err) {
            res.status(400).json(err);
        }
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