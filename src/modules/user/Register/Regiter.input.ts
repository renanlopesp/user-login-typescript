import { Length, IsEmail } from 'class-validator'
import { InputType, Field } from 'type-graphql'
import { IsEmailAlreadyExist } from './isEmailAlreadyExist'
import { PasswordInput } from '../Shared/Password.input'

@InputType()
export class RegisterInput extends PasswordInput {
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
}
