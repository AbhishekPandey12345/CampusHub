import mongoose from "mongoose";

const LikesSchema = mongoose.Schema({
    PostOn:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    LikeBy:{
        type: mongoose.Schema.Types.ObjectId ,
        ref: "User"
    }
},{
    timestamps:true,
});

const Like = mongoose.model("Like",LikesSchema);
export default Like;

