import {fileURLToPath} from "url";
import { dirname } from "path";
import bcrypt from "bcrypt"
import { config } from "dotenv"
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const PORT = 3000;

export default __dirname;
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const SECRET_PASS = process.env.SECRET_PASS;

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    }
export const isValidPassword = (user, password) => {
   return bcrypt.compareSync(password, user.password)
 }
 export const generateToken = user => {
  const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '24h' })
  return token
}
export const extractCookie = req => {
  return (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null
}
export const passportCall = strategy => {
  return async(req, res, next) => {
      passport.authenticate(strategy, function(err, user, info) {
          if(err) return next(err)
          if(!user) errors.push({ text: 'The user has no authority' });
          
          req.user = user
          next()
      }) (req, res, next)
  }
}


export const handlePolicies = policies => (req, res, next) => {
  const user = req.user.user || null 
  if(policies.includes('admin')) {
      if(!user.role === 'admin') {
          return res.status(403).render('errors/base', {
              error: 'Need to be an ADMIN'
          })
      }
  }
  return next
}