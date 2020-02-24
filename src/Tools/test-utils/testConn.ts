import * as dotenv from 'dotenv'
import { createConnection } from 'typeorm'

dotenv.config()

export const testConn = (drop: boolean = false) => {
    return createConnection({
        name: process.env.TYPEORM_NAME_TEST,
        type: 'mysql',
        host: process.env.TYPEORM_HOST_TEST,
        port: 3306,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD_TEST,
        database: process.env.TYPEORM_DATABASE_TEST,
        synchronize: drop,
        dropSchema: drop,
        entities: [__dirname + '/../../entities/*.*'],
    })
}
