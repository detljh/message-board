var db = require('../../db.js');

const DB_ERR = 'Something went wrong. Please try again.';
const THREAD_EXIST_ERR = 'Thread does not exist.';
const BOARD_EXIST_ERR = 'Board does not exist.';
const REPLY_EXIST_ERR = 'Reply does not exist.';

/*
* Create a new thread
* @param board Name of board
* @param text Thread text
* @param password Password used to delete thread
* @return Created thread on success otherwise error message
*/
const createThread = (board, text, password) => {
    return new Promise((res, rej) => {
        db.Board.findOne({name: board}, (err, doc) => {
            if (err) return rej(DB_ERR);
    
            if (!doc) {
                doc = db.Board({
                    name: board
                });
            }
    
            let date = new Date();
            let newThread = db.Thread({
                board_id: doc._id,
                text: text,
                delete_password: password,
                created_on:  date,
                bumped_on: date
            });
    
            newThread.save((err, thread) => {
                if (err) return rej('Thread could not be created.');
                
                doc.save((err, board) => {
                    if (err) return rej('Board could not be updated.');
                    return res(thread);
                });
            });
        });
    });
}

/*
* Create a new reply
* @param board Name of board
* @param thread_id ID of thread to reply to
* @param text Reply text
* @param password Password used to delete reply
* @return Created reply on success otherwise error message
*/
const createReply = (board, thread_id, text, password) => {
    return new Promise((res, rej) => {
        db.Board.findOne({name: board}, (err, board) => {
            if (err || !board) return rej(BOARD_EXIST_ERR);
    
            db.Thread.findOne({_id: thread_id}, (err, thread) => {
                if (err || !thread) return rej(THREAD_EXIST_ERR);
                if (thread.board_id.toString() != board._id.toString()) return rej('Thread does not exist in this board.');
    
                let date = new Date();
                let newReply = db.Reply({
                    thread_id: thread._id,
                    text: text,
                    delete_password: password,
                    created_on: date
                });
    
                newReply.save((err, reply) => {
                    if (err) return rej('Reply could not be saved.');
                    
                    thread.bumped_on = date;
                    thread.save((err, thread) => {
                        if (err) return rej(DB_ERR);
                        return res(reply);
                    });
                });
            })
        }); 
    });
}

/*
* Validate board exists and thread exists within the board
* @param board Name of board
* @param thread_id ID of thread
* @param fields Fields to select
* @return Thread if successful otherwise error message 
*/
const validateBoardAndThread = (board, thread_id, fields='board_id _id text delete_password created_on bumped_on reported') => {
    return new Promise((res, rej) => {
        db.Board.findOne({name: board}, (err, board) => {
            if (err || !board) return rej(BOARD_EXIST_ERR);
            
            let id = board._id;
            db.Thread.findOne({_id: thread_id}).select(fields + ' board_id').lean().exec((err, thread) => {
                if (!thread || err) return rej(THREAD_EXIST_ERR);
                if (thread.board_id.toString() != id.toString()) return rej('Thread does not exist in this board.');
                delete thread.board_id;
                return res(thread);
            });
        });  
    })
}

/*
* Validate reply exists within the thread
* @param thread_id ID of thread
* @param reply_id ID of reply
* @param fields Fields to select
* @return Reply if successful otherwise error message 
*/
const validateThreadAndReply = (thread_id, reply_id, fields='thread_id _id text delete_password created_on reported') => {
    return new Promise((res, rej) => {
        db.Reply.findOne({_id: reply_id}).select(fields).lean().exec((err, reply) => {
            if (err || !reply) return rej(REPLY_EXIST_ERR);
            if (thread_id.toString() != reply.thread_id.toString()) return rej('Reply does not exist in this thread.');
            delete reply.thread_id;
            return res(reply);
        });  
    });
}

module.exports = {
    createThread,
    createReply,
    validateBoardAndThread,
    validateThreadAndReply,
    DB_ERR,
    REPLY_EXIST_ERR,
    THREAD_EXIST_ERR,
    BOARD_EXIST_ERR
};