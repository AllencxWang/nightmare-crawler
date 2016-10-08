var Promise = require('bluebird')

var getCards = function(page) {
  var baseUrl = 'https://teamtreehouse.com'
  var topicUrl = 'https://teamtreehouse.com/library/topic:'
  var topics = [
    'android',
    'business',
    'csharp',
    'css',
    'databases',
    'design',
    'development-tools',
    'digital-literacy',
    'game-development',
    'html',
    'ios',
    'java',
    'javascript',
    'php', 
    'python',
    'ruby',
    'wordpress'
  ]
  
  return Promise.mapSeries(topics, function(topic) {
    return new Promise(function(resolve, reject) {
      page
        .goto(topicUrl + topic)
        .wait('ul.card-list')
        .evaluate(function(baseUrl, topic) {
          var courses = []
          var workshops = []
          $('li.card.course > a.card-box').each(function() {
            courses.push({
              title: $(this).find('h3.card-title').text(),
              link: baseUrl + $(this).attr('href')
            })
          })
          $('li.card.workshop > a.card-box').each(function() {
            workshops.push({
              title: $(this).find('h3.card-title').text(),
              link: baseUrl + $(this).attr('href')
            })
          })
          return {
            topic: topic,
            courses: courses,
            workshops: workshops
          }
        }, baseUrl, topic)
        .then(resolve)
        .catch(function(err) {
          console.log('an error was catached in cards.js', err)
          reject(err)
        })
    })
  })
}


module.exports = getCards