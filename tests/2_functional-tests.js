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

chai.use(chaiHttp);

const browser = new Browser();

suite('Functional Tests', function() {
  suiteSetup(() => {
    return Promise.all([db.Board.deleteMany({}), db.Reply.deleteMany({}), db.Thread.deleteMany({})]);
  });

  let testThread = {
    board: 'test',
    text: 'text test',
    delete_password: 'password'
  };

  let testReply = {
    text: 'reply text',
    delete_password: '1'
  };

  suite('1. API ROUTING FOR /api/threads/:board', function() {
    suite('1.1 POST', function() {
      test('1.1.1 New thread created', (done) => {
        browser.visit("http://localhost:8888/").then(() => {
          browser.fill('#board1', testThread.board);
          browser.fill('#newThread textarea[name=text]', testThread.text);
          browser.fill('#newThread input[name=delete_password]', testThread.delete_password);
          browser.pressButton('#newThread input[type=submit]', () => {
            browser.assert.success();
            browser.assert.redirected();
            browser.assert.text('#boardTitle', 'Welcome to /b/test');
            browser.assert.url({pathname: '/b/test'});
            browser.assert.element('#submitNewThread');
            browser.assert.element('.thread');
            browser.assert.text('.thread .main h3', 'text test');
            done();
          });
        });
      });
    });    
    
    suite('1.2 GET', function() {
      test('1.2.1 Created thread is loaded', (done) => {
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
      
    });
    
    suite('PUT', function() {
      
    });
    

  });
  
  suite('2. API ROUTING FOR /api/replies/:board', function() {
    
    suite('2.1 POST', function() {
      test('2.1.1 New reply created', (done) => {
        browser.visit("http://localhost:8888/").then(() => {
          browser.fill('#board4', testThread.board);
          browser.fill('#newReply input[name=thread_id]', testThread.id);
          browser.fill('#newReply textarea[name=text]', testReply.text);
          browser.fill('#newReply input[name=delete_password]', testReply.delete_password);
          browser.pressButton('#newReply input[type=submit]', () => {
            browser.assert.success();
            browser.assert.redirected();
            browser.assert.text('#threadTitle', `/b/test/${testThread.id}`);
            browser.assert.url({pathname: `/b/test/${testThread.id}`});
            browser.assert.element('.thread');
            browser.assert.text('.thread .main h3', 'text test');
            browser.assert.element('.replies');
            browser.assert.element('.reply')
            browser.assert.text('.reply .replyText', testReply.text);
            done();
          });
        });
      });
    });
    
    suite('2.2 GET', function() {
      test('2.2.1 Reply is loaded with thread', (done) => {
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
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
