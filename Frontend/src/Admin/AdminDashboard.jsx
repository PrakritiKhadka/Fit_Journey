import React, { useState } from 'react';
import { BarChart, LineChart, PieChart, TrendingUp, TrendingDown, Users, Dumbbell, Utensils, Calendar, ChevronDown, ArrowLeft } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import './AdminDashboard.css';

// Sample data for charts
const userGrowthData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 600 },
  { name: 'Mar', users: 800 },
  { name: 'Apr', users: 1000 },
  { name: 'May', users: 1200 },
  { name: 'Jun', users: 1300 },
];

const workoutTypesData = [
  { name: 'Strength', value: 35 },
  { name: 'Cardio', value: 25 },
  { name: 'HIIT', value: 20 },
  { name: 'Yoga', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

function StatCard({ title, value, change, icon, color }) {
  const isPositive = change > 0;
  
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        {icon}
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
        <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp className="trend-icon" /> : <TrendingDown className="trend-icon" />}
          <span>{isPositive ? '+' : ''}{change}% from last month</span>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, icon, children }) {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{title}</h3>
        <div className="chart-icon">
          {icon}
        </div>
      </div>
      <div className="chart-container">
        {children}
      </div>
    </div>
  );
}

function ActivityItem({ color, title, description, time }) {
  return (
    <div className={`activity-item border-${color}`}>
      <p className="activity-title">{title}</p>
      <p className="activity-description">{description}</p>
      <p className="activity-time">{time}</p>
    </div>
  );
}

function Dashboard() {
  const [timeRange, setTimeRange] = useState('This Month');
  
  return (
    <div className="dashboard">
      {/* Back Button */}
      <div className="back-button-container">
        <a href="/AdminPanel" className="back-button">
          <ArrowLeft className="back-icon" />
          <span>Go Back</span>
        </a>
      </div>
      
      <header className="dashboard-header">
        <div>
          <h1>Fitness Dashboard</h1>
          <p className="subtitle">Overview of your fitness platform performance</p>
        </div>
        <div className="time-filter">
          <Calendar className="calendar-icon" />
          <span>{timeRange}</span>
          <ChevronDown className="dropdown-icon" />
        </div>
      </header>

      {/* Stats Overview */}
      <div className="stats-grid">
        <StatCard 
          title="Total Users" 
          value="1,254" 
          change={5.2}
          icon={<Users className="stat-svg" />}
          color="blue"
        />
        <StatCard 
          title="Active Workout Plans" 
          value="45" 
          change={12.7}
          icon={<Dumbbell className="stat-svg" />}
          color="purple"
        />
        <StatCard 
          title="Active Diet Plans" 
          value="78" 
          change={-3.5}
          icon={<Utensils className="stat-svg" />}
          color="green"
        />
      </div>
      
      {/* Charts */}
      <div className="charts-grid">
        <ChartCard title="User Growth" icon={<LineChart className="chart-svg" />}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={userGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Popular Workout Types" icon={<PieChart className="chart-svg" />}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={workoutTypesData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {workoutTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      
      {/* Recent Activity */}
      <div className="activity-card">
        <div className="activity-header">
          <h3>Recent Activity</h3>
          <button className="view-all">View All</button>
        </div>
        <div className="activity-list">
          <ActivityItem 
            color="blue" 
            title="New user registered" 
            description="Jane Smith just signed up for Premium plan" 
            time="2 hours ago" 
          />
          <ActivityItem 
            color="purple" 
            title="New workout plan created" 
            description='Admin added "Advanced HIIT" workout plan'
            time="5 hours ago" 
          />
          <ActivityItem 
            color="green" 
            title="Diet plan updated" 
            description='Admin modified "Keto Diet" meal options'
            time="Yesterday" 
          />
          <ActivityItem 
            color="orange" 
            title="Achievement unlocked" 
            description='15 users completed the "30-Day Challenge"'
            time="2 days ago" 
          />
        </div>
      </div>
      
      {/* Additional Section: Quick Analytics */}
      <div className="analytics-card">
        <h3>Quick Analytics</h3>
        <div className="analytics-grid">
          <div className="analytics-item">
            <div className="analytics-value">87%</div>
            <div className="analytics-label">User Retention</div>
          </div>
          <div className="analytics-item">
            <div className="analytics-value">24 min</div>
            <div className="analytics-label">Avg. Session</div>
          </div>
          <div className="analytics-item">
            <div className="analytics-value">4.8</div>
            <div className="analytics-label">App Rating</div>
          </div>
          <div className="analytics-item">
            <div className="analytics-value">62%</div>
            <div className="analytics-label">Goal Completion</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;