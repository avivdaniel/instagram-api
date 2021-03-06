const md5 = require('md5');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const User = require('../models/user');
const config = require('../config/env/index');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
const makeUniqueImageName = require('../utils/unique')
const fs = require('fs');
const ERR_DUPLICATE_VALUE = 11000;
const DURATION_60D = 60 * 60 * 24 * 60 * 1000;

class Users {

    async getAll(req, res) {
        const regex = new RegExp(req.query.username || '', 'i')
        try {
            const users = await User.find({
                username: regex
            })
                .select(['username', 'avatar', 'bio'])
                .limit(10);
            res.json(users);
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id)
                .select(['_id', 'fullName', 'username', 'bio', 'avatar', 'createdAt']);
            if (!user) {
                res.sendStatus(400);
                return;
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async getPosts(req, res) {
        try {
            const posts = await Post.find({
                user: ObjectId(req.params.id)
            })
                .populate('user', ['_id', 'avatar', 'username'])
                .sort({ createdAt: req.query.sort || 1 });
            res.json(posts);
        } catch (err) {
            console.log(err);
            res.sendStatus(400);
        }
    }

    async create(req, res) {
        const newUser = new User(req.body);
        newUser.password = md5(newUser.password);
        try {
            const createUser = await newUser.save();
            res.status(201).json(createUser);

        } catch (err) {
            if (err.code === ERR_DUPLICATE_VALUE) {
                res.sendStatus(409);
                return;
            }
            res.status(400).json(err);
        }
    }

    async login(req, res) {
        const credentials = req.body;
        try {
            const user = await User.findOne({
                username: credentials.username,
                password: md5(credentials.password)
            });
            if (!user) {
                res.sendStatus(401);
                return;
            }
            const token = jwt.sign({ id: user._id }, config.secret)
            if (config.dev) {
                res.cookie(config.cookieName, token, { maxAge: DURATION_60D });
                res.json(user).send();
                return;
            }
            res.cookie(config.cookieName, token, { maxAge: DURATION_60D, sameSite: 'None', secure: true });
            res.json(user).send();
        } catch (error) {
            res.sendStatus(500);
        }
    }

    async check(req, res) {
        const { username, email } = req.query;
        if (!username && !email) {
            res.sendStatus(400);
            return;
        }
        let property = email ? 'email' : 'username';
        try {
            const isExist = await User.exists({
                [property]: req.query[property]
            });
            res.json(isExist);
        } catch (err) {
            console.log(err)
            res.status(400).json(err);
        }

    }

    async editUser(req, res) {
        const id = req.params.id;
        const queryOptions = {
            upsert: true,
            omitUndefined: true,
            new: true
        };
        let updatedValues = {
            fullName: req.body.fullName,
            bio: req.body.bio
        }

        if (!id && !updatedValues) {
            res.sendStatus(400);
            return;
        }
        if (req.user._id != id) {
            res.sendStatus(403);
            return;
        }
        if (req.body.avatar) {
            const base64Data = req.body.avatar.split(';base64,').pop();
            const avatarName = makeUniqueImageName();
            updatedValues.avatar = avatarName;
            fs.writeFile("public/avatars/" + avatarName, base64Data, 'base64', err => {
                if (err) console.log(err);
            });
        }
        try {
            let updatedUser = await User.findByIdAndUpdate(id, updatedValues, queryOptions)
                .select(['_id', 'fullName', 'username', 'bio', 'avatar', 'createdAt']);
            if (!updatedUser) {
                res.sendStatus(401);
                return;
            }
            res.json(updatedUser);
        } catch (err) {
            console.log(err)
            res.status(400).json(err);
        }

    }

    logout(req, res) {
        res.clearCookie(config.cookieName).sendStatus(200);
    }

    me(req, res) {
        res.json(req.user);
    }
}

module.exports = new Users();