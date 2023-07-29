import {Router} from "express";
import UserModel from "../Dao/fsManagers/models/user.model";
import { createHash, isValidPassword } from "../utils";
import passport from "passport";

const router = express.Router()

router.post('/register', async (req, res) => {

  const errors = []

  const {first_name, last_name, age, email, password} = req.body

  if(password.length < 4) {
    errors.push({text: 'Password must be at least 4 characters'})
  }

  const existUser = await UserModel.findOne({ email })
    if(existUser) {
     errors.push({ text: 'The user already exist.'})
   
    }
  if (errors.length > 0) {
    res.render('sessions/register', {
      errors, 
        first_name,
        last_name,
        age,
        email
    })
  } else {

    const newUser = new UserModel({
      first_name,
      last_name,
      email,
      age,
      password,
      role: "usuario",
    })
      newUser.password = await newUser.encryptPassword(password)
      await newUser.save()
      res.redirect('login')
      
  }
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/sessions/login'}), async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email: email });
  req.session.user = user
  res.redirect('/products')
})

router.get('/failLogin', (req, res) => {
  res.send({ error: 'Failed!'})
})

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if(err) {
          console.log(err);
          res.status(500).render('errors/base', {error: err})
      } else res.redirect('/sessions/login')
  })
})

router.get("/login", (req, res) => {
  res.render("sessions/login");
})

router.get("/register", (req, res) => {
  res.render("sessions/register");
})
router.get('/failRegister', (req, res) => {
  res.send({ error: 'Faileed!'})
})



router.get("/github", (req, res) => {
  passport.authenticate('github', {scope: ['user:email']}),
  async(req, res) => {}
})


export default router;