import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { confirmUserPrefix } from "../constants/redisPrefixes";

// We send User as an argument to the resolver so that it knows where the field for the FieldResolver resides
@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(
    @Arg("token") token: string
    // TypeGraphQL allows us to access the request object with the help of the Ctx decorator
  ): Promise<boolean> {
    const userId = await redis.get(confirmUserPrefix + token);

    // Bad token / token has expired
    if (!userId) {
      return false;
    }

    await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
    await redis.del(confirmUserPrefix + token);

    return true;
  }
}
