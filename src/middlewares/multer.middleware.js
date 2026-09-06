import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp'); // Specify the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        //can use the above line if you want to add a unique suffix to the filename, but for now we will just use the original filename

        // cb(null, file.fieldname + '-' + uniqueSuffix); // Generate a unique filename for each uploaded file
        cb(null, file.originalname); // Use the original filename for each uploaded file
        //but it is better to use the unique suffix because if two files with the same name are uploaded, the second one will overwrite the first one. So it is better to use the unique suffix to avoid this issue.
    }
});

const upload = multer({
     storage: storage 
    }
);