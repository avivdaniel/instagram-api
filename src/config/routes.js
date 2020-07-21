const express = require('express');
const users = require('../controllers/users');
const posts = require('../controllers/posts');
const auth = require('../middlewares/auth');
// const fs = require('fs');


const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/posts')
    },
    filename: function (req, file, cb) {
        const nameArr = file.originalname.split('.');
        const extension = nameArr[nameArr.length - 1];
        let filename = Math.random().toString(36).substr(2, 9);
        cb(null, filename + '.' + extension);
    }
});

const upload = multer({ storage: storage });
const routes = express.Router();

//users
routes.get('/users', auth, users.getAll);
routes.put('/users', users.create);
routes.post('/users/login', users.login);
routes.get('/users/me', auth, users.me);
routes.get('/users/check', users.check);
routes.get('/users/:id', auth, users.getUserById);
routes.get('/users/:id/posts', auth, users.getPosts);

//posts
routes.get('/posts', auth, posts.getAll);
routes.put('/posts', auth, upload.single('image'), posts.create);
routes.get('/posts/:id', posts.getPostById);
routes.post('/posts/:id/likes', auth, posts.like);
routes.delete('/posts/:id/likes/:userId', auth, posts.unlike);


//health
routes.get('/health', (req, res) => {
    res.send()
});

module.exports = routes;