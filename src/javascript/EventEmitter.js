var EventEmitter = function() {
  this.listeners = {};
};

// subscribe to an event
EventEmitter.prototype.on = function(event, cb) {
  var listeners = this.listeners[event];

  if(listeners) {
    var listener = {type: 0, fn: cb};
    listeners.push(listener);
  }
  else {
    listeners = [];

    var listener = {type: 0, fn: cb};
    listeners.push(listener);

    this.listeners[event] = listeners;
  }

  return this;
};

// subscribe only once to and event
EventEmitter.prototype.once = function(event, cb) {
  var listeners = this.listeners[event];

  if(listeners) {
    var listener = {type: 1, fn: cb};
    listeners.push(listener);
  }
  else {
    listeners = [];

    var listener = {type: 1, fn: cb};
    listeners.push(listener);

    this.listeners[event] = listeners;
  }

  return this;
};

// emit the event with the provided arguments
EventEmitter.prototype.emit = function(event) {
  var args = [];
  var _this = this;

  if(arguments.length > 1) {
    args = Array.prototype.slice.call(arguments, 1, arguments.length);
  }

  var listeners = this.listeners[event];

  if(listeners) {
    var shouldRemove = [];

    for(var i = 0; i < listeners.length; i++ ){
      var item = listeners[i];
      item.fn.apply(_this, args);

      if(item.type == 1)
        shouldRemove.push(item);
    }

    for(var i = 0; i < shouldRemove.length; i++) {
      var item = shouldRemove[i];
      listeners.splice(listeners.indexOf(item), 1);
    }
  }

  return this;
};
