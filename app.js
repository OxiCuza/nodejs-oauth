import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import { engine } from 'express-handlebars';
import { initializeDB } from "./config/db.js"
import indexRouter from "./routes/index.js"
import session from "express-session";
import passport from "passport"
import { configPassport } from "./config/passport.js"
import authRouter from "./routes/auth.js";
import connectMongo from "connect-mongo";
import mongoose from "mongoose";

// load config env
dotenv.config({ path: './config/.env' })

// passport config
configPassport(passport)

// mongo connect config
const MongoStore = connectMongo(session)

const app = express()
const PORT = process.env.PORT || 3000

// logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

// passport
app.use(passport.initialize())
app.use(passport.session())

// static files
app.use(express.static('public'))

// handlebars engine
app.engine('.hbs', engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

// routes
app.use('/', indexRouter)
app.use('/auth', authRouter)

const start = async () => {
    try {
        const db = await initializeDB(process.env.MONGO_URI)

        console.log(`MongoDB Connected : ${db.connection.host}`);

        app.listen(PORT, console.log(`app listening in ${process.env.NODE_ENV} mode on port : ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}

start()

