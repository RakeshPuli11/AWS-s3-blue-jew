const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  phonenumber: { type: String, default: "" },
  email: { type: String, default: "" },
  carousal: { type: [String], default: [] },
  about: { type: [String], default: [] },
  products: {
    type: [{
      product: { type: String, default: "" },
      caption: { type: String, default: "" }
    }],
    default: []
  },
});

const loadContent = mongoose.model('loadContent', contentSchema);

module.exports = { loadContent };
