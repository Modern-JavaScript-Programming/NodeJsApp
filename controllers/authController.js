const bcrypt = require('bcrypt')

const User = require('../models/User')

const Flash = require('../utils/Flash')
const {
    validationResult
} = require('express-validator')

const errorFormatter = require('../utils/validationResultFormatter')

exports.signupGetController = (req, res, next) => {
    res.render('pages/auth/signup', {
        title: 'Create a new account',
        error: {},
        value: {},
        flashMessage: Flash.getMessage(req)
    })
}

exports.signupPostController = async (req, res, next) => {
    let {
        username,
        email,
        password,
        confirmPassword
    } = req.body

    let errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your Form')
        return res.render('pages/auth/signup', {
            title: 'Create a new account',
            error: errors.mapped(),
            value: {
                username,
                email,
                password
            },
            flashMessage: Flash.getMessage(req)
        })
    }

    try {
        let hashedPassword = await bcrypt.hash(password, 11)

        let user = new User({
            username,
            email,
            password: hashedPassword
        })

        await user.save()
        req.flash('success', 'User created successfully')
        res.redirect('/auth/login')
        // console.log('User created successfully', createdUser);
        // res.render('pages/auth/login', {
        //     title: 'Create a new account',
        //     flashMessage: Flash.getMessage(req)
        // })

    } catch (e) {
        console.log(e)
        next(e)
    }

    // res.render('pages/auth/signup', {
    //     title: 'Create a new account'
    // })
}


exports.loginGetController = (req, res, next) => {

    // console.log(req.session.isLoggedIn, req.session.user);

    res.render('pages/auth/login', {
        title: 'Login to Your Account',
        error: {},
        flashMessage: Flash.getMessage(req)
    })

}

exports.loginPostController = async (req, res, next) => {
    let {
        email,
        password
    } = req.body

    let errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your Form')
        return res.render('pages/auth/login', {
            title: 'Login to Your Account',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        })
    }

    try {
        let user = await User.findOne({
            email
        })
        if (!user) {
            req.flash('fail', 'Please provide valid credentials')
            return res.render('pages/auth/login', {
                title: 'Login to Your Account',
                error: {},
                flashMessage: Flash.getMessage(req)
            })
        }

        let match = await bcrypt.compare(password, user.password)
        if (!match) {
            req.flash('fail', 'Please provide valid credentials')
            return res.render('pages/auth/login', {
                title: 'Login to Your Account',
                error: {},
                flashMessage: Flash.getMessage(req)
            })
        }

        req.session.isLoggedIn = true

        req.session.user = user

        req.session.save(err => {
            if (err) {
                console.log(err);
                return next(err)
            }
            //console(req.flash(req))
            req.flash('success', 'Successfully Logged In')
            res.redirect('/dashboard')

            // req.flash('success', 'Successfully Logged In')
            // return res.render('pages/dashboard', {
            //     title: 'Login to Your Account',
            //     error:{},
            //     flashMessage: Flash.getMessage(req)
            // })
        })

    } catch (e) {
        console.log(e);
        next(e)
    }

}

exports.logoutController = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err)
            return next(err)
        }
        res.redirect('/auth/login')

    })
}