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

C# Client
==============

The C# is a little more complicated and limited in how stuff is handled. One cool thing about C# is that the events are actually on another thread and not the main thread! Be careful of thread safety!

The C# client is compatible with Unity3D and is built using Mono. You can find all the necessary DLLs in the build folder. They should be compatible with Linux and Windows .Net 2.0+.

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

Getting Started
-----------------

First thing you will need to do is import the proper libraries.

```
using Data.io;
using Data.io.Lib;
using SimpleJson;
```

Next step is creating a socket. Use the static Client helper functions.
```
Socket socket = Client.Create("ws://localhost:8080");

//Subscribe to events first before calling socket.connect()
socket.on("connect",(object[] args) => {
  //socket connected to client do whatever you need too.
  //there are no args for this event
});
socket.on("someevent", (object[] args) => {
  //always check to see if there are args!
  if(args.length > 0) {
    //okay we actually have something
    //Remember if there are objects than they will be JsonObject
    //Or if they are arrays they will be JsonArray
    //The only things that are not are numbers, bools, and nulls.

    //remember this is in a separate thread
    //if you need to access ui you will need to switch threads.

    //If we know we have an object in the first arg
    JsonObject jobj = (JsonObject)args[0];
    //do whatever with it.
  }
});
socket.on("close", (object[] args) => {
  //socket was closed. There are no args
});
socket.on("error", (object[] args) => {
  //if an error happens. The first element in args is an ErrorEventArgs.
});

//now connect
socket.connect();

//if you need to close
socket.close();
```

Objective-C Client
=======================

The Objective-C files can be found in the src folder. Just drag and drop them into your project.

Be warned, the Objective-C version does require manual cleanup to prevent memory leaks. For instance, if you used a block and access self and that object is about to dealloc. Then, you need to call the:
```
[someSocket removeListener: @"event" forKey:@"The Key You Specified for the Listener"];
```
Otherwise ARC will not reduce the retain count until the block has been released.

Dependencies
--------------
PocketSocket - https://github.com/zwopple/PocketSocket

PocketSocket is required as the DIOSocket wraps a PSWebSocket and the TEventEmitter together to handle the packets and events.

Getting Started
------------------

First thing import the proper header file
```
#import "DIOSocket.h"
```

Next up create an instance and setup events
```
self.socket = [[DIOSocket alloc] init];

[self.socket on:@"connect" forKey:@"MyListenerKey" withBlock:^(id data){
  //there is no data for the connect event;
}];

[self.socket on:@"error" forKey:@"MyListenerKey" withBlock:^(id data) {
  //data is an NSError object.
}];

[self.socket on:@"close" forKey:@"MyListenerKey" withBlock:^(id data) {
  //socket closed. There is no data
}];

[self.socket on:@"someevent" forKey:@"MyListenerKey" withBlock:^(id data) {
  //On events from the server the data is actually an NSMutableArray
  //The NSMutableArray is from the NSJSONSerialization
  NSMutableArray *args = (NSMutableArray *)data;
  if(args.count > 0) {
    //do something with it
    //When emitting the withData argument must have a compatible NSArray or
    //NSMutableArray with data that is compatible with NSJSONSerialization
    [self.socket emit:@"someevent" withData:args];
  }
}];

[self.socket connect:[NSURLRequest requestWithURL:[NSURL urlWithString:@"ws://localhost:8080"]]];
```

Remember when emitting the withData arg must have a compatible NSArray or NSMutableArray that has data that is compatible with NSJSONSerialization. That means the data in the Array must be one of the following: NSDictionary,NSMutableDictionary,NSArray,NSMutableArray,NSNumber,NSNull, or NSString.

Removing listeners on dealloc for a temporary object if app is not closing
```
- (void)dealloc {
  [self.socket removeListener:@"connect" forKey:@"MyListenerKey"];
  [self.socket removeListener:@"error" forKey:@"MyListenerKey"];
  [self.socket removeListener:@"close" forKey:@"MyListenerKey"];
  [self.socket removeListener:@"someevent" forKey:@"MyListenerKey"];
}
...
```
