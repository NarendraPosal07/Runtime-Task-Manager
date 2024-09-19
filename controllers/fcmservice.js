const admin = require('firebase-admin');
const serviceAccount = require('../task-manager-74b4f-firebase-adminsdk-afn7u-b571750c45.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (token, payload) => {
    try {
        await admin.messaging().send({
            token,
            notification: payload.notification,
            data: payload.data,
        });
        console.log('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = { sendNotification };
