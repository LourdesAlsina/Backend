import passport  from 'passport'
import local from 'passport-local'
import UserModel from '../Dao/fsManagers/models/user.model'
import { cartModel } from '../Dao/fsManagers/models/cart.models'
import GitHubStrategy from 'passport-github2'
import { CLIENT_SECRET, CLIENT_ID, JWT_PRIVATE_KEY } from './config.js'
import { extractCookie, generateToken } from '../utils.js'

const localStrategy = local.Strategy
const JWTStrategy = passport_jwt.Strategy
const ExtractJWT = passport_jwt.ExtractJwt

const initializePassport = () => {

    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email',
        passReqToCallback: true
    }, async(req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        const errors = [];
    
        if (password.length < 4) {
            errors.push({ text: 'Password must be at least 4 characters' });
        }
    
        const existUser = await UserModel.findOne({ email });
        if (existUser) {
            errors.push({ text: 'The user already exists.' });
        }

       
    
        if (errors.length > 0) {
            return done(null, false, { errors });
        } else {
            const cartForNewUser = await cartModel.create({})
            
            const newUser = new UserModel({
                first_name,
                last_name,
                email,
                age,
                password,
                cart:  cartForNewUser._id
            });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            return done(null, newUser);
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
     
         const token = generateToken(user)
         
         user.token = token
         

         if (match) {
            return done(null, user)
         }else {
            return done(null, false, { message: 'Constraseña incorrecta' })
        }
    }
    }))

} 

passport.use('github', new GitHubStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    //clientID: 'Iv1.efc0db9e62c3023b',
    //clientSecret: '7364d7ea4dad99d5e3295fdb30aba6c5c48dccc7',
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

passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
    secretOrKey: JWT_PRIVATE_KEY
}, async(jwt_payload, done) => {
    done(null, jwt_payload)
}))

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id)
    done(null, user)
})

export default initializePassport