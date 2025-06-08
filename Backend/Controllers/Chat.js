import { ApiError } from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { FileUpload } from "../Utils/PostUpload.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import Chat from "../models/Chat.model.js";
import Message from "../models/Message.model.js";
import { User } from "../models/user.model.js";

const createMessage = asyncHandler(async (req, res) => {
  const { chatid, _id, content } = req.body;
  try {
    const get = await Message.create({
      chat: chatid,
      sender: _id,
      content: content,
    });
    const getnew = await get.populate({
      path: "sender",
      select: "Avatar _id",
    });
    const hello = await getnew.populate({
      path: "chat",
      select: "users",
    });
    await Chat.findByIdAndUpdate(
      chatid,
      {
        latestmessage: get._id,
      },
      {
        new: true,
      }
    );
    return res.status(200).json(new ApiResponse(200, hello, "Good"));
  } catch (err) {
    throw new ApiError(404, "Somethings Went Wrong");
  }
});

const getallmessage = asyncHandler(async (req, res) => {
  const { chatid } = req.query;
  try {
    const get = await Message.find({
      chat: chatid,
    }).populate({ path: "sender", select: "_id Avatar" });
    return res.status(200).json(new ApiResponse(200, get, "Good"));
  } catch (err) {
    throw ApiError(404, "Somethings Went Wrong");
  }
});

const allchat = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  try {
    const chats = await Chat.find({ users: _id })
      .populate({
        path: "latestmessage",
        populate: {
          path: "sender",
          select: "FullName Avatar username",
        },
      })
      .populate({
        path: "users",
        match: { _id: { $ne: _id } }, // Exclude the given _id
        select: "-password",
      })
      .populate("groupAdmin", "-password")
      // .select("chatname" ,"isgroup" )
      .sort({ updatedAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, chats, " Successfully fetch"));
  } catch (error) {
    console.error(error);
    throw new ApiError(405, "Server error");
  }
});

const creategruop = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.groupname) {
    throw new ApiError(405, "Fill All reequired Field");
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    throw new ApiError(405, "More then two people reqiured");
  }

  try {
    const avatarLocalPath = req.files?.Postimg[0]?.path;
    const postString = await FileUpload(avatarLocalPath);

    const groupget = await Chat.create({
      chatname: req.body.groupname,
      users: users,
      Avatar: postString?.url,
      isgroup: true,
      groupAdmin: req.body._id,
    });
    const get = await Chat.find({ _id: groupget._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res
      .status(200)
      .json(new ApiResponse(200, get, " Successfully creataed"));
  } catch (error) {
    throw new ApiError(405, "Server error");
  }
});


const acesschat = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  const { username, getid } = req.query;

  // ✅ Case 1: Chat by ID
  if (getid) {
    const chat = await Chat.findById(getid)
      .populate("users", "username Avatar _id")
      .populate({
        path: "latestmessage",
        populate: {
          path: "sender",
          select: "name Avatar _id username"
        }
      });

    if (!chat) {
      return res.status(404).json(new ApiError(404, "Chat not found"));
    }

    const modifiedChat = chat.toObject();
    modifiedChat.users = modifiedChat.users.filter(
      (user) => user._id.toString() !== _id
    );

    return res.status(200).json(new ApiResponse(200, modifiedChat, "Chat fetched"));
  }

  // ✅ Case 2: Chat with user via username
  if (!username) {
    return res.status(400).json(new ApiError(400, "Username is required"));
  }

  const targetUser = await User.findOne({ username }).select("allowChat _id");
  if (!targetUser) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  if (targetUser._id.toString() === _id) {
    return res.status(400).json(new ApiError(400, "Cannot chat with yourself"));
  }

  if (!targetUser.allowChat) {
    return res.status(400).json(
      new ApiError(400, {
        message: "User does not allow chatting",
        code: "CHAT_DISABLED",
      })
    );
  }
  
  const chat = await Chat.findById(getid)
  .populate("users", "username Avatar _id")
  .populate({
    path: "latestmessage",
    populate: {
      path: "sender",
      select: "name Avatar _id username"
    }
  });

