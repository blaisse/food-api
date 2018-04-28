const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    tresc: String,
    autor: { type: Schema.Types.ObjectId, ref: 'user' }
});

const commentModel = mongoose.model('comments', CommentSchema);