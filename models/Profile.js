// user, title, bio, profilePics, links:{fb, twitter, linkedIn}, posts, bookmarks

const { Schema, model} = require('mongoose')
// const User = require('./User')
// const Post = require('./Post')

const profileSchema = new Schema({

    user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 30,
    },
    title : {
        type: String,
        trim: true,
        required: true,
        maxlength: 100
    },
    bio : {
        type:String,
        trim: true,
        required: true,
        maxlength:500
    },
    profilePics : String,
    links : {
        website: String,
        facebook: String,
        twitter: String,
        linkedIn: String,
        github: String
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'

        }
    ],
    bookmarks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]

},{
    timestamps: true
})

const Profile = model('Profile', profileSchema)

module.exports = Profile