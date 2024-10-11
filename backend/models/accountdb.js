const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: String, required: false },
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;