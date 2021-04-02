const { render } = require('art-template')

const express = require('express')
const md5 = require('blueimp-md5')

//接入数据库
const User = require('./models/user')
const topic = require('./models/topic')
const comment = require('./models/comment')
// new topic({
//   title: 'jojo'
// }).save(function(err, data){
//   console.log('插入成功')
// })

let router = express.Router()

router.get('/', function(req, res){
  topic.find(function(err, data){
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: 'Server error'
      })
    }
    let topic = data
    res.render('index.html', {
      user: req.session.user,
      topic: topic
    })
  })
})

router.get('/login', function(req, res){
  res.render('login.html')
})

router.post('/login', function(req, res){
  let body = req.body
  User.findOne({
    email: body.email,
    password: md5(md5(body.password))
  }, function(err, user){
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: 'Server error'
      })
    }
    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: '邮箱或密码错误'
      })
    }
    req.session.user = user
    return res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
  })
})

router.get('/register', function(req, res){
  res.render('register.html')
})

router.post('/register', function(req, res){
  let body = req.body
  User.findOne({
    $or: [
      {
        email: body.email
      },
      {
        nickname: body.nickname
      }
    ]
  }, function(err, data){
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: 'Server error.'
      })
    }
    //用户已存在
    if (data) {
      res.status(200).json({
        err_code: 1,
        message: 'email or nickname is already exist.'
      })
    }
    body.password = md5(md5(body.password))
    new User(body).save(function(err, user){
      if (err) {
        return res.status(500).json({
          err_code: 500,
          message: 'Server error.'
        })
      }
      //注册成功
      req.session.user = user  //使用session保存新注册用户登录会话窗口
      res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
    })
  })
})

router.get('/logout', function(req, res){
  req.session.user = null
  res.redirect('/')
})

router.get('/newTopic', function(req, res){
  res.render('topic/new.html')
})

router.post('/newTopic', function(req, res){
  let body = req.body
  new topic(req.body).save(function(err, data){
    if (err) {
      res.status(500).send('Server error')
    }
    res.redirect('/')
  })
})

router.get('/showTopic', function(req, res){
  let title = req.query.title
  topic.findOne({
    title: title
  }, function(err, data){
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: 'Server error'
      })
    }
  let topic = data
  comment.find({
    title: title
  }, function(err, data){
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: 'Server error'
      })
    }
    let comment = data
    res.render('topic/show.html', {
      topic: topic,
      comment: comment
    })
  })
})
})

router.post('/comment', function(req, res){
  let body = req.body
  new comment(req.body).save(function(err, data){
    if (err) {
      res.status(500).send('Server error')
    }
    res.redirect('/showTopic?title=' + body.title)
  })
})

module.exports = router