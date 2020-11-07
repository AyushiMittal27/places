const multer = require('multer')
const {v1 :uuid}= require('uuid')
const MIME_TYPE_MAP={
    'image/jpeg' :'jpeg',
    'image/jpg' : 'jpg',
    'image/png' : 'png'
}

const fileUpload= multer({
    limit : 500000,
    storage: multer.diskStorage({
        destination :((req, file , cb)=>{
           cb(null, 'uploads/images')
        }),
        fileName :((req, file, cb)=>{
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null , uuid()+'.'+ext);
                })
    }),
    fileFilter :(req, file, cb)=>{
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type')
        cb(error , isValid);
    }
})

module.exports = fileUpload;