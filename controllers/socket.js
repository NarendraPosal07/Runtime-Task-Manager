const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Task = require('../models/task');
const User = require('../models/user');
const { sendNotification } = require('./fcmservice');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);




const soketFunction = (req, res) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('updateTask', async (data) => {
            try {
                const updatedTask = await Task.findByIdAndUpdate(data.taskId, data.update, { new: true });
                io.emit('taskUpdated', updatedTask);

                const assignedUser = await User.findOne({ email: updatedTask.assignedTo });
                if (assignedUser && assignedUser.fcmToken) {
                    sendNotification(assignedUser.fcmToken, {
                        notification: {
                            title: 'Task Updated',
                            body: `Task "${updatedTask.title}" has been updated.`,
                        },
                        data: {
                            taskId: updatedTask._id.toString(),
                        },
                    });
                }
            } catch (error) {
                console.error('Error updating task:', error);
            }
        });

        socket.on('assignTask', async (data) => {
            try {
                const newTask = new Task(data);
                await newTask.save();
                io.emit('taskAssigned', newTask);

                const assignedUser = await User.findOne({ email: newTask.assignedTo });
                if (assignedUser && assignedUser.fcmToken) {
                    sendNotification(assignedUser.fcmToken, {
                        notification: {
                            title: 'New Task Assigned',
                            body: `You have been assigned a new task: "${newTask.title}".`,
                        },
                        data: {
                            taskId: newTask._id.toString(),
                        },
                    });
                }
            } catch (error) {
                console.error('Error assigning task:', error);
            }
        });

        socket.on('addComment', async (data) => {
            try {
                const task = await Task.findById(data.taskId);
                task.comments.push({ user: data.user, comment: data.comment, timestamp: new Date() });
                await task.save();
                io.emit('commentAdded', task);

                const assignedUser = await User.findOne({ email: task.assignedTo });
                if (assignedUser && assignedUser.fcmToken) {
                    sendNotification(assignedUser.fcmToken, {
                        notification: {
                            title: 'New Comment on Your Task',
                            body: `New comment on task "${task.title}": "${data.comment}".`,
                        },
                        data: {
                            taskId: task._id.toString(),
                        },
                    });
                }
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

module.exports = { soketFunction }