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

module.exports = router;