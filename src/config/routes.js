const express = require('express');
const users = require('../controllers/users');
const posts = require('../controllers/posts');
const comments = require('../controllers/comments');
const auth = require('../middlewares/auth');
// const fs = require('fs');


const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file);
        cb(null, 'public/posts')
    },
    filename: function (req, file, cb) {
        const nameArr = file.originalname.split('.');
        const extension = nameArr[nameArr.length - 1];
        let filename = Math.random().toString(36).substr(2, 9);
        cb(null, filename + '.' + extension);
    }
});

const upload = multer({
    storage: storage,
    limits: { fieldSize: 25 * 1024 * 1024 }
});
const routes = express.Router();

//users
routes.get('/users', auth, users.getAll);
routes.put('/users', users.create);
routes.post('/users/login', users.login);
routes.get('/users/me', auth, users.me);
routes.get('/users/check', users.check);
routes.get('/users/:id', auth, users.getUserById);
routes.post('/users/:id', auth, upload.single('avatar'), users.editUser),
    routes.get('/users/:id/posts', auth, users.getPosts);

//posts
routes.get('/posts', auth, posts.getAll);
routes.put('/posts', auth, upload.single('image'), posts.create);
routes.get('/posts/:id', auth, posts.getPostById);
routes.post('/posts/:id/likes', auth, posts.like);
routes.put('/posts/:id/comment', auth, comments.create);
routes.get('/posts/:id/comment', auth, comments.getAll);
routes.delete('/posts/:id/likes/:userId', auth, posts.unlike);


//health
routes.get('/health', (req, res) => {
    res.send()
});

module.exports = routes;