const mongoose = require("mongoose");
const { Schema } = mongoose;

const savedSearchSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    searchQuery: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const savedSearch = mongoose.model('savedSearch', savedSearchSchema);

module.exports = savedSearch;