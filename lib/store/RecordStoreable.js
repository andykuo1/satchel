import { useEffect } from 'react';
import { useForceUpdate } from '../hooks/UseForceUpdate';

const KEYS_LISTENERS = Symbol('keys');

/**
 * @template {object} Store
 * @template {string} Key
 * @template {any} Value
 */
export class RecordStoreable {
    /**
     * @param {(store: Store) => Record<Key, Value>} getDataFromStore 
     * @param {(store: Store) => Record<Key, Array<Function>>} getListenersFromStore
     */
    constructor(getDataFromStore, getListenersFromStore) {
        /** @protected */
        this._dataFromStore = getDataFromStore;
        /** @protected */
        this._listenersFromStore = getListenersFromStore;
    }

    /**
     * @param {Store} store 
     * @param {Key} key
     * @returns {Value}
     */
    get(store, key) {
        return this._dataFromStore(store)[key];
    }

    /**
     * @param {Store} store 
     */
    keys(store) {
        return Object.keys(this._dataFromStore(store));
    }

    /**
     * @param {Store} store 
     * @param {Key} key
     */
    has(store, key) {
        return key in this._dataFromStore(store);
    }

    /**
     * @param {Store} store 
     */
    count(store) {
        return this.keys(store).length;
    }

    /**
     * @param {Store} store 
     * @param {Key} key 
     * @param {Value} value 
     */
    put(store, key, value) {
        this._dataFromStore(store)[key] = value;

        this.dispatch(store, key);
        // @ts-ignore
        this.dispatch(store, KEYS_LISTENERS);
    }

    /**
     * @param {Store} store 
     * @param {Key} key 
     */
    delete(store, key) {
        delete this._dataFromStore(store)[key];

        // @ts-ignore
        this.dispatch(store, KEYS_LISTENERS);
        this.dispatch(store, key);
    }

    /**
     * @param {Store} store 
     */
    clear(store) {
        let data = this._dataFromStore(store);
        let keys = /** @type {Array<Key>} */ (Object.keys(data));

        for(let key of keys) {
            delete data[key];
        }

        // @ts-ignore
        this.dispatch(store, KEYS_LISTENERS);
        for(let key of keys) {
            this.dispatch(store, key);
        }
    }

    /**
     * @param {Store} store 
     * @param {Key} key 
     */
    dispatch(store, key) {
        for(let listener of resolveListeners(this._listenersFromStore(store), key)) {
            listener();
        }
    }

    /**
     * @param {Store} store 
     * @param {Key} key
     * @returns {Value}
     */
    useValue(store, key) {
        const value = this.get(store, key);
        const update = useForceUpdate();
        useEffect(() => {
            if (value !== this.get(store, key)) {
                update();
                return;
            }
            let listeners = resolveListeners(this._listenersFromStore(store), key);
            listeners.push(update);
            return () => {
                let i = listeners.indexOf(update);
                if (i >= 0) {
                    listeners.splice(i, 1);
                }
            };
        }, [store, key]);
        return value;
    }

    /**
     * @param {Store} store
     */
    useKeys(store) {
        const keys = this.keys(store);
        const update = useForceUpdate();
        useEffect(() => {
            if (keys !== this.keys(store)) {
                update();
                return;
            }
            let listeners = resolveKeysListeners(this._listenersFromStore(store));
            listeners.push(update);
            return () => {
                let i = listeners.indexOf(update);
                if (i >= 0) {
                    listeners.splice(i, 1);
                }
            };
        }, [store]);
        return keys;
    }
}

/**
 * @template {string} Key
 * @param {Record<Key, Array<Function>>} listeners 
 * @param {Key} key 
 * @returns {Array<Function>}
 */
function resolveListeners(listeners, key) {
    if (key in listeners) {
        return listeners[key];
    }
    let result = [];
    listeners[key] = result;
    return result;
}

/**
 * @template {string} Key
 * @param {Record<Key, Array<Function>>} listeners 
 * @returns {Array<Function>}
 */
function resolveKeysListeners(listeners) {
    // @ts-ignore
    return resolveListeners(listeners, KEYS_LISTENERS);
}
