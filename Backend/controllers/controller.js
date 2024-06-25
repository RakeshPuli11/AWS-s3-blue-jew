const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
const { loadContent } = require('../models/loadedContent');
dotenv.config();

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.BUCKET_REGION,
});

const storage = multerS3({
  s3: s3,
  bucket: process.env.BUCKET_NAME,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const folder = file.fieldname;
    const uniquePrefix = Date.now().toString();
    const fullPath = `${folder}/${uniquePrefix}-${file.originalname}`;
    cb(null, fullPath);
  }
});

const upload = multer({ storage: storage }).fields([
  { name: 'carousal', maxCount: 5 },
  { name: 'about', maxCount: 5 },
  { name: 'products', maxCount: 7 }
]);

const uploadFiles = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to upload files' });
    }

    try {
      const jsonData = JSON.parse(req.body.data);

      const carousalImages = req.files.carousal ? req.files.carousal.map(file => file.location) : [];
      const aboutImages = req.files.about ? req.files.about.map(file => file.location) : [];
      const productImages = req.files.products ? req.files.products.map((file, index) => ({
        product: file.location,
        caption: jsonData.content[index] || ''
      })) : [];

      const content = new loadContent({
        title: jsonData.title,
        phonenumber: jsonData.phonenumber,
        email: jsonData.email,
        carousal: carousalImages,
        about: aboutImages,
        products: productImages
      });

      await content.save();

      res.status(200).json({ message: 'Files uploaded and saved successfully!', data: content });
    } catch (saveError) {
      res.status(500).json({ error: 'Failed to save content to database' });
    }
  });
};



const getAllContent = async (req, res)=>{
  try {
    const content = await loadContent.findOne({ title: req.params.title });
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content from database' });
  }
};



module.exports = { uploadFiles, getAllContent};