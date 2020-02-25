/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

var chai = require('chai');
var assert = chai.assert;
const helper = require('../utilities/helper.js');
const test_helper = require('../utilities/test-helper.js');
const db = require('../db.js');
let testThread = test_helper.testThread;
let testReply = test_helper.testReply;
let testDelete = test_helper.testDelete;
let testReport = test_helper.testReport;

suite('Unit Tests', function() {
    test('createThread_Success', (done) => {
        helper.createThread(testThread.board, testThread.text, testThread.delete_password).then(thread => {
            db.Thread.findOne({_id: thread._id}, (err, thread) => {
                assert.isDefined(thread);
                assert.equal(thread.text, testThread.text);
                assert.equal(thread.delete_password, testThread.delete_password);
                done();
            });
        }).catch(done);
    });

    test('createReply_Success', (done) => {
        helper.createThread(testThread.board, testThread.text, testThread.delete_password).then(thread => {
            helper.createReply(testThread.board, thread._id, testReply.text, testReply.delete_password).then(reply => {
                db.Reply.findOne({_id: reply._id}, (err, reply) => {
                    assert.isDefined(reply);
                    assert.equal(reply.text, testReply.text);
                    assert.equal(reply.delete_password, testReply.delete_password);
                    done();
                });
            }).catch(done);
        }).catch(done);
    });

    test('createReply_WrongBoard', (done) => {
         helper.createThread(testThread.board, testThread.text, testThread.delete_password).then(thread => {
            helper.createReply('wrong board', thread._id, testReply.text, testReply.delete_password).then(() => {})
            .catch((err) => {
                assert.equal(err, 'Board does not exist.');
            }).then(done, done);
        }).catch(done);
    });

    test('createReply_NonexistentThread', (done) => {
        helper.createThread(testThread.board, testThread.text, testThread.delete_password).then(thread => {
           helper.createReply(testThread.board, 'no thread', testReply.text, testReply.delete_password).then(() => {})
           .catch((err) => {
               assert.equal(err, 'Thread does not exist.');
           }).then(done, done);
       }).catch(done);
   });

   test('createReply_ThreadNotInBoard', (done) => {
        helper.createThread('another board', testThread.text, testThread.delete_password).then(diffThread => {
            helper.createThread(testThread.board, testThread.text, testThread.delete_password).then(thread => {
                helper.createReply(diffThread.board, thread._id, testReply.text, testReply.delete_password).then(() => {})
                .catch((err) => {
                    assert.equal(err, 'Thread does not exist in this board.');
                }).then(done, done);
            }).catch(done);
        }).catch(done);
    });

    test('validateBoardAndThread_Success', (done) => {
        helper.createThread(testThread.board, testThread.text, testThread.delete_password).then(thread => {
            helper.validateBoardAndThread(testThread.board, thread._id).then(result => {
                assert.isDefined(result);
                assert.equal(result.text, testThread.text);
                assert.equal(result.delete_password, testThread.delete_password);
                done();
            }).catch(done);
        }).catch(done);
    });

    test('validateBoardAndThread_NonexistentBoard', (done) => {
        helper.createThread(testThread.board, testThread.text, testThread.delete_password).then(thread => {
            helper.validateBoardAndThread('board', thread._id).then(result => {})
            .catch(err => {
                assert.equal(err, 'Board does not exist.');
            }).then(done, done);
        }).catch(done);
    });

    test('validateBoardAndThread_NonexistentThread', (done) => {
        helper.createThread(testThread.board, testThread.text, testThread.delete_password).then(thread => {
            helper.validateBoardAndThread(testThread.board, 'thread').then(result => {})
            .catch(err => {
                assert.equal(err, 'Thread does not exist.');
            }).then(done, done);
        }).catch(done);
    });

    test('validateBoardAndThread_ThreadNotInBoard', (done) => {
        helper.createThread('another board', testThread.text, testThread.delete_password).then(diffThread => {
            helper.createThread(testThread.board, testThread.text, testThread.delete_password).then(thread => {
                helper.validateBoardAndThread(diffThread.board, thread._id).then(() => {})
                .catch((err) => {
                    assert.equal(err, 'Thread does not exist in this board.');
                }).then(done, done);
            }).catch(done);
        }).catch(done);
    });

    test('validateThreadAndReply_Success', (done) => {
        helper.createThread(testThread.board, testThread.text, testThread.delete_password).then(thread => {
            helper.createReply(testThread.board, thread._id, testReply.text, testReply.delete_password).then((result) => {
                helper.validateThreadAndReply(thread._id, result._id).then(result => {
                    assert.isDefined(result);
                    assert.equal(result.text, testReply.text);
                    assert.equal(result.delete_password, testReply.delete_password);
                    done();
                }).catch(done);
            }).catch(done);
        }).catch(done);
    });

    test('validateThreadAndReply_NonexistentReply', (done) => {
        helper.createThread(testThread.board, testThread.text, testThread.delete_password).then(thread => {
            helper.createReply(testThread.board, thread._id, testReply.text, testReply.delete_password).then((reply) => {
                helper.validateThreadAndReply(thread._id, 'reply').then(() => {})
                .catch((err) => {
                    assert.equal(err, 'Reply does not exist.');
                }).then(done, done);
            }).catch(done);
        }).catch(done);
    });

    test('validateThreadAndReply_ReplyNotInThread', (done) => {
        helper.createThread('another board', testThread.text, testThread.delete_password).then(diffThread => {
            helper.createThread(testThread.board, testThread.text, testThread.delete_password).then(thread => {
                helper.createReply(testThread.board, thread._id, testReply.text, testReply.delete_password).then((reply) => {
                    helper.validateThreadAndReply(diffThread._id, reply._id).then(() => {})
                    .catch((err) => {
                        assert.equal(err, 'Reply does not exist in this thread.');
                    }).then(done, done);
                }).catch(done);
            }).catch(done);
        }).catch(done);
    });
});