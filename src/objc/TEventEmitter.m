//
//  TEventEmitter.m
//
//  Created by Aaron Klick on 8/10/15.
//  Copyright (c) 2015 Vantage Technic. All rights reserved.
//

#import "TEventEmitter.h"

@interface TEventEmitter()

@property (nonatomic, strong) NSMutableDictionary *listeners;

@end

@implementation TEventEmitter

- (instancetype)init {
    self = [super init];
    if(self) {
        self.listeners = [NSMutableDictionary dictionary];
    }
    return self;
}

// Subscribe to an event, with a key for removing, and a block for callback of the event
- (void)on:(NSString *)event forKey:(NSString *)object withBlock:(void (^)(id))block {
    NSMutableDictionary *listeners = self.listeners[event];
    
    if(listeners) {
        [listeners setObject:block forKey:object];
    }
    else {
        listeners = [NSMutableDictionary dictionary];
        [listeners setObject:block forKey:object];
        [self.listeners setObject:listeners forKey:event];
    }
}

// Emit data for the event
- (void)emit: (NSString *)event withData:(id)data {
    NSMutableDictionary *listeners = self.listeners[event];
    
    if(listeners) {
        for(void(^block)(id) in listeners.allValues) {
            block(data);
        }
    }
}

// Remove all listeners for the event
- (void)removeListeners: (NSString *)event {
    NSMutableDictionary *listeners = self.listeners[event];
    
    if(listeners) {
        [listeners removeAllObjects];
    }
}

// Remove all listeners
- (void)removeAllListeners {
    [self.listeners removeAllObjects];
}

// Remove the listener with the specified key for the event
- (void)removeListener: (NSString *)event forKey:(NSString *)object {
    NSMutableDictionary *listeners = self.listeners[event];
    
    if(listeners) {
        [listeners removeObjectForKey:object];
    }
}

@end
