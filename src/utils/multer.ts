import * as multer from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

export const upload = multer({
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }, storage: multer.diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
            const newId = uuid();
            const fileExtension = path.extname(file.originalname);

            cb(null, `${newId}${fileExtension}`);
        }
    })
});
