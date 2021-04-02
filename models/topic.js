const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const Schema = mongoose.Schema

const topicSchema = new Schema({
  title: {
    type: String,
    default: 'headding'
  },
  content: {
    type: String,
    default: ''
  },
  created_time: {
    type: Date,
    default: Date.now
  },
  last_modified_time: {
    type: Date,
    default: Date.now
  }  
})

module.exports = mongoose.model('topic', topicSchema)