import { Ctx, Query, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";

// We use this to get the current logged in user
@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.req.session!.userId) {
      // initially we were returning null but TS was unhappy so we made this undefined
      // TypeGraphQL will automatically cast it to null when returning
      return undefined;
    }

    return User.findOne(ctx.req.session!.userId);
  }
}
