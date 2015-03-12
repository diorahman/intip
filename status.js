var cheerio = require('cheerio');
var request = require('request');
var async = require('async');
var rootUrl = 'http://cdimage.blankonlinux.or.id/blankon/livedvd-harian';

module.exports = Status;

function Status() {}

Status.prototype.isBuildSuccess = function(path, cb) {
  request(rootUrl + '/' + path, function(err, res, body){
    if (err)
      return cb(err);
    if (res.statusCode != 200)
      return cb(new Error('not 200'));
    var $ = cheerio.load(body);
    cb(null, $('a').length > 3);
  });
}

Status.prototype.buildList = function(cb) {
  request(rootUrl, function(err, res, body) {
    if (err) 
      return cb(err);
    if (res.statusCode != 200)
      return cb (new Error('not 200'));
    var $ = cheerio.load(body);
    var list = [];
    var links = $('a');
    for (var i = 1; i < links.length; i++) {
      list.push($(links[i]).attr('href'));
    }
    cb (null, list);
  });
}

Status.prototype.latestSuccessfulBuild = function(cb) {
  var that = this;
  this.buildList(function(err, list){
    async.mapSeries(list, that.isBuildSuccess, function(err, result){
        for (var i = list.length - 1; i > -1; i--) {
          if (result[i]) {
            return cb(null, list[i]);
          }
        }
    });
  });
}
