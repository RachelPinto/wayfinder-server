'use strict';

const express = require('express');
//const passport = require('passport');

const router = express.Router();
//router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

const Experienced = require('../models/experience-records');

/* GET/READ ALL ITEMS */
router.get('/', (req, res, next) => {

  Experienced
    .find()
    .then(experienceRecord => res.json(experienceRecord))
});


/* GET/READ A SINGLE ITEM */
router.get('/:id', (req, res, next) => {

  Experienced
    .findById(req.params.id)
    .then(experienceRecord => {
      res.json(experienceRecord)
    })
});

/* POST/CREATE AN ITEM */

router.post('/', (req, res, next) => {
  Experienced
    .create({
      experienceRecord: req.body.experienceRecord,
    })
    .then(newExperienceRecord => res.location(`${req.originalUrl}${newExperienceRecord.id}`).status(201).json(newExperienceRecord))
});

module.exports = router;
