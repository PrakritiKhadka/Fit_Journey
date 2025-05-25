// service/workoutService.js
import Workout from '../models/workout.js';
import User from '../models/user.model.js';
import nodemailer from 'nodemailer';

// Create email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const createWorkout = async (req, res) => {
  try {
    const { 
      name,
      workoutType, 
      duration, 
      intensityLevel, 
      date, 
      time, 
      notes, 
      isRecurring, 
      recurringDays, 
      reminderEnabled, 
      reminderTime,
      isAdminWorkout,
      caloriesBurn
        } = req.body;
    
    // Validate required fields
    if (!name || !workoutType || !duration || !intensityLevel || !date || !time || !caloriesBurn) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields are missing' 
      });
    }

    const userId = req.user ? req.user._id : null;
    
    // Combine date and time
    const [hours, minutes] = time.split(':');
    const workoutDate = new Date(date);
    workoutDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    
    const newWorkout = new Workout({
      name,
      workoutType,
      duration: Number(duration),
      intensityLevel,
      date: workoutDate,
      time,
      notes,
      userId,
      createdBy: userId,
      isRecurring,
      recurringDays,
      reminderEnabled,
      reminderTime: reminderTime || 30,
      isAdminWorkout: isAdminWorkout,
      isReUsed: false,
      caloriesBurn: Number(caloriesBurn)
    });

    const savedWorkout = await newWorkout.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Workout saved successfully',
      data: savedWorkout
    });
  } catch (err) {
    console.error('Error saving workout:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save workout: ' + err.message 
    });
  }
};

export const getAdminWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ isAdminWorkout: true, isReUsed: false });
    res.status(200).json({ success: true, data: workouts });
  } catch (err) {
    console.error('Error fetching admin workouts:', err);
  }
};

export const getSubscribedWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ isAdminWorkout: false , userId: req.user._id});
    res.status(200).json({ success: true, data: workouts });
  } catch (err) {
    console.error('Error fetching subscribed workouts:', err);
  }
};

export const getNormalWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ isAdminWorkout: false, isReUsed: false });
    res.status(200).json({ success: true, data: workouts });
  } catch (err) {
    console.error('Error fetching normal workouts:', err);
  }
};
export const getWorkouts = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const isAdmin = req.user ? req.user.role === 'admin' : false;

    let query = {};
    
    // If not admin, only show user's workouts and admin workouts
    if (!isAdmin) {
      query = {
        $or: [
          { userId },
          { isAdminWorkout: true }
        ]
      };
    }

    const workouts = await Workout.find(query)
      .sort({ date: -1 })
      .populate('userId', 'name email')
      .populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      data: workouts
    });
  } catch (err) {
    console.error('Error fetching workouts:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch workouts: ' + err.message
    });
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user ? req.user._id : null;
    const isAdmin = req.user ? req.user.role === 'admin' : false;

    const workout = await Workout.findById(id);
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        error: 'Workout not found'
      });
    }

    // Check permissions
    if (!isAdmin && workout.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this workout'
      });
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedWorkout
    });
  } catch (err) {
    console.error('Error updating workout:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update workout: ' + err.message
    });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user._id : null;
    const isAdmin = req.user ? req.user.role === 'admin' : false;

    const workout = await Workout.findById(id);
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        error: 'Workout not found'
      });
    }

    // Check permissions
    if (!isAdmin && workout.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this workout'
      });
    }

    await Workout.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting workout:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete workout: ' + err.message
    });
  }
};

export const useAdminWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user._id : null;

    const adminWorkout = await Workout.findOne({ _id: id, isAdminWorkout: true });
    
    if (!adminWorkout) {
      return res.status(404).json({
        success: false,
        error: 'Admin workout not found'
      });
    }

    const existingWorkout = await Workout.findOne({userId:userId,isReUsed:true, name:adminWorkout.name, workoutType:adminWorkout.workoutType, duration:adminWorkout.duration, intensityLevel:adminWorkout.intensityLevel});
    if(existingWorkout){
      return res.status(400).json({
        success: false,
        error: 'Workout already exists'
      });
    }

    // Create a new workout based on the admin workout
    const newWorkout = new Workout({
      ...adminWorkout.toObject(),
      _id: undefined,
      userId,
      createdBy: userId,
      isAdminWorkout: false,
      date: new Date(),
      usageCount: 0,
      isReUsed: true
    });

    const savedWorkout = await newWorkout.save();

    // Update usage count of admin workout
    adminWorkout.usageCount += 1;
    adminWorkout.lastUsed = new Date();
    await adminWorkout.save();

    res.status(201).json({
      success: true,
      data: savedWorkout
    });
  } catch (err) {
    console.error('Error using admin workout:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to use admin workout: ' + err.message
    });
  }
};

