import { Array as YArray, Map as YMap } from 'yjs';

/**
 * @param {YArray} yArray
 */
export function createProxyYArray(yArray) {
    return new Proxy(yArray.toJSON(), {
        get(target, p, receiver) {
            if (typeof p === 'string') {
                if (p === 'push') {
                    return function push(value) {
                        let result = target.push(value);
                        yArray.push([value]);
                        return result;
                    };
                } else if (p === 'unshift') {
                    return function unshift(value) {
                        let result = target.unshift(value);
                        yArray.unshift([value]);
                        return result;
                    };
                } else if (p === 'pop') {
                    return function pop() {
                        yArray.delete(yArray.length - 1, 1);
                        return target.pop();
                    };
                } else if (p === 'shift') {
                    return function shift() {
                        yArray.delete(0, 1);
                        return target.shift();
                    };
                } else if (Object.keys(target).includes(p)) {
                    let i = parseInt(p.toString(), 10);
                    return yArray.get(i);
                } else {
                    return Reflect.get(target, p, receiver);
                }
            } else {
                return Reflect.get(target, p, receiver);
            }
        },
        set(target, p, newValue, receiver) {
            if (typeof p === 'string') {
                if (Object.keys(target).includes(p)) {
                    target[p] = newValue;
                    let i = parseInt(p, 10);
                    yArray.delete(i, 1);
                    yArray.insert(i, [ newValue ]);
                    return true;
                } else {
                    return Reflect.set(target, p, receiver);
                }
            } else {
                return Reflect.set(target, p, receiver);
            }
        }
    });
}

/**
 * @param {YMap} yMap
 */
export function createProxyYMap(yMap) {
    return new Proxy({}, {
        get(target, p, receiver) {
            if (typeof p === 'string') {
                return yMap.get(p);
            } else {
                return Reflect.get(target, p, receiver);
            }
        },
        set(target, p, newValue, receiver) {
            if (typeof p === 'string') {
                target[p] = newValue;
                yMap.set(p, newValue);
                return true;
            } else {
                return Reflect.set(target, p, newValue, receiver);
            }
        },
        deleteProperty(target, p) {
            if (typeof p ===  'string') {
                delete target[p];
                yMap.delete(p);
                return true;
            } else {
                return Reflect.deleteProperty(target, p);
            }
        },
    });
}
