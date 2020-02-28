/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var Browser = require('zombie');
var db = require('../db');
const helper = require('../js/utilities/helper.js');
const test_helper = require('../js/utilities/test-helper.js');
let testThread = test_helper.testThread;
let testReply = test_helper.testReply;
let testDelete = test_helper.testDelete;
let testReport = test_helper.testReport;

chai.use(chaiHttp);

const browser = new Browser();

suite('Functional Tests', function() {
  suiteSetup(() => {
    return Promise.all([db.Board.deleteMany({}), db.Reply.deleteMany({}), db.Thread.deleteMany({})]);
  });

  suite('API ROUTING FOR /api/threads/:board', function() {
    suite('POST', function() {
      test('New thread created', (done) => {
        browser.visit("http://localhost:8888/api").then(() => {
          browser.fill('#board1', testThread.board);
          browser.fill('#newThread textarea[name=text]', testThread.text);
          browser.fill('#newThread input[name=delete_password]', testThread.delete_password);
          browser.pressButton('#newThread input[type=submit]', () => {
            browser.assert.success();
            browser.assert.redirected();
            browser.assert.text('#page-title #top', 'Welcome to /b/test');
            browser.assert.url({pathname: '/b/test'});
            browser.assert.element('#new-thread');
            browser.assert.element('.thread');
            browser.assert.text('.thread .body-text', 'text test');
            done();
          });
        });
      });
    });    
    
    suite('GET', function() {
      test('Created thread is loaded', (done) => {
        browser.visit(`http://localhost:8888/api/threads/${testThread.board}`).then(() => {
          let res = browser.response;
          let body = JSON.parse(res.body);
          testThread.id = body[0]._id;

          browser.assert.success();
          assert.equal(body[0].text, testThread.text);
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('Delete thread successful', done => {
        helper.createThread(testDelete.board, testDelete.text, testDelete.delete_password).then(result => {
          chai.request(server)
            .del(`/api/threads/${testDelete.board}`)
            .send({thread_id: result._id, delete_password: testDelete.delete_password})
            .end(() => {
              test_helper.findThread(result._id).then(data => {
                assert.isFalse(data[0]);
                assert.isNull(data[1]);
                done();
              }).catch(done);
            });
            // Below test not working -> request body remains empty
          // browser.visit(`http://localhost:8888/`).then(() => {
          //   browser.fill('#board3', testDelete.board);
          //   browser.fill('#deleteThread input[name=thread_id]', result._id);
          //   browser.fill('#deleteThread input[name=delete_password]', testDelete.delete_password);
          //   browser.pressButton('Delete thread', () => {
          //     browser.assert.success();
          //     findThread(result._id).then(thread => {
          //       assert.isFalse(thread);
          //       done();
          //     }).catch(err => {
          //       console.log(err);
          //       done();
          //     });
          //   });
          // });
        }).catch(done);
      });

      test('Delete thread unsuccessful', done => {
        browser.visit(`http://localhost:8888/api`).then(() => {
          helper.createThread(testDelete.board, testDelete.text, testDelete.delete_password).then(result => {
            chai.request(server)
            .del(`/api/threads/${testDelete.board}`)
            .send({thread_id: result._id, delete_password: 'wrong password'})
            .end(() => {
              test_helper.findThread(result._id).then(data => {
                assert.isTrue(data[0]);
                assert.isNotNull(data[1]);
                done();
              }).catch(done);
            });
              // Below test not working -> request body remains empty
            // browser.fill('#board3', testDelete.board);
            // browser.fill('#deleteThread input[name=thread_id]', result._id);
            // browser.fill('#deleteThread input[name=delete_password]', 'wrong password');
            // browser.pressButton('Delete thread', () => {
            //   browser.assert.success();
            //   findThread(result._id).then(thread => {
            //     assert.isTrue(thread);
            //     done();
            //   }).catch(err => {
            //     console.log(err);
            //     done();
            //   });
            // });
          }).catch(done);
        });
      });
    });
    
    suite('PUT', function() {
      test('Report thread successful', (done) => {
        browser.visit("http://localhost:8888/api").then(() => {
          helper.createThread(testReport.board, testReport.text, testReport.delete_password).then((result) => {
            browser.fill('#board2', testReport.board);
            browser.fill('#reportThread input[name=thread_id]', result._id);
            browser.pressButton('Report thread', () => {
              test_helper.findThread(result._id).then((data) => {
                assert.isTrue(data[0]);
                assert.isNotNull(data[1]);
                assert.isTrue(data[1].reported);
                done();
              }).catch(done);
            })
          }).catch(done);
        });
      });

      test('Report thread in different board unsuccessful', (done) => {
        browser.visit("http://localhost:8888/api").then(() => {
          helper.createThread(testReport.board, testReport.text, testReport.delete_password).then((result) => {
            browser.fill('#board2', 'wrongBoard');
            browser.fill('#reportThread input[name=thread_id]', result._id);
            browser.pressButton('Report thread', () => {
              test_helper.findThread(result._id).then((data) => {
                assert.isTrue(data[0]);
                assert.isNotNull(data[1]);
                assert.isFalse(data[1].reported);
                done();
              }).catch(done);
            })
          }).catch(done);
        });
      });
    });
  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('New reply created', (done) => {
        browser.visit("http://localhost:8888/api").then(() => {
          browser.fill('#board4', testThread.board);
          browser.fill('#newReply input[name=thread_id]', testThread.id);
          browser.fill('#newReply textarea[name=text]', testReply.text);
          browser.fill('#newReply input[name=delete_password]', testReply.delete_password);
          browser.pressButton('#newReply input[type=submit]', () => {
            browser.assert.success();
            browser.assert.redirected();
            browser.assert.text('#page-title #top', `/b/test/${testThread.id}`);
            browser.assert.url({pathname: `/b/test/${testThread.id}`});
            browser.assert.element('.thread');
            browser.assert.element('.replies');
            browser.assert.element('.reply')
            browser.assert.text('.reply .body-text', testReply.text);
            done();
          });
        });
      });
    });
    
    suite('GET', function() {
      test('Reply is loaded with thread', (done) => {
        browser.visit(`http://localhost:8888/api/replies/${testThread.board}?thread_id=${testThread.id}`).then(() => {
          let res = browser.response;
          let body = JSON.parse(res.body);
          console.log(body);
          let replies = body.replies;

          browser.assert.success();
          assert.equal(replies[0].text, testReply.text);
          assert.equal(replies[0].created_on, body.bumped_on);
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('Report reply successful', (done) => {
        browser.visit("http://localhost:8888/api").then(() => {
          helper.createReply(testThread.board, testThread.id, testReport.text, testReport.delete_password).then((result) => {
            browser.fill('#board5', testThread.board);
            browser.fill('#reportReply input[name=thread_id]', testThread.id);
            browser.fill('#reportReply input[name=reply_id]', result._id)
            browser.pressButton('#reportReply input[type=submit]', () => {
              test_helper.findReply(result._id).then((data) => {
                assert.isTrue(data[0], data[1]);
                assert.isNotNull(data[1]);
                assert.isTrue(data[1].reported, data[1]);
                done();
              }).catch(done);
            })
          }).catch(done);
        });
      });
      
      test('Report reply in wrong board unsuccessful', (done) => {
        browser.visit("http://localhost:8888/api").then(() => {
          helper.createReply(testThread.board, testThread.id, testReport.text, testReport.delete_password).then((result) => {
            browser.fill('#board5', 'wrong board');
            browser.fill('#reportReply input[name=thread_id]', testThread.id);
            browser.fill('#reportReply input[name=reply_id]', result._id)
            browser.pressButton('#reportReply input[type=submit]', () => {
              test_helper.findReply(result._id).then((data) => {
                assert.isTrue(data[0], data[1]);
                assert.isNotNull(data[1]);
                assert.isFalse(data[1].reported, data[1]);
                done();
              }).catch(done);
            })
          }).catch(done);
        });
      });
    });
    
    suite('DELETE', function() {
      test('Delete reply successful', done => {
        helper.createReply(testThread.board, testThread.id, testDelete.text, testDelete.delete_password).then(result => {
          chai.request(server)
            .del(`/api/replies/${testThread.board}`)
            .send({thread_id: testThread.id, delete_password: testDelete.delete_password, reply_id: result._id})
            .end(() => {
              test_helper.findReply(result._id).then(data => {
                assert.isTrue(data[0], data[1]);
                assert.equal(data[1].text, '[deleted]', data[1]);
                done();
              }).catch(done);
            });
          }).catch(done);
        });

      test('Delete reply unsuccessful', done => {
        helper.createReply(testThread.board, testThread.id, testDelete.text, testDelete.delete_password).then(result => {
          chai.request(server)
          .del(`/api/replies/${testThread.board}`)
          .send({thread_id: testThread.id, delete_password: 'wrong password', reply_id: result._id})
          .end(() => {
            test_helper.findReply(result._id).then(data => {
              assert.isTrue(data[0], data[1]);
              assert.equal(data[1].text, testDelete.text, data[1]);
              done();
            }).catch(done);
          });
        }).catch(done);
      });
    });
  });

  suite('UI TESTING FOR /', () => {
    test('New thread created', (done) => {
      browser.visit("http://localhost:8888/").then(() => {
        browser.fill('#new-thread input[name=board]', 'newBoard');
        browser.fill('#new-thread textarea[name=text]', testThread.text);
        browser.fill('#new-thread input[name=delete_password]', testThread.delete_password);
        browser.pressButton('#new-thread button[type=submit]', () => {
          browser.assert.success();
          browser.assert.redirected();
          browser.assert.text('#page-title #top', 'Welcome to /b/newBoard');
          browser.assert.url({pathname: '/b/newBoard'});
          browser.assert.element('#new-thread');
          browser.assert.element('.thread');
          browser.assert.text('.thread .body-text', 'text test');
          done();
        });
      });
    });

    test('Search boards', (done) => {
      browser.visit("http://localhost:8888/").then(() => {
        browser.assert.elements('.board-name', 2);
        browser.fill('#search-board input[name=board]', 'a');
        browser.pressButton('#search-board button[type=submit]', () => {
          browser.assert.success();
          browser.assert.element('.board-name');
          browser.fill('#search-board input[name=board]', '');
          browser.pressButton('#search-board button[type=submit]', () => {
            browser.assert.elements('.board-name', 2);
            done();
          });
        });
      });
    });
  });

  suite('UI TESTING FOR /b/:board', () => {
    test('New thread created', (done) => {
      helper.createThread('anotherNewBoard', testThread.text, testThread.delete_password).then((thread) => {
        browser.visit(`http://localhost:8888/b/anotherNewBoard`).then(() => {
          browser.fill('#new-thread textarea[name=text]', testThread.text);
          browser.fill('#new-thread input[name=delete_password]', testThread.delete_password);
          browser.pressButton('#new-thread button[type=submit]', () => {
            browser.assert.success();
            browser.assert.redirected();
            browser.assert.text('#page-title #top', `Welcome to /b/anotherNewBoard`);
            browser.assert.url({pathname: `/b/anotherNewBoard`});
            browser.assert.element('#new-thread');
            browser.assert.elements('.thread', 2);
            done();
          });
        });
      });
    });

    test('Report thread', done => {
      helper.createThread('reportBoard', 'any', 'any').then((thread) => {
        browser.visit(`http://localhost:8888/b/reportBoard`).then(() => {
          browser.assert.success();
          browser.assert.element('.thread');
          browser.pressButton('.report-thread button[type=submit]', () => {
            browser.assert.success();
            browser.assert.text('#page-title #top', `Welcome to /b/reportBoard`);
            browser.assert.url({pathname: '/b/reportBoard'});
            test_helper.findThread(thread._id).then((data) => {
              assert.isTrue(data[0]);
              assert.isNotNull(data[1]);
              assert.isTrue(data[1].reported);
              done();
            });
          });
        });
      });
    });

    test('Report reply', done => {
      helper.createThread('reportBoard', 'any', 'any').then((thread) => {
        helper.createReply('reportBoard', thread._id, 'any reply', 'password').then((reply) => {
          browser.visit(`http://localhost:8888/b/reportBoard`).then(() => {
            browser.assert.success();
            browser.assert.elements('.thread', 2);
            browser.pressButton('.report-reply:first-of-type button[type=submit]', () => {
              browser.assert.success();
              browser.assert.text('#page-title #top', `Welcome to /b/reportBoard`);
              browser.assert.url({pathname: '/b/reportBoard'});
              test_helper.findReply(reply._id).then((data) => {
                assert.isTrue(data[0]);
                assert.isNotNull(data[1]);
                assert.isTrue(data[1].reported);
                done();
              });
            });
          });
        });
      });
    });
  });

  suite('UI TESTING FOR /b/:board/:threadid', () => {

  });
});
