import { Resolver, Query, Mutation, Arg } from 'type-graphql'
import * as bcrypt from 'bcryptjs'
import { User } from '../../models/User'
import { RegisterInput } from './RegiterInput'

@Resolver()
export class RegisterResolver {
    @Query(() => String)
    async hello() {
        return 'Hello World!'
    }

    @Mutation(() => User)
    async register(
        @Arg('data') { firstName, lastName, email, password }: RegisterInput
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        }).save()

        return user
    }
}
