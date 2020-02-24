import { InputType, Field } from 'type-graphql'
import { PasswordInput } from '../Shared/Password.input'

@InputType()
export class ChangePasswordInput extends PasswordInput {
    @Field()
    token: string
}
