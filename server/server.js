const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const connection = process.env.ATLAS_URI;
mongoose.connect(connection, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(() => console.log("Database connected successfully.")).catch(err => console.log(err));

const todoRouter = require('./routes/todo-route');
const userRouter = require('./routes/user-route');

app.use('/todos', todoRouter);
app.use('/users', userRouter);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port`)
});