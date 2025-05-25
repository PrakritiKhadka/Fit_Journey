import mongoose from 'mongoose';

const dietPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Diet plan name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  dailyCalories: {
    type: Number,
    required: [true, 'Daily calories is required'],
    min: [0, 'Daily calories cannot be negative']
  },
  mealsPerDay: {
    type: Number,
    required: [true, 'Number of meals per day is required'],
    min: [1, 'Must have at least 1 meal per day'],
    max: [10, 'Cannot have more than 10 meals per day']
  },
  blogLink: {
    type: String,
    required: [true, 'Blog link is required'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAdminCreated: {
    type: Boolean,
    default: false
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dailyDetails: {
    type: Map,
    of: {
      meals: [{
        name: String,
        time: String,
        description: String,
        calories: Number
      }]
    },
    default: {}
  }
}, {
  timestamps: true
});

// Index for faster queries
dietPlanSchema.index({ name: 1, category: 1 });
dietPlanSchema.index({ subscribers: 1 });

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

export default DietPlan; 