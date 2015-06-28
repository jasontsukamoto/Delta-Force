var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Timer(time, lag) {
  EventEmitter.call(this);
  var speed = 1000;
  if (arguments.length === 0) {
    time = 10;
  }
  if (arguments[1] === undefined) {
    lag = 50;
  }
  var self = this;
  this.i = 0;
  this.ms = Date.now();
  var nIntervID;
  self.start = function() {
    self.emit('start');
    var start = Date.now();
    self.flag = false;

    nIntervID = setInterval(function deltaForce () {
      self.emit('tick', { interval : self.i++ });
      var lagger = 0;
      lagger = Date.now();
      self.trueTime = self.i * 1000;
      var delay = (lagger - start);
      self.lagEvent = (delay - self.trueTime);
      if (self.i === time) {
        self.stop();
      }


      if (self.lagEvent >= lag) {
        self.flag = true;
        self.emit('lag');
      }

      if (self.flag === true) {
        clearInterval(nIntervID);

        if (self.i !== time) {
          setTimeout(deltaForce, speed = 1000 - self.lagEvent);
        }

      }
    }, speed);



  };
  self.stop = function() {
    self.emit('stop');
    clearInterval(nIntervID);
  };
}

util.inherits(Timer, EventEmitter);

var myTimer = new Timer(20, 10);
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

function lagHandler() {

  process.stdout.write('true time: ' + this.trueTime + ' offset: ' + this.lagEvent + '\n');
}

myTimer.on('tick', tickHandler);
myTimer.on('start', startHandler);
myTimer.on('stop', stopHandler);
myTimer.on('lag', lagHandler);

myTimer.start();
