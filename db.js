const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const replySchema = new Schema({
    thread_id: Schema.Types.ObjectId,
    text: String,
    delete_password: String,
    created_on: Date,
    reported: {
        type: Boolean,
        default: false
    }
});
const threadSchema = new Schema({
    board_id: Schema.Types.ObjectId,
    text: String,
    created_on: Date,
    bumped_on: Date,
    reported: {
        type: Boolean,
        default: false
    },
    delete_password: String,
    replies: Array
});
const boardSchema = new Schema({
    name: String
});

const Board = mongoose.model('board', boardSchema);
const Thread = mongoose.model('thread', threadSchema);
const Reply = mongoose.model('reply', replySchema);

module.exports = {
    Board,
    Thread,
    Reply
};