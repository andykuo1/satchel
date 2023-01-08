import { createContext, useContext } from 'react';

/**
 * @template T
 * @param {T} value
 */
export function createStoreContext(value) {
    const StoreContext = createContext(null);
    return {
        StoreContext,
        StoreProvider({ children }) {
            return (
                <StoreContext.Provider value={value}>
                    {children}
                </StoreContext.Provider>
            )
        },
        /** @returns {T} */
        useStore() {
            const store = useContext(StoreContext);
            if (!store) {
                throw new Error('Missing root store <StoreProvider>!');
            }
            return store;
        }
    };
}
