import {fileURLToPath} from "url";
import { dirname } from "path";
import bcrypt from "bcrypt"

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