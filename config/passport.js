import passport  from 'passport'
import local from 'passport-local'
import UserModel from '../Dao/fsManagers/models/user.model'
import { createHash, isValidPassword } from '../utils.js'
import GitHubStrategy from 'passport-github2'
import bcrypt from "bcrypt";

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
            if (
                newUser.email === "lolaFlores@gmail.com" &&
                bcrypt.compareSync("lola12345", newUser.password)
              ) {
                newUser.role = "Admin";
              }
              const result = await userModel.create(newUser);
              return done(null, result);
            } catch (error) {
              console.log(error);
              return done('Error al crear el usuario: ' + error.message);
            }
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

passport.use('github', new GitHubStrategy({
    clientID: 'Iv1.efc0db9e62c3023b',
    clientSecret: '7364d7ea4dad99d5e3295fdb30aba6c5c48dccc7',
    callbackURL: 'http://localhost:3000/api/sessions/githubcallback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const userName = profile.displayName || profile.username;
        const userEmail = profile._json.email;

        const existingUser = await UserModel.findOne({ email: userEmail });
        if (existingUser) return done(null, existingUser);
        const newUser = {
            first_name: userName,
            last_name: " ",
            email: userEmail,
            password: " ",
        };
        const result = await userModel.create(newUser);
        return done(null, result);
    } catch (error) {
        console.log(error);
        return done("Error");
    }
}));


passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id)
    done(null, user)
})

export default initializePassport