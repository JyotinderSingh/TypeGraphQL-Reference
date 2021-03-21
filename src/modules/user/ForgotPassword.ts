import { Arg, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";

import { User } from "../../entity/User";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { sendEmail } from "../utils/sendEmail";

// We send User as an argument to the resolver so that it knows where the field for the FieldResolver resides
@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string
    // TypeGraphQL allows us to access the request object with the help of the Ctx decorator
  ): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // we don't wanna indicate to our user if the email exists in our database
      return true;
    }
    // We want to create a token associated to the person's userId
    // and when the user clicks on the link - we send that token to our server
    // and verify that the user has a correct token and confirm their identity for changing the password

    // v4() generates a unique ID
    const token = v4();

    await redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24); // Token expires in 1 day

    // We redirect to a page on the front end, and make a mutation call from there to confirm the ID

    await sendEmail(
      email,
      `http://localhost:3000/user/change-password/${token}`
    );

    return true;
  }
}
