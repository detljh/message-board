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
          let newBoard = db.Board({
            name: board
          });

          newBoard.save((err, board) => {
            if (err) console.log(err);

            console.log(board);
          })
        }

        console.log("a");
        
      });

      res.redirect(`/b/${board}`);
    })
    .get((req, res) => {
      //console.log(req);
      res.redirect(`/b/${req.param.board}`);
    });
    
  app.route('/api/replies/:board');

};
