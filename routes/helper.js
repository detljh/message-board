var db = require('../db.js');

/*
* Create a new thread
* @param board Name of board
* @param text Thread text
* @param password Password used to delete thread
* @return Created thread on success otherwise error message
*/
const createThread = (board, text, password) => {
    db.Board.findOne({name: board}, (err, doc) => {
        if (err) return 'Something went wrong. Please try again.';

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
        if (err) return 'Thread could not be created.';
        
        doc.save((err, board) => {
            if (err) 'Board could not be updated.';
        });
        return thread;
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
    db.Board.findOne({name: board}, (err, board) => {
        if (err || !board) return 'Board does not exist';

        db.Thread.findOne({_id: thread_id}, (err, thread) => {
            if (err || !thread) return 'Thread does not exist';
            if (thread.board_id.toString() != board._id.toString()) return 'Thread does not exist in this board';

            let date = new Date();
            let newReply = db.Reply({
                thread_id: thread._id,
                text: text,
                delete_password: password,
                created_on: date
            });

            newReply.save((err, reply) => {
                if (err) return 'Reply could not be saved';
                
                thread.bumped_on = date;
                thread.replies.push(reply);
                thread.save((err, thread) => {
                    if (err) return 'Something went wrong. Please try again.';
                    return reply;
                });
            })
        })
    }); 
}

module.exports = {
    createThread,
    createReply
}