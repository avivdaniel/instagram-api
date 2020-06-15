const express = require('express');
const routes = express.Router();
const users = require('../controllers/users');

routes.get('/users', users.getAll);
routes.put('/users', users.create)
routes.get('/health', (req, res) => {
    res.send()
});

module.exports = routes;