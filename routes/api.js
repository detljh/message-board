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
        if (err) console.log(err);

        if (!doc) {
          doc = db.Board({
            name: board
          });
        }

        let newThread = db.Thread({
          board_id: doc._id,
          text: text,
          delete_password: password
        });

        newThread.save((err, thread) => {
          if (err) console.log(err);
          doc.threads.push({
            $each: [thread],
            $position: 0
          });
          
          doc.save((err, board) => {
            if (err) console.log(err);
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
          threads = board.threads;
        }
        res.send(threads);
      });
    });
    
  app.route('/api/replies/:board');

};
