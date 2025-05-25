import { OAuth2Client } from 'google-auth-library';
import { configDotenv } from "dotenv";

configDotenv();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const getPayload = async (token) => {
    try {
        if (!token) {
          return res.status(400).json({
            message: 'No token provided',
          });
        }

          const verifiedToken = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          
          return verifiedToken.payload;
          
      } catch (err) {
        console.error('Google auth error:', err);
        return null;
      }
    }