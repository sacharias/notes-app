import express = require('express')
const router = express.Router()

// Posts
router.get('/', (req, res) => {
    // Add author functionality
    console.log('not implemented 3000')
    res.status(200).json({})
})

router.get('/:id', (req, res) => {
    console.log('not implemented 2000')
    res.status(200).json({})
})

router.post('/', (req, res) => {
    console.log('not implemented')
    res.status(200).json({})
})

router.put('/:id', (req, res) => {
    console.log('not implemented')
    res.status(200).json({})
})

router.patch('/:id', (req, res) => {
    console.log('not implemented')
    res.status(200).json({})
})

router.delete('/:id', (req, res) => {
    console.log('not implemented')
    res.status(200).json({})
})

module.exports = router
