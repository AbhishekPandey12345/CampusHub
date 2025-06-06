import mongoose from "mongoose";
// isgroup //gruopAdmin //user // chatname  //latestmessage 

const ChatSchema = new mongoose.Schema({
    chatname: {
        type: String,
        trim: true,
    },
    isgroup: {
        type: Boolean,
        default: false,
    },
    Avatar:{
        type:String,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    latestmessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true
});

const Chat = mongoose.model("Chat" , ChatSchema);

export default Chat;