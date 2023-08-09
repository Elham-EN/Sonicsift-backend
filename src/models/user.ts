import { Model, ObjectId, Schema, model } from "mongoose";
// Define user model type and structure
interface UserDocument {
  name: string;
  email: string;
  password: string;
  verified: boolean; // to verify users
  avatar?: { url: string; publicId: string };
  // store authentication token of users, where users can
  // signin inside the application from multiple devices
  tokens: string[];
  // users can have multiple favourites on their list
  favorites: ObjectId[];
  followers: ObjectId[];
  followings: ObjectId[];
}

// Create user schema (structure the data shape)
const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: Object,
      url: String,
      publicId: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    // Array of ObjectIds
    favorites: [{ type: Schema.Types.ObjectId, ref: "Audio" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tokens: [String],
  },
  { timestamps: true }
);

export default model("User", userSchema) as Model<UserDocument>;
