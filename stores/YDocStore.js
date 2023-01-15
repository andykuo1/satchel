/**
 * @typedef {import('./StoreContext').Store} Store
 */

export const YDocStore = {
    /** @param {Store} store */
    get(store) {
        return store.ydoc;
    }
};
