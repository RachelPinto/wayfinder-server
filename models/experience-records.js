const mongoose = require('mongoose');

const experienceRecordSchema = new mongoose.Schema({ 
  experience: { type: Boolean },
});

// Add `createdAt` and `updatedAt` fields
experienceRecordSchema.set('timestamps', true);

experienceRecordSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
 });

 module.exports = mongoose.model('Experienced', experienceRecordSchema);