import { Router } from "express";
import {ensureAuth, ensureGuest} from "../middleware/auth"

const indexRouter = Router()

// @desc    login/landing page
// @route   GET /
indexRouter.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'auth'
    })
})

// @desc    dashboard
// @route   GET /dashboard
indexRouter.get('/dashboard', ensureAuth, (req, res) => {
    res.render('dashboard', {
        name: req.user.firstName
    })
})

export default indexRouter
