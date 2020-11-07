const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
    title :{
        type: String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type: String,
        required:true
    },
    address:{
        type:String,
        require:true
    },
    location:{
        lat: {
            type: Number, required:true
        },
        long: {
            type: Number, required:true
        }
    },
    creator:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})
 
module.exports= mongoose.model('Place' , placeSchema);