var express = require('express');
var request = require('request');
var secrets = require('../secrets')
var querystring = require('querystring');
var youtubeDL = require('youtube-dl');
var ffmetadata = require("ffmetadata");
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

  youtubeDL.exec(req.params.videoId, ['--add-metadata', '-x', '--audio-format', 'mp3'], {}, function(err, output) {
    if (err){
      res.send("bad request");
      return;
    }else{
      var outputString = output.toString();
      var filenamei = outputString.search("Destination: .*.mp3");
      var endi = outputString.search("mp3");
      var filename = outputString.substring(filenamei + 13, endi + 3);
      res.setHeader("content-type", "audio/mp3");
      fs.createReadStream(filename).pipe(res).on('close', function() {
        fs.unlink(filename);
      }).pipe(res);
    }
  });
});

module.exports = router;
