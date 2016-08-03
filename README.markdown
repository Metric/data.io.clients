data.io Clients
=====================

There are several pre-built ones to choose from. The source is available for each one.

JavaScript Client
======================

You can grab the minified and pre-built one from the build directory.

Things to know:

1. Only has a very simple event emitter. Does not include removing of listeners.
2. Same socket events as the data.io server socket such as close and error.
3. There is only one new event that is: connect for when the socket has established a connection

Getting Started
-----------------

First be sure to include the minified script
```
<script src="data.io.client.min.js"></script>
```

Establishing a connection and setting up events
```
//Do note if you do not provide a uri then
//it will try and use window.location with a
//regular ws socket and not a wss socket.

var socket = new dio('http://localhost:8080');

socket.on('error', function(err) {
  //an error occurred
});

socket.on('close', function() {
  //the connection was closed by either the client or the server
});

socket.on('connect', function() {
  //connected to server do any prep needed
});

socket.on('someevent', function(somedata) {
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
socket.on('error', function(err) {
  //This is assuming you have a dialog class you can call to ask
  //The user if they want to reconnect
  var dialog = new Dialog('Connection lost...', 'Retry', function() {
    socket.connect();
  });
});
socket.on('close', function() {
  //This is assuming you have a dialog class you can call to ask
  //The user if they want to reconnect
  var dialog = new Dialog('Connection lost...', 'Retry', function() {
    socket.connect();
  });
});
```

C# Client
==============

The C# is a little more complicated and limited in how stuff is handled. One cool thing about C# is that the events are actually on another thread and not the main thread! Be careful of thread safety!

The C# client is compatible with Unity3D and is built using Mono. You can find all the necessary DLLs in the build folder. They should be compatible with Linux, Mac, and Windows .Net 2.0+.

If using with Unity3D you will need to use Loom.cs to return back to the Unity3D main thread from an event to update the UI and such. Just put the DLLs in your plugin folder for Unity3D to use.

Dependencies
-------------
1. websocket-sharp
2. SimpleJson

For documentation and source on either one please see:
https://github.com/sta/websocket-sharp
https://github.com/facebook-csharp-sdk/simple-json

The websocket-sharp was built with a fix I included for an error people were having in the original websocket-sharp. I do not know if they included the fix yet in the github branch of their code.

The simplejson dll is precompiled for .net 2.0+. Usually simplejson only comes in a single .cs file.

The DLLs are included in the build folder along with the pre-built DataIOClient.dll

This latest build has some major changes to how things work internally for the C# client.
As well as, how to add your event listener.

Getting Started
-----------------

First thing you will need to do is import the proper libraries.

```
using Data.io;
using Data.io.Lib;
using SimpleJson;
```

After importing you are going to need to determine what sort of events you are going to need.
Here are all possible objects that can come through via a delegate:

* string
* long
* double
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

For the error event you will need a delegate like so.

```
delegate void ErrorEvent(ErrorEventArgs e);
```

Next step is creating a socket. Use the static Client helper functions.
```
Socket socket = Client.Create("ws://localhost:8080");

//Subscribe to events first before calling socket.connect()
socket.on("connect", (Action)delegate() {
  //socket connected to server
  //there are no args for this event
});
socket.on("someevent", (StringEvent)delegate(string something) {
  
});
socket.on("close", (Action)delegate() {
  //socket was closed. There are no args
});
socket.on("error", (ErrorEvent)delegate(ErrorEventArgs e) {

});

//now connect
socket.connect();

//if you need to close
socket.close();

//to check to see if the socket is still connected:
socket.isConnected
```

For those that wish to use this with Unity3D. I have now included my own Loom.cs that I use for switching back to the main thread for UI updates. The single .cs file can be found in the build/csharp folder.

The Loom.cs must always be on a Unity3D gameobject in order for it to work properly. I highly recommend creating a gameobject specifically for it and making sure the gameobject is never destroyed on load.

Objective-C Client
=======================

No longer supported. You will need to create your own.
