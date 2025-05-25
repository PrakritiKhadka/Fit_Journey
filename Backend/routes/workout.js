// routes/workout.js
import express from 'express';
import { 
  createWorkout, 
  getWorkouts, 
  updateWorkout, 
  deleteWorkout,
  useAdminWorkout,
  getWorkoutStats
} from '../service/workoutService.js';
import { verifyLogin } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyLogin);

// POST: Save new workout
router.post('/', createWorkout);

// GET: Get all workouts (filtered based on user role)
router.get('/', getWorkouts);

// PUT: Update a workout
router.put('/:id', updateWorkout);

// DELETE: Delete a workout
router.delete('/:id', deleteWorkout);

// POST: Use an admin workout
// router.post('/admin/:id/use', useAdminWorkout);

// GET: Get workout statistics (admin only)
// router.get('/stats', getWorkoutStats);

export default router;