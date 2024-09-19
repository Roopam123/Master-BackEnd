import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponce } from "../utils/apiResponce.js";
import { fileUploadOnCloudinary } from "../utils/cloudinary.js";
import asyncHandler from "./../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "somthing went wrong while generating the access and refresh tokens"
    );
  }
};

// --------------Register Function ---------------------->
const registerUser = asyncHandler(async (req, res) => {
  // 1. Get User details from the frontEnd
  // 2. validation - not empoty
  // 3. user not exist, username or email
  // 4. check for image and avatar
  // 5. upload them at cloudinary, avatar
  // 6. create user object and upload at DB
  // 7. remove password & refresh token from the db
  // 8. check for user creation
  // 9. return response

  // 1. Get User details from the frontEnd
  const { username, email, fullName, password } = req.body;

  // 2. validation - not empty
  if (username === "" || fullName === "" || email === "" || password === "") {
    throw new ApiError(400, "All fields is mendentory");
  }

  // 3. check user not exist, username or email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(40, "User with username and email is already exist");
  }

  // 4. check for image and avatar
  const avtarLocalPath = req.files?.avatar[0]?.path;
  const coverImagePath = req.files?.coverImage[0]?.path;

  if (!avtarLocalPath) {
    throw new ApiError(400, "Avatar files is required!!");
  }

  // 5. upload them at cloudinary, avatar
  const avatarUploadOnCloudinary = await fileUploadOnCloudinary(avtarLocalPath);
  const coverImgUploadOnCloudinary =
    await fileUploadOnCloudinary(coverImagePath);

  if (!avatarUploadOnCloudinary) {
    throw new ApiError(400, "Avatar is not present");
  }

  // 6. create user object and upload at DB
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    password,
    avatar: avatarUploadOnCloudinary?.url,
    coverImage: coverImgUploadOnCloudinary?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  // All done
  return res
    .status(201)
    .json(new ApiResponce(200, createdUser, "user Register Successfully"));
});

// -----------------Login Function ------------------------->
const loginUser = asyncHandler(async (req, res) => {
  // req body --> data
  // username or email
  // find the user
  // password check
  // generate access & refresh token
  // send cookies

  const { username, email, password } = req.body;
  console.log("Name-->", username, email);

  if (!username || !email) {
    throw new ApiError(400, "username or password is required!!");
  }
  if (password) {
    throw new ApiError(400, "password is required!!");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist!!");
  }

  const isPasswordValid = await user.isPasswordCurrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "incurrect password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponce(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully"
      )
    );
});

// -----------------Log Out User ---------------------------->
const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponce(200, {}, "User logout successfully"));
});

export { registerUser, loginUser, logOutUser };
