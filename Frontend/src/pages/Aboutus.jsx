import React, { useState, useEffect } from "react";
import '../styles/Aboutus.css';
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

const AboutUs = () => {
    const navigate = useNavigate();
    const [featuredWorkouts, setFeaturedWorkouts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/allworkouts");
                
                if (!response.ok) {
                    throw new Error("Failed to fetch workouts");
                }
                
                const data = await response.json();
                setFeaturedWorkouts(data.data?.slice(0, 3) || []);
            } catch (err) {
                console.error("Error fetching workouts:", err);
                setError("Failed to load recommended workouts");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchWorkouts();
    }, []);

    // Sample data for user vlogs with stories
    const userVlogs = [
        {
            id: 1,
            name: "Sarah K.",
            title: "How I Lost 30 Pounds in 6 Months",
            thumbnail: "/api/placeholder/300/200",
            views: "15.2K",
            story: "When I started with Fit Journey, I was skeptical about another fitness platform. But the personalized tracking helped me see patterns I never noticed before. Six months later, I'm down 30 pounds and have more energy than ever."
        },
        {
            id: 2,
            name: "Mike T.",
            title: "My Marathon Training Journey",
            thumbnail: "/api/placeholder/300/200",
            views: "8.7K",
            story: "Training for my first marathon seemed impossible until I started using Fit Journey to track my runs. The website helped me gradually increase mileage while monitoring recovery. Crossed the finish line last month and already planning my next race!"
        },
        {
            id: 3,
            name: "Aisha J.",
            title: "From Couch to 5K: A Beginner's Story",
            thumbnail: "/api/placeholder/300/200",
            views: "12.3K",
            story: "As someone who had never run before, the Couch to 5K program on Fit Journey was a game-changer. The progress tracking kept me motivated even on tough days. Three months later, I completed my first 5K and I'm now training for a 10K."
        }
    ];

    // Stats for fitness tracking (Removed the rating stat)
    const stats = [
        { id: 1, number: "50K+", label: "Active Users" },
        { id: 2, number: "2.3M", label: "Workouts Completed" },
        { id: 3, number: "186K", label: "Goals Achieved" }
    ];

    return (
        <div className="about-us-container">
            {/* Hero Section */}
            <div className="hero-section">
                <h1>About Fit Journey</h1>
                <p className="tagline">Track. Progress. Achieve.</p>
            </div>

            {/* Introduction Section */}
            <section className="intro-section">
                <div className="intro-content">
                    <h2>Our Mission</h2>
                    <p>
                        At Fit Journey, we believe fitness tracking should be motivational, not complicated. 
                        we've built a powerful yet intuitive platform that you to be motivated and work hard for your physical health everyday.
                    </p>
                    <p>
                        Your success is our story and your health is our priority .
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                {stats.map(stat => (
                    <div key={stat.id} className="stat-card">
                        <div className="stat-label">{stat.label}</div>
                        <div className="stat-number">{stat.number}</div>
                    </div>
                ))}
            </section>

            {/* Featured Workouts Section */}
            <section className="workout-section">
                <h2>Recommended Workouts</h2>
                <p>Discover fitness routines designed to help you reach your goals efficiently.</p>
                
                {isLoading ? (
                    <div className="loading-message">Loading workouts...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : featuredWorkouts.length > 0 ? (
                    <div className="workout-card-grid">
                        {featuredWorkouts.slice(0, 3).map((workout) => (
                            <div key={workout._id} className="workout-cards ">
                                <div className="workout-header">
                                    <h3>{workout.name}</h3>
                                    <span className={`intensity-badge ${workout.intensityLevel?.toLowerCase()}`}>
                                        {workout.intensityLevel}
                                    </span>
                                </div>
                                <p className="workout-description">
                                    {workout.notes?.substring(0, 60) || "A comprehensive workout designed to help you achieve your fitness goals."}
                                    {workout.notes?.length > 60 ? "..." : ""}
                                </p>
                                <div className="workout-details">
                                    <div className="detail-item">
                                        <Clock size={14} />
                                        <span>{workout.duration} min</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>{workout.workoutType}</span>
                                    </div>
                                </div>
                                {workout.exercises && workout.exercises.length > 0 && (
                                    <div className="exercises-preview">
                                        <h4>Top Exercises:</h4>
                                        <ul>
                                            {workout.exercises.slice(0, 2).map((exercise, idx) => (
                                                <li key={idx}>{exercise.name}</li>
                                            ))}
                                            {workout.exercises.length > 2 && (
                                                <li>+ {workout.exercises.length - 2} more</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-workouts-message">No workouts available at this time.</div>
                )}
            </section>

            {/* User Vlogs Section */}
            <section className="vlogs-section">
                <h2>Success Stories</h2>
                <p className="vlogs-section-description">Real progress tracked and shared by our community members.</p>
                
                <div className="story-cards">
                    {userVlogs.map(vlog => (
                        <div key={vlog.id} className="story-card">
                            <div className="story-content">
                                <h3>{vlog.title}</h3>
                                <p className="story-author">By {vlog.name}</p>
                                <p className="story-text">{vlog.story}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Join Us Section */}
            <section className="join-section">
                <h2>Start Tracking Your Fit Journey Today</h2>
                <p>Join thousands of members who are visualizing their progress and achieving their fitness goals.</p>
                <button className="join-btn" onClick={() => navigate("/SignupPage")}>
                    Start your Journey
                </button>
            </section>
        </div>
    );
};

export default AboutUs;
