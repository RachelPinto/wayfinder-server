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
    .find( {userId} )
    .then(records => res.json(records))
    .catch(err => {
      next(err);
    });
});


/* GET/READ A SINGLE ITEM BY ID */

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Record
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

  console.log(req.body, 'this is reqbody')
  const userId = req.user.id;

  const newRecord = { symptoms: req.body, userId }

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

// /* GET/READ ALL ITEMS BY DAY */

// router.get('/day', (req, res, next) => {

//   const userId = req.user.id;

//   Daylist
//     .find( userId )
//     .then(dayrecords => res.json(dayrecords))
//     .catch(err => {
//       next(err);
//     });
// });


// /* GET/READ A SINGLE ITEM BY DAY */

// router.get('/day/:date', (req, res, next) => {
//   const { id } = req.params;
//   const userId = req.user.id;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     const err = new Error('The `id` is not valid');
//     err.status = 400;
//     return next(err);
//   }

//   Daylist
//     .find({ createdAt: req.params.date, userId })
//     .then(result => {
//       if (result) {
//         res.json(result);
//       } else {
//         next();
//       }
//     })
//     .catch(err => {
//       next(err);
//     });
// });

module.exports = router;