export const getWorkoutStats = async (req, res) => {
  try {
    const isAdmin = req.user ? req.user.role === 'admin' : false;

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view workout stats'
      });
    }

    const stats = await Workout.aggregate([
      {
        $match: { isAdminWorkout: true, isReUsed: false }
      },
      {
        $group: {
          _id: '$workoutType',
          totalUsage: { $sum: '$usageCount' },
          lastUsed: { $max: '$lastUsed' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { totalUsage: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Error fetching workout stats:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch workout stats: ' + err.message
    });
  }
};

// Function to send workout reminder emails
export const sendWorkoutReminders = async () => {
  try {
    const now = new Date();
    const reminderTime = process.env.WORKOUT_REMINDER_TIME || 30; // minutes before workout

    // Find workouts that need reminders
    const workouts = await Workout.find({
      reminderEnabled: true,
      date: {
        $gte: new Date(now.getTime() + reminderTime * 60000),
        $lt: new Date(now.getTime() + (reminderTime + 1) * 60000)
      }
    }).populate('userId', 'email name');

    for (const workout of workouts) {
      if (workout.userId && workout.userId.email) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: workout.userId.email,
          subject: `Workout Reminder: ${workout.workoutType}`,
          html: `
            <h2>Workout Reminder</h2>
            <p>Hi ${workout.userId.name},</p>
            <p>This is a reminder that you have a ${workout.workoutType} workout scheduled in ${reminderTime} minutes.</p>
            <p>Details:</p>
            <ul>
              <li>Duration: ${workout.duration} minutes</li>
              <li>Intensity: ${workout.intensityLevel}</li>
              ${workout.notes ? `<li>Notes: ${workout.notes}</li>` : ''}
            </ul>
            <p>Stay motivated and keep up the great work!</p>
          `
        };

        await transporter.sendMail(mailOptions);
      }
    }
  } catch (err) {
    console.error('Error sending workout reminders:', err);
  }
};

// Get summary stats for admin/user workouts
export const getWorkoutSummaryStats = async (req, res) => {
  try {
    const workouts = await Workout.find();
    const totalWorkouts = workouts.length;
    const completedWorkouts = workouts.filter(w => w.completionStatus === 'completed');
    const totalCompleted = completedWorkouts.length;
    const totalDurationCompleted = completedWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const totalUsage = totalCompleted;

    const userCreatedWorkouts = workouts.filter(w => w.isAdminWorkout == false && w.isReUsed==false);
    const totalUserCreatedWorkouts = userCreatedWorkouts.length;
    const userCompletedWorkouts = userCreatedWorkouts.filter(w => w.completionStatus === 'completed');
    const totalUserCompletedWorkouts = userCompletedWorkouts.length;
    const totalUserDurationCompleted = userCompletedWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);

    const adminCreatedWorkouts = workouts.filter(w => w.isAdminWorkout == true && w.isReUsed==false);
    const totalAdminCreatedWorkouts = adminCreatedWorkouts.length;
    const adminCompletedWorkouts = adminCreatedWorkouts.filter(w => w.completionStatus === 'completed');
    const totalAdminCompletedWorkouts = adminCompletedWorkouts.length;
    const totalAdminDurationCompleted = adminCompletedWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalWorkouts,
        totalCompleted,
        totalDurationCompleted,
        totalUsage,
        userWorkouts: {
          totalWorkouts: totalUserCreatedWorkouts,
          totalCompleted: totalUserCompletedWorkouts,
          totalDurationCompleted: totalUserDurationCompleted
        },
        adminWorkouts: {
          totalWorkouts: totalAdminCreatedWorkouts,
          totalCompleted: totalAdminCompletedWorkouts,
          totalDurationCompleted: totalAdminDurationCompleted
        }
      }
    });
  } catch (err) {
    console.error('Error fetching workout summary stats:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch workout summary stats: ' + err.message
    });
  }
};

export const markUnmarkCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const { completedStatus } = req.body;

    const workout = await Workout.findById(id);
    if (!workout) {
      return res.status(404).json({
        success: false,
        error: 'Workout not found'
      });
    }

    if (completedStatus) {
      workout.completedCount += 1;
    } else {
      workout.completedCount -= 1;
    }
    await workout.save();

    res.status(200).json({
      success: true,
      message: 'Workout completion status updated successfully'
    });
  } catch (err) {
    console.error('Error marking/unmarking workout as completed:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to mark/unmark workout as completed: ' + err.message
    });
  }
};