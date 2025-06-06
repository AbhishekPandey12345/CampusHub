import ApiResponse from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import Like from "../models/Like.model.js";
import { Post } from "../models/Post.model.js";


const GetPostDetail = asyncHandler(async (req, res) => {
    // try {
        const getallPost = await Post.aggregate([
            { 
                $match: {
                    owner: req.user?._id,
                }
            },
            {
                $lookup: {
                    from: "commentScs",
                    localField: "_id",
                    foreignField: "Poston",
                    as: "Comment"
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "LikeBy",
                    as: "Likes"
                }
            },
            {
                $addFields: {
                    likeCount: { $size: "$Likes" },
                    Comments: "$Comment",
                    isLike:{$in:[req.user._id,"$Likes.LikeBy"]},
                }
            },
            {
                $project: {
                    Postimg: 1,
                    description: 1,
                    title: 1,
                    likeCount: 1,
                    Comments: 1,
                    isLike:1,
                }
            }
        ]);
        
        // Send the result back to the client
        res.status(200).json(
        new ApiResponse(200,getallPost,"Get AllPost"));
    // } 
});


export {
    GetPostDetail,
}