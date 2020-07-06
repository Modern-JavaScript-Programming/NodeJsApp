require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const chalk = require('chalk');

const MONGODB_URI = 'mongodb://localhost:27017/exp-blog'

const setMiddlewares = require('./middlewares/middlewares')

const setRoutes = require('./routes/routes')

const app = express()

// Setup view engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Using middlewares from middlewares directory
setMiddlewares(app)

// Using routes from routes directory
setRoutes(app)

app.use((req, res, next) => {
    let error = new Error('404 Page Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    if(error.status == 404) {
        // console.log(error)
        return res.render('pages/errors/404',{flashMessage:{}})
    }
    console.log(error)
    res.render('pages/errors/500',{flashMessage:{}})
})

const PORT = process.env.PORT || 1000

mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log(chalk.green('Database is connected'))
        app.listen(PORT, () => {
            console.log(chalk.green(`Server is listening on Port ${PORT}`))
        })
    })
    .catch(e => {
        return console.log(e)
    })