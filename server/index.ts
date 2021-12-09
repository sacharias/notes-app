require('dotenv').config()

import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import { createConnection } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'

import { notesRouter } from './controllers/notes'
import { usersRouter } from './controllers/users'
import { User } from "./entity/User"
import { Note } from "./entity/Note"

import { verifyToken } from './middleware/auth'
// TODO: Set CORS




createConnection().then(connection => {
    const app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    // load routers
    app.use(usersRouter)
    app.use('/notes', notesRouter)

 

    // Users
    // app.get('/profile', verifyToken, async (req, res) => {
    //     const { email } = req.user

    //     const user = await userRepo.findOne({ email })
    //     const notes = await noteRepo.find({user})

    //     return res.status(200).json({
    //         "firstName": user.firstName,
    //         "lastName": user.lastName,
    //         "email": user.email,
    //         "notes": notes
    //     })
    // })

    // app.get('/users/:id', (req, res) => {

    // })

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
