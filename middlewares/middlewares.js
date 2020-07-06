const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash')
const config = require('config');

const { bindUserWithRequest } = require('./authMiddleware')

const setLocals = require('./setLocals')

const MONGODB_URI = 'mongodb://localhost:27017/exp-blog'

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 2
});

const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({
        extended: true
    }),
    express.json(),
    session({
        secret: config.get('secret'),
        resave: false,
        saveUninitialized: false,
        store: store
    }),
    flash(),
    bindUserWithRequest(),
    setLocals()
]

module.exports = app => {
    middleware.forEach(m => {
        app.use(m)
    })
}