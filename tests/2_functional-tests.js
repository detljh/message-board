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
Browser.site = Browser.localhost('example.com', 5000);

chai.use(chaiHttp);

suite('Functional Tests', function() {
  const browser = new Browser();
  suiteSetup((done) => {
    return browser.visit('/', done);
  })

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      chai.request(server)
        .fill('board', 'test')
        .fill('text', 'text test')
        .fill('delete_password', 'password')
        .pressButton('submit', () => {
          browser.assert.success();
          done();
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
