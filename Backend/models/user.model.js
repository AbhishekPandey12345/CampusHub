import mongoose, { Types } from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    FullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        index: true,
    },
    Avatar: {
        type: String, // Cloudinary URL
        required: [true, "Avatar URL is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    allowChat: {
        type: Boolean,
        required: [true, "AllowChat is required"],
    },
    allowGroupAdd: {
        type: Boolean,
        required: [true, "AllowGroupAdd is required"],
    },
    showMobileNumber: {
        type: Boolean,
        required: [true, "ShowMobileNumber is required"],
    },
    mobileNumber: {
        type: String,
        required: [true, "Mobile number is required"],
        match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    branch: {
        type: String,
        required: [true, "Branch is required"],
    },
    batchYear: {
        type: Number,
        required: [true, "Batch year is required"],
    },
    interests: {
        type: String,
    },
    workExperience: {
        type: String,
    }
});


UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", UserSchema);
