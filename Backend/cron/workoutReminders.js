import cron from 'node-cron';
import { sendWorkoutReminders } from '../service/workoutService.js';

// Run every minute to check for workouts that need reminders
export const startWorkoutReminders = () => {
  cron.schedule('* * * * *', async () => {
    try {
      await sendWorkoutReminders();
    } catch (error) {
      console.error('Error in workout reminder cron job:', error);
    }
  });
}; 