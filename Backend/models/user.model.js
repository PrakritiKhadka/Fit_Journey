import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: false, min: 13 },
  gender: {
    type: String,
    enum: ["male", "female", "non-binary", "prefer-not-to-say"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
  },
  authMethod: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  password: {
    type: String,
    required: function () {
      return this.authMethod === "local"; // Only required for local auth
    },
  },
  googleId: {
    type: String,
    required: function () {
      return this.authMethod === "google";
    },
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  goal: {
    type: Number,
    required: false,
  },
  goalType: {
    type: String,
    enum: ["lose", "gain", "maintain"],
    required: function () {
      return this.goal != null; // Only required when goal is set
    },
  },
});
// Index for better query performance on role-based queries
UserSchema.index({ role: 1 });
UserSchema.index({ email: 1, role: 1 });

// Instance method to check if user is admin
UserSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

// Instance method to check if user is normal user
UserSchema.methods.isUser = function () {
  return this.role === "user";
};

// Static method to find users by role
UserSchema.statics.findByRole = function (role) {
  return this.find({ role: role });
};
const User = mongoose.model("User", UserSchema);
export default User;
