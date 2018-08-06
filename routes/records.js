'use strict';

const express = require('express');

const router = express.Router();

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

module.exports = router;