import express from 'express';
import {verifyLogin} from "../middleware/authMiddleware.js"
import { createOrUpdateProfile, getProfile } from "../service/profileService.js";
import { getUser, updateUser, getAllUsers, updateUserByAdmin, deleteUserByAdmin, updateUserGoal } from "../service/userService.js";
import { createGoal, deleteGoal, getGoals, updateGoal } from "../service/goalService.js";
import { login, signUpWithEmail, signupWithGoogle } from '../service/authService.js';
import { createWorkout, deleteWorkout, getAdminWorkouts, getNormalWorkouts, getSubscribedWorkouts, getWorkouts, getWorkoutSummaryStats, markUnmarkCompleted, useAdminWorkout } from "../service/workoutService.js";
import { 
  getBlogs, 
  getPublishedBlogs, 
  getBlogById,
  createBlog, 
  updateBlog, 
  deleteBlog, 
  togglePublish 
} from "../service/blogService.js";
import {
  createDietPlan,
  getDietPlans,
  getDietPlanById,
  updateDietPlan,
  deleteDietPlan,
  subscribeToDietPlan,
  unsubscribeFromDietPlan,
  getDietPlanStats,
  getSubscribedDietPlanById
} from "../service/dietPlanService.js";

const router = express.Router();

// Routes for auth
router.post('/signup/email', signUpWithEmail);
router.post('/signup/google', signupWithGoogle);
router.post('/login', login);

// Routes for users
// router.post('/users/register');
router.get('/users/me', verifyLogin, getUser);
router.put('/users/me', verifyLogin, updateUser); // Updated to use the new controller function
router.put('/users/profile', verifyLogin, createOrUpdateProfile); // Keep this for fitness profile data
// router.delete('/users/delete');
router.put('/users/goal', verifyLogin, updateUserGoal);

// Admin User Management Routes
router.get('/admin/users', verifyLogin, getAllUsers);
router.put('/admin/users/:id', verifyLogin, updateUserByAdmin);
router.delete('/admin/users/:id', verifyLogin, deleteUserByAdmin);

// Routes for profile
router.get('/profiles', verifyLogin, getProfile);
router.post('/profiles', verifyLogin, createOrUpdateProfile);
router.put('/profiles', verifyLogin, createOrUpdateProfile);
// router.delete('/profiles')

// Routes for goals
router.get('/goals', verifyLogin, getGoals);
router.post('/goals', verifyLogin, createGoal);
router.put('/goals/:id', verifyLogin, updateGoal);
router.delete('/goals/:id', verifyLogin, deleteGoal);

// Routes for Workout
router.post('/workouts', verifyLogin, createWorkout);
router.get('/workouts', verifyLogin, getWorkouts);
router.get('/allworkouts', getNormalWorkouts);
router.get('/workouts/stats', verifyLogin, getWorkoutSummaryStats);
router.get('/workouts/admin', verifyLogin, getAdminWorkouts);
router.get('/workouts/subscribed', verifyLogin, getSubscribedWorkouts);
router.post('/workouts/:id/subscribe/', verifyLogin, useAdminWorkout);
router.delete('/workouts/:id', verifyLogin, deleteWorkout);
router.put('/workouts/markcompleted/:id', verifyLogin, markUnmarkCompleted);

// Routes for Blogs
router.get('/blogs', verifyLogin, getBlogs);
router.get('/blogs/published', getPublishedBlogs);
router.get('/blogs/:id', getBlogById);
router.post('/blogs', verifyLogin, createBlog);
router.put('/blogs/:id', verifyLogin, updateBlog);
router.delete('/blogs/:id', verifyLogin, deleteBlog);
router.patch('/blogs/:id/publish', verifyLogin, togglePublish);

// Routes for Diet Plans
router.get('/diet-plans/stats',verifyLogin, getDietPlanStats);
router.post('/diet-plans', verifyLogin, createDietPlan);
router.get('/diet-plans', verifyLogin, getDietPlans);
router.get('/diet-plans/user', verifyLogin, getSubscribedDietPlanById);
router.get('/diet-plans/:id', verifyLogin, getDietPlanById);
router.put('/diet-plans/:id',verifyLogin, updateDietPlan);
router.delete('/diet-plans/:id', verifyLogin, deleteDietPlan);
router.post('/diet-plans/:id/subscribe', verifyLogin, subscribeToDietPlan);
router.post('/diet-plans/:id/unsubscribe', verifyLogin, unsubscribeFromDietPlan);


export default router;