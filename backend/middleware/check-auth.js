const jwt = require('jsonWebToken')
const HttpError = require('../model/http-error')

module.exports = (req, res, next)=>{
 if(req.method === 'OPTIONS'){
     return next();
 }
 try{
    const token = req.headers.authorization.split(' ')[1] // AUthorization: 'Bearer TOKEN'
    if(!token){
     const error = new HttpError('Authentication failed!', 400);
     return next(error)   
    }
    const decodedToken =jwt.verify(token, 'supersecret_dont_share')
    req.userData={userId: decodedToken.userId}
    next();
 }catch(err)
 {
    const error = new HttpError('Authentication Failed!' , 403)
    return next(error);
 }   
 

}