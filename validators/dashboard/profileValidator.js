const {body} = require('express-validator')
const validator = require('validator')

const linkValidator = (value) => {
    if(value) {
        if(!validator.isURL(value)) {
            throw new Error(`Please Provide Valid URL`)
        }
    }
    return true
}

module.exports = [
    body('name')
    .not().isEmpty().withMessage(`Name Cannot be Empty`)
    .isLength({max:50}).withMessage(`Name Cannot be Grater TMore 50 Characters`)
    .trim(),

    body('title')
    .not().isEmpty().withMessage(`Title Cannot be Empty`)
    .isLength({max:100}).withMessage(`Title Cannot be More Than 100 Characters`)
    .trim(),

    body('bio')
    .not().isEmpty().withMessage(`Bio Cannot be Empty`)
    .isLength({max:500}).withMessage(`Bio Cannot be More Than 500 Characters`)
    .trim(),

    body('website')
    .custom(linkValidator),

    body('facebook')
    .custom(linkValidator),

    body('twitter')
    .custom(linkValidator),

    body('linkedIn')
    .custom(linkValidator),

    body('github')
    .custom(linkValidator),
    
]

