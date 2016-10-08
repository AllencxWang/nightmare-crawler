var request = require('request')
var fs = require('fs')
var Promise = require('bluebird')
var progress = require('request-progress')

var download = function(uri, filename) {
  if(fs.existsSync(filename)) {
    console.log(filename, 'already exists')
    return Promise.resolve()
  } 
  return new Promise(function(resolve, reject) {
    console.log('DOWNLOADING....')
    console.log('URI :', uri)
    console.log('FILENAME :', filename)
    
    progress(request(uri), {
      throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms 
      delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms 
      lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length 
    })
    .on('progress', function(state) {
      console.log('transferred:', state.size.transferred)
    })
    .on('error', reject)
    .pipe(fs.createWriteStream(filename))
    .on('close', resolve)  
  })
}

module.exports = download