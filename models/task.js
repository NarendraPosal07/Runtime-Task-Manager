const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    assignedTo: String, 
    dueDate: Date,
    comments: [
        {
            user: String,
            comment: String,
            timestamp: Date,
        }
    ],
    status: { type: String, default: 'pending' } 
});

module.exports = mongoose.model('Task', taskSchema);
