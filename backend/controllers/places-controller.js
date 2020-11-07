const fs = require('fs')
const {v4: uuid} = require('uuid');
const { validationResult }= require('express-validator');
const HttpError = require('../model/http-error');
const getCoordsForAddress = require('../util/location')
const Place = require('../model/place');
const User = require('../model/user');
const mongoose = require('mongoose');
const { selectFields } = require('express-validator/src/select-fields');


const getPlaceByID =async (req, res, next)=>
{const placeId= req.params.pid;
    let place;
try{
    place = await Place.findById(placeId);
}catch(err){
    const error = new HttpError('Something went wrong , Could not find the place' , 500)
    return next(error);
}    
if(!place){
    
    const error= new HttpError('Could not provide  place for the provided id', 404)
    return next(error);
}
res.json({place : place.toObject({getters: true})}); /* =>{place : place}  */

}

const getPlacesByUserID = async (req, res , next)=>{
    const userId= req.params.id
    let places;
    try{
        places = await Place.find({creator: userId})
    }catch(err){
        console.log(err)
       const error = new HttpError('Fetching Places FAiled, Please try again ' , 500)
       return next(error)
    }
    
    if(!places || places.length === 0){
       const error =new HttpError('Could not provide the places for the provided user id', 400);
       return next(error);
    }
    res.json({places: places.map((place)=> place.toObject({getters: true}))}) 
}


const createPlace = async(req, res , next)=>{
    const errors=validationResult(req)
    //console.log(req.body , "req body")
    if(!errors.isEmpty())
    {  //console.log(errors)
        return next(new HttpError('Invalid inputs passed , please check your data' , 422));
    } 
    
     const {title , description, address} = req.body;
     // const title = req.body.title
     let coordinates;
    try{ 
     coordinates =await getCoordsForAddress(address)
    }catch(error){
        return next(error);
    }
     const createdPlace =new Place({
         title,
         description,
         location: coordinates,
         image:req.file.path,
         address,
         creator: req.userData.userId,
     })
     let user;
     try{
         user = await User.findById(req.userData.userId)
     }catch(err){
         console.log(err , "error")
        const error = new HttpError('creating Place failed , please try again , 500')
        return next(error);
     }
     if(!user){
         const error = new HttpError('Could not find user for the provided id', 400)
         return next(error)
     }

     try{6
         await createdPlace.save()
         //console.log(user.places , "user")
         //user.places = createPlace._id
         user.places.push(createdPlace._id)
         await user.save() 
         console.log(user , "id of user")
         res.json({msg : 'Place created'})
          /* const sess= await mongoose.startSession();
           sess.startTransaction();
           await createdPlace.save({session: sess})
           user.places.push(createdPlace)
           await user.save({session: sess})
           await sess.commitTransaction();  */
     }catch(err){
         console.log(err)
         const error = new HttpError('creating Place failed , please try again , 500')
         return next(error);
     }
}


const updatePlace =async (req, res, next)=>{
    // for patch request we have a body
    // fields eligible for updation are only title and description
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        return next(new HttpError('Invalid inputs passed , please check your data', 422))
    }

    const {title, description} = req.body;
    const placeId = req.params.pid;
    let place;
    try{
        place= await Place.findById(placeId)
    }catch(err){
        const error = new HttpError('Something went wrong , Could not update place' , 500)
        return next(error);
    }
    if(place.creator.toString() != req.userData.userId){
        const error =new HttpError('You are not allowed to edit this place' , 401);
        return next(error)
    }

    place.title = title;
    place.description = description;
    try{
        await place.save()
    }catch(err)
    {
        const error= new HttpError('Something went wrong , could not update', 500)
        return next(error)
    }
    res.status(200).json({place : place.toObject({getters:true})})
}


const deletePlace =async (req, res , next)=>{ 
      const placeId = req.params.pid;
      let place;
      try{
          place = await  Place.findById(placeId).populate('creator')
      }catch(err){
          const error = new HttpError('something went wrong , could not delete place' ,500)
          return next(error)
      }
      
      if(!place){
          const error = new HttpError('Could not find place for this id', 404)
          return next(error)
      }
      
      if(place.creator.id !== req.userData.userId){
          const error = new HttpError('You are not allowed to delete this place', 401)
          return next(error)
      }

      const imagePath = place.image ;
      try{
           await place.remove()
           place.creator.places.pull(place)
           await place.creator.save()

          /*const sess = await mongoose.startSession();
          sess.startTransaction();
          await place.remove({session:sess})
          place.creator.places.pull(place);
          await place.creator.save({session:sess})
          await sess.commitTransaction()
          */
      }catch(err){
           console.log(err)
           const error = new HttpError('something went wrong , could not delete place' , 500)
           return next(error)
      }

      fs.unlink(imagePath , (err)=>{
          console.log(err)
      });
      res.status(200).json({msg: 'Deleted Place. '});
}


exports.getPlaceByID = getPlaceByID;
exports.getPlacesByUserID= getPlacesByUserID;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

