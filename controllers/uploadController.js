const fs = require('fs')
const User = require('../models/User')
const Profile = require('../models/Profile')

exports.uploadProfilePics = async (req, res, next) => {
    if (req.file) {
        try {

            let oldProfilePics = req.user.profilePics

            let profilePics = `/uploads/${req.file.filename}`

            let profile = await Profile.findOne({ user: req.user._id })


            if (profile) {
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    { $set: { profilePics } }
                )
            }

            await User.findOneAndUpdate(
                {_id: req.user._id}, 
                { $set: { profilePics }}
            )

                // Remove old Profile Pics from Storage
                if(oldProfilePics != '/uploads/default.jpg') {
                    fs.unlink(`public${oldProfilePics}`, err => {   
                        if(err) {
                            console.log(err)
                        }
                    })
                }

            res.status(200).json({
                profilePics
            })
            
        } catch (e) {
            res.status(500).json({
                profilePics: req.user.profilePics
            })
        }
    } else {
        res.status(500).json({
            profilePics: req.user.profilePics
        })
    }
}

// Remove Profile Pics from Database annd File System
exports.removeProfilePics = (req, res, next) => {
    try {

        let defaultProfilePics = '/uploads/default.jpg'
        let currentProfilePics = req.user.profilePics

        // Remove from Local File System
        fs.unlink(`public${currentProfilePics}`,async (err) =>{
            let profile = await Profile.findOne({ user: req.user._id })

            // Update Profile Collection
            if(profile) {
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    { $set: { defaultProfilePics } }    
                )
            }
            // Update User Collection
            await User.findOneAndUpdate(
                {_id: req.user._id}, 
                { $set: { profilePics: defaultProfilePics }}
            )
        })

        res.status(200).json({
            profilePics: defaultProfilePics
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Cannot Remove Profile Pics'
        })
    }
}