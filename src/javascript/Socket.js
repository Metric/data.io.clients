var Socket = function() {
  this.ws = null;
  this.emitter = new EventEmitter();
  this.init.apply(this, arguments);
};

Socket.prototype.init = function(ws) {
  var _this = this;
  this.ws = ws;
  this.connected = false;

  if(this.ws) {
    this.ws.onmessage = function(evt) {
      _this.handleMessage(evt.data);
    };
    this.ws.onclose = function(res) {
      _this.connected = false;
      _this.broadcast('close', res);
    };
    this.ws.onerror = function(er) {
      _this.connected = false;
      _this.broadcast('error', er);
    };
    this.ws.onopen = function() {
      _this.connected = true;
      _this.broadcast('connect');
    };
  }

  return this;
};

// parses the incoming data
Socket.prototype.handleMessage = function(message) {
  var _this = this;

  if(typeof message == 'string') {
    var packet = JSON.parse(message);
    this.broadcast(packet.name, packet.data);
  }

  return this;
};

// handles the actual emission of the data
Socket.prototype.broadcast = function(event, data) {
  var emission = [event];
  emission = emission.concat(data);

  this.emitter.emit.apply(this.emitter, emission);

  return this;
};

// subscribe to an event
Socket.prototype.on = function(event, cb) {
  this.emitter.on(event, cb);

  return this;
};

// subscribe to an event for only one trigger
Socket.prototype.once = function(event, cb) {
  this.emitter.once(event, cb);

  return this;
};

// close the socket
Socket.prototype.close = function() {
  if(this.ws) {
    this.ws.close();
  }

  return this;
};

// emit the data for the event to the server
Socket.prototype.emit = function(name) {
  var _this = this;
  var args = [];

  if(arguments.length > 1) {
    args = Array.prototype.slice.call(arguments, 1, arguments.length);
  }

  var packet = {
    name: name,
    data: args
  };

  if(this.ws) {
    this.ws.send(JSON.stringify(packet));
  }

  return this;
};
