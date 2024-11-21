const mongoose = require('mongoose');
const { Schema } = mongoose;

// Event schema to include calendar date and weather details
const eventSchema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
    },
    weather: {
        temperature: { type: String },
        condition: { type: String },
    },
});

// User schema
const accountSchema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    events: [eventSchema],
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
