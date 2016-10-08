var path = require('path')
var Promise = require('bluebird')

var download = require('./download')

module.exports = function(page, url, folder, isWorkshop) {
  var baseUrl = 'https://teamtreehouse.com'

  var padding = function(num, digit) {
    num = num + ''
    var len = num.length
    if(len < digit) {
      num = '0'.repeat(digit - len) + num
    }
    return num
  }

  return new Promise(function(resolve, reject) {
    
    page
      .goto(url)
      // .wait(isWorkshop ? 'ul.stage-progress-list' : 'ul.steps-list')
      .wait(1000)
      .evaluate(function(baseUrl, isWorkshop) {
        var steps = []
        if(isWorkshop) {
          $('ul.stage-progress-list > li > a').each(function() {
            steps.push(baseUrl + $(this).attr('href'))
          })
          if(steps.length === 0) {
            // this workshop contains only one video
            steps.push(baseUrl + $('a#workshop-hero').attr('href'))
          }
        } else {
          $('ul.steps-list > li > a').each(function() {
            steps.push(baseUrl + $(this).attr('href'))
          })
        }
        return steps
      }, baseUrl, isWorkshop)
      .then(function(steps) {
        var counter = 0
        var advance = function(i) {
          if(i !== steps.length) {
            console.log('step :', steps[i])
            page
              .goto(steps[i])
              // .wait('div.stage-progress-container')
              .wait(1000)
              .evaluate(function (baseUrl) {
                return {
                  video: $('source[type="video/mp4"]').attr('src'),
                  subtitle: $('track[kind="subtitles"]').attr('src') ? baseUrl + $('track[kind="subtitles"]').attr('src') : null
                }
              }, baseUrl)
              .then(function(link) {
                if(link.video) {
                  console.log('video :', link.video)
                  var filename = path.join(folder, padding(counter++, 3) + ' - ' + path.basename(steps[i]) + '.mp4') 
                  download(link.video, filename)
                    .then(function() {
                      console.log('subtitle :', link.subtitle)
                      if(link.subtitle) return download(link.subtitle, filename.replace('.mp4', '.srt'))
                      else return null
                    })
                    .then(function() {
                      advance(i+1)
                    })
                    .catch(function(err) {
                      console.log('an error was catched in scrap.js [1]', err)
                      reject(err)
                    })
                } else {
                  console.log('video : none')
                  advance(i+1)
                }
              })
              .catch(function(err) {
                console.log('an error was catched in scrap.js [2]', err)
                reject(err)
              })
          } else {
            resolve()
          }
        } 
        advance(0)
      })
      .catch(function(err) {
        console.log('an error was catched in scrap.js [3]', err)
        reject(err)
      })
  })
}

