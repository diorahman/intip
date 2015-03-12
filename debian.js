var util = require('util');
var EventEmitter = require('events').EventEmitter;
var request = require('request');
var byline = require('byline');
var zlib = require('zlib');

module.exports = DebianPackage;

function DebianPackage(options) {
  if (!(this instanceof DebianPackage))
    return new DebianPackage(options);
  options = options || {};
  options.arch = options.arch || 'i386';
  // fixme: build this url based on options
  this.url = 'http://ftp.debian.org/debian/dists/sid/main/binary-amd64/Packages.gz';
  this.lineStream = byline.createStream();
  this.httpStream = request(this.url);
  EventEmitter.call(this);
  var that = this;
  this.lineStream.on('data', function(data){
    that.handleLineStream(that, data);
  });
  this.gunzip = zlib.createGunzip();
  this.currentPackage = {};
  this.isPackageLine = false;
  this.packages = {};

  this.gunzip.on('end', function(){
    that.currentPackage = {};
    that.isPackageLine = false;
    that.started = false;
    that.emit('end');
  });
}

util.inherits(DebianPackage, EventEmitter);

DebianPackage.prototype.handleLineStream = function(self, line) {
  line = line.toString();
  if (line.indexOf('Package:') == 0) {
    self.currentPackage.name = line.split(':')[1].trim();
    self.isPackageLine = true;
  }

  if (line.indexOf('Version:') == 0) {
    self.currentPackage.version = line.split(':')[1].trim();
    self.packages[this.currentPackage.name] = this.currentPackage;
    self.isPackageLine = false;
    self.emit('data', this.currentPackage);
  }
}

DebianPackage.prototype.resume = function() {
  if (!this.started) {
    this.httpStream.pipe(this.gunzip).pipe(this.lineStream);
    this.started = true;
  }
}
