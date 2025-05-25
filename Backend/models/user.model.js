import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: false, min: 13 },
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  authMethod: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  password: {
    type: String,
    required: function() {
      return this.authMethod === 'local'; // Only required for local auth
    }
  },
  googleId: {
    type: String,
    required: function() {
      return this.authMethod === 'google';
    },
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  goal: {
    type: Number,
    required: false,
  },
});

const User = mongoose.model('User', UserSchema);
export default User;