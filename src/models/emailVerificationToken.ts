import { Model, ObjectId, Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";

interface EmailVerificationTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date; // expire token after 1 hr
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

/**
 * This schema allows the system to generate email verification tokens for
 * users, associate those tokens with specific users, and automatically
 * remove tokens that have been around for more than an hour
 */
const emailVerificationTokenSchema = new Schema<
  EmailVerificationTokenDocument,
  {},
  Methods
>({
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
});

// function to run right before an emailVerificationToken document
// is saved to the MongoDB database
emailVerificationTokenSchema.pre("save", async function (next) {
  // If you create a new emailVerificationToken document and set
  // a value for the token field, isModified("token") would be
  // true because you're setting the token for the first time.
  if (this.isModified("token")) {
    // Hash the token
    this.token = await hash(this.token, 10);
  }
  next();
});

// token parameter come from user'input
// defining a method on a Mongoose schema for email verification tokens
emailVerificationTokenSchema.methods.compareToken = async function name(token) {
  // compares the provided token with the token stored in the current document
  // (this.token). Compare a plaintext value (token in this case) with a
  // hashed value (this.token). If matched then return true
  const result = await compare(token, this.token);
  return result;
};

export default model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
) as Model<EmailVerificationTokenDocument, {}, Methods>;
