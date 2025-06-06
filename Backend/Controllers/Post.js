import { ApiError } from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { FileUpload } from "../Utils/PostUpload.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import CommentSc from "../models/Comment.model.js";
import Like from "../models/Like.model.js";
import Post from "../models/Post.model.js";
import { User } from "../models/user.model.js";

const Postimg = asyncHandler(async (req, res) => {
    const { _id, title, description, Username } = req.body;
    try {
        const username = await User.findById(_id);
        const owner = username._id;
        const avatarLocalPath = req.files?.Postimg[0]?.path;
        const postString = await FileUpload(avatarLocalPath);
        const post = await Post.create({
            title,
            description,
            owner,
            Username,
            Postimg: postString?.url || "",
        });
        return res.status(200).json(new ApiResponse(200, post, "good"));
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});

const postDetail = asyncHandler(async (req, res) => {
    const { post_id } = req.query;
    const { _id } = req.body;
    if (!post_id) {
        throw new ApiError(401, "Notable to Fetch the data");
    }
    try {
        const get = await Post.findById(post_id);
        const getcomment = await CommentSc.find({ Poston: post_id }).select("-Poston -User");
        const isilike = await Like.findOne({ $and: [{ LikeBy: _id }, { PostOn: post_id }] });
        const Data = {
            Postinfo: get,
            AllComment: getcomment,
            isilike: (isilike ? true : false),
        };

        return res.status(200).json(new ApiResponse(200, Data, "Fetch Data Succefully"));
    }
    catch {
        throw new ApiError(501, "Some Error From Server Side");
    }
});

const Posthitlike = asyncHandler(async (req, res) => {
    const { post_id, _id } = req.body;

    if (!post_id || !_id) {
        return res.status(400).json(new ApiResponse(400, null, "Post ID and User ID are required"));
    }

    // Check if the like exists
    const getlike = await Like.findOne({ LikeBy: _id, PostOn: post_id });

    // Find the post
    const post = await Post.findById(post_id);
    if (!post) {
        return res.status(404).json(new ApiResponse(404, null, "Post not found"));
    }

    if (!getlike) {
        // Like the post
        await Like.create({
            LikeBy: _id,
            PostOn: post_id,
        });
        post.Nooflike += 1;
        await post.save();

        return res.status(200).json(new ApiResponse(200, { nooflike: post.Nooflike, isilike: true }, "Like Successfully"));
    } else {
        // Unlike the post
        await Like.deleteOne({ LikeBy: _id, PostOn: post_id });
        post.Nooflike -= 1;
        await post.save();

        return res.status(200).json(new ApiResponse(200, { nooflike: post.Nooflike, isilike: false }, "UnLike Successfully"));
    }
});


const AddComment = asyncHandler(async (req, res) => {
    const { Username, post_id, _id, Comment } = req.body;
    try {
        await CommentSc.create({
            Content: Comment,
            User: _id,
            Poston: post_id,
            Username: Username
        });
        const getall_comments = await CommentSc.find({ Poston: post_id }).select("-User -Poston");

        const post = await Post.findById(post_id);
        const getcommvalue = post.NoofComment + 1;
        post.NoofComment = post.NoofComment + 1;
        await post.save({ validateBeforeSave: true });
        const data = {
            comments: getall_comments,
            Nocomm: getcommvalue,
        }
        return res.status(200).json(new ApiResponse(200, data, "Successfully added Comment"));
    } catch {
        throw new ApiError(501, "SomeError From Server Side");
    }
});
const deleteComment = asyncHandler(async (req, res) => {
    const { Username, comm_id, _id, postid } = req.body;
    const check = await CommentSc.find({ _id: comm_id});
    if(Username !== check[0].Username){
        throw new ApiError(405, "You Can delete this");
    }
    if (check) {
        try {
            await CommentSc.deleteOne({ _id: comm_id });
            const post = await Post.findById(postid);
            const getcommvalue = post.NoofComment - 1;
            post.NoofComment = post.NoofComment - 1;
            await post.save({ validateBeforeSave: true });
            const getall_comments = await CommentSc.find({ Poston: postid });
            return res.status(200).json(new ApiResponse(200, { comments: getall_comments, Nocomm: getcommvalue }, "Successfully delelete Comment"));
        } catch {
            throw new ApiError(501, "Some Error From Server Side");
        }
    }
    else {
        throw new ApiError(202, "This Is Not Your Comment You can not delete it");
    }
});

const PostDelete = asyncHandler(async (req, res) => {
    let { username, Username, postid } = req.body;

    if (username == Username) {
        try {
            await Post.deleteOne({ _id: postid });
            await Like.deleteMany({PostOn:postid});
            await CommentSc.deleteMany({Poston:postid});
            return res.status(200).json(new ApiResponse(200, {}, "DeleteSuccefully"));
        } catch {
            throw new ApiError(501, "Some Error From Server Side");
        }
    }
    else {
        throw new ApiError(501, "You Cannot Delete It");
    }
})
export { AddComment, deleteComment, postDetail, Posthitlike ,PostDelete };
export default Postimg;