const request = require('supertest')
const app = require('../server.js')

describe('gryt-focus API', function () {
  describe('General interaction', function () {
    it('should return interaction info', function (done) {
      request(app)
        .get('/api/interact?action=interrupt')
        .expect('Content-type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.status).toEqual(200)
          expect(res.text).toEqual('Handling interaction: {"action":"interrupt"}')
          done()
        })
    })
  })
})
