import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [50, 'Title cannot be more than 50 characters']
  },
  type: {
    type: String,
    required: true,
    enum: ['loss', 'gain', 'maintain']
  },
  targetDate: {
    type: Date,
    required: [true, 'Please add a target date']
  },
  currentValue: {
    type: Number,
    required: true,
    min: [0, 'Value cannot be negative']
  },
  targetValue: {
    type: Number,
    required: true,
    min: [0, 'Value cannot be negative']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { toJSON: { virtuals: true } });

// Improved progress calculation
goalSchema.virtual('progress').get(function() {
  if (this.type === 'maintain') {
    // For maintain goals, check if current is within 2% of target
    const difference = Math.abs(this.currentValue - this.targetValue);
    const percentDifference = (difference / this.targetValue) * 100;
    return percentDifference <= 2 ? 100 : 0;
  }
  
  if (this.type === 'loss') {
    // For weight loss, progress increases as current value decreases
    if (this.currentValue <= this.targetValue) return 100; // Goal reached
    
    const initial = this.currentValue;  // Using current as initial (simplified)
    const target = this.targetValue;
    const current = this.currentValue;
    
    // Calculate how far we've come from start toward target
    return Math.min(100, Math.max(0, 
      Math.round(((initial - current) / (initial - target)) * 100)
    ));
  }
  
  if (this.type === 'gain') {
    // For muscle gain, progress increases as current value increases
    if (this.currentValue >= this.targetValue) return 100; // Goal reached
    
    const initial = this.currentValue;  // Using current as initial (simplified)
    const target = this.targetValue;
    const current = this.currentValue;
    
    // Calculate how far we've come from start toward target
    return Math.min(100, Math.max(0, 
      Math.round(((current - initial) / (target - initial)) * 100)
    ));
  }
  
  return 0; // Default fallback
});

export default mongoose.model('Goal', goalSchema, 'goals');