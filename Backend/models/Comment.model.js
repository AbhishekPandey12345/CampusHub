import mongoose, { Schema } from "mongoose";

const CommentSechma = mongoose.Schema({
    Poston:{
        type:Schema.Types.ObjectId,
        ref:"Post"
    },
    User:{
     type:Schema.Types.ObjectId,
     ref:"User"
    },
    Username:{
        type:String,
        require:true,
    },
    Content:{
        require:true,
        type:String,
        require:true,
    }
});

const CommentSc = mongoose.model("CommentSc", CommentSechma);
export default CommentSc;