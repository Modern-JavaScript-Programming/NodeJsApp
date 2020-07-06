const {body} = require('express-validator')
const User = require('../../models/User')

// creating validator
module.exports = [
    body('username')
        .isLength({min:2, max:15}).withMessage(`Username must be between 2 to 15 characters`)
        .custom(async username => {
            let user = await User.findOne({username})
            if(user) {
                return Promise.reject(`Username exists`)
            }
        })
        .trim(),

        body('email')
            .isEmail().withMessage(`Please provide a valid Email`)
            .custom(async email => {
                let user = await User.findOne({email})
                if(user) {
                    return Promise.reject(`Email exists`)
                }
            })
            .normalizeEmail(),

            body('password')
                .isLength({min:5}).withMessage(`Your password must be greater than 5 characters`),
            
            body('confirmPassword')
                .isLength({min:5}).withMessage(`Your password must be greater than 5 characters`)
                .custom( (confirmPassword, { req } ) => {
                    if(confirmPassword != req.body.password ) {
                        throw new Error(`Password does not match`)
                    }
                    return true
                })
]