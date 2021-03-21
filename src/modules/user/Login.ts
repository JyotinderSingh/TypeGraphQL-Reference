import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";

// We send User as an argument to the resolver so that it knows where the field for the FieldResolver resides
@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    // TypeGraphQL allows us to access the request object with the help of the Ctx decorator
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // It's better to not give back the user specific error data when login fails
      // to prevent fishing attempts
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    // If the user made it till here, it means they authenticated successfully
    // and now we'll send them back a cookie
    // For this we need access to the context and we need access to the request object to store the session for them
    ctx.req.session!.userId = user.id;

    return user;
  }
}
