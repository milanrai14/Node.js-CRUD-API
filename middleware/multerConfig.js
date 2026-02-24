const multer = require('multer')

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, "./storage") //cb(error, fileDestination)
    },
    filename: function(req, file, cb){
        cb(null, Date.now()+'-'+ file.originalname) //cb(error, filename)
    }
})
module.exports = {
    multer,
    storage
}