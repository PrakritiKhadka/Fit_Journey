import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

export const generateToken = (userId, email) => {
  return jwt.sign({ userId: userId, email: email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const verifyAndGetPayload = (token) => {
    try {
        if (!token) {
        return null;
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        console.error("JWT verification error:");
        return null;
    }
}