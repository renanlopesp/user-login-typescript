import { Resolver, Query, Mutation, Arg, UseMiddleware } from 'type-graphql'
import * as bcrypt from 'bcryptjs'
import { User } from '../../models/User'
import { RegisterInput } from './RegiterInput'
import { isAuth } from '../../middleware/isAuth'
import { createConfirmationUrl } from '../../utils/createConfirmation'
import { sendEmail } from '../../utils/sendEmail'

@Resolver()
export class RegisterResolver {
    @UseMiddleware(isAuth)
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
        await sendEmail(email, await createConfirmationUrl(user.id))
        return user
    }
}
