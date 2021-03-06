/* @flow */

import createPrivate from "@stefanwimmer128/core-class/src/createPrivate";
import val from "@stefanwimmer128/core-utils/src/val";
import {
    isFunction,
} from "lodash";

const $index = createPrivate("index"),
    $resolver = createPrivate("resolver");

export default class Iterator {
    constructor(resolver: {
        get(i: number): any,
        size: number | () => number,
    }) {
        $resolver(this, resolver);
    }
    
    static fromArray(array: any[]): Iterator {
        return new Iterator({
            get(i) {
                return array[i];
            },
            size() {
                return array.length;
            },
        });
    }
    
    next(): {
        done: boolean,
        value: any,
    } {
        $index(this, ($index(this) || 0) + 1);
        
        return {
            done: $index(this) > val($resolver(this).size, size => isFunction(size) ? size() : size),
            value: $resolver(this).get($index(this) - 1),
        };
    }
    
    // $FlowFixMe
    [Symbol.iterator](): this {
        return this;
    }
}
