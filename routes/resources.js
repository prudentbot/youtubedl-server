var express = require('express');
var request = require('request');
var secrets = require('../secrets')
var querystring = require('querystring');
var youtubeDL = require('youtube-dl');
var router = express.Router();
var fs = require('fs');

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
  console.log(qstring);
  request(qstring, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
    else {
      res.send(error);
    }
  });
});

router.get('/video/:videoId', function(req, res, next) {
  console.log('requested ' + req.params.videoId);
  var filename = req.params.videoId + ".mp3";
  var title = "placeholder";
  youtubeDL.getInfo(req.params.videoId, [], function(err, info) {
    if (err) {
      res.send("bad request");
      return;
    }
    title = info.title;
  });

  youtubeDL.exec(req.params.videoId, ['-x', '--audio-format', 'mp3', '-o', filename], {}, function(err, output) {
    if (err){
      res.send("bad request");
      return;
    }else{
      console.log("success!")
      res.setHeader("content-type", "audio/mp3");
      console.log(title);
      res.setHeader("song-title", title);
      fs.createReadStream(filename).pipe(res);
      fs.unlink(filename);
    }
  });

});

module.exports = router;
