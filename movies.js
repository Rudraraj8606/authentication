const express = require("express");
const router = express.Router();
const verifyAuth = require('./verifyAuthToken')
const JWT = require('jsonwebtoken')

router.post('/', verifyAuth, (req, res) => {
	const accessToken = req.headers.accesstoken
	const expires = JWT.decode(accessToken, key).exp
	const currentTime = Math.floor(Date.now() / 1000);
	res.json({ bool: true, msg:"get unlimited movies", AT: accessToken, exp: expires, currentT: currentTime})
})

module.exports = router