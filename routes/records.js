'use strict';

const express = require('express');

const router = express.Router();
router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

const Record = require('../models/records');

/* GET/READ ALL ITEMS */
router.get('/', (req, res, next) => {
  
  Record
  .find()
  .then(records => res.json(records))
});


/* GET/READ A SINGLE ITEM */
router.get('/:id', (req, res, next) => {
  
  Record
  .findById(req.params.id)
  .then(record => {
    res.json(record)
  })
});

/* POST/CREATE AN ITEM */

router.post('/', (req, res, next) => {
  Record
    .create({
      symptom: req.body.symptom,
      experience: req.body.experience,
      level: req.body.level,
      impact: req.body.impact,
      impactNote: req.body.impactNote,
      symptomNote: req.body.symptomNote,
      successNote: req.body.successNote
    })
    .then(newRecord => res.location(`${req.originalUrl}${newRecord.id}`).status(201).json(newRecord))
});

module.exports = router;
