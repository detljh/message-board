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
        if (err) return console.log(err);

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
          if (err) return console.log(err);
          doc.threads.push({
            $each: [thread],
            $position: 0
          });
          
          doc.save((err, board) => {
            if (err) return console.log(err);
          });
        });
        res.redirect(`/b/${board}`);
      });
    })
    .get((req, res) => {
      let threads = [];
      db.Board.findOne({name: req.params.board}, (err, board) => {
        if (err) console.log(err);
        if (board) {
          let id = board._id;
          db.Thread.find({board_id: id}).select('_id text created_on bumped_on replies').sort({bumped_on: -1}).limit(10).lean().exec((err, threads) => {
            if (err) return console.log(err);
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
      const thread = req.body.thread_id;
      const text = req.body.text;
      const password = req.body.delete_password;

      db.Thread.findOne({_id: thread}, (err, doc) => {
        if (err || !doc) return res.send('Thread does not exist');

        let date = new Date();
        let newReply = db.Reply({
          thread_id: doc._id,
          text: text,
          delete_password: password,
          created_on: date
        });

        newReply.save((err, reply) => {
          if (err) return console.log(err);

          db.Thread.updateOne({_id: doc._id}, {bumped_on: date}, (err, thread) => {
            if (err) return console.log(err);
            res.redirect(`/b/${board}/${thread._id}`);
          });
        })
      })
    });

};
