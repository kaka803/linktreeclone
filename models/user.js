import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
      trim: true,
    },
    url: {
      type: String,
      required: true, 
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0, 
    },
    
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  bio: {
    type: String,
    maxlength: 200,
    default: "",
  },
  profilePic: {
    type: String, 
    default: "",
  },
  links: [linkSchema], 
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
