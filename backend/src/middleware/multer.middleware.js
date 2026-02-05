import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    filename : (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})


//filefilter: jpeg , jpg , png , webp
const filefilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if(extname && mimeType){
        cb(null, true)
    }else{
        cb(new Error("Invalid file type - Only Image files are allowed ( jpeg , jpg , png , webp )"))
    }
}

export const upload = multer({
    storage,
    fileFilter : filefilter,
    limits : {
        fileSize : 1024 * 1024 * 5 //5MB
    }
})