require('dotenv').config()

import * as express from 'express'
import { Request, Response } from 'express'
import { createConnection } from 'typeorm'

const TOKEN_KEY = 'token-secret'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const posts = require('./controllers/posts')

// Set CORS


createConnection().then(connection => {
    const app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    // fix entities

    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({ "status": "ok" })
    })

    app.post('/register', (req: Request, res: Response) => {
        console.log(req.body)
        res.status(201).json({})
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
