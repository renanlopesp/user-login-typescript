import { MiddlewareFn } from 'type-graphql'
import { MyContext } from '../types/MyContex'

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
    if (!context.req.session!.userId) {
        throw new Error('not authenticated')
    }

    return next()
}
