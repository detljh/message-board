/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

module.exports = function (app, db) { 
  app.route('/api/threads/:board')
    .post((req, res) => {
      const board = req.body.board;
      const text = req.body.text;
      const password = req.body.delete_password;
      
      db.Board.findOne({name: board}, (err, doc) => {
        if (err) return res.send('Something went wrong. Please try again.');

        if (!doc) {
          doc = db.Board({
            name: board
          });
        }

        let newThread = db.Thread({
          board_id: doc._id,
          text: text,
          delete_password: password,
          created_on: new Date(),
          bumped_on: new Date()
        });

        newThread.save((err, thread) => {
          if (err) return res.send('Thread could not be created.');
          
          doc.save((err, board) => {
            if (err) return res.send('Board could not be updated.');
          });
        });
        res.redirect(`/b/${board}`);
      });
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
    });
    
  app.route('/api/replies/:board')
    .post((req, res) => {
      const board = req.body.board;
      const thread_id = req.body.thread_id;
      const text = req.body.text;
      const password = req.body.delete_password;
      db.Board.findOne({name: board}, (err, board) => {
        if (err || !board) return res.send('Board does not exist');

        db.Thread.findOne({_id: thread_id}, (err, thread) => {
          if (err || !thread) return res.send('Thread does not exist');
          if (thread.board_id.toString() != board._id.toString()) return res.send('Thread does not exist in this board');
  
          let date = new Date();
          let newReply = db.Reply({
            thread_id: thread._id,
            text: text,
            delete_password: password,
            created_on: date
          });
  
          newReply.save((err, reply) => {
            if (err) return res.send('Reply could not be saved');
            
            thread.bumped_on = date;
            thread.replies.push(reply);
            thread.save((err, thread) => {
              if (err) return res.send('Something went wrong. Please try again.');

              res.redirect(`/b/${board.name}/${thread._id}`);
            });
          })
        })
      }); 
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
              console.log(reply);
            });
            res.json(thread);
          });
        }
      });
    });
};
