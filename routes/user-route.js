const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
let User = require('../models/user-model');

router.route('/').get((req, res) => {
    User.find().then(users => res.json(users)).catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').get((req, res) => {
    User.findById(req.params.id).then(user => res.json(user)).catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    User.findById(req.params.id).then(user => {
        user.username = req.body.username;
        user.password = req.body.password;
        user.color = req.body.color;

        user.save().then(() => res.json('User updated')).catch(err => res.status(400).json('Error: ' + err))
    }).catch(err => res.status(400).json('Error: ' + err));
});

router.route('/signup').post( async (req, res) => {
    const {username, password, password2, color} = req.body;

        let user = await User.findOne({username});
        if(user){
            return res.status(400).send('User already exists')
        }
        if(password !== password2){
            return res.status(401).send('Passwords dont match')
        }

    const newUser = new User({username, password: await bcrypt.hash(password, 10), color})
    newUser.save().then(() => {
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {expiresIn: '7d'})
        res.json(token)
    }).catch(err => res.status(402).json('Error: ' + err));  
})

router.route('/login').post( async (req, res) => {
        const {username, password} = req.body;
        let user = await User.findOne({username});
        if (!user) {
            return res.status(404).send('No user exists with that username')
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if(passwordsMatch) {
            const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
            res.status(200).json(token)
        } else {
            res.status(401).json()
        }
    })

router.route('/accounts').post(async (req, res) => {
    const auth = req.headers.authorization

    if(!auth) {
        return res.status(401).send('No Authorization')
    }

    const {userId} = jwt.verify(auth, process.env.JWT_SECRET)
    const user = await User.findOne({_id: userId})
    if(user){
        res.status(200).json(user)
    } else {
        res.status(404).send("no user found")
    }
})

module.exports = router;