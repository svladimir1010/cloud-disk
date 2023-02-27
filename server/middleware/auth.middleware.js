const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
  if(req.method === 'OPTIONS') {
    alert('OPTIONS')
    return next()
  }
  try {
    const token = req.headers.authorization.split(' ')[1]
    if(!token) {
      return res.status(401).json({message: 'Auth error'})
    }
    console.log('decoded middleware')
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
    req.user = decoded
    next()
  } catch( e ) {
    return res.status(401).json({message: 'Auth error: ' + e.message})
  }
}
