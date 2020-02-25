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
      const board = req.params.board;
      const text = req.body.text;
      const password = req.body.delete_password;

      helper.createThread(board, text, password).then(() => {
        setTimeout(() => res.redirect(`/b/${board}`), 100);
      }).catch(err => res.status(500).send(err));
    })
    .get((req, res) => {
      db.Board.findOne({name: req.params.board}, (err, board) => {
        if (err || !board) return res.status(400).send('Board does not exist.');

        if (board) {
          let id = board._id;

          db.Thread.find({board_id: id}).select('_id text created_on bumped_on').sort({bumped_on: -1}).limit(10).lean().exec((err, threads) => {
            if (err) return res.status(500).send('Something went wrong. Please try again.');

            let addReplies = new Promise((res, rej) => {
              threads.forEach((thread, index, array) => {
                db.Reply.find({thread_id: thread._id}).select('_id text created_on').sort({created_on: -1}).limit(3).lean().exec((err, replies) => {
                  if (err) return rej('Something went wrong. Please try again.');
                  if (index == array.length - 1) res();

                  thread['replies'] = replies;
                  thread['replycount'] = replies.length;
                });
              });
            });
            
            addReplies.then(() => {
              res.json(threads);
            }).catch(err => res.status(500).send(err));
          });
        }
      });
    })
    .delete((req, res) => {
      const board = req.params.board;
      const thread_id = req.body.thread_id;
      const password = req.body.delete_password;

      helper.validateBoardAndThread(board, thread_id).then(result => {
        if (result.delete_password != password) return res.json('incorrect password');

        db.Thread.deleteOne({_id: result._id}, (err) => {
          if (err) return res.status(500).send('Thread could not be deleted.');
          
          db.Reply.deleteMany({thread_id: result._id}, (err) => {
            res.json('success');
          });
        });
      }).catch(err => res.send(err));
    })
    .put((req, res) => {
      const board = req.params.board;
      const thread_id = req.body.thread_id || req.body.report_id;

      helper.validateBoardAndThread(board, thread_id).then(result => {
        db.Thread.updateOne({_id: result._id}, {reported: true}, (err) => {
          if (err) return res.status(500).send('Thread could not be reported.');
          
          res.json('success');
        });
      }).catch(err => res.send(err));
    });
    
  app.route('/api/replies/:board')
    .post((req, res) => {
      const board = req.params.board;
      const thread_id = req.body.thread_id;
      const text = req.body.text;
      const password = req.body.delete_password;

      helper.createReply(board, thread_id, text, password).then((result) => {
        res.redirect(`/b/${board}/${thread_id}`);
      }).catch(err => res.status(500).send(err));
    })
    .get((req, res) => {
      const board = req.params.board;
      const thread = req.query.thread_id;
      if (!thread) return res.status(400).send('Please input the thread id.');

      helper.validateBoardAndThread(board, thread, '_id text created_on bumped_on').then(result => {
        db.Reply.find({thread_id: result._id}).select('_id text created_on').lean().exec((err, replies) => {
          result['replies'] = replies;
          result['replycount'] = replies.length;
          res.json(result);
        });
      }).catch(err => res.status(400).send(err));;
    })
    .delete((req, res) => {
      const board = req.params.board;
      const thread_id = req.body.thread_id;
      const password = req.body.delete_password;
      const reply_id = req.body.reply_id;
      
      helper.validateBoardAndThread(board, thread_id).then(thread => {
        helper.validateThreadAndReply(thread_id, reply_id).then(reply => {
          if (reply.delete_password != password) return res.send('incorrect password');
          db.Reply.updateOne({_id: reply_id}, {text: '[deleted]'}, (err) => {
            if (err) res.send('Reply could not be deleted.');
            res.json('success');
          })
        }).catch(err => res.send(err));
      }).catch(err => res.send(err));
    })
    .put((req, res) => {
      const board = req.params.board;
      const thread_id = req.body.thread_id;
      const reply_id = req.body.reply_id;

      helper.validateBoardAndThread(board, thread_id).then(thread => {
        helper.validateThreadAndReply(thread_id, reply_id).then(reply => {
          db.Reply.updateOne({_id: reply_id}, {reported: true}, (err) => {
            if (err) res.send('Reply could not be reported.');
            res.json('success');
          })
        }).catch(err => res.send(err));
      }).catch(err => res.send(err));
    });
};
