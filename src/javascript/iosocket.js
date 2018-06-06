'use strict';

const WS = WebSocket || MozWebSocket;

class IOSocket extends EventEmitter {
  constructor(uri) {
    super();

    this.connected = false;
    this._emit = super.emit;
    this._parseUri(uri);
    this._init(new WS(this.uri));
  }

  _parseUri(uri) {
    if(!uri) uri = 'ws://' + window.location.host + '/';

    if(uri.indexOf('ws://') == -1 && uri.indexOf('wss://') == -1) {
      if(uri.indexOf('http://') > -1) {
        uri = uri.replace('http://', 'ws://');
      }
      else if(uri.indexOf('https://') > -1) {
        uri = uri.replace('https://', 'wss://');
      }
      else if(uri.indexOf(':') > -1) {
        const index = uri.indexOf(':');

        uri = 'ws' + uri.substring(index);
      }
      else {
        uri = 'ws://' + uri;
      }
    }
    this.uri = uri;
  }

  _init(ws) {
    this.ws = ws;

    if(this.ws) {
      this.ws.onmessage = (evt) => {
        this._handleMessage(evt.data);
      };
      this.ws.onclose = (res) => {
        this.connected = false;
        this._emit('close', res);
        this.ws = null;
      };
      this.ws.onerror = (er) => {
        this.connected = false;
        this._emit('error', er);
        this.ws = null;
      };
      this.ws.onopen = () => {
        this.connected = true;
        this._emit('connect');
      };
    }
  }

  _handleMessage(data) {
    if(typeof data === 'string') {
      const packet = JSON.parse(data);

      if(packet.name && typeof packet.name === 'string' 
        && packet.data && Array.isArray(packet.data)) {
          let pdat = [packet.name];
          pdat = pdat.concat(packet.data);

          this._emit.apply(this, pdat);
      }
    }


    return this;
  }

  close() {
    if(this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  connect() {
    if(!this.ws && this.uri) {
      this._init(new ws(this.uri));
    }
  }

  emit(event, ...args) {
    const packet = {
      name: event,
      data: args
    };

    if(this.ws && this.connected) {
      this.ws.send(JSON.stringify(packet));
    }
  }
}