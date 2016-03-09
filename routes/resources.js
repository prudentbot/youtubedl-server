var express = require('express');
var request = require('request');
var secrets = require('../secrets')
var querystring = require('querystring');
var youtubeDL = require('youtube-dl');
var router = express.Router();


var searchByKeyword = function() {
  var results = YouTube.Search.list('id,snippet', {q: 'dogs', maxResults: 25});
  for(var i in results.items) {
    var item = results.items[i];
    Logger.log('[%s] Title: %s', item.id.videoId, item.snippet.title);
  }
}

var base_url = "https://www.googleapis.com/youtube/v3/search?";
var query = {
  part: "id,snippet",
  maxResults:"25",
  fields: "items/id/videoId,items/snippet/title",
  type:"video",
  q: "default",
  key: secrets.YOUTUBE_KEY
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:searchstring', function(req, res, next) {
  query.q = req.params.searchstring;
  var qstring = base_url + querystring.stringify(query);
  request(qstring, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
    else {
      res.send(error);
    }
  });

  // res.send('resource with arg: ' + req.params.searchstring);
});

router.get('/video/:videoId', function(req, res, next) {
  var video = youtubeDL(req.params.videoId,
    ['-f', 'bestaudio']);

  video.on('info', function(info) {
    console.log('Download started');
    console.log('filename: ' + info.filename);
    console.log('size: ' + info.size);
    // res.header('Content-Disposition', 'attachment; filename="new file name.pdf"');
    res.setHeader("content-type", "audio/mp4");
    video.pipe(res);
  });
});

module.exports = router;
