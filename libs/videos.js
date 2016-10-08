var path = require('path')
var mkdirp = require('mkdirp')
var Promise = require('bluebird')

var scrapping = require('./scrap')

module.exports = function(page, cards) {
  // loop through all cards
  return Promise.mapSeries(cards, function(card) {
    // a card contains a topic and its corresponding courses/workshops 
    var topic = card.topic
    var courses = card.courses
    var workshops = card.workshops

    return new Promise(function(resolve, reject) {
      // loop though all courses of a topic
      Promise.mapSeries(courses, function(course) {
        // download each course
        var folder = path.join('downloaded', topic, 'course', course.title)
        mkdirp(folder)
        return scrapping(page, course.link, folder)
      })
      .then(function() {
        // loop though all workshops of a topic
        return Promise.mapSeries(workshops, function(workshop) {
          // download each workshop
          var folder = path.join('downloaded', topic, 'workshops', workshop.title)
          mkdirp(folder)
          return scrapping(page, workshop.link, folder, true)
        })
      })
      // move on to the next topic
      .then(resolve)
      .catch(function(err) {
        console.log('an error was catched in video.js', err)
        reject(err)
      })
    })
  })
}

