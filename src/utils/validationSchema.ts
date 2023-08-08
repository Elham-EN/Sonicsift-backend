import * as yup from "yup";
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
