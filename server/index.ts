require('dotenv').config()

import * as express from 'express'
import { Request, Response } from 'express'
import { createConnection } from 'typeorm'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const posts = require('./controllers/posts')
import { User } from "./entity/User"

const TOKEN_KEY = process.env.TOKEN_KEY


// Set CORS


createConnection().then(connection => {
    const app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    // fix entities
    const userRepo = connection.getRepository(User)


    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({ "status": "ok" })
    })

    app.post('/register', async (req: Request, res: Response) => {
        try {
            // add try and catch
            console.log(req.body)
            const { email, password } = req.body

            // validate input

            const potential_user = await userRepo.findOne({
                where: { email }
            })
            if (potential_user) {
                return res.status(409).send({ message: "User already exist, sign in instead"})
            }

            const password_hash = await bcrypt.hash(password, 10)
            const user = await userRepo.create({ email, password_hash })
            const results = await userRepo.save(user)

            const { user_id } = results
            const token = jwt.sign({ email, user_id }, TOKEN_KEY, { expiresIn: "2h" })

            res.status(201).json({ email, token })
        } catch (error) {
            console.log('error', error)
            res.status(501).send({ message: "error" })
        }
    })

    app.post('/login', (req, res) => {

    })

    // Users
    app.get('/profile', (req, res) => {
        console.log(req)
        // verifyToken
        // get user info from DB
        // send over as JSON

    })

    app.get('/users/:id', (req, res) => {

    })

    // Posts
    app.use('/posts', posts)

    app.listen(process.env.PORT || 3000, () => { console.log('server running on port 3000') })

}).catch(err => {
    console.log(err)
})
