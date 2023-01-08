import { Storeable } from '../../lib/store/Storeable';

/** @template Key, Value */
export class ValueStoreable extends Storeable {
    /**
     * @param {(store: Store) => Record<Key, Value>} getData 
     * @param {(store: Store) => Record<Key, Array<Function>>} getListeners
     */
    constructor(getData, getListeners) {
        this._data = getData;
        this._listeners = getListeners;
    }

    /**
     * @override
     * @param {Store} store 
     * @param {Key} key
     * @returns {Value}
     */
    get(store, key) {
        return this._data(store)[key];
    }

    /**
     * @override
     * @param {Store} store 
     * @param {Key} key
     */
    has(store, key) {
        return key in this._data(store);
    }

    /**
     * @override
     * @param {Store} store 
     * @param {Key} key
     */
    listeners(store, key) {
        let listeners = this._listeners(store);
        if (key in listeners) {
            return listeners[key];
        }
        let result = [];
        listeners[key] = result;
        return result;
    }

    /**
     * @override
     * @param {Store} store 
     * @param {Key} key 
     */
    dispatch(store, key) {
        for(let listener of this.listeners(store, key)) {
            listener();
        }
    }

    /**
     * @override
     * @param {Store} store 
     * @param {Key} key
     * @returns {Value}
     */
    use(store, key) {
        const value = this.get(store, key);
        const update = useForceUpdate();
        useEffect(() => {
            let listeners = this.listeners(store, key);
            listeners.push(update);
            return () => {
                let i = listeners.indexOf(update);
                if (i >= 0) {
                    listeners.splice(i, 1);
                }
            };
        }, [key]);
        return value;
    }
}
