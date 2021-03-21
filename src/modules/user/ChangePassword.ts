import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import { MyContext } from "../../types/MyContext";

// We send User as an argument to the resolver so that it knows where the field for the FieldResolver resides
@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput,
    // TypeGraphQL allows us to access the request object with the help of the Ctx decorator
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      return null;
    }

    const user = await User.findOne(userId);

    if (!user) {
      return null;
    }

    await redis.del(forgotPasswordPrefix + token);

    // You can use user.update() also instead of this
    user.password = await bcrypt.hash(password, 12);
    user.save();

    // We log the user in as well after he resets his password (cuz we're cool like that)
    ctx.req.session.userId = userId;

    return user;
  }
}
