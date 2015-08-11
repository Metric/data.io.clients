//
//  DIOSocket.m
//
//  Created by Aaron Klick on 8/10/15.
//  Copyright (c) 2015 Vantage Technic. All rights reserved.
//

#import "DIOSocket.h"

@interface DIOSocket()

@property (nonatomic, strong) TEventEmitter *events;
@property (nonatomic, strong) PSWebSocket *ws;

@end

@implementation DIOSocket

- (instancetype)init {
    self = [super init];
    if(self) {
        self.events = [[TEventEmitter alloc] init];
    }
    return self;
}

#pragma mark - Event Handling

// Connect to the specified url
// will emit the event: connect, on success
- (void)connect:(NSURLRequest *)url {
    if(!self.isConnected) {
        self.ws = [PSWebSocket clientSocketWithRequest:url];
        self.ws.delegate = self;
        [self.ws open];
    }
}

// Close the socket
// When closed the event: close, will be emitted
- (void)close {
    if(self.isConnected) {
        [self.ws close];
        self.ws = nil;
    }
}

// Subscribe to events for the specified key
- (void)on:(NSString *)event forKey:(NSString *)object withBlock:(void (^)(id))block {
    [self.events on:event forKey:object withBlock:block];
}

// Remove the specified listener with the key for the event
- (void)removeListener:(NSString *) event forKey:(NSString *)object {
    [self.events removeListener:event forKey:object];
}

// Emit the specified event with the data through the socket
- (void)emit:(NSString *)event withData:(id)data {
    NSMutableDictionary *packet = [NSMutableDictionary dictionary];
    packet[@"event"] = event;
    packet[@"data"] = data;
    
    NSData *json = [NSJSONSerialization dataWithJSONObject:packet options:NSJSONWritingPrettyPrinted error:nil];
    
    if(json) {
        NSString *buffer = [[NSString alloc] initWithData:json encoding:NSUTF8StringEncoding];
        
        if(self.ws && self.isConnected) {
            [self.ws send:buffer];
        }
    }
}

#pragma mark - PSWebSocket Delegate

- (void)webSocket:(PSWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean
{
    self.isConnected = NO;
    [self.events emit:@"close" withData:nil];
}

- (void)webSocket:(PSWebSocket *)webSocket didFailWithError:(NSError *)error
{
    self.isConnected = NO;
    [self.events emit:@"error" withData:error];
}

- (void)webSocket:(PSWebSocket *)webSocket didReceiveMessage:(id)message {
    if(message) {
        NSMutableDictionary *packet = [NSJSONSerialization JSONObjectWithData:[message dataUsingEncoding:NSUTF8StringEncoding] options:NSJSONReadingMutableContainers | NSJSONReadingMutableLeaves | NSJSONReadingAllowFragments error:nil];
        
        if(packet) {
            NSString *event = packet[@"event"];
            NSMutableArray *data = packet[@"data"];
            
            [self.events emit:event withData:data];
        }
    }
}

- (void)webSocketDidOpen:(PSWebSocket *)webSocket {
    self.isConnected = YES;
    [self.events emit:@"connect" withData:nil];
}

@end
