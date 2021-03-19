import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import * as bcrypt from "bcryptjs";
import { User } from "../../entity/User";

// We send User as an argument to the resolver so that it knows where the field for the FieldResolver resides
@Resolver(User)
export class RegisterResolver {
  // GraphQL sometimes gets cranky when you dont have a single query in your whole schema, so we'll just keep this one here
  @Query(() => String)
  async hello() {
    return "Hello, World!";
  }

  @FieldResolver()
  async name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Mutation(() => User)
  async register(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    return user;
  }
}
