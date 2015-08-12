  var ws = WebSocket || MozWebSocket;

  // returns a Socket object
  var DataIO = function(uri) {
    var _this = this;

    if(!uri) uri = 'ws://' + window.location.host + '/';

    if(uri.indexOf('ws://') == -1 && uri.indexOf('wss://') == -1) {
      if(uri.indexOf('http://') > -1) {
        uri = uri.replace('http://', 'ws://');
      }
      else if(uri.indexOf('https://') > -1) {
        uri = uri.replace('https://', 'wss://');
      }
      else if(uri.indexOf(':') > -1) {
        var index = uri.indexOf(':');

        uri = 'ws' + uri.substring(index);
      }
      else {
        uri = 'ws://' + uri;
      }
    }

    if(ws) {
      var socket = new Socket(new ws(uri));
      socket.uri = uri;
      return socket;
    }

    return null;
  };

  window.dio = DataIO;
