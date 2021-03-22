import { Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
    return new Promise((res, rej) =>
      // This destroys the session on the server, but doesn't clear the cookie for the user
      ctx.req.session!.destroy((err) => {
        if (err) {
          console.log(err);
          return rej(false);
        }

        // We clear the cookie on the client (it doesn't matter too much though)
        ctx.res.clearCookie("qid");
        res(true);
      })
    );
  }
}
