var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Timer() {
  EventEmitter.call(this);
  var self = this;
  this.i = 0;
  this.ms = Date.now();
  var nIntervID;
  self.start = function() {
    self.emit('start');
    nIntervID = setInterval(function() {
      self.emit('tick', { interval : self.i++ });
    }, 1000);
  };
  self.stop = function() {
    self.emit('stop');
    clearInterval(nIntervID);
  };
}

util.inherits(Timer, EventEmitter);

var myTimer = new Timer();
function tickHandler(event) {
  process.stdout.write('tick ' + this.i + '\n');
}
function startHandler(event) {
  process.stdout.write('start ' + this.ms + '\n');
}

function stopHandler(event) {
  var elapsedTime = Date.now() - this.ms;
  process.stdout.write('elapsed time ' + elapsedTime + '\n');
}
setTimeout(myTimer.stop, 5000);

myTimer.on('tick', tickHandler);
myTimer.on('start', startHandler);
myTimer.on('stop', stopHandler);

myTimer.start();
