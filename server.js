require('dotenv').config();
const express = require('express');
const http = require('http');
const db = require('./db/db');
const bodyParser = require('body-parser');
const Task = require('./models/task');
const User = require('./models/user');
const controller = require('./controllers/socket')
const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());

db

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

