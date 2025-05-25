import { getUserByEmail } from "../service/userService.js";
import { verifyAndGetPayload } from "../utils/tokenUtil.js";

export const verifyLogin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied, Provide Valid Bearer Token" });
    }
    const decoded = verifyAndGetPayload(token);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Access Denied, Provide Valid Bearer Token" });
    }

    const user = await getUserByEmail(decoded.email);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, sign up first", user });
    }
    const {password, __v, ...userData} = user.toObject();
    req.user = userData;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Access Denied, Provide Valid Bearer Token or contact us",
    });
  }
};
