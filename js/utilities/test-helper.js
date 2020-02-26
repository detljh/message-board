const db = require('../../db.js');

let testThread = {
    board: 'test',
    text: 'text test',
    delete_password: 'password'
  };
  
  let testReply = {
    text: 'reply text',
    delete_password: '1'
  };
  
  let testDelete = {
    board: 'test',
    text: 'to be deleted',
    delete_password: 'what'
  };
  
  let testReport = {
    board: 'test',
    text: 'to be reported',
    delete_password: 'report'
  };
  
  const findThread = (thread_id) => {
    return new Promise((res, rej) => {
      db.Thread.findOne({_id: thread_id}, (err, thread) => {
        if (err) return rej(err);
        if (!thread) return res([false, null]);
        return res([true, thread]);
      })
    });
  }
  
  const findReply = (reply_id) => {
    return new Promise((res, rej) => {
      db.Reply.findOne({_id: reply_id}, (err, reply) => {
        if (err) return rej(err);
        if (!reply) return res([false, null]);
        return res([true, reply]);
      })
    });
  }

  module.exports = {
      testDelete,
      testReply,
      testReport,
      testThread,
      findReply,
      findThread
  };