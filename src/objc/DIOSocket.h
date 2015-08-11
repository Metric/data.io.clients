//
//  DIOSocket.h
//
//  Created by Aaron Klick on 8/10/15.
//  Copyright (c) 2015 Vantage Technic. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TEventEmitter.h"
#import "PSWebSocket.h"

@interface DIOSocket : NSObject <PSWebSocketDelegate>

@property (nonatomic) BOOL isConnected;

- (void)on:(NSString *)event forKey:(NSString *)object withBlock:(void (^)(id))block;
- (void)emit:(NSString *)event withData:(id)data;
- (void)connect:(NSURLRequest *)url;
- (void)close;
- (void)removeListener:(NSString *) event forKey:(NSString *)object;

@end
