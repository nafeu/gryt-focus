var expect = require("chai").expect;
var request = require("supertest");
var app = require('../server.js');

describe("gryt-focus API", function(){
  describe("General interaction", function() {
    it("should return interaction info",function(done){
      request(app)
        .get("/api/interact?action=interrupt")
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          expect(res.status).to.equal(200);
          expect(res.text).to.equal('Handling interaction: {"action":"interrupt"}');
          done();
        });
    });
  });
});
