const { Schema, model } = require('mongoose');

const WelcomeAndLeave = new Schema({
    guildID: {
        type: String
    },
    WelcomeChannel: {
        type: String,
        default: 'Not Selected'
    },
    LeaveChannel: {
        type: String,
        default: 'Not Selected'
    }
});

module.exports = model('WlecomeAndLeave', WelcomeAndLeave);