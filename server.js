const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")));

const connection = process.env.MONGODB_URI || "mongodb+srv://kieferslaton:aHEROneverruns72591@cluster0-xcgu6.mongodb.net/doly?retryWrites=true&w=majority";
mongoose.connect(connection, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(() => console.log("Database connected successfully.")).catch(err => console.log(err));

const todoRouter = require('./routes/todo-route');
const userRouter = require('./routes/user-route');

app.use('/todos', todoRouter);
app.use('/users', userRouter);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"))
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port`)
});