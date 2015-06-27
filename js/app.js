var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Timer(time) {
  EventEmitter.call(this);
  if (arguments.length === 0) {
    time = 10;
  }
  var self = this;
  this.i = 0;
  this.ms = Date.now();
  var nIntervID;
  self.start = function() {
    self.emit('start');
    nIntervID = setInterval(function() {
      self.emit('tick', { interval : self.i++ });
      if (self.i === time) {
        self.stop();
      }
    }, 100);

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
function startHandler() {
  process.stdout.write('start ' + this.ms + '\n');
}

function stopHandler() {
  var elapsedTime = Date.now() - this.ms;
  process.stdout.write('elapsed time ' + elapsedTime + '\n');
}

myTimer.on('tick', tickHandler);
myTimer.on('start', startHandler);
myTimer.on('stop', stopHandler);

myTimer.start();
