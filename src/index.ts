import 'reflect-metadata'
import * as dotenv from 'dotenv'
import * as Express from 'express'
import * as session from 'express-session'
import * as connectRedis from 'connect-redis'
import * as cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { createConnection } from 'typeorm'
import { redis } from './redis'
import { createSchema } from './createSchema'
import {
    getComplexity,
    fieldExtensionsEstimator,
    simpleEstimator,
} from 'graphql-query-complexity'
import { separateOperations } from 'graphql'

dotenv.config()

const main = async () => {
    await createConnection()

    const schema = await createSchema()

    const apolloServer = new ApolloServer({
        schema,
        context: ({ req, res }: any) => ({ req, res }),
        plugins: [
            {
                requestDidStart: () => ({
                    didResolveOperation({ request, document }) {
                        const complexity = getComplexity({
                            schema,
                            query: request.operationName
                                ? separateOperations(document)[
                                      request.operationName
                                  ]
                                : document,
                            variables: request.variables,
                            estimators: [
                                fieldExtensionsEstimator(),
                                simpleEstimator({ defaultComplexity: 1 }),
                            ],
                        })
                        if (complexity >= 20) {
                            throw new Error(
                                `Sorry, too complicated query! ${complexity} is over 20 that is the max allowed complexity.`
                            )
                        }
                        console.log('Used query complexity points:', complexity)
                    },
                }),
            },
        ],
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
