//
//  TEventEmitter.h
//
//  Created by Aaron Klick on 8/10/15.
//  Copyright (c) 2015 Vantage Technic. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TEventEmitter : NSObject

- (void)on:(NSString *)event forKey:(NSString *)object withBlock:(void (^)(id))block;
- (void)emit: (NSString *)event withData:(id)data;
- (void)removeListener: (NSString *)event forKey:(NSString *)object;
- (void)removeListeners: (NSString *)event;
- (void)removeAllListeners;

@end
