import { v4 } from "uuid";
import { redis } from "../../redis";
import { confirmUserPrefix } from "../constants/redisPrefixes";

export const createConfirmationUrl = async (userId: number) => {
  // We want to create a token associated to the person's userId
  // and when the user clicks on the link - we send that token to our server
  // and verify that the user has a correct token and confirm their account

  // v4() generates a unique ID
  const token = v4();

  await redis.set(confirmUserPrefix + token, userId, "ex", 60 * 60 * 24); // Token expires in 1 day

  // We redirect to a page on the front end, and make a mutation call from there to confirm the ID
  return `http://localhost:3000/user/confirm/${token}`;
};
