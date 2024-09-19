const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    fcmToken: String, 
});

module.exports = mongoose.model('User', userSchema);
