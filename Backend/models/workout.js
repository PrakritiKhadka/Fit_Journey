// models/workout.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const WorkoutSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  workoutType: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true 
  },
  intensityLevel: { 
    type: String, 
    enum: ['low', 'medium', 'high'],
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  time: { 
    type: String,
    required: true
  },
  notes: { 
    type: String 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAdminWorkout: {
    type: Boolean,
    default: false
  },
  isReUsed: {
    type: Boolean,
    default: false
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  reminderEnabled: {
    type: Boolean,
    default: false
  },
  reminderTime: {
    type: Number, // minutes before workout
    default: 30
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date
  },
  completionStatus: {
    type: String,
    enum: ['pending', 'completed', 'skipped'],
    default: 'pending'
  },
  completedAt: {
    type: Date
  },
  dailyCompletions: [{
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['completed', 'skipped'],
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedCount: {
    type: Number,
    default: 0
  },
  caloriesBurn: {
    type: Number,
    default: 0
  }
});

// Update the updatedAt timestamp before saving
WorkoutSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Workout = mongoose.model('Workout', WorkoutSchema);
export default Workout;