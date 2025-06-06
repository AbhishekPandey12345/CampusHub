import { ApiError } from "../Utils/ApiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { FileUpload } from "../Utils/PostUpload.js";
import ApiResponse from "../Utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import Following from "../models/Following.model.js";
import Post from "../models/Post.model.js";

const registerUser = asyncHandler(async (req, res) => {
  const {
    FullName,
    username,
    email,
    password,
    branch,
    batchYear,
    mobileNumber,
    interests,
    workExperience,
    privacySettings,
  } = req.body;

  // Step 1: Parse privacy settings
  let parsedPrivacy;
  try {
    parsedPrivacy = JSON.parse(privacySettings);
  } catch (err) {
    throw new ApiError(400, "Invalid JSON in privacySettings");
  }

  const { allowChat, allowGroupAdd, showMobileNumber } = parsedPrivacy;

  // Step 2: Validate required fields
  const requiredFields = [
    FullName,
    username,
    email,
    password,
    branch,
    batchYear,
    mobileNumber,
  ];
  if (requiredFields.some((field) => !field || field.trim() === "")) {
    throw new ApiError(
      400,
      "All required fields must be provided and non-empty"
    );
  }

  if (
    typeof allowChat !== "boolean" ||
    typeof allowGroupAdd !== "boolean" ||
    typeof showMobileNumber !== "boolean"
  ) {
    throw new ApiError(400, "Invalid or missing privacy settings");
  }

  // Step 3: Check if user already exists
  const isExist = await User.findOne({ $or: [{ username }, { email }] });
  if (isExist) {
    throw new ApiError(400, "User already exists");
  }

  // Step 4: Upload avatar
  const avatarLocalPath = req.files?.Avatar?.[0]?.path;
  const uploadedAvatar = await FileUpload(avatarLocalPath);

  // Step 5: Create user
  let newUser;
  try {
    newUser = await User.create({
      FullName,
      username,
      email,
      password,
      Avatar: uploadedAvatar?.url || "",
      branch,
      batchYear: Number(batchYear),
      mobileNumber,
      interests,
      workExperience,
      allowChat,
      allowGroupAdd,
      showMobileNumber,
    });
  } catch (err) {
    console.error("Error while creating user:", err);
    throw new ApiError(
      500,
      "Failed to register user. Check data and try again."
    );
  }

  // Step 6: Sanitize and send user
  let checkUser;
  try {
    checkUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );
    if (!checkUser) {
      throw new ApiError(
        500,
        "Something went wrong while verifying the registered user"
      );
    }
  } catch (err) {
    console.error("Error while retrieving user:", err);
    throw new ApiError(500, "Failed to retrieve user after registration");
  }

  res
    .status(201)
    .json(new ApiResponse(200, checkUser, "Registered User Successfully"));
});

const loginuser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(400, "Unauthorized User");
  }

  const check = await user.isPasswordCorrect(password);
  if (!check) {
    throw new ApiError(400, "Incorrect Password");
  }
  const AccessToken = jwt.sign(
    {
      _id: user.id,
      Username: user.username,
    },
    process.env.TOKEN
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: user._id, Token: AccessToken },
        "User Successfully Login"
      )
    );
});

const Makesearchwrequest = asyncHandler(async (req, res) => {
  const { search } = req.query;
  try {
    const regexPattern = new RegExp(`^${search}`, "i");

    // Find all users whose names match the regex pattern
    const users = await User.find({ username: regexPattern }).select(
      "-password -email"
    );
    return res
      .status(200)
      .json(new ApiResponse(200, users, " Successfully search"));
  } catch {
    throw new ApiError(405, "Somethings Went Wrongs");
  }
});

const CurrentUserPassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.body?._id);
    const check = await user.isPasswordCorrect(oldPassword);

    if (!check) {
      throw new ApiError(405, "Not Correct Password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: true });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Successfully changed password"));
  } catch (error) {
    // Handle errors
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
});

const CurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Get Current User"));
});

const UpdateProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.body._id;
    const {
      mobileNumber,
      email,
      interests,
      workExperience,
      showMobileNumber,
      allowChat,
      allowGroupAdd,
    } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Handle avatar upload if provided
    const avatarLocalPath = req.files?.Avatar?.[0]?.path;
    const uploadedAvatar = await FileUpload(avatarLocalPath);

    // Update fields
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.email = email || user.email;
    user.interests = interests || user.interests;
    user.workExperience = workExperience || user.workExperience;
    user.showMobileNumber = showMobileNumber === "true";
    user.allowChat = allowChat !== "false"; // Default true
    user.allowGroupAdd = allowGroupAdd !== "false"; // Default true
    user.Avatar = uploadedAvatar?.url || user.Avatar; // Use existing avatar if not provided

    // Save updated user
    await user.save();

    // Prepare response data
    const responseData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      FullName: user.FullName,
      Avatar: user.Avatar,
      mobileNumber: user.mobileNumber,
      interests: user.interests,
      workExperience: user.workExperience,
      showMobileNumber: user.showMobileNumber,
      allowChat: user.allowChat,
      allowGroupAdd: user.allowGroupAdd,
      branch: user.branch,
      batchYear: user.batchYear,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, responseData, "Profile updated successfully"));
  } catch (error) {
    console.error("Error updating profile:", error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Failed to update profile"
        )
      );
  }
});

const getProfileofUser = asyncHandler(async (req, res) => {
  const username = req.body.username || req.body.Username;

  const getProfileofUser = await User.findOne({ username }).select(
    "FullName username Avatar branch batchYear showMobileNumber interests workExperience mobileNumber"
  );

  if (!getProfileofUser) {
    throw new ApiError(406, "Something went wrong while getting profile");
  }

  // Destructure relevant fields
  const {
    FullName,
    username: uname,
    Avatar,
    branch,
    batchYear,
    showMobileNumber,
    interests,
    workExperience,
    mobileNumber,
  } = getProfileofUser;

  const countFollowing = await Following.countDocuments({
    follows: getProfileofUser._id,
  });
  const countFollower = await Following.countDocuments({
    follower: getProfileofUser._id,
  });
  const Posts = await Post.find({ owner: getProfileofUser._id });

  // Build response profile
  const Profiledata = {
    FullName,
    username: uname,
    Avatar,
    branch,
    batchYear,
  };

  if (showMobileNumber) {
    Profiledata.mobileNumber = mobileNumber;
  }

  if (interests?.trim()) {
    Profiledata.interests = interests;
  }

  if (workExperience?.trim()) {
    Profiledata.workExperience = workExperience;
  }

  const getData = {
    Profiledata,
    countFollowing,
    countFollower,
    Posts,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, getData, "Get User Profile Successfully"));
});

