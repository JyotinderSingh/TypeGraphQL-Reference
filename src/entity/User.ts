import { Field, ID, ObjectType, Root } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

// Extending the BaseEntity allows us to
// use magic methods like User.find() and User.create()
@ObjectType()
@Entity()
export class User extends BaseEntity {
  // Decorating a column with the field attribute means that you would like to
  // expose this to GraphQL (in the GraphQL schema)
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column("text", { unique: true })
  email: string;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column()
  password: string;
}