if (!chat) {
  return res.status(404).json(new ApiError(404, "Chat not found"));
}

// ✅ Exclude current user
const modifiedChat = chat.toObject();
modifiedChat.users = modifiedChat.users.filter(
  (user) => user._id.toString() !== _id
);

return res.status(200).json(new ApiResponse(200, modifiedChat, "Chat fetched"));
});

// const acesschat = asyncHandler(async (req, res) => {
//   const { _id } = req.body;
//   const { username } = req.query;
//   if (!username) {
//     return res.status(400).json(new ApiError(400, "Username is required"));
//   }

//   const targetUser = await User.findOne({ username }).select("allowChat _id");
//   if (!targetUser) {
//     return res.status(404).json(new ApiError(404, "User not found"));
//   }

//   // Explicit return after throwing error
//   if (targetUser._id.equals(_id)) {
//     return res.status(400).json({message: "Cannot create chat with yourself"}
//     );
//   }
  
//   if (!targetUser.allowChat) {
//     console.log("jakj");
//     return res.status(400).json(
//       new ApiError(400, {
//         message: "User does not allow chatting",
//         code: "CHAT_DISABLED",
//       })
//     );
//   }
//   try {
//     // Rest of your chat logic...
//     const existingChat = await Chat.findOne({
//       users: { $all: [targetUser._id, _id] },
//       isgroup: false,
//     }).populate(/* ... */);

//     if (existingChat) {
//       return res
//         .status(200)
//         .json(new ApiResponse(200, existingChat, "Chat fetched"));
//     }

//     const newChat = await Chat.create(/* ... */);
//     const populatedChat = await Chat.findById(newChat._id).populate(/* ... */);

//     return res
//       .status(200)
//       .json(new ApiResponse(200, populatedChat, "New chat created"));
//   } catch (error) {
//     console.error("Chat error:", error);
//     return res.status(500).json(new ApiError(500, "Chat processing failed"));
//   }
// });


const rename = asyncHandler(async (req, res) => {
  const { chatid, chatname } = req.body;
  try {
    const getgroup = await Chat.findByIdAndUpdate(
      chatid,
      {
        chatname,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res
      .status(200)
      .json(new ApiResponse(200, getgroup, " Successfully creataed"));
  } catch (error) {
    throw new ApiError(405, "Server error");
  }
});

const addtogroup = asyncHandler(async (req, res) => {
  const { chatid, user } = req.body;
  try {
    const add = await Chat.findOneAndUpdate(
      {
        $and: [{ _id: chatid }, { groupAdmin: req.body._id }],
      },
      {
        $addToSet: { users: user }, // Ensures the user is not added if already present
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res
      .status(200)
      .json(new ApiResponse(200, add, "Successfully updated"));
  } catch (error) {
    throw new ApiError(405, "Server error");
  }
});

const deletegroup = asyncHandler(async (req, res) => {
  const { chatid } = req.body;
  try {
    await Chat.findByIdAndDelete(chatid);
    await Message.deleteMany({ chat: chatid });
    return res
      .status(200)
      .json(new ApiResponse(200, "Delete Group Successfully"));
  } catch (err) {
    throw new ApiError(405, "Somethings Went Wrong");
  }
});

const removetogroup = asyncHandler(async (req, res) => {
  const { chatid, user } = req.body;
  try {
    const add = await Chat.findOneAndUpdate(
      {
        $and: [{ _id: chatid }, { groupAdmin: req.body._id }],
      },
      {
        $pull: { users: user.userid },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res
      .status(200)
      .json(new ApiResponse(200, add, " Successfully creataed"));
  } catch (error) {
    throw new ApiError(405, "Server error");
  }
});

export {
  acesschat,
  allchat,
  creategruop,
  rename,
  addtogroup,
  removetogroup,
  deletegroup,
  createMessage,
  getallmessage,
};
