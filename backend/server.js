require('dotenv').config();
const express = require('express');
const path = require('path');
const {authMiddleware, register, login} = require('./auth');
const {User, Blog, Comment} = require('./db');
const {getMusicData} = require('./api');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/register', register);
app.post('/login', login);

app.get('/users/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
});

app.post('/blogs', authMiddleware, async (req, res) => {
    try {
        const {title, text, songName} = req.body;
        const songData = await getMusicData(songName);
        const blog = new Blog({title, text, song: songData, author: req.user.id});
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.get('/blogs', authMiddleware, async (req, res) => {
    const blogs = await Blog.find({author: req.user.id}).populate('author', 'username');
    res.json(blogs);
});

app.get('/blogs/all', async (req, res) => {
    const blogs = await Blog.find().populate('author', 'username').sort({createdAt:-1});
    res.json(blogs);
});
//укjh
app.delete('/blogs/:id', authMiddleware, async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (blog.author.toString() !== req.user.id) return res.status(403).send();
    await Blog.findByIdAndDelete(req.params.id);
    res.json({success: true});
});

app.use((err, req, res, next) => {
    res.status(500).json({message: err.message});
});

app.listen(process.env.PORT || 3000);
//sc