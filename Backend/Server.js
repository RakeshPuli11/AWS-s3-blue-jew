// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import router from './routes/router.js';
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { fileURLToPath } = require('url');
const router = require('./routes/router.js');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.use(express.json(),cors());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Serve static files from the 'public' directory
// app.use('/public', express.static(path.join(__dirname, 'public')));

app.use("/api", router);

mongoose.connect(process.env.MONGODB_URI)
  .then((result) => {
    app.listen(3000, () => console.log('http://localhost:3000/'));
  })
  .catch((err) => {
    console.log(err);
  });
