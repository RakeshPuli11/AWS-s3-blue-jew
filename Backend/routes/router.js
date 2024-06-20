const express = require('express');
const {  uploadFiles, getAllContent} = require('../controllers/controller.js');
const router = express.Router();


router.post('/singlefileupload', uploadFiles);
router.get('/getallcontent/:id', getAllContent);


module.exports = router;