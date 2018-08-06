const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  symptom: { type: String, required: true },
  experience: { type: boolean },
  level: { type: number },
  impact: { type: boolean },
  impactNote: { type: string },
  symptomNote: { type: string },
  successNote: { type: string },
});

// Add `createdAt` and `updatedAt` fields
recordSchema.set('timestamps', true);

recordSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
 });

 module.exports = mongoose.model('Record', recordSchema);