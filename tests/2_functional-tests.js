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

  suite('1. API ROUTING FOR /api/threads/:board', function() {
    
    suite('1.1 POST', function() {
      test('1.1.1 New thread', (done) => {
        browser.visit("http://localhost:3000/").then(() => {
          browser.fill('#board1', 'test');
          browser.fill('text', 'text test');
          browser.fill('delete_password', 'password');
          browser.pressButton('New thread', () => {
            browser.assert.success();
            done();
          });
        });
      });
    });    
    
    suite('GET', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
