import Profile from "../models/profile.model.js";

export const getProfile = async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  };

export const createOrUpdateProfile = async (req, res) => {
    try {
      const {
        height,
        weight,
        fitnessGoal,
        activityLevel,
        workoutPreferences,
        dietaryRestrictions
      } = req.body;
      
      // Build profile object
      const profileFields = {
        user: req.user.id,
        height: height || undefined,
        weight: weight || undefined,
        fitnessGoal: fitnessGoal || undefined,
        activityLevel: activityLevel || undefined,
        workoutPreferences: workoutPreferences || [],
        dietaryRestrictions: dietaryRestrictions || [],
        updatedAt: Date.now()
      };
      
      // Remove undefined fields
      Object.keys(profileFields).forEach(key => 
        profileFields[key] === undefined && delete profileFields[key]
      );
      
      let profile = await Profile.findOne({ user: req.user.id });
      
      if (profile) {
        // Update existing profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
      } else {
        // Create new profile
        profile = new Profile(profileFields);
        await profile.save();
      }
      
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  };