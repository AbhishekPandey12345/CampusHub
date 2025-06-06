import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        trim: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",  // "Chat" should be capitalized to match the convention
    }
});

const Message = mongoose.model("Message", MessageSchema);  // "message" should be capitalized to "Message"
export default Message;
