const router = require('express').Router();
let Todo = require('../models/todo-model');

router.route('/').get((req, res) => {
    Todo.find().then(todos => res.json(todos)).catch(err => res.status(400).json('Error: ' + err));
})

router.route('/add').post((req, res) => {
    const username = req.body.username
    const task = req.body.task
    const due = req.body.due
    const complete = false
    const tags = req.body.tags

    const newUser = new Todo({username, task, due, complete, tags});

    newUser.save().then(() => res.json('Todo Added')).catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Todo.findById(req.params.id).then(todo => res.json(todo)).catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Todo.findByIdAndDelete(req.params.id).then(() => res.json('Exercise deleted.')).catch(err => res.status(400).json('Error: ' + err))
})

router.route('/update/:id').post((req, res) => {
    Todo.findById(req.params.id).then(todo => {
        todo.username = req.body.username;
        todo.task = req.body.task;
        todo.due = req.body.due;
        todo.complete = req.body.complete;
        todo.tags = req.body.tags;

        todo.save().then(() => res.json('Todo updated')).catch(err => res.status(400).json('Error: ' + err))
    }).catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;