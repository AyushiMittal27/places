const {v4: uuid}= require('uuid')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const HttpError = require('../model/http-error')
const { validationResult }= require('express-validator')
const User = require('../model/user');


const getUsers= async (req, res, next)=>{
     
    let users ;
    try{
        users = await User.find({} , '-pasword')  // will return everrything excluding password
    }catch(err){
        const error = new HttpError('Fetching users failed, Please try again later' , 500)
    }

    res.json({users : users.map((user)=>user.toObject({getters : true}))})
}


const signup = async (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){

        return next(new HttpError('Invalid inputs passed , please check your data', 422))
    }
    const {name , email , password} = req.body;
    
    let existingUser;
    try{
        existingUser= await User.findOne({email: email });
    }catch(err)
    {
        const error= new HttpError('Signing up failed , Please try again later' , 500)
        return next(error);
    }
    
    if(existingUser){
        const error= new HttpError('User exits already , please login instead ' , 422)
        return next(error);
    }

    let hashedPassword
    try{
    hashedPassword = await bcrypt.hash( password , 12) // no of salt rounds  
    }catch(err){
       const error = new HttpError('Could not create  a user , please try again.', 500)
       return next(error)
    }
    const createdUser =new User( {
        name,
        email,
        password:hashedPassword,
        image:req.file.path,
        places:[]
   })
    let  newCreatedUser
    try{
        newCreatedUser = await createdUser.save()
    }catch(err){
        console.log(err)
        const error = new HttpError('Signing up  Failed , Please try again Later' , 500)
        return next(error);
    }
    
    let token;
    try{
        token =jwt.sign(
            {userId: newCreatedUser._id , email:newCreatedUser.email} , 
            'supersecret_dont_share',
            {expiresIn:'1h'}
        );
    }catch(err){
        console.log(err);
        const error = new HttpError('Signing up  Failed , Please try again Later', 500)
        return next(error)       
    }
    

    res.status(200).json({userId: createdUser._id , email: createdUser.email  ,token: token})
}

const login =async (req,res,next)=>{
    const {email , password}= req.body;
    let existingUser;
    try{
        existingUser=await User.findOne({email:email})
    }catch(err){
        const error = new HttpError('Login failed , Please try again later', 500)
        return next(error)
    }
    if(!existingUser){
    const error =new HttpError('Invalid Credentials , could not log you in', 403)
    return next(error);
    }
    
    let isValidPassword = false;
    try{
        isValidPassword = await bcrypt.compare(password ,existingUser.password);
    }
    catch(err){
        const error = new HttpError("could not log you in , please check your credentials and try again ", 500)
        return next(error)
    }
    
    if(!isValidPassword){
        const error = new HttpError('Invalid Credentials , could not log you in' , 401);
        return next(error);
    }

    let token;
    try{
     token = await jwt.sign({userId:existingUser.id , email:existingUser.email} ,'supersecret_dont_share', {expiresIn:'1h'} )
    }catch(err){
        const error = new HttpError("Logged in failed, please try again ", 500)
        return next(error)
    }
    res.json({
        userId:existingUser.id,
        email:existingUser.email,
        token:token});
}


exports.getUsers = getUsers
exports.signup = signup
exports.login = login