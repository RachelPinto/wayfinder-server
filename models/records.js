const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  level: { type: Number },
  impact: { type: Boolean },
  impactNote: { type: String },
  symptomNote: { type: String },
  successNote: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
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