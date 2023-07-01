const mongoose = require('../mongodb')

const ImageInfo = new mongoose.Schema({
  path: {
    type: String,
    default: ''
  },
  hash: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: '',
    unique: true
  }
})

const Image = mongoose.model('Image', ImageInfo)

module.exports = { Image }