'use strict';

const express = require('express');
const passport = require('passport');

const router = express.Router();
router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

const Record = require('../models/records');

/* GET/READ ALL ITEMS */

router.get('/', (req, res, next) => {

  const userId = req.user.id;

  Record
    .find( userId )
    .then(records => res.json(records))
    .catch(err => {
      next(err);
    });
});


/* GET/READ A SINGLE ITEM */

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Experienced
    .findOne({ _id: id, userId })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* POST/CREATE AN ITEM */

router.post('/', (req, res, next) => {

  const { level, impact, impactNote, symptomNote, successNote} = req.body;
  const userId = req.user.id;

  const newRecord = { level, impact, impactNote, symptomNote, successNote, userId }

  Record.create(newRecord)
      .then(result => {
      res
        .location(`${req.originalUrl}${result.id}`)
        .status(201)
        .json(result)
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
