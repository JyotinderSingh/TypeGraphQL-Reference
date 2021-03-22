import { IsEmail, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { PasswordMixin } from "../../shared/PasswordInput";
import { IsEmailAlreadyExists } from "./isEmailAlreadyExists";

@InputType()
export class RegisterInput extends PasswordMixin(class {}) {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExists({ message: "Email already in use" })
  email: string;
}
