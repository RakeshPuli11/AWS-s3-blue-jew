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
  { name: 'carousal', maxCount: 2 },
  { name: 'about', maxCount: 2 },
  { name: 'products', maxCount: 6 }
]);

const uploadFiles = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to upload files' });
    }

    try {
      const carousalImages = req.files.carousal ? req.files.carousal.map(file => file.location) : [];
      const aboutImages = req.files.about ? req.files.about.map(file => file.location) : [];
      const captions = JSON.parse(req.body.captions || '[]');
      const productImages = req.files.products ? req.files.products.map((file, index) => ({
        product: file.location,
        caption: captions[index]
      })) : [];

      const content = new loadContent({
        title: req.body.title,
        phonenumber: req.body.phonenumber,
        email: req.body.email,
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
    const baseUrl = 'http://localhost:3000/public';
    const data = {
      title: "hello",
      about:[
        `${baseUrl}/About/rect1.png`,
        `${baseUrl}/About/rect2.png`
      ],
      carousal: [
        `${baseUrl}/carousal/corousal.png`, 
        `${baseUrl}/carousal/corousal2.png`
      ],
      products:[
        {
        product:`${baseUrl}/Products/r1.png`,
        caption:"Ring"
        },
        {
          product:`${baseUrl}/Products/r2.png`,

          caption:"Chain"
          },
          {
            product:`${baseUrl}/Products/r3.png`,
            caption:"Necklace"
            },
            {
              product:`${baseUrl}/Products/r4.png`,
              caption:"Ear rings"
              },
              {
                product:`${baseUrl}/Products/r5.png`,
                caption:"Pendants"
                },
                {
                  product:`${baseUrl}/Products/r6.png`,
                  caption:"Bangles"
                  },
      ],
    };

    res.status(200).json(data);
  } catch (err) {
    console.error('Error reading images:', err);
    res.status(500).json({ error: 'Failed to read images' });
  }
};


module.exports = { uploadFiles };