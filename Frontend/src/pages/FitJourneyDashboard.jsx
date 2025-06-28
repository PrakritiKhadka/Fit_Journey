import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FitJourneyDashboard.css";
import useUserStore from "../store/user";
import { Eye, Plus, Calendar, Clock, Repeat, Bell, Trash2 } from "lucide-react";
import WorkoutForm from "./WorkoutForm";
import { showErrorToast, showSuccessToast } from "../toastutil";
import BlogPreview from "../components/BlogPreview";
import BlogList from "./BlogList";

const FitJourneyDashboard = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useUserStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    workoutsThisMonth: 0,
    goalCompletion: 0,
    caloriesBurned: 0,
    activeDays: 0,
  });
  const [subscribedDietPlan, setSubscribedDietPlan] = useState(null);
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);
  const [recommendedDietPlans, setRecommendedDietPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    goal: 0,
    goalType: "",
  });
  const [goal, setGoal] = useState({
    type: "maintain", // 'lose', 'gain', 'maintain'
    weeklyTarget: 0.5, // kg per week
    currentWeight: 0,
    targetWeight: 0,
    height: 0,
    activityLevel: "sedentary",
  });
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [calculatedCalories, setCalculatedCalories] = useState(0);
  const [subscribedWorkouts, setSubscribedWorkouts] = useState([]);
  const [adminWorkouts, setAdminWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showCreateWorkoutModal, setShowCreateWorkoutModal] = useState(false);
  const [activeDietTab, setActiveDietTab] = useState("today");
  const [showDietPlanModal, setShowDietPlanModal] = useState(false);
  const [selectedDietPlan, setSelectedDietPlan] = useState(null);
  const [showSubscribeConfirm, setShowSubscribeConfirm] = useState(false);
  const [dietPlanToSubscribe, setDietPlanToSubscribe] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);
  const [selectedDay, setSelectedDay] = useState("monday");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        age: user.age || "",
        gender: user.gender || "",
        goals: user.goals || [],
      });
    }
  }, [user]);

  useEffect(() => {
    fetchUserStats();
    fetchSubscribedDietPlan();
    fetchRecommendedBlogs();
    fetchRecommendedDietPlans();
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const adminWorkouts = await fetch("/api/workouts/admin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const adminData = await adminWorkouts.json();
      const subscribedWorkouts = await fetch("/api/workouts/subscribed", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const subscribedData = await subscribedWorkouts.json();
      setSubscribedWorkouts(subscribedData);
      setAdminWorkouts(adminData);
    } catch (err) {
      setError(err.message || "Failed to fetch workouts");
    }
  };

  const handleSubscribeWorkout = async (workoutId) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json(); // ✅ parse the response body

      if (!response.ok) {
        // Show backend error message if available
        showErrorToast(result.error || "Failed to subscribe to workout");
        return;
      }

      showSuccessToast("Subscribed to workout successfully!");
      fetchWorkouts(); // ✅ Refresh the UI
    } catch (err) {
      setError(err.message || "Failed to subscribe to workout");
      showErrorToast("Network error while subscribing to workout");
    }
  };

  const fetchUserStats = async () => {
    setIsLoading(true);
    try {
      // Fetch user stats
      const statsResponse = await fetch("/api/workouts/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const statsData = await statsResponse.json();
      if (statsResponse.ok) {
        setStats(statsData);
      }
    } catch (err) {
      showErrorToast("Failed to fetch dashboard data");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscribedDietPlan = async () => {
    setIsLoading(true);
    try {
      // Fetch subscribed diet plan
      const dietPlanResponse = await fetch("/api/diet-plans/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const dietPlanData = await dietPlanResponse.json();
      if (dietPlanResponse.ok) {
        setSubscribedDietPlan(dietPlanData);
      }
    } catch (err) {
      showErrorToast("Failed to fetch diet plan");
      console.error("Error fetching diet plan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendedBlogs = async () => {
    setIsLoading(true);
    try {
      // Fetch recommended blogs
      const blogsResponse = await fetch("/api/blogs/published", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const blogsData = await blogsResponse.json();
      if (blogsResponse.ok) {
        // Get first 3 blogs for the dashboard
        setRecommendedBlogs(blogsData.slice(0, 3));
      }
    } catch (err) {
      showErrorToast("Failed to fetch recommended blogs");
      console.error("Error fetching recommended blogs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendedDietPlans = async () => {
    try {
      const response = await fetch("/api/diet-plans", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommended diet plans");
      }

      const data = await response.json();
      setRecommendedDietPlans(data);
    } catch (err) {
      showErrorToast("Failed to fetch recommended diet plans");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  // Function to calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
  const calculateBMR = (weight, height, age, gender) => {
    if (!weight || !height || !age || !gender) return 0;

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (gender === "male") {
      return 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      return 10 * w + 6.25 * h - 5 * a - 161;
    }
  };

  // Function to calculate TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = (bmr, activityLevel) => {
    const activityMultipliers = {
      sedentary: 1.2, // Little to no exercise
      lightly_active: 1.375, // Light exercise 1-3 days/week
      moderately_active: 1.55, // Moderate exercise 3-5 days/week
      very_active: 1.725, // Hard exercise 6-7 days/week
      extremely_active: 1.9, // Very hard exercise, physical job
    };

    return bmr * (activityMultipliers[activityLevel] || 1.2);
  };

  // Function to calculate calorie goal based on weight goal
  const calculateCalorieGoal = () => {
    const bmr = calculateBMR(
      goal.currentWeight,
      goal.height,
      user.age, // Using existing user age
      user.gender // Using existing user gender
    );

    const tdee = calculateTDEE(bmr, goal.activityLevel);

    // 1 kg of fat = approximately 7700 calories
    const caloriesPerKg = 7700;
    const dailyCalorieAdjustment = (goal.weeklyTarget * caloriesPerKg) / 7;

    let targetCalories = tdee;

    if (goal.type === "lose") {
      targetCalories = tdee - dailyCalorieAdjustment;
    } else if (goal.type === "gain") {
      targetCalories = tdee + dailyCalorieAdjustment;
    }

    return Math.round(targetCalories);
  };

  // Update the goal calculation whenever goal data changes
  useEffect(() => {
    if (goal.currentWeight && goal.height && user.age && user.gender) {
      const calories = calculateCalorieGoal();
      setCalculatedCalories(calories);
    }
  }, [goal, user]);

  // Calculate days to reach target
  const calculateTimeToGoal = () => {
    if (!goal.currentWeight || !goal.targetWeight || !goal.weeklyTarget)
      return null;

    const weightDifference = Math.abs(goal.targetWeight - goal.currentWeight);
    const weeksToGoal = weightDifference / goal.weeklyTarget;
    const daysToGoal = Math.round(weeksToGoal * 7);

    return { weeks: Math.round(weeksToGoal), days: daysToGoal };
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();

    const calculatedCalories = calculateCalorieGoal();

    try {
      // Get the token from your user store or wherever you store it
      const token =
        localStorage.getItem("token") || useUserStore.getState().token;

      if (!token) {
        showErrorToast("Please log in again");
        navigate("/login");
        return;
      }

      const response = await fetch("/api/users/goal", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Make sure token exists
        },
        body: JSON.stringify({
          goal: calculatedCalories,
          goalType: goal.type,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          showErrorToast("Session expired. Please log in again.");
          navigate("/login");
          return;
        }
        throw new Error(`Failed to set goal: ${response.status}`);
      }

      const data = await response.json();

      // Update the user store with the new user data
      if (data.user) {
        // Assuming you have a method to update user in your store
        useUserStore.getState().setUser(data.user);
      }

      setShowGoalForm(false);
      showSuccessToast("Goal set successfully!");

      // Optionally refresh the page or update the UI
      window.location.reload(); // or update state to reflect changes
    } catch (err) {
      console.error("Goal submission error:", err);
      showErrorToast("Failed to set goal");
    }
  };

  const handleSubscribeDietPlan = async (planId) => {
    setDietPlanToSubscribe(planId);
    setShowSubscribeConfirm(true);
  };

  const confirmSubscribeDietPlan = async () => {
    try {
      const response = await fetch(
        `/api/diet-plans/${dietPlanToSubscribe}/subscribe`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to subscribe to diet plan");
      }

      // Refresh diet plans after subscription
      fetchSubscribedDietPlan();
      setShowSubscribeConfirm(false);
      setDietPlanToSubscribe(null);
    } catch (err) {
      showErrorToast("Failed to subscribe to diet plan");
    }
  };

  const getCategoryColor = (category) => {
    const categoryMap = {
      "Weight Loss": "weight-loss",
      "Muscle Gain": "muscle-gain",
      Maintenance: "maintenance",
      Vegetarian: "vegetarian",
      Vegan: "vegan",
    };
    return categoryMap[category] || "maintenance";
  };

  const handleDeleteWorkout = async (workoutId) => {
    setWorkoutToDelete(workoutId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteWorkout = async () => {
    try {
      const response = await fetch(`/api/workouts/${workoutToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete workout");
      }

      showSuccessToast("Workout deleted successfully!");
      fetchWorkouts();
      setShowDeleteConfirm(false);
      setWorkoutToDelete(null);
    } catch (err) {
      showErrorToast("Failed to delete workout");
    }
  };

  const getDayName = () => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[new Date().getDay()];
  };

  const renderTabContent = () => {
    if (!user.goal) return null;
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="dashboard-content">
            <div className="diet-plan-section">
              <div className="diet-plan-header">
                <h2>Your Activity Detail</h2>
                <div className="diet-plan-tabs">
                  <button
                    className={`tab-button ${
                      activeDietTab === "today" ? "active" : ""
                    }`}
                    onClick={() => setActiveDietTab("today")}
                  >
                    For Today
                  </button>
                  <button
                    className={`tab-button ${
                      activeDietTab === "weekly" ? "active" : ""
                    }`}
                    onClick={() => setActiveDietTab("weekly")}
                  >
                    This Week
                  </button>
                </div>
              </div>

              <div className="diet-plan-content">
                {activeDietTab === "today" ? (
                  <div className="daily-content">
                    <div className="daily-section">
                      <h3>Today's Diet Plan</h3>
                      {subscribedDietPlan ? (
                        subscribedDietPlan.data.dailyDetails[getDayName()]
                          ?.meals?.length > 0 ? (
                          <div className="diet-cards">
                            {subscribedDietPlan.data.dailyDetails[
                              getDayName()
                            ].meals.map((meal, index) => (
                              <div key={index} className="meal-card">
                                <div className="meal-header">
                                  <span className="meal-name">{meal.name}</span>
                                  <span className="meal-time">{meal.time}</span>
                                </div>
                                <p className="meal-description">
                                  {meal.description}
                                </p>
                                <span className="meal-calories">
                                  {meal.calories} kcal
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="compact-message">
                            <p>No meals scheduled for today</p>
                          </div>
                        )
                      ) : (
                        <div className="compact-message">
                          <p>No diet plan subscribed</p>
                        </div>
                      )}
                    </div>

                    <div className="daily-section">
                      <h3>Today's Workouts</h3>
                      <div className="workout-cards">
                        {subscribedWorkouts?.data?.length > 0 ? (
                          subscribedWorkouts.data.filter((workout) => {
                            if (workout.isRecurring && workout.recurringDays) {
                              return workout.recurringDays.includes(
                                getDayName()
                              );
                            }
                            return false;
                          }).length > 0 ? (
                            subscribedWorkouts.data
                              .filter((workout) => {
                                if (
                                  workout.isRecurring &&
                                  workout.recurringDays
                                ) {
                                  return workout.recurringDays.includes(
                                    getDayName()
                                  );
                                }
                                return false;
                              })
                              .map((workout, index) => (
                                <div key={index} className="workout-card">
                                  <div className="workout-header">
                                    <h4>{workout.name}</h4>
                                    <span
                                      className={`intensity-badge ${workout.intensityLevel.toLowerCase()}`}
                                    >
                                      {workout.intensityLevel}
                                    </span>
                                  </div>
                                  <div className="workout-details">
                                    <span>
                                      <Clock size={16} /> {workout.duration} min
                                    </span>
                                    <span>{workout.workoutType}</span>
                                  </div>
                                  {workout.scheduledTime && (
                                    <div className="workout-time">
                                      <Clock size={16} />{" "}
                                      {workout.scheduledTime}
                                    </div>
                                  )}
                                </div>
                              ))
                          ) : (
                            <div className="compact-message">
                              <p>No workouts scheduled for today</p>
                            </div>
                          )
                        ) : (
                          <div className="compact-message">
                            <p>No workouts subscribed</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="weekly-content">
                    {[
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].map((day) => (
                      <div key={day} className="day-section">
                        <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>

                        <div className="daily-section">
                          <h4>Diet Plan</h4>
                          {subscribedDietPlan && (
                            <div className="diet-cards">
                              {subscribedDietPlan.data.dailyDetails[
                                day
                              ]?.meals?.map((meal, index) => (
                                <div key={index} className="meal-card">
                                  <div className="meal-header">
                                    <span className="meal-name">
                                      {meal.name}
                                    </span>
                                    <span className="meal-time">
                                      {meal.time}
                                    </span>
                                  </div>
                                  <p className="meal-description">
                                    {meal.description}
                                  </p>
                                  <span className="meal-calories">
                                    {meal.calories} kcal
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="daily-section">
                          <h4>Workouts</h4>
                          <div className="workout-cards">
                            {subscribedWorkouts?.data?.length > 0 ? (
                              subscribedWorkouts.data
                                .filter((workout) => {
                                  if (
                                    workout.isRecurring &&
                                    workout.recurringDays
                                  ) {
                                    return workout.recurringDays.includes(day);
                                  }
                                  return false;
                                })
                                .map((workout, index) => (
                                  <div key={index} className="workout-card">
                                    <div className="workout-header">
                                      <h4>{workout.name}</h4>
                                      <span
                                        className={`intensity-badge ${workout.intensityLevel.toLowerCase()}`}
                                      >
                                        {workout.intensityLevel}
                                      </span>
                                    </div>
                                    <div className="workout-details">
                                      <span>
                                        <Clock size={16} /> {workout.duration}{" "}
                                        min
                                      </span>
                                      <span>{workout.workoutType}</span>
                                    </div>
                                    {workout.scheduledTime && (
                                      <div className="workout-time">
                                        <Clock size={16} />{" "}
                                        {workout.scheduledTime}
                                      </div>
                                    )}
                                  </div>
                                ))
                            ) : (
                              <div className="no-workouts">
                                No workouts scheduled for {day}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="recommended-blogs">
                <div className="section-header">
                  <h2>Recommended Blogs</h2>
                  <button
                    className="view-all-btn"
                    onClick={() => navigate("/blog")}
                  >
                    View All
                  </button>
                </div>
                {recommendedBlogs.length > 0 ? (
                  <div className="blogs-grid">
                    {recommendedBlogs.slice(0, 3).map((blog) => (
                      <div key={blog._id} className="blog-preview-card">
                        <div className="blog-preview-image">
                          <BlogPreview key={blog._id} blog={blog} />
                        </div>
                        <div className="blog-preview-content">
                          {/* <h3>{blog.title}</h3>
                            <p>{blog.excerpt?.substring(0, 60)}...</p> */}
                          <button
                            className="read-more-btn"
                            onClick={() => navigate(`/blog/${blog._id}`)}
                          >
                            Read More
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="compact-message">
                    <p>No recommended blogs available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="profile-content">
            <h2>Your Profile</h2>
            {!isEditing ? (
              <div className="profile-details">
                <div className="profile-row">
                  <div className="profile-label">Name</div>
                  <div className="profile-value">{user.name}</div>
                </div>
                <div className="profile-row">
                  <div className="profile-label">Email</div>
                  <div className="profile-value">{user.email}</div>
                </div>
                <div className="profile-row">
                  <div className="profile-label">Age</div>
                  <div className="profile-value">
                    {user.age || "Not specified"}
                  </div>
                </div>
                <div className="profile-row">
                  <div className="profile-label">Gender</div>
                  <div className="profile-value">
                    {user.gender
                      ? user.gender.charAt(0).toUpperCase() +
                        user.gender.slice(1)
                      : "Not specified"}
                  </div>
                </div>
                <div className="profile-row">
                  <div className="profile-label">Goals</div>
                  <div className="profile-value">
                    {user.goal || "No goals set"} cal/day (
                    <strong>
                      {user.goalType === "lose"
                        ? "🎯 Lose Weight"
                        : user.goalType === "gain"
                        ? "💪 Gain Weight"
                        : "⚖️ Maintain Weight"}
                    </strong>
                    )
                  </div>
                </div>

                <div className="profile-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowGoalForm(true)}
                  >
                    Set Goals
                  </button>
                </div>
              </div>
            ) : (
              <form className="profile-form" onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    min="13"
                    max="120"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {showGoalForm && (
              <div className="goal-form-modal">
                <div className="goal-form-content">
                  <h3>Set Your Fitness Goals</h3>
                  <form onSubmit={handleGoalSubmit}>
                    <div className="form-group">
                      <label htmlFor="goalType">What's your goal?</label>
                      <select
                        id="goalType"
                        value={goal.type}
                        onChange={(e) =>
                          setGoal({ ...goal, type: e.target.value })
                        }
                        required
                      >
                        <option value="maintain">
                          Maintain Current Weight
                        </option>
                        <option value="lose">Lose Weight</option>
                        <option value="gain">Gain Weight</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="currentWeight">Current Weight (kg)</label>
                      <input
                        type="number"
                        id="currentWeight"
                        value={goal.currentWeight}
                        onChange={(e) =>
                          setGoal({ ...goal, currentWeight: e.target.value })
                        }
                        min="30"
                        max="300"
                        step="0.1"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="height">Height (cm)</label>
                      <input
                        type="number"
                        id="height"
                        value={goal.height}
                        onChange={(e) =>
                          setGoal({ ...goal, height: e.target.value })
                        }
                        min="100"
                        max="250"
                        required
                      />
                    </div>

                    {goal.type !== "maintain" && (
                      <>
                        <div className="form-group">
                          <label htmlFor="targetWeight">
                            Target Weight (kg)
                          </label>
                          <input
                            type="number"
                            id="targetWeight"
                            value={goal.targetWeight}
                            onChange={(e) =>
                              setGoal({ ...goal, targetWeight: e.target.value })
                            }
                            min="30"
                            max="300"
                            step="0.1"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="weeklyTarget">
                            How fast do you want to{" "}
                            {goal.type === "lose" ? "lose" : "gain"} weight?
                          </label>
                          <select
                            id="weeklyTarget"
                            value={goal.weeklyTarget}
                            onChange={(e) =>
                              setGoal({
                                ...goal,
                                weeklyTarget: parseFloat(e.target.value),
                              })
                            }
                            required
                          >
                            <option value="0.25">
                              0.25 kg/week (Slow & Steady)
                            </option>
                            <option value="0.5">0.5 kg/week (Moderate)</option>
                            <option value="0.75">0.75 kg/week (Fast)</option>
                            <option value="1">1 kg/week (Very Fast)</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div className="form-group">
                      <label htmlFor="activityLevel">Activity Level</label>
                      <select
                        id="activityLevel"
                        value={goal.activityLevel}
                        onChange={(e) =>
                          setGoal({ ...goal, activityLevel: e.target.value })
                        }
                        required
                      >
                        <option value="sedentary">
                          Sedentary (Desk job, little exercise)
                        </option>
                        <option value="lightly_active">
                          Lightly Active (Light exercise 1-3 days/week)
                        </option>
                        <option value="moderately_active">
                          Moderately Active (Moderate exercise 3-5 days/week)
                        </option>
                        <option value="very_active">
                          Very Active (Hard exercise 6-7 days/week)
                        </option>
                        <option value="extremely_active">
                          Extremely Active (Very hard exercise + physical job)
                        </option>
                      </select>
                    </div>

                    {calculatedCalories > 0 && (
                      <div className="calorie-preview">
                        <div className="calorie-result">
                          <h4>
                            🎯 Your Daily Calorie Goal: {calculatedCalories}{" "}
                            calories
                          </h4>
                          <p>
                            Based on your profile and goals, you should consume
                            approximately <strong>{calculatedCalories}</strong>{" "}
                            calories per day.
                          </p>
                          {goal.type !== "maintain" && (
                            <p>
                              This will help you{" "}
                              {goal.type === "lose" ? "lose" : "gain"}{" "}
                              <strong>{goal.weeklyTarget} kg per week</strong>.
                            </p>
                          )}
                          {(() => {
                            const timeToGoal = calculateTimeToGoal();
                            return (
                              timeToGoal &&
                              goal.type !== "maintain" && (
                                <p>
                                  🗓️{" "}
                                  <strong>
                                    Estimated time to reach your goal:{" "}
                                    {timeToGoal.weeks} weeks
                                  </strong>
                                </p>
                              )
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        Save Goal
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowGoalForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );

      case "workouts":
        return (
          <div className="workouts-content">
            <div className="workout-header">
              <h2>Your Workouts</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateWorkoutModal(true)}
              >
                Create New Workout
              </button>
            </div>

            <div className="workouts-section">
              <h3>Your Subscribed Workouts</h3>
              <div className="workout-table-container">
                <table className="workout-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Intensity</th>
                      <th>Calories Burn</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribedWorkouts.data.map((workout) => (
                      <tr key={workout._id}>
                        <td>{workout.name}</td>
                        <td>{workout.workoutType}</td>
                        <td>{workout.duration} min</td>
                        <td>
                          <span
                            className={`intensity-badge ${workout.intensityLevel.toLowerCase()}`}
                          >
                            {workout.intensityLevel}
                          </span>
                        </td>
                        <td>{workout.caloriesBurn} cal</td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="btn-icon"
                              onClick={() => {
                                setSelectedWorkout(workout);
                                setShowWorkoutModal(true);
                              }}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="btn-icon delete"
                              onClick={() => handleDeleteWorkout(workout._id)}
                              title="Delete Workout"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="workouts-section">
              <h3>Recommended Workouts</h3>
              <div className="workout-table-container">
                <table className="workout-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Intensity</th>
                      <th>Calories Burn</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminWorkouts.data.map((workout) => (
                      <tr key={workout._id}>
                        <td>{workout.name}</td>
                        <td>{workout.workoutType}</td>
                        <td>{workout.duration} min</td>
                        <td>
                          <span
                            className={`intensity-badge ${workout.intensityLevel}`}
                          >
                            {workout.intensityLevel}
                          </span>
                        </td>
                        <td>{workout.caloriesBurn} cal</td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="btn-icon"
                              onClick={() => {
                                setSelectedWorkout(workout);
                                setShowWorkoutModal(true);
                              }}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="btn-icon subscribe"
                              onClick={() =>
                                handleSubscribeWorkout(workout._id)
                              }
                              title="Subscribe"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "diet-plans":
        return (
          <div className="workouts-content">
            <div className="workouts-section">
              <h3>Your DietPlan</h3>
              <div className="workout-table-container">
                <table className="workout-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Daily Calories</th>
                      <th>Meals Per Day</th>
                      <th>Blog</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribedDietPlan && (
                      <tr key={subscribedDietPlan.data._id}>
                        <td>{subscribedDietPlan.data.name}</td>
                        <td>{subscribedDietPlan.data.category}</td>
                        <td>{subscribedDietPlan.data.dailyCalories}</td>
                        <td>{subscribedDietPlan.data.mealsPerDay}</td>
                        <td>
                          <button
                            className="btn-icon"
                            onClick={() =>
                              navigate(
                                `/blog/${subscribedDietPlan.data.blogLink}`
                              )
                            }
                            title="View Blog"
                          >
                            View Blog
                          </button>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="btn-icon"
                              onClick={() => {
                                setSelectedDietPlan(subscribedDietPlan.data);
                                setShowDietPlanModal(true);
                              }}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="workouts-section">
              <h3>Recommended DietPlans</h3>
              <div className="workout-table-container">
                <table className="workout-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Daily Calories</th>
                      <th>Meals Per Day</th>
                      <th>Blog</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendedDietPlans.data.map((d) => (
                      <tr key={d._id}>
                        <td>{d.name}</td>
                        <td>{d.category}</td>
                        <td>{d.dailyCalories}</td>
                        <td>{d.mealsPerDay}</td>
                        <td>
                          <button
                            className="btn-icon"
                            onClick={() => navigate(`/blog/${d.blogLink}`)}
                            title="View Blog"
                          >
                            View Blog
                          </button>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="btn-icon"
                              onClick={() => {
                                setSelectedDietPlan(d);
                                setShowDietPlanModal(true);
                              }}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="btn-icon subscribe"
                              onClick={() => handleSubscribeDietPlan(d._id)}
                              title="Subscribe"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>FitJourney Dashboard</h1>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`tab-button ${activeTab === "workouts" ? "active" : ""}`}
          onClick={() => setActiveTab("workouts")}
        >
          Workouts
        </button>
        <button
          className={`tab-button ${activeTab === "diet-plans" ? "active" : ""}`}
          onClick={() => setActiveTab("diet-plans")}
        >
          Diet Plans
        </button>
        <button
          className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
      </div>

      <div className="dashboard-content-wrapper">{renderTabContent()}</div>

      {/* Workout Modal */}
      {showWorkoutModal && selectedWorkout && (
        <div
          className="modal-overlay"
          onClick={() => setShowWorkoutModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedWorkout.name}</h2>
              <button
                className="modal-close"
                onClick={() => setShowWorkoutModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="workout-details">
                <div className="detail-section">
                  <h3>Basic Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Type</span>
                      <span className="detail-value">
                        {selectedWorkout.workoutType}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Duration</span>
                      <span className="detail-value">
                        {selectedWorkout.duration} minutes
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Intensity</span>
                      <span
                        className={`intensity-badge ${selectedWorkout.intensityLevel.toLowerCase()}`}
                      >
                        {selectedWorkout.intensityLevel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Schedule</h3>
                  <div className="detail-grid">
                    {selectedWorkout.scheduledDate && (
                      <div className="detail-item">
                        <Calendar size={16} />
                        <span className="detail-value">
                          {new Date(
                            selectedWorkout.scheduledDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {selectedWorkout.scheduledTime && (
                      <div className="detail-item">
                        <Clock size={16} />
                        <span className="detail-value">
                          {selectedWorkout.scheduledTime}
                        </span>
                      </div>
                    )}
                    {selectedWorkout.isRecurring &&
                      selectedWorkout.recurringDays && (
                        <div className="detail-item recurring-days">
                          <Repeat size={16} />
                          <div className="day-chips">
                            {selectedWorkout.recurringDays.map((day, index) => (
                              <span key={index} className="day-chip">
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    {selectedWorkout.reminderEnabled &&
                      selectedWorkout.reminderTime && (
                        <div className="detail-item">
                          <Bell size={16} />
                          <span className="detail-value">
                            Reminder: {selectedWorkout.reminder} minutes before
                            workout
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Description</h3>
                  <p className="workout-description">{selectedWorkout.notes}</p>
                </div>

                {selectedWorkout.exercises && (
                  <div className="detail-section">
                    <h3>Exercises</h3>
                    <div className="exercises-list">
                      {selectedWorkout.exercises.map((exercise, index) => (
                        <div key={index} className="exercise-item">
                          <h4>{exercise.name}</h4>
                          <div className="exercise-details">
                            <span>Sets: {exercise.sets}</span>
                            <span>Reps: {exercise.reps}</span>
                            {exercise.duration && (
                              <span>Duration: {exercise.duration}s</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Workout Modal */}
      {showCreateWorkoutModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateWorkoutModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Workout</h2>
              <button
                className="modal-close"
                onClick={() => setShowCreateWorkoutModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <WorkoutForm
                initialData={selectedWorkout}
                isAdminMode={false}
                onSuccess={() => {
                  setShowCreateWorkoutModal(false);
                  fetchWorkouts();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Diet Plan Detail Modal */}
      {showDietPlanModal && selectedDietPlan && (
        <div
          className="modal-overlay"
          onClick={() => setShowDietPlanModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDietPlan.name}</h2>
              <button
                className="modal-close"
                onClick={() => setShowDietPlanModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="diet-plan-details">
                <div className="detail-header">
                  <div className="plan-info">
                    <div className="info-item">
                      <span className="label">Category:</span>

                      <span className="value">{selectedDietPlan.category}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Daily Calories:</span>

                      <span className="value">
                        {selectedDietPlan.dailyCalories} kcal
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Meals Per Day:</span>
                      <span className="value">
                        {selectedDietPlan.mealsPerDay}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Blog Link:</span>

                      <a
                        href={`/blog/${selectedDietPlan.blogLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="blog-link"
                      >
                        View Blog for more details
                      </a>
                    </div>
                  </div>
                </div>

                <div className="daily-meals">
                  <div className="days-selector">
                    {[
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].map((day) => (
                      <button
                        key={day}
                        className={`day-button ${
                          selectedDay === day ? "active" : ""
                        }`}
                        onClick={() => setSelectedDay(day)}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="meals-container">
                    <div className="meals-header">
                      <h3>
                        Meals for{" "}
                        {selectedDay.charAt(0).toUpperCase() +
                          selectedDay.slice(1)}
                      </h3>
                    </div>

                    <div className="meals-list">
                      {selectedDietPlan.dailyDetails[selectedDay]?.meals?.map(
                        (meal, index) => (
                          <div key={index} className="meal-card">
                            <div className="meal-header">
                              <span className="meal-name">{meal.name}</span>
                              <span className="meal-time">{meal.time}</span>
                            </div>
                            <p className="meal-description">
                              {meal.description}
                            </p>
                            <span className="meal-calories">
                              {meal.calories} kcal
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscribe Confirmation Modal */}
      {showSubscribeConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowSubscribeConfirm(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Subscription</h2>
              <button
                className="modal-close"
                onClick={() => setShowSubscribeConfirm(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="confirmation-message">
                If you subscribe to this diet plan, your current diet plan will
                be unsubscribed. Do you want to continue?
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowSubscribeConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={confirmSubscribeDietPlan}
                >
                  Yes, Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button
                className="modal-close"
                onClick={() => setShowDeleteConfirm(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="confirmation-message">
                Are you sure you want to delete this workout? This action cannot
                be undone.
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmDeleteWorkout}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitJourneyDashboard;
