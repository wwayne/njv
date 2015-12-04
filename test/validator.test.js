/**
 * ENV
 * node: 4.2.1
 */
'use strict';

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const jsonValidator = require('../')

const Request = class {
  constructor(opt) {
    let lowercaseOpt = {}
    for (let key in opt) {
      lowercaseOpt[`${key.toLowerCase()}`] = opt[key]
    }
    this.headers = Object.assign({}, {
      'content-type': 'text/html',
      'accept': 'text/html'
    }, lowercaseOpt)
  }
  get (key) {
    return this.headers[key]
  }
}
const res = {}

describe('Middleware jsonapi', () => {

  it('should return 415 when Content-Type is wrong', done => {
    const req = new Request({'Content-Type': 'application/json'})
    jsonValidator()(req, res, (err) => {
      err.should.not.be.undefined
      err.should.have.property('status', 415)
      done()
    })
  })

  it('should return 415 when Content-Type has more than 2 types', done => {
    const req = new Request({'Content-Type': 'application/vnd.api+json; html/text'})
    jsonValidator()(req, res, (err) => {
      err.should.not.be.undefined
      err.should.have.property('status', 415)
      done()
    })
  })

  it('should return 406 when Accept have jsonapi but all have params', done => {
    const req = new Request({
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json; html/text'
    })
    jsonValidator()(req, res, (err) => {
      err.should.not.be.undefined
      err.should.have.property('status', 406)
      done()
    })
  })

  it('return nothing when verification success', done => {
    const req = new Request({
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api.v1+json, application/vnd.api+json'
    })
    jsonValidator()(req, res, (err) => {
      expect(err).to.be.undefined
      done()
    })
  })
})
