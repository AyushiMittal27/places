const fs= require('fs')
const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const placesRoutes = require('./routes/places-route');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./model/http-error');

const app = express();


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}))
app.use('/uploads/images' , express.static(path.join('uploads' , 'images')))

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-origin', '*');  // for browser to access 
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization') // for browser to access, firs 3 are automatically set by browsers
    res.setHeader('Access-Control-Allow-Methods' , 'GET, POST , PATCH , DELETE')  // which http method is allowed 
    next();
}) 

app.use('/api/places',placesRoutes);
app.use('/api/users' ,usersRoutes);


app.use((req , res , next)=>{
    const error = new HttpError('Could not find this route ' , 400)
    throw error;
}) ; 

app.use((error , req, res, next) =>{
   
    if(req.file){
       fs.unlink(req.file.path , (err)=>{
           console.log(err)
       });    
    }

    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message : error.message ||'An unknown error has occured'})
})
mongoose.connect('mongodb://localhost:27017/mern' , {useNewUrlParser:true , useUnifiedTopology:true , useCreateIndex:true})
.then(()=>{
    app.listen(5000)
})
.catch((err)=> {
    console.log(err);
})
 