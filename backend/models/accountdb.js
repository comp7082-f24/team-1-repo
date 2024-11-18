const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new mongoose.Schema({
    title: String,
    date: Date,
    description: String,
    // Add other event fields as needed
});

const accountSchema = new Schema({
    email:    { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    events: [eventSchema], // Add an array of events to the user schema
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;