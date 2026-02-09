require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Validator = require('validatorjs');
const {User} = require('./db');

const secret = process.env.JWT_SECRET || process.env.jwt_secret_key;

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({message:'No token provided'});

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({message:'Invalid token'});
    }
};

const register = async (req, res) => {
    try {
        const {email, password, username} = req.body;
        const validation = new Validator(req.body, {
            email: 'required|email',
            password: 'required|min:8',
            username: 'required'
        });

        if (validation.fails()) return res.status(400).json({errors: validation.errors.all()});

        const existingUser = await User.findOne({$or: [{email}, {username}]});
        if (existingUser) return res.status(400).json({message:'User exists'});

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({email, password: hashedPassword, username});
        await user.save();
        res.status(201).json({message:'Success'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign({id: user._id, username: user.username}, secret, {expiresIn: '1h'});
        res.json({token});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {authMiddleware, register, login};