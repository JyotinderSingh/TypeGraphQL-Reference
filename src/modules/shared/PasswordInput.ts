import { Length } from "class-validator";
import { ClassType, Field, InputType } from "type-graphql";

// We turned this into a mixin so that we could extend multiple classes (just for demo)
export const PasswordMixin = <T extends ClassType>(BaseClass: T) => {
  @InputType({ isAbstract: true })
  class PasswordInput extends BaseClass {
    @Field()
    @Length(5, 20)
    password: string;
  }
  return PasswordInput;
};
