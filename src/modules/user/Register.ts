import { Arg, Mutation, Query, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";

// We send User as an argument to the resolver so that it knows where the field for the FieldResolver resides
@Resolver()
export class RegisterResolver {
  // GraphQL sometimes gets cranky when you dont have a single query in your whole schema, so we'll just keep this one here
  @Query(() => String)
  async hello() {
    return "Hello, World!";
  }

  @Mutation(() => User)
  async register(
    @Arg("data") {email, firstName, lastName, password}: RegisterInput,
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
