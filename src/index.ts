import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import * as Express from 'express'
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'

import { RegisterResolver } from './controllers/user/Register'

const main = async () => {
    await createConnection()

    const schema = await buildSchema({
        resolvers: [RegisterResolver],
    })

    const apolloServer = new ApolloServer({
        schema,
    })
    const app = Express()

    apolloServer.applyMiddleware({ app })

    app.listen(4000, () => {
        console.log('Server running http://localhost:4000/graphql')
    })
}
main()
