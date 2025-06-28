import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";
import User from "../models/user.model.js";
import { getPayload } from "../utils/googleUtil.js";
import { generateToken } from "../utils/tokenUtil.js";
import { createUser, getUserByEmail } from "./userService.js";

configDotenv();

export const signupWithGoogle = async (req, res) => {
  const googleToken = req.header("Authorization")?.replace("Bearer ", "");
  const { role } = req.body; // Get role from request body

  if (!googleToken) {
    return res.status(400).json({ message: "Google token is required" });
  }

  if (!role || !["user", "admin"].includes(role)) {
    return res
      .status(400)
      .json({ message: "Valid role (user/admin) is required" });
  }

  try {
    const googleUser = await getPayload(googleToken);

    if (!googleUser) {
      return res
        .status(401)
        .json({ message: "Invalid Google token, provide valid bearer token" });
    }

    var existingUser = await getUserByEmail(googleUser.email);
    if (!existingUser) {
      const user = new User({
        name: googleUser.name,
        email: googleUser.email,
        gender: "prefer-not-to-say",
        authMethod: "google",
        googleId: googleUser.sub,
        role: role, // Add role to user creation
      });

      existingUser = await createUser(user);
    }

    const token = generateToken(existingUser.id, existingUser.email);

    // Return user data along with token
    const { password, __v, ...userData } = existingUser.toObject();
    return res.json({
      message: "Signed Up successfully",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("Error in Google sign-up:", err);
    return res
      .status(500)
      .json({ message: "Opps! Failed to Sign Up, Contact Us for help" });
  }
};

export const signUpWithEmail = async (req, res) => {
  const { name, age, gender, email, password, role } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: "Email, password, and name are required" });
  }

  if (!role || !["user", "admin"].includes(role)) {
    return res
      .status(400)
      .json({ message: "Valid role (user/admin) is required" });
  }

  if (age && age < 13) {
    return res
      .status(400)
      .json({ message: "You must be at least 13 years old to register." });
  }

  try {
    // Check if the email is already taken
    var existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({
      name: name,
      gender: gender || "prefer-not-to-say",
      email: email,
      password: password,
      age: age,
      authMethod: "local",
      role: role, // Add role to user creation
    });

    existingUser = await createUser(user);

    const token = generateToken(existingUser.id, existingUser.email);

    // Return user data along with token
    const { password: _, __v, ...userData } = existingUser.toObject();
    return res.json({
      message: "Signed Up successfully",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Error in email sign-up:", error);
    return res
      .status(500)
      .json({ message: "Registration failed. Please try again." });
  }
};

export const login = async (req, res) => {
  try {
    const googleToken = req.header("Authorization")?.replace("Bearer ", "");

    if (googleToken) {
      const googleUser = await getPayload(googleToken);

      if (!googleUser) {
        return res.status(401).json({
          message: "Invalid Google token, provide valid bearer token",
        });
      }

      var existingUser = await getUserByEmail(googleUser.email);
      if (!existingUser) {
        return res
          .status(400)
          .json({ message: "User not found. Please sign up first." });
      }

      const token = generateToken(existingUser.id, existingUser.email);

      // Return user data along with token
      const { password, __v, ...userData } = existingUser.toObject();
      return res.json({
        message: "Logged in successfully",
        token,
        user: userData,
      });
    } else if (req.body.email && req.body.password) {
      const { email, password } = req.body;

      // Check if user exists
      var existingUser = await getUserByEmail(email);
      if (!existingUser) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const salt = process.env.PASSWORD_SALT || "RTxD+XMmfNSHh5$da2At";

      const isMatch = await bcrypt.compare(
        password + salt,
        existingUser.password
      );
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(existingUser.id, existingUser.email);

      // Return user data along with token
      const { password: _, __v, ...userData } = existingUser.toObject();
      return res.json({
        message: "Logged in successfully",
        token,
        user: userData,
      });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid credentials, provide valid credentials" });
    }
  } catch (err) {
    console.error("Log in", err);
    return res
      .status(401)
      .json({ message: "Opps! Failed to Log In, Contact Us for help" });
  }
};
