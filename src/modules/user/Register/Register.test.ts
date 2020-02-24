import { Connection } from 'typeorm'
import { testConn } from '../../../test/testConn'
import { gCall } from '../../../test/graphqlCall'

let conn: Connection
beforeAll(async () => {
    conn = await testConn()
})
afterAll(async () => {
    await conn.close()
})

const registerMutation = `
mutation Register($data: RegisterInput!) {
    register(
            data: $data
    ) {
            id
            firstName
            lastName
            email
            name
    }
}
`

describe('Register', () => {
    it('create user', async () => {
        console.log(
            await gCall({
                source: registerMutation,
                variableValues: {
                    data: {
                        firstName: 'bobasd',
                        lastName: 'bob2asd',
                        email: 'bob@bob.com',
                        password: 'asdfasdf',
                    },
                },
            })
        )
    })
})
