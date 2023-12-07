import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserModel } from "../models/User.js";
import 'dotenv/config'

export const configPassport = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, 
    async (accessToken, refreshToken, profile, cb) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }

        try {
            let user = await UserModel.findOne({googleId: profile.id})

            if (user) {
                cb(null, user)
            } else {
                user = await UserModel.create(newUser)
                cb(null, user)
            }
        } catch (error) {
            console.log(error);
        }
    }))

    passport.serializeUser(function(user, cb) {
        cb(null, user.id)
    });
      
    passport.deserializeUser(function(id, cb) {
        UserModel.findById(id, function (err, user) {
            cb(err, user)
        })
    });
}