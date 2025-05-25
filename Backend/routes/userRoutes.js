const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get current month's workouts
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const workoutsThisMonth = await Workout.countDocuments({
      user: userId,
      date: { $gte: startOfMonth }
    });
    
    // Calculate goal completion
    const user = await User.findById(userId);
    const goalCompletion = user.goals ? 
      Math.round((user.completedGoals / user.goals.length) * 100) : 0;
    
    // Calculate calories burned
    const caloriesBurned = await Workout.aggregate([
      { $match: { user: userId, date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$caloriesBurned' } } }
    ]);
    
    // Calculate active days
    const activeDays = await Workout.distinct('date', {
      user: userId,
      date: { $gte: startOfMonth }
    });
    
    res.json({
      workoutsThisMonth,
      goalCompletion,
      caloriesBurned: caloriesBurned[0]?.total || 0,
      activeDays: activeDays.length
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Get user's subscribed diet plan
router.get('/diet-plan', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('subscribedDietPlan');
    
    if (!user.subscribedDietPlan) {
      return res.json(null);
    }
    
    res.json(user.subscribedDietPlan);
  } catch (error) {
    console.error('Error fetching diet plan:', error);
    res.status(500).json({ error: 'Failed to fetch diet plan' });
  }
});

// Subscribe to a diet plan
router.post('/diet-plan/:planId', auth, async (req, res) => {
  try {
    const { planId } = req.params;
    const user = await User.findById(req.user.id);
    
    // Check if diet plan exists
    const dietPlan = await DietPlan.findById(planId);
    if (!dietPlan) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }
    
    user.subscribedDietPlan = planId;
    await user.save();
    
    res.json({ message: 'Successfully subscribed to diet plan' });
  } catch (error) {
    console.error('Error subscribing to diet plan:', error);
    res.status(500).json({ error: 'Failed to subscribe to diet plan' });
  }
});

// Get recommended blogs
router.get('/blogs/recommended', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get blogs based on user's interests and preferences
    const recommendedBlogs = await Blog.find({
      tags: { $in: user.interests || [] }
    })
    .sort({ createdAt: -1 })
    .limit(3)
    .select('title excerpt coverImage');
    
    res.json(recommendedBlogs);
  } catch (error) {
    console.error('Error fetching recommended blogs:', error);
    res.status(500).json({ error: 'Failed to fetch recommended blogs' });
  }
});

module.exports = router; 