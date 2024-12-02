import { nanoid } from "nanoid";
import user from "../model/User.js";

export const generateUserName = async (email) => {
  const userName = email.split("@")[0];
  const isUserNameNotUnique = await user
    .exists({
      "personal_info.username": userName,
    })
    .then((result) => result);

  isUserNameNotUnique ? (userName += nanoid()) : "";
  return userName;
};
