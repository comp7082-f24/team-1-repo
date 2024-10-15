const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
    email:    { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;