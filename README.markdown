data.io Clients
=====================

There are several to choose from. You will find them in the src folder of this repo.

JavaScript Client
======================
NEW
------
Rewritten completely in ECMA6
Library simplified to only two classes IOSocket and EventEmitter

Getting Started
-----------------

First be sure to include the following in order
```
<script src="eventemitter.js"></script>
<script src="iosocket.js"></script>
```

Establishing a connection and setting up events
```
//Do note if you do not provide a uri then
//it will try and use window.location with a
//regular ws socket and not a wss socket.

const socket = new IOSocket('http://localhost:8080');

socket.on('error', (err) => {
  //an error occurred
});

socket.on('close', function() {
  //the connection was closed by either the client or the server
});

socket.on('connect', () => {
  //connected to server do any prep needed
});

socket.on('someevent', (somedata) => {
  //do whatever
  socket.emit('someevent', somedata);
})

//close the connection
socket.close();

//check for connection
if(socket.connected) {
  //do whatever
}

//If you ever lose connection and need to reconnect
//will only work if not connected already
socket.connect();
```

Example of reconnecting on connection lost
```
socket.on('error', (err) => {
  //This is assuming you have a dialog class you can call to ask
  //The user if they want to reconnect
  var dialog = new Dialog('Connection lost...', 'Retry', function() {
    socket.connect();
  });
});
socket.on('close', () => {
  //This is assuming you have a dialog class you can call to ask
  //The user if they want to reconnect
  var dialog = new Dialog('Connection lost...', 'Retry', function() {
    socket.connect();
  });
});
```

C# Client
==============

NEW
-----
Simplified class structure instead of using Client, simply use: new IOSocket(uri);
Updated to adhere to C# coding syntax.


Getting Started
-----------------

The C# version events are actually on another thread and not the main thread! Be careful of thread safety!

The C# client is compatible with Unity3D.

If using with Unity3D you will need to use Loom.cs to return back to the Unity3D main thread from an event to update the UI and such.

Loom.cs is included in the src folder.

Dependencies
-------------
1. websocket-sharp (included in src folder)
2. SimpleJson (included in src folder)

For documentation and source on either one please see:
https://github.com/sta/websocket-sharp
https://github.com/facebook-csharp-sdk/simple-json

Examples
-------------
First thing you will need to do is import the proper libraries.

```
using Data.io;
using SimpleJson;
```

After importing you are going to need to determine what sort of events you are going to need.
Here are all possible objects that can come through via a delegate:

* Any primitive (string, long, int, float, double, etc.)
* JsonObject
* JsonArray

And one special case is for errors

* ErrorEventArgs 

Knowing these you can create your corresponding delegates. If you are not receiving any data from the event, except the event itself. Then, you can simply use an (Action)delegate() {}.

So let's see some examples.

If my event is simply receiving a string then I will need a delegate as follows.

```
delegate void StringEvent(string s);
```

You will want to keep your delegates as generic as possible for reuse. However, sometimes you will need a special one such as:

```
delegate void GameCompleteEvent(string winner, long winAmount, long loseAmount);
```

For the error event you will need a delegate like so or use (Action)delegate() {} if you don't care about the error message.

```
delegate void ErrorEvent(ErrorEventArgs e);
```

Next step is creating a socket.
```
IOSocket socket = new IOSocket("ws://localhost:8080");

//Subscribe to events first before calling socket.connect()
socket.On("connect", (Action)delegate() {
  //socket connected to server
  //there are no args for this event
});
socket.On("someevent", (StringEvent)delegate(string something) {
  
});
socket.On("close", (Action)delegate() {
  //socket was closed. There are no args
});
socket.On("error", (ErrorEvent)delegate(ErrorEventArgs e) {

});

//now connect
socket.Connect();

//if you need to close
socket.Close();

//to check to see if the socket is still connected:
socket.IsConnected
```

Sending an event with data
```
socket.Emit("myevent", "boom", 1000);
```

What if I only want to listen to an event once? I got you covered!
``` 
socket.Once("someevent", (StringEvent)delegate(string something) {
  //this will only be called once and then removed
});
```

For those that wish to use this with Unity3D. I have now included my own Loom.cs that I use for switching back to the main thread for UI updates.

The Loom.cs must always be on a Unity3D gameobject in order for it to work properly. I highly recommend creating a gameobject specifically for it and making sure the gameobject is never destroyed on load.
