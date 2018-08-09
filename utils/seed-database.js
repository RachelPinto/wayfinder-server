const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');
const Record = require('../models/records');
const Experienced = require('../models/experience-records');
const User = require('../models/users')

const seedRecords = require('../db/seed/records');
const seedExperienceRecords = require('../db/seed/experience-records');
const seedUsers = require('../db/seed/users');

mongoose.connect(DATABASE_URL, /*{useNewUrlParser: true}*/)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Record.insertMany(seedRecords),
      Experienced.insertMany(seedExperienceRecords),
      User.insertMany(seedUsers)
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });

