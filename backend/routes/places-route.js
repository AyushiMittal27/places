const express = require('express')
const {check}= require('express-validator')
const fileUpload = require('../middleware/file-upload')
const checkAuth = require('../middleware/check-auth')

const HttpError = require('../model/http-error')
const { getPlaceByID,
      getPlacesByUserID,
      createPlace, 
      updatePlace,
      deletePlace } = require('../controllers/places-controller')

const router = express.Router();


router.get('/:pid' , getPlaceByID)

router.get('/users/:id' , getPlacesByUserID)

router.use(checkAuth);

router.post('/' , fileUpload.single('image') , [
check('title').not().isEmpty(),
check('description').isLength({min:5}),
check('address').not().isEmpty()
 ] , createPlace)

router.patch('/:pid',
fileUpload.single('image') 
,[
    check('title').not().isEmpty(),
    check('description').isLength({min:5})
] ,updatePlace )

router.delete('/:pid' , deletePlace)

module.exports= router;