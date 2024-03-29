import express from "express";
import { JWT_COOKIE_NAME } from "../utils.js";

const router = express.Router()


export const userLoginController = async (req, res) => {
  if (!req.user) {
    res.status(400).send({ status: "error", error: "invalid credentials" })
  }
  res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')
}

export const userLogoutController = (req, res) => {
  res.clearCookie(JWT_COOKIE_NAME).redirect('/')
}

export const githubPassportController = async(req, res) => {}


export const githubLoginController = async(req, res) => {
        console.log('Callback: ', req.user)
        req.session.user = req.user
        console.log('User session: ', req.session.user)
        res.redirect('/')
    }

export const registerViewController = (req, res) => {
  res.render("sessions/register");
}

export const loginViewController = (req, res) => {
  res.render("sessions/login");
}


export default router;