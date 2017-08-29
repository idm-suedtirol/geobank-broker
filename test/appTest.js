const expect = require('chai').expect;
const app = require('../app');
const request = require('request');
const baseUrl = 'http://localhost:8090';
var tagname = '';
var endpointname = '';

describe('App', function(){
  it('test tag', function(done){
    request.get({url: baseUrl + '/tag'}, function(error, response, body){
      tagname = myRandom(body);
      expect(response.statusCode).equal(200);
      expect(tagname).not.empty;
      console.log(tagname);
      done();
    });
  });

  it('test tag/tagname', function(done){
    request.get({url: baseUrl + '/tag/' + tagname}, function(error, response, body){
      endpointname = myRandom(body).endpoint;
      expect(response.statusCode).equal(200);
      expect(endpointname).not.empty;
      console.log(endpointname);
      done();
    });
  });

  it('test /endpoint/endpointname', function(done){
    request.get({url: baseUrl + '/endpoint/' + endpointname}, function(error, response, body){
      expect(response.statusCode).equal(200);
      expect(body).not.equal("nothing");
      console.log(body);
      done();
    });
  });

  it('test testinterface', function(done){
    request.get({url: baseUrl}, function(error, response, body){
      expect(response.statusCode).equal(200);
      expect(body).not.equal("nothing");
      done();
    });
  });
});

function myRandom(body){
  var bodyObj = JSON.parse(body);
  var count = Object.keys(bodyObj).length - 1;
  var random = Math.floor(Math.random()*(count+1));
  return bodyObj[Object.keys(bodyObj)[random]];
}
