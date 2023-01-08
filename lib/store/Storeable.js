/**
 * @template T, V
 */
export class Storeable {
    /**
     * @abstract
     * @param {T} store
     * @returns {V}
     */
    get(store) {}

    /**
     * @abstract
     * @param {T} store
     * @returns {boolean}
     */
    has(store) {}

    /**
     * @abstract
     * @param {T} store
     * @returns {Array<Fucntion>}
     */
    listeners(store) {}

    /**
     * @abstract
     * @param {T} store
     */
    dispatch(store) {}

    /**
     * @abstract
     * @param {T} store
     * @returns {V}
     */
    use(store) {}
}
