import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  height: { type: Number, min: 50, max: 300 },
  weight: { type: Number, min: 20, max: 500 },
  fitnessGoal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'maintain', 'improve_endurance', 'other'],
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
  },
  workoutPreferences: [String],
  dietaryRestrictions: [String],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model('Profile', ProfileSchema);
export default Profile;
