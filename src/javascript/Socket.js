var Socket = function() {
  this.ws = null;
  this.init.apply(this, arguments);
};

Socket.prototype = Object.create(EventEmitter.prototype);

Socket.prototype.init = function(ws) {
  var _this = this;
  this.ws = ws;
  this.connected = false;

  if(this.ws) {
    this.ws.onmessage = function(evt) {
      _this._handleMessage(evt.data);
    };
    this.ws.onclose = function(res) {
      _this.connected = false;
      _this._broadcast('close', res);
      _this.ws = null;
    };
    this.ws.onerror = function(er) {
      _this.connected = false;
      _this._broadcast('error', er);
      _this.ws = null;
    };
    this.ws.onopen = function() {
      _this.connected = true;
      _this._broadcast('connect');
    };
  }

  return this;
};

// parses the incoming data
Socket.prototype._handleMessage = function(message) {
  var _this = this;

  if(typeof message == 'string') {
    var packet = JSON.parse(message);

    if(packet.name && typeof packet.name == 'string' && packet.data && Array.isArray(packet.data)) {
      this._broadcast(packet.name, packet.data);
    }
    else {
      this._broadcast('error', new Error('Invalid Packet: ' + message));
    }
  }

  return this;
};

// handles the actual emission of the data
Socket.prototype._broadcast = function(event, data) {
  var emission = [event];
  emission = emission.concat(data);

  this._emit.apply(this, emission);

  return this;
};

// close the socket
Socket.prototype.close = function() {
  if(this.ws) {
    this.ws.close();
  }

  return this;
};

Socket.prototype.connect = function() {
  if(!this.ws && this.uri) {
    this.init(new ws(this.uri));
  }
};


Socket.prototype._emit = Socket.prototype.emit;
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

  if(this.ws && this.connected) {
    this.ws.send(JSON.stringify(packet));
  }

  return this;
};