const getProfileofAlt = asyncHandler(async (req, res) => {
  const { Username, _id } = req.body;
  const userId = req.query._id
    ? typeof req.query._id === "string"
      ? req.query._id
      : req.query._id._id
    : null;
  const branch = req.query.branch ? req.query.branch : null;

  console.log(userId, branch);
  if (userId) {
    try {
          // 1. Find the requested user's profile
    const requestedUser = await User.findById(userId).select(
        "FullName username Avatar branch batchYear showMobileNumber interests workExperience mobileNumber"
    );

    if (!requestedUser) {
        throw new ApiError(404, "User not found");
    }

    // 2. Get the current logged-in user's ID (if authenticated)
    const currentUserId = req.user?._id; // Assuming you have auth middleware that sets req.user

    // 3. Get follow counts
    const [countFollowing, countFollower] = await Promise.all([
        Following.countDocuments({ follows: requestedUser._id }),
        Following.countDocuments({ follower: requestedUser._id })
    ]);

    // 4. Get user's posts
    const Posts = await Post.find({ owner: requestedUser._id });

    // 5. Build response
    const Profiledata = {
        FullName: requestedUser.FullName,
        username: requestedUser.username,
        Avatar: requestedUser.Avatar,
        branch: requestedUser.branch,
        batchYear: requestedUser.batchYear,
        isyouraccount: currentUserId && currentUserId.equals(requestedUser._id)
    };

    // Add conditional fields
    if (requestedUser.showMobileNumber) {
        Profiledata.mobileNumber = requestedUser.mobileNumber;
    }

    if (requestedUser.interests?.trim()) {
        Profiledata.interests = requestedUser.interests;
    }

    if (requestedUser.workExperience?.trim()) {
        Profiledata.workExperience = requestedUser.workExperience;
    }

    return res.status(200).json(
        new ApiResponse(200, {
            Profiledata,
            countFollowing,
            countFollower,
            Posts,
        }, "User profile fetched successfully")
    );
    } catch {
      throw new ApiError(405, "Get Some Problem while Fectching the data");
    }
  }

  if (branch) {
    try {
      const users = await User.find({ branch })
        .select(
          "_id Avatar FullName branch workExperience interests showMobileNumber mobileNumber"
        )
        .lean();
      console.log(users);
      if (!users || users.length === 0) {
        return res
          .status(200)
          .json(new ApiResponse(200, [], "No users found for this branch"));
      }

      // Format the response data based on privacy settings
      const formattedUsers = users.map((user) => ({
        _id: user._id,
        Avatar: user.Avatar,
        FullName: user.FullName,
        branch: user.branch,
        workExperience: user.workExperience,
        interests: user.interests,
        // Only include mobile number if allowed
        mobileNumber: user.showMobileNumber ? user.mobileNumber : undefined,
      }));

      return res
        .status(200)
        .json(
          new ApiResponse(200, formattedUsers, "Get User Profile Successfully")
        );
    } catch {
      throw new ApiError(405, "Get Some Problem while Fectching the data");
    }
  }
});

const Followrequest = asyncHandler(async (req, res) => {
  const { _id, Username } = req.body;
  if (req.body.user_id._id == undefined) {
    throw new ApiError(402, " Something Went Wrong in Following ");
  }
  try {
    const findfollow = await Following.findOne({
      $and: [{ follows: req.body.user_id._id }, { follower: _id }],
    });
    if (!findfollow) {
      await Following.create({
        follows: req.body.user_id._id,
        follower: _id,
      });
      const countFollowing = await Following.countDocuments({
        follows: req.body.user_id._id,
      });
      const countFollower = await Following.countDocuments({
        follower: req.body.user_id._id,
      });
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            followers: countFollower,
            following: countFollowing,
            isfollowing: true,
          },
          " Succefully Follow "
        )
      );
    } else {
      await Following.deleteOne({
        follows: req.body.user_id._id,
        follower: _id,
      });
      const countFollowing = await Following.countDocuments({
        follows: req.body.user_id._id,
      });
      const countFollower = await Following.countDocuments({
        follower: req.body.user_id._id,
      });
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            followers: countFollower,
            following: countFollowing,
            isfollowing: false,
          },
          " Succefully UnFollow "
        )
      );
    }
  } catch {
    throw new ApiError(403, " Something Wnet Wrong in Following ");
  }
});

const GetAllPost = asyncHandler(async (req, res) => {
  try {
    const { skip = 0, limit = 10 } = req.query;

    // Convert skip and limit to numbers
    const skipCount = parseInt(skip);
    const limitCount = parseInt(limit);

    // Query the database to skip some posts and limit the number of posts returned
    const limitedPosts = await Post.find().skip(skipCount).limit(limitCount);

    // Query the database to get the total count of all posts
    const totalCount = await Post.countDocuments();

    return res.status(200).json({
      success: true,
      data: {
        posts: limitedPosts,
        totalCount: totalCount,
      },
      message: "Get AllPost Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

export {
  Makesearchwrequest,
  getProfileofAlt,
  Followrequest,
  GetAllPost,
  UpdateProfile,
  registerUser,
  loginuser,
  CurrentUserPassword,
  CurrentUser,
  getProfileofUser,
};
