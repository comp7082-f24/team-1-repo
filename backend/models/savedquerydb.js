const mongoose = require("mongoose");
const { Schema } = mongoose;

const savedQuerySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    searchQuery: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const SavedQuery = mongoose.model('savedQuery', savedQuerySchema);

module.exports = SavedQuery;