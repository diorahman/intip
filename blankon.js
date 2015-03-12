var util = require('util');
var EventEmitter = require('events').EventEmitter;
var request = require('request');
var byline = require('byline');

module.exports = BlankonPackage;

function BlankonPackage(options) {
  if (!(this instanceof BlankonPackage))
    return new BlankonPackage(options);
  options = options || {};
  options.arch = options.arch || 'i386';
  // fixme: build this url based on options
  this.url = options.url;
  this.lineStream = byline.createStream();
  EventEmitter.call(this);
  var that = this;
  this.httpStream = request(this.url);
  this.lineStream.on('data', function(data){
    that.handleLineStream(that, data);
  });
  this.packages = {};
  that.httpStream.on('end', function(){
    that.emit('end');
    that.started = false;
    that.packages = {};
  });
}

util.inherits(BlankonPackage, EventEmitter);

BlankonPackage.prototype.handleLineStream = function(self, line) {
  line = line.toString();
  var arr = line.split(' ');
  var package = {
    name: arr[0].trim(),
    version: arr[1].trim()
  };
  this.packages[package.name] = package;
  self.emit('data', package);
}

BlankonPackage.prototype.resume = function() {
  if (!this.started) {
    this.httpStream.pipe(this.lineStream);
    this.started = true;
  }
}

