import * as yup from "yup";
import { isValidObjectId } from "mongoose";
import User from "#/models/user";

const emailIsUnique = async (email: string) => {
  const user = await User.findOne({ email });
  return !user;
};

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is missing!")
    .min(3, "Name is too short!")
    .max(20, "Name is too long!"),
  email: yup
    .string()
    .required("Email is missing")
    .email("invalid email")
    .test("email-is-unique", "Email has already been taken", async (email) => {
      const isUnique = await emailIsUnique(email);
      return isUnique;
    }),
  password: yup
    .string()
    .trim()
    .required("Password is missing")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password must be strong"
    ),
});

export const TokenAndIDValidation = yup.object().shape({
  token: yup.string().trim().required("Invalid Token"),
  userId: yup
    .string()
    // run custom validation (value come from incoming resquest)
    .transform(function (value) {
      // if value is type string and valid objectId
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return ""; // transforming value into empty string
    })
    .required("Invalid userId"), // if empty throw an error
});

export const UpdatePasswordSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid Token"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return ""; // transforming value into empty string
    })
    .required("Invalid userId"), // if empty throw an error
  password: yup
    .string()
    .trim()
    .required("Password is missing")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password must be strong"
    ),
});
