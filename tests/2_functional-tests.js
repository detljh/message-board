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

  suite('1. API ROUTING FOR /api/threads/:board', function() {
    suite('1.1 POST', function() {
      test('1.1.1 New thread created', (done) => {
        browser.visit("http://localhost:8888/").then(() => {
          browser.fill('#board1', testThread.board);
          browser.fill('text', testThread.text);
          browser.fill('delete_password', testThread.delete_password);
          browser.pressButton('New thread', () => {
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
        browser.visit("http://localhost:8888/api/threads/test").then(() => {
          let res = browser.response;
          let body = JSON.parse(res.body);
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
      // test('2.1.1 New reply created', (done) => {
      //   // browser.visit("http://localhost:8888/").then(() => {
      //   //   browser.fill('#board4', 'test');
      //   //   browser.fill('thread_id', '')
      //   //   browser.fill('text', 'text test');
      //   //   browser.fill('delete_password', 'password');
      //   //   browser.pressButton('New thread', () => {
      //   //     browser.assert.success();
      //   //     browser.assert.redirected();
      //   //     browser.assert.text('#boardTitle', 'Welcome to /b/test');
      //   //     browser.assert.url({pathname: '/b/test'});
      //   //     browser.assert.element('#submitNewThread');
      //   //     browser.assert.element('.thread');
      //   //     browser.assert.text('.thread .main h3', 'text test');
      //   //     done();
      //   //   });
      //   // });
      // });
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
