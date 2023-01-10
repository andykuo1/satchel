
/**
 * @typedef {import('./StoreContext').Store} Store
 */

export const CursorStore = {
    /** @param {Store} store */
    get(store) {
        return store.cursor;
    }
};
