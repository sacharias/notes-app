require('dotenv').config()

import * as express from 'express'
import { createConnection } from 'typeorm'
import { notesRouter } from './controllers/notes'
import { usersRouter } from './controllers/users'
// TODO: Set CORS

createConnection().then(connection => {
    const app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    // load routers
    app.use(usersRouter)
    app.use('/notes', notesRouter)
    
    app.listen(process.env.PORT || 3000, () => { console.log('server running on port 3000') })
}).catch(err => {
    console.log(err)
})
