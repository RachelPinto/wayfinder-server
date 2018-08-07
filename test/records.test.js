'use strict'

//require packages
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { app } = require('../index');
const { TEST_DATABASE_URL } = require('../config');
const Record = require('../models/records');
const seedRecords = require('../db/seed/records');

//configure expect as your assertion library and load chai-http with chai.use()
const expect = chai.expect;
chai.use(chaiHttp);

//describe() wraps your tests
describe('records test hooks', (url = TEST_DATABASE_URL) => {
  // configure the Mocha hooks manage the database during the tests
  before(function () {
    return mongoose.connect(url)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Record.insertMany(seedRecords);
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });
  //______________GET Tests______________
  //Serial Request - Call DB then call API then compare:
  describe('GET by id, GET all', () => {
    //GET by id
    it('should return record with correct id', () => {
      let data;
      // 1) First, call the database
      return Record.findOne()
        .then(_data => {
          data = _data;
          // 2) then call the API with the ID
          return chai.request(app).get(`/api/records/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys(
            'id',
            'symptom',
            'experience',
            'level',
            'impact',
            'impactNote',
            'symptomNote',
            'successNote',
            'createdAt', 'updatedAt')

          // 3) then compare database results to API response
          expect(res.body.id).to.equal(data.id);
          expect(res.body.symptom).to.equal(data.symptom);
          expect(res.body.experience).to.equal(data.experience);
          expect(res.body.level).to.equal(data.level);
          expect(res.body.impact).to.equal(data.impact);
          expect(res.body.impactNote).to.equal(data.impactNote);
          expect(res.body.symptomNote).to.equal(data.symptomNote);
          expect(res.body.successNote).to.equal(data.successNote);
          expect((new Date(res.body.createdAt)).toString()).to.equal(data.createdAt.toString());

        });
    });

    //GET all records
    it('should get all records', () => {
      return chai.request(app)
        .get('/api/records')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          return Record.find()
            .then(data => {
              expect(res.body).to.have.length(data.length);
            });
        });
    });
  })
  //_________________POST Tests_________________
  //Serial Request - Call API then call DB then compare
  describe('POST /api/notes', () => {
    it('should create and return a new record when provided valid data', function () {
      const newRecord = {
        "symptom": "depression",
        "experience": true,
        "level": 5,
        "impact": true,
        "impactNote": "felt lonely",
        "symptomNote": "was really cold and rainy today",
        "successNote": "I read a good book"
      };

      let res;
      // 1) First, call the API

      return chai.request(app)
        .post('/api/records')
        .send(newRecord)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys(
            'id',
            'symptom',
            'experience',
            'level',
            'impact',
            'impactNote',
            'symptomNote',
            'successNote',
            'createdAt', 'updatedAt');
          //  2) then call the database
          return Record.findById(res.body.id);
        })
        // 3) then compare the API response to the database results
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.symptom).to.equal(data.symptom);
          expect(res.body.experience).to.equal(data.experience);
          expect(res.body.level).to.equal(data.level);
          expect(res.body.impact).to.equal(data.impact);
          expect(res.body.impactNote).to.equal(data.impactNote);
          expect(res.body.symptomNote).to.equal(data.symptomNote);
          expect(res.body.successNote).to.equal(data.successNote);
          expect((new Date(res.body.createdAt)).toString()).to.equal(data.createdAt.toString());
        });
    });
  });
});