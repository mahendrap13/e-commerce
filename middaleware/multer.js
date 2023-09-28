import multer from "multer";
import fs from "fs";
import path from "path";

export const multerFunction = (dist) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (fs.existsSync(dist)) {
        cb(null, dist);
      } else {
        fs.mkdirSync(dist, true);
        cb(null, dist);
      }
    },
    filename: function (req, file, cb) {
      const imgName = file.originalname;
      const imgarr = imgName.split(".");
      imgarr.pop();
      const imgEXt = path.extname(imgName);
      const imageName = imgarr.join(".") + "-" + Date.now() + imgEXt;
      cb(null, imageName);
    },
  });
  return multer({ storage: storage });
};
