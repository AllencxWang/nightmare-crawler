var Nightmare = require('nightmare')

var getCards = require('./libs/cards')
var downloadVideos = require('./libs/videos')

var page = new Nightmare({
  typeInterval: 20,
  waitTimeout: 60000,
  gotoTimeout: 60000,
  // dock: true,
  // show: true,
  // openDevTools: {
  //   mode: 'attach'
  // }
})

// you have to type in your Treehouse pro account info to login
var email = 'EMAIL'
var password = 'PASSWORD'

// those matching patterns in this project may be invalid in the future
// but once you get the idea, you can rewrite it yourself
page
  .viewport(1024, 768)
  .cookies.clearAll()
  .goto('https://teamtreehouse.com/signin')
  .wait('button[type="submit"]')
  .type('input[name="user_session[email]"]', email)
  .type('input[name="user_session[password]"]', password)
  .click('button[type="submit"]')
  .wait('div.control-container.with-subnav')
  .then(function() {
    return getCards(page)
  })
  .then(function(cards) {
    return downloadVideos(page, cards)
  })
  .then(function() {
    console.log('all videos have been downloaded!!')
    console.log('well done!!')
  })
  .catch(function(err) {
    console.log('an error was catched in index.js', err)
  })



