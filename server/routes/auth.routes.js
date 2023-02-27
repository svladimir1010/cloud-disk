const Router = require('express')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const config = require('config')
const {check, validationResult, body} = require('express-validator')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')
require('dotenv').config()

const router = new Router()

router.post('/registration',
    [
      check('email', 'Uncorrected email').isEmail(),
      check('password', 'Password must be longer than 3 and shorted than 12').isLength({min: 3, max: 12}),
    ],
    async(req, res) => {
  console.log('register')
      try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
          return res.status(400).json({message: 'Uncorrected request', errors})
        }

        const {email, password} = req.body
        const candidate = await User.findOne({email})

        if(candidate) {
          return res.status(402).json({message: `User with email ${email} already exist`})
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const user = new User({email, password: hashPassword})
        await user.save()
        await fileService.createDir(req, new File({user: user.id, name: ''}))
        console.log('user registration')
        return res.json({message: 'User was created'})
      } catch( err ) {
        console.log(err)
        res.send({message: 'Server error'})
      }
    })

router.post('/login',

    async(req, res) => {
      try {
        const {email, password} = req.body
        console.log('login:', email, password)
        const user = await User.findOne({email})
        if(!user) res.status(404).json({message: 'User not found'})

        const isPassValid = bcrypt.compareSync(password, user.password)
        if(!isPassValid) res.status(400).json({message: 'Invalid password'})
        const token = jwt.sign({id: user.id}, process.env.TOKEN_SECRET_KEY, {expiresIn: '1h'})
        console.log('user login', token)
        return res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            diskSpace: user.diskSpace,
            usedSpace: user.usedSpace,
            avatar: user.avatar
          }
        })
      } catch( err ) {
        console.log(err)
        res.send({message: 'Server error'})
      }
    })

router.get('/auth', authMiddleware,

    async(req, res) => {
      try {
        const user = await User.findOne({id: req.user.id})
        const token = jwt.sign({id: user.id}, process.env.TOKEN_SECRET_KEY, {expiresIn: '1h'})
        console.log('user authorization')
        return res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            diskSpace: user.diskSpace,
            usedSpace: user.usedSpace,
            avatar: user.avatar
          }
        })
      } catch( err ) {
        console.log(err)
        res.send({message: 'Server error'})
      }
    })

module.exports = router