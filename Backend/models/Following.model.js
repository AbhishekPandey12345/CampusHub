import mongoose from "mongoose";

const { Schema } = mongoose;

const FollowSchema = new Schema({
     follower: {
        type: Schema.Types.ObjectId,
        ref: "User"
     },
     follows : {
        type: Schema.Types.ObjectId,
        ref: "User"
     }
}, {
    timestamps: true
});

const Following = mongoose.model("Following", FollowSchema); // Creating the model

export default Following; // Exporting the model
