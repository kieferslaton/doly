const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true, 
        trim: true
    }, 
    due: {
        type: Date,
    },
    complete: {
        type: Boolean,
        default: false
    },
    tags: {
        type: Array,
    }
})

const Todo = mongoose.model("Todo", TodoSchema);
module.exports = Todo;