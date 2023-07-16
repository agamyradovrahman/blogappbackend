const express = require("express");
const { register, loginUser, logoutUser } = require("../controllers/user");
const router = express.Router()



router.route("/register").post(register);

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);






module.exports = router