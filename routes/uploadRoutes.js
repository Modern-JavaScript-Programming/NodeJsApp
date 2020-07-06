const router = require('express').Router()

const {
    isAuthenticated
} = require('../middlewares/authMiddleware')

const upload = require('../middlewares/uploadMiddleware')

const {
    uploadProfilePics,
    removeProfilePics
} = require('../controllers/uploadController')

router.post('/profilePics', isAuthenticated, upload.single('profilePics'), uploadProfilePics)

router.delete('/profilePics', isAuthenticated, removeProfilePics)

module.exports = router