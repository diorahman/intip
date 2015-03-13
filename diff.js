var JSONStream = require('JSONStream');
var request = require('request');
var es = require('event-stream');
var byline = require('byline');
var zlib = require('zlib');
var _ = require('lodash');
var fs = require('fs');
var vercmp = require('vercmp');
var Status = require('./status');

var Debian = require('./debian');
var Blankon = require('./blankon');

var DATA_URI='http://rani.blankon.in:8000/packages';
var dataStream = request(DATA_URI);
var status = new Status();

function hasBlankon1(version) {
  return version.indexOf('blankon1') >= 0;
}

module.exports = function() {
  dataStream
  .pipe(JSONStream.parse())
  .pipe(es.mapSync(function (repoPackages) {
    // 0. filter data from debian using repoPackages
    var refPackages = {};
    var debian = new Debian();
    debian.resume();
    var count = 0;
    var countMatch = 0;
    var result = {
      equal: [],
      greater: [],
      less: []
    };
    debian.on('data', function(debianPackage){
      var found = _.find(repoPackages, function(package){
        return package.name == debianPackage.name;
      });

      if (found) {
        countMatch++;
        refPackages[debianPackage.name] = {
          name: debianPackage.name,
          version: debianPackage.version
        };
      }
      process.stdout.write('--> ' + debianPackage.name.substring(0, 4) + '... ' + count++ + '(' + countMatch + ')\r');
    });

    debian.on('end', function(){
      // 1. blankon
      var count = 0;

      status.latestSuccessfulBuild(function(err, date){
        result.blankonUrl = 'http://cdimage.blankonlinux.or.id/blankon/livedvd-harian/' + date + 'tambora-desktop-amd64.list';
        var blankon = new Blankon({url: result.blankonUrl });
        blankon.resume();
        blankon.on('data', function(blankonPackage){
          if (refPackages[blankonPackage.name]) {
            var version = blankonPackage.version;
            var refVersion = refPackages[blankonPackage.name].version;
            var cmp = vercmp(blankonPackage.version, refVersion);
            var obj = {
              name: blankonPackage.name,
              blankonVersion: blankonPackage.version,
              sidVersion: refVersion,
              hasBlankon1Version: hasBlankon1(version)
            };
            if (cmp == 0)
              result.equal.push(obj);
            if (cmp > 0)
              result.greater.push(obj);
            if (cmp < 0)
              result.less.push(obj);
          }
        });
        blankon.on('end', function(){
          fs.writeFileSync(__dirname + '/data/' + 'data-' + new Date().valueOf() + '.json', JSON.stringify(result, null, 2));
        });
      });
    });
}));
}
