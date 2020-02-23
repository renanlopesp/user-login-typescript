import { Length, IsEmail, MinLength } from 'class-validator'
import { InputType, Field } from 'type-graphql'
import { IsEmailAlreadyExist } from './isEmailAlreadyExist'

@InputType()
export class RegisterInput {
    @Field()
    @Length(3, 255)
    firstName: string

    @Field()
    @Length(3, 255)
    lastName: string

    @Field()
    @IsEmail()
    @IsEmailAlreadyExist({ message: 'Email already exist' })
    email: string

    @Field()
    @MinLength(5)
    password: string
}
