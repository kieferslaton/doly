const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = require('express').Router();
let User = require('../models/User-model');

router.route('/').post((req, res) => {
    User.findOne(req.body.username).then(user => {
    if (user) {
        return res.status(422).send('User already exists')
    }

    const username = req.body.username
    const hash = bcrypt.hash(req.body.password, 10);
    const color = req.body.color
    
    const newUser = new User({username, password: hash, color})
    newUser.save()
    console.log(newUser)

    const token = jwt.sign({ userId: newUser._id }, config.JWT_SECRET, {
        expiresIn: '7d'
    })
    res.status(201).json(token)
}).catch(err => res.status(400).json('Error: '+err))
})


module.exports = router
