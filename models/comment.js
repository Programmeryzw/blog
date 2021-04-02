const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const Schema = mongoose.Schema

const commentSchema = new Schema({
  title: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: '匿名用户'
  },
  content: {
    type: String,
    default: ''
  },
  create_time: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('comment', commentSchema)