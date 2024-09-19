import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import asyncHandler from "./../utils/asyncHandler";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized User Request");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //   find user in db
    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(400, "Invalid Access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.massage || "Invalid access token");
  }
});

export { verifyJWT };
