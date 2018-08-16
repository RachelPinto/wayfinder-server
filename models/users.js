const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  firstName: {type: String},
  lastName: {type: String},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  symptoms: [{ type: String }]
});

userSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.password;
  }
});


userSchema.methods.serialize = function () {
  return {
    id: this._id,
    username: this.username
  };
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);

