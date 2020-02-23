import 'reflect-metadata'
import 'dotenv'
import * as Express from 'express'
import * as session from 'express-session'
import * as connectRedis from 'connect-redis'
import * as cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'
import { RegisterResolver } from './controllers/user/Register'
import { redis } from './redis'
import { LoginResolver } from './controllers/user/Login'
import { MeResolver } from './controllers/user/Me'
import { ConfirmUserResolver } from './controllers/user/ConfirmUser'

const main = async () => {
    await createConnection()

    const schema = await buildSchema({
        resolvers: [
            MeResolver,
            RegisterResolver,
            LoginResolver,
            ConfirmUserResolver,
        ],
    })

    const apolloServer = new ApolloServer({
        schema,
        context: ({ req }: any) => ({ req }),
    })
    const app = Express()

    const RedisStore = connectRedis(session)

    app.use(
        cors({
            credentials: true,
            origin: 'http://localhost:3000',
        })
    )

    app.use(
        session({
            store: new RedisStore({
                client: redis as any,
            }),
            name: 'qid',
            secret: process.env.SESSION_SECRET, // Need change to env
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnline: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
            },
        } as any)
    )

    apolloServer.applyMiddleware({ app })

    app.listen(process.env.PORT, () => {
        console.log('Server running http://localhost:4000/graphql')
    })
}
main()
