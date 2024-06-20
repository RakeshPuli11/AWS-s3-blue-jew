const express = require('express');
const {  uploadFiles } = require('../controllers/controller.js');
const router = express.Router();

router.post('/singlefileupload', uploadFiles);

module.exports = router;