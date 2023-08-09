import { ObjectId, Schema, model } from "mongoose";

interface EmailVerificationTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date; // expire token after 1 hr
}

/**
 * This schema allows the system to generate email verification tokens for
 * users, associate those tokens with specific users, and automatically
 * remove tokens that have been around for more than an hour
 */
const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument>(
  {
    // Represents the user associated with this email verification token.
    owner: {
      type: Schema.Types.ObjectId, // user id
      required: true,
      // owner field corresponds to an ID from the "User" collection
      ref: "User",
    },
    // store the actual email verification token
    token: {
      type: String,
      required: true, //  Every document must have a token value
    },
    // Tells MongoDB to automatically delete this document after 3600 seconds
    // (1 hour) from the createdAt time. So, this email verification token will
    // be valid for one hour. After that, MongoDB will automatically remove it.
    createdAt: {
      type: Date,
      expires: 3600, // 60 min * 60 sec = 3600s
      default: Date.now(),
    },
  }
);

export default model("EmailVerificationToken", emailVerificationTokenSchema);
