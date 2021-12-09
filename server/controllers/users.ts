import * as express from 'express'
import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { getRepository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

import { User } from '../entity/User'
import { verifyToken } from '../middleware/auth'

const router = express.Router()


router.post('/users/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const userRepo = getRepository(User)
        const user = await userRepo.findOne({ email })
        const { user_id, password_hash } = user

        if (await bcrypt.compare(password, password_hash)) {
            const token = jwt.sign({ email, user_id }, process.env.TOKEN_KEY, { expiresIn: "2h" })
            return res.status(201).json({ email, token })
        }
        res.status(401).json({ message: "password is not correct" })
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "error" })
    }
})

router.post(
    '/users',
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    async (req: Request, res: Response) => {
        try {
            const { email, password, firstName, lastName } = req.body

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const userRepo = getRepository(User)

            const potential_user = await userRepo.findOne({ email })
            if (potential_user) {
                return res.status(409).json({ message: "User already exist, sign in instead" })
            }

            const password_hash = await bcrypt.hash(password, 10)
            const user = await userRepo.create({ email, password_hash, firstName, lastName })
            const results = await userRepo.save(user)
            const { user_id } = results

            const token = jwt.sign({ email, user_id }, process.env.TOKEN_KEY, { expiresIn: "2h" })

            res.status(201).json({ email, token })
        } catch (error) {
            console.log('error', error)
            res.status(500).json({ message: "error" })
        }
    })

router.get('/user', verifyToken, async (req: Request, res: Response) => {
    try {
        const { email } = req.user

        const userRepo = getRepository(User)
        const user = await userRepo.findOne({ email })

        return res.status(200).json({
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "notes": user.notes
        })
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: 'error' })
    }
})

router.put('/user', verifyToken, async (req: Request, res: Response) => {
    try {
        const { email } = req.user
        const { firstName, lastName } = req.body
        const userRepo = getRepository(User)
        const user = await userRepo.findOne({ email })
        user.firstName = firstName
        user.lastName = lastName
        const results = await userRepo.save(user)

        const output = { email: results.email, firstName: results.firstName, lastName: results.lastName }
        return res.status(201).json(output)

    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: 'error' })
    }
})

router.get('/profiles/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        const userRepo = getRepository(User)
        const user = await userRepo.findOne({ user_id: id })

        if (!user) {
            return res.status(404).end()
        }

        return res.status(200).json({
            'firstName': user.firstName,
            'lastName': user.lastName,
            // notes
        })
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: 'error' })
    }
})



export { router as usersRouter }
