var express = require('express');
var router = express.Router();

var searchByKeyword = function() {
  var results = YouTube.Search.list('id,snippet', {q: 'dogs', maxResults: 25});
  for(var i in results.items) {
    var item = results.items[i];
    Logger.log('[%s] Title: %s', item.id.videoId, item.snippet.title);
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
