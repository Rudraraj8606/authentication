const JWT = require('jsonwebtoken')
const UserExist = require('../DataBase/CRUD/Read/UserExist')
const validateRT = require('../DataBase/CRUD/Read/refreshToken')
const JWTgen = require('../../utility/JWTGenerator')
const key = process.env.SECRETE_KEY

const verifyToken = async(req, res, next) => {
	const AT = req.headers.accesstoken
	const RT = req.headers.refreshtoken
	if(AT == undefined){
		res.status(401).send('Unauthorized');
	}else{
		try {
			const decoded = JWT.verify(AT, key)
			const checkUser = await UserExist('', decoded.id)
			if(checkUser == "true"){
				next()
			}else{
				res.status(401).send('Unauthorized');
			}
			
		} catch (error) {
			if(error.message == "jwt expired"){
				// console.log("error")
				const VeriRT = JWT.verify(RT, key)
				const checkRT = await validateRT(VeriRT.Userid)
				if(checkRT){
					const decodeOldAT = JWT.decode(AT, key)
					// gen new access tok
					const newAccesstoken = JWT.sign({id: VeriRT.Userid, Roles: decodeOldAT.Roles}, key, { expiresIn: 30, algorithm: 'HS256' } )
					// console.log(newAccesstoken)
					req.headers.accesstoken = newAccesstoken
					next()
				}else{
					res.status(401).send('Unauthorized');
				}
			}else{
				res.status(500).json({"internal error": error})
				console.log(error)
			}
		}
	}
}

module.exports = verifyToken