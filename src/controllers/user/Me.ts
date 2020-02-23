import { Resolver, Query, Ctx } from 'type-graphql'
import { User } from '../../models/User'
import { MyContext } from '../../types/MyContex'

@Resolver()
export class MeResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
        if (!ctx.req.session!.userId) {
            return undefined
        }

        return User.findOne(ctx.req.session!.userId)
    }
}
