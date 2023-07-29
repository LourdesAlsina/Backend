import passport  from 'passport'
import local from 'passport-local'
import UserModel from '../Dao/fsManagers/models/user.model'
import { createHash, isValidPassword } from '../utils.js'
import GitHubStrategy from 'passport-github2'

const localStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await UserModel.findOne({ email: username })
            if (user) {
                console.log('Este usurario ya se encuentra registrado')
                return done(null, false)
            }

            const newUser = {
                first_name, last_name, email, age, password: createHash(password)
            }
            const result = await UserModel.create(newUser)
            return done(null, result)
        } catch(err) {
            return done('error al obtener el user')
        }
    }))
    
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.efc0db9e62c3023b',
        clientSecret: '7364d7ea4dad99d5e3295fdb30aba6c5c48dccc7',
        callbackURL: 'http://localhost:3000/api/sessions/githubcallback',
    }, async(accessToken, refreshToken, profile, done)=> {
        console.log(profile)
    }))

    passport.use('login', new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    } , async (email, password, done) => {

        const user = await UserModel.findOne({ email })
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' })
        } else {
         const match = await user.isValidPassword(password)
         if (match) {
            return done(null, user)
         }else {
            return done(null, false, { message: 'Contraseña incorrecta' })
        }
    }
    }))

} 

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id)
    done(null, user)
})

export default initializePassport