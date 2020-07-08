const express = require('express');
const routes = express.Router();
const users = require('../controllers/users');
const posts = require('../controllers/posts');
const auth = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

//users
routes.get('/users', users.getAll);
routes.put('/users', users.create);
routes.post('/users/login', users.login);
routes.get('/users/me', auth, users.me);
routes.get('/users/check', users.check)

//posts
routes.put('/posts', posts.create);

//health
routes.get('/health', (req, res) => {
    res.send()
});

module.exports = routes;