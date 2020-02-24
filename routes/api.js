/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var helper = require('./helper.js');

module.exports = function (app, db) { 
  app.route('/api/threads/:board')
    .post((req, res) => {
      const board = req.body.board;
      const text = req.body.text;
      const password = req.body.delete_password;
      helper.createThread(board, text, password);
      res.redirect(`/b/${board}`);
    })
    .get((req, res) => {
      db.Board.findOne({name: req.params.board}, (err, board) => {
        if (err || !board) return res.send('Board does not exist.');

        if (board) {
          let id = board._id;

          db.Thread.find({board_id: id}).select('_id text created_on bumped_on replies').sort({bumped_on: -1}).limit(10).lean().exec((err, threads) => {
            if (err) return res.send('Something went wrong. Please try again.');

            threads.forEach(thread => {
              thread['replycount'] = thread.replies.length;
            });

            res.json(threads);
          });
        }
      });
    })
    .delete((req, res) => {

    });
    
  app.route('/api/replies/:board')
    .post((req, res) => {
      const board = req.params.board;
      const thread_id = req.body.thread_id;
      const text = req.body.text;
      const password = req.body.delete_password;
      helper.createReply(board, thread_id, text, password);
      res.redirect(`/b/${board}/${thread_id}`);
    })
    .get((req, res) => {
      const board = req.params.board;
      const thread = req.query.thread_id;
      if (!thread) return res.send('Please input the thread id');

      db.Board.findOne({name: board}, (err, board) => {
        if (err || !board) return res.send('Board does not exist');

        if (board) {
          let id = board._id;

          db.Thread.findOne({_id: thread}).select('board_id _id text created_on bumped_on replies').lean().exec((err, thread) => {
            if (!thread || err) return res.send('Thread does not exist');
            if (thread.board_id.toString() != id.toString()) return res.send('Thread does not exist in this board');

            delete thread.board_id;
            thread.replies.forEach(reply => {
              delete reply.reported;
              delete reply.thread_id;
              delete reply.delete_password;
              delete reply.__v;
            });
            res.json(thread);
          });
        }
      });
    });
};
