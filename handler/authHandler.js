const expressAsyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");

const validationToken = expressAsyncHandler( async (req, res, next)=>{
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1]

        jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decode)=>{
            if (err) {
                res.status(400)
                throw new Error("User is not Authorized.")
            }else{
                req.user = decode.nameU;
                next()
;            }
        })
        if (!token) {
            res.status(401);
            throw new Error("Missing token")
        }
    }
})

module.exports = validationToken;