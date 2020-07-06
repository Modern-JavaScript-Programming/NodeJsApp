const route = require('express').Router()

const signupValidator = require('../validators/auth/signupValidator')
const loginValidator = require('../validators/auth/loginValidator')

// import Controllers
const {
    signupGetController,
    signupPostController ,
    loginGetController,
    loginPostController,
    logoutController

} = require('../controllers/authController')

const { isUnAuthenticated } = require('../middlewares/authMiddleware')

// creating routes for signup
route.get('/signup', isUnAuthenticated, signupGetController)
route.post('/signup', isUnAuthenticated, signupValidator, signupPostController)

// creating routes for login
route.get('/login', isUnAuthenticated, loginGetController)
route.post('/login', isUnAuthenticated, loginValidator, loginPostController)

route.get('/logout', logoutController )

// export the router object
module.exports = route