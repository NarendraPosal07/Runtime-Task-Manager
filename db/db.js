const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/taskdb').then((req, res) => {
    console.log("database connected");
}).catch((err) => {
    console.log(err);
})
mongoose.connect('mongodb://localhost:27017/taskdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

module.exports = mongoose