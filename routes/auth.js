import { Router } from "express";
import passport from "passport";

const authRouter = Router()

// @desc    auth with google
// @route   GET /auth/google
authRouter.get('/google', passport.authenticate('google', {scope: ['profile']}))

// @desc    google auth callback
// @route   GET /auth/google/callback
authRouter.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/dashboard')
})

// @desc    logout user
// @route   /auth/logout
authRouter.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

export default authRouter
