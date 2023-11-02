import { NextFunction, Request, Response } from "express";
import * as multer from "multer";
export default new (class UploadFile {
  Upload(fileName: string) {
    const storage = multer.diskStorage({
      destination: (req, res, cb) => {
        cb(null, "src/uploads");
      },
      filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + ".png");
      },
    });

    const uploadFile = multer({
      storage: storage,
    });

    return (req: Request, res: Response, next: NextFunction) => {
      uploadFile.single(fileName)(req, res, function (error: any) {
        if (error) {
          if (
            error instanceof multer.MulterError &&
            error.code === "LIMIT_UNEXPECTED_FILE"
          ) {
            return next();
          }

          return res.status(400).json({ error });
        } else {
          if (req.file) {
            res.locals.filename = req.file.filename;
          }
          next();
        }
      });
    };
  }
})();
