var express = require('express');
var marko = require('marko');
var fs = require('fs');
var server = express();

var template = marko.load(__dirname + '/public/diff.marko');

server.use(express.static(__dirname + '/public'));

server.get('/', function(req, res){
  var arr = [];
  fs.readdir(__dirname + '/data', function(err, files){
    files.sort(function(a, b){
      var dateA = a.match('data-(.*?).json')[1];
      var dateB = b.match('data-(.*?).json')[1];
      return a - b;
    });
    var file = files.pop();
    var data = require(__dirname + '/data/' + file);
    var date = file.match('data-(.*?).json')[1];
    data.date = new Date(parseInt(date));
    template.stream(data).pipe(res);
  });
});

server.listen(process.env.PORT || 3000);
