var express = require('express');
var request = require('request');
var secrets = require('../secrets')
var querystring = require('querystring');
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
  q: "default",
  key: secrets.YOUTUBE_KEY
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:searchstring', function(req, res, next) {
  query.q = req.params.searchstring;
  console.log(JSON.stringify(query));
  var qstring = base_url + querystring.stringify(query);
  console.log("querying " + qstring);
  request(qstring, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body) // Show the HTML for the Google homepage.
      res.send(body);
    }
    else {
      res.send(error);
    }
  });

  // res.send('resource with arg: ' + req.params.searchstring);
});

module.exports = router;
