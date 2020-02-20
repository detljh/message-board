const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true});
const Schema = mongoose.Schema;
const boardSchema = new Schema({
    name: String,
    threads: {
        type: Array,
        default: []
    }
});
const threadSchema = new Schema({
    board_id: Schema.Types.ObjectId,
    text: String,
    created_on: {
        type: Date,
        default: new Date()
    },
    bumped_on: {
        type: Date,
        default: new Date()
    },
    reported: {
        type: Boolean,
        default: false
    },
    delete_password: String,
    replies: {
        type: Array,
        default: []
    }
});
const replySchema = new Schema({
    thread_id: Schema.Types.ObjectId,
    text: String,
    delete_password: String,
    created_on: {
        type: Date,
        default: new Date()
    },
    reported: {
        type: Boolean,
        default: false
    }
});

const Board = mongoose.model('board', boardSchema);
const Thread = mongoose.model('thread', threadSchema);
const Reply = mongoose.model('reply', replySchema);

module.exports = {
    Board,
    Thread,
    Reply
};