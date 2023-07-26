import passport  from 'passport'
import local from 'passport-local'
import UserModel from '../Dao/fsManagers/models/user.model'

const localStrategy = local.Strategy

const initializePassport = () => {
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