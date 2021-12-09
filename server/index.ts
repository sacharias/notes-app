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

    // app.post('/posts', verifyToken, async (req: Request, res: Response) => {
    //     const { title, content } = req.body

    //     const user = await userRepo.findOne(req.user)
    //     const note = new Note()
    //     note.title = title
    //     note.content = content
    //     note.views = 0
    //     note.user = user

    //     const results = await noteRepo.save(note)
        
    //     res.status(201).json({ id: results.id })
    // })

    app.listen(process.env.PORT || 3000, () => { console.log('server running on port 3000') })
}).catch(err => {
    console.log(err)
})
