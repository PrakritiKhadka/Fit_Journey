import mongoose from "mongoose";
import DietPlan from "../models/dietPlan.js";
import User from "../models/user.model.js";

export const createDietPlan = async (req, res) => {
  try {
    const { name, category, dailyCalories, mealsPerDay, blogLink } = req.body;

    // Validate required fields
    if (!name || !category || !dailyCalories || !mealsPerDay || !blogLink) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Create new diet plan
    const dietPlan = new DietPlan({
      name,
      category,
      dailyCalories,
      mealsPerDay,
      blogLink,
      createdBy: req.user._id,
      isAdminCreated: req.user.role === "admin",
      dailyDetails: {},
      subscribers: [],
    });

    // Save the diet plan
    const savedDietPlan = await dietPlan.save();

    // Populate the createdBy field
    const populatedDietPlan = await DietPlan.findById(savedDietPlan._id)
      .populate("createdBy", "name email")
      .populate("subscribers", "name email");

    res.status(201).json({
      success: true,
      data: populatedDietPlan,
    });
  } catch (error) {
    console.error("Error creating diet plan:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const getDietPlans = async (req, res) => {
  try {
    const dietPlans = await DietPlan.find()
      .populate("createdBy", "name email")
      .populate("subscribers", "name email");

    res.status(200).json({
      success: true,
      data: dietPlans,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const getDietPlanById = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("subscribers", "name email");

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        error: "Diet plan not found",
      });
    }

    res.status(200).json({
      success: true,
      data: dietPlan,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateDietPlan = async (req, res) => {
  try {
    const {
      name,
      category,
      dailyCalories,
      mealsPerDay,
      blogLink,
      dailyDetails,
    } = req.body;
    const dietPlan = await DietPlan.findById(req.body._id);
    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        error: "Diet plan not found",
      });
    }
    console.log(req.body);
    // Update basic info
    if (name) dietPlan.name = name;
    if (category) dietPlan.category = category;
    if (dailyCalories) dietPlan.dailyCalories = dailyCalories;
    if (mealsPerDay) dietPlan.mealsPerDay = mealsPerDay;
    if (blogLink) dietPlan.blogLink = blogLink;
    
    // Update daily details if provided
    if (dailyDetails && typeof dailyDetails === "object") {
      for (const [key, value] of Object.entries(dailyDetails)) {
        dietPlan.dailyDetails.set(key, value);
      }
    }

    await dietPlan.save();

    res.status(200).json({
      success: true,
      data: dietPlan,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        error: "Diet plan not found",
      });
    }

    // Remove diet plan from all subscribed users
    await User.updateMany(
      { subscribedDietPlan: dietPlan._id },
      { $unset: { subscribedDietPlan: 1 } }
    );

    await dietPlan.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const subscribeToDietPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const newPlanId = req.params.id;

    const newDietPlan = await DietPlan.findById(newPlanId);
    if (!newDietPlan) {
      return res.status(404).json({
        success: false,
        error: "Diet plan not found",
      });
    }

    await DietPlan.updateMany(
      { subscribers: userId },
      { $pull: { subscribers: userId } }
    );

    if (!newDietPlan.subscribers.includes(userId)) {
      newDietPlan.subscribers.push(userId);
      await newDietPlan.save();
    }

    res.status(200).json({
      success: true,
      message: "Successfully subscribed to the new diet plan",
      data: newDietPlan,
    });

  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const unsubscribeFromDietPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const dietPlan = await DietPlan.findById(req.params.id);

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        error: "Diet plan not found",
      });
    }

    // Remove subscription
    user.subscribedDietPlan = undefined;
    await user.save();

    await DietPlan.findByIdAndUpdate(dietPlan._id, {
      $pull: { subscribers: user._id },
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const getDietPlanStats = async (req, res) => {
  try {
    const totalDietPlans = await DietPlan.countDocuments();
    const subscribedDietPlans = await DietPlan.countDocuments({
      subscribers: { $exists: true, $ne: [] },
    });

    res.status(200).json({
      success: true,
      data: {
        totalDietPlans,
        subscribedDietPlans,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const getSubscribedDietPlanById = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id); // Explicitly convert
    const dietPlan = await DietPlan.findOne({ subscribers: userId });

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'No subscribed diet plan found for this user',
      });
    }

    res.status(200).json({
      success: true,
      data: dietPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};