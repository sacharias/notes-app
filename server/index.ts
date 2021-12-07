require('dotenv').config()

import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import { createConnection } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'

import { posts } from './controllers/posts'
import { User } from "./entity/User"
import { Note } from "./entity/Note"

// TODO: Set CORS


const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"]

    if (!token) return res.status(403).json({ message: "A token is required for auth" })

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        delete decoded.iat
        delete decoded.exp

        req.user = decoded
    } catch (error) {
        return res.status(401).send('invalid token')
    }
    return next()
}


createConnection().then(connection => {
    const app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    // fix entities
    const userRepo = connection.getRepository(User)
    const noteRepo = connection.getRepository(Note)


    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({ "status": "ok" })
    })

    app.post(
        '/register',
        body('email').isEmail(),
        body('password').isLength({ min: 5 }),
        async (req: Request, res: Response) => {
            try {
                // add try and catch
                console.log(req.body)
                const { email, password } = req.body

                // validate input
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() })
                }

                const potential_user = await userRepo.findOne({
                    where: { email }
                })
                if (potential_user) {
                    return res.status(409).json({ message: "User already exist, sign in instead" })
                }

                const password_hash = await bcrypt.hash(password, 10)
                const user = await userRepo.create({ email, password_hash })
                const results = await userRepo.save(user)

                const { user_id } = results
                const token = jwt.sign({ email, user_id }, process.env.TOKEN_KEY, { expiresIn: "2h" })

                res.status(201).json({ email, token })
            } catch (error) {
                console.log('error', error)
                res.status(501).json({ message: "error" })
            }
        })

    app.post(
        '/login', async (req: Request, res: Response) => {
            try {
                const { email, password } = req.body

                const user = await userRepo.findOne({
                    where: { email }
                })

                const { user_id, password_hash } = user

                if (await bcrypt.compare(password, password_hash)) {
                    const token = jwt.sign({ email, user_id }, process.env.TOKEN_KEY, { expiresIn: "2h" })
                    return res.status(201).json({ email, token })
                }

                res.status(401).json({ message: "password is not correct" })
            } catch (error) {
                console.log('error', error)
                res.status(501).json({ message: "error" })
            }

        })

    // Users
    app.get('/profile', verifyToken, async (req, res) => {
        const { email } = req.user

        const user = await userRepo.findOne({ email })
        const notes = await noteRepo.find({user})

        console.log(user)
        console.log(notes)

        return res.status(401).json({ message: "ok" })
        // verifyToken
        // get user info from DB
        // send over as JSON

    })

    app.get('/users/:id', (req, res) => {

    })

    app.post('/posts', verifyToken, async (req: Request, res: Response) => {
        const { title, content } = req.body

        const user = await userRepo.findOne(req.user)
        const note = new Note()
        note.title = title
        note.content = content
        note.views = 0
        note.user = user

        const results = await noteRepo.save(note)
        
        res.status(201).json({ id: results.id })
    })

    // Posts
    // app.use('/posts', posts)

    app.listen(process.env.PORT || 3000, () => { console.log('server running on port 3000') })

}).catch(err => {
    console.log(err)
})
