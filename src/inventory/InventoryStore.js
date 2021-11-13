import { uuid } from '../util/uuid.js';

/**
 * @typedef {object} InventoryStore
 */

let GLOBAL_STORE = createInventoryStore();

export function createInventoryStore() {
  return {
    data: {
      item: {},
      inventory: {},
    },
    listeners: {
      item: {},
      inventory: {},
      container: {},
    },
  };
}

/**
 * @param store
 */
export function setInventoryStore(store) {
  GLOBAL_STORE = store;
}

/**
 * @param previousStore
 * @param nextStore
 */
export function resetInventoryStore(previousStore, nextStore) {
  const previousItemList = Object.keys(previousStore.data.item);
  const previousInventoryList = Object.keys(previousStore.data.inventory);
  const nextItemList = Object.keys(nextStore.data.item);
  const nextInventoryList = Object.keys(nextStore.data.inventory);
  // Copy data over
  previousStore.data.item = { ...nextStore.data.item };
  previousStore.data.inventory = { ...nextStore.data.inventory };

  // Dispatch all events
  dispatchInventoryListChange(previousStore);
  const visitedItems = new Set();
  const visitedInventories = new Set();
  // Dispatch for old objects
  for (const itemId of previousItemList) {
    visitedItems.add(itemId);
    dispatchItemChange(previousStore, itemId);
  }
  for (const invName of previousInventoryList) {
    visitedInventories.add(invName);
    dispatchInventoryChange(previousStore, invName);
  }
  // Dispatch for new objects
  for (const itemId of nextItemList) {
    if (!visitedItems.has(itemId)) {
      dispatchItemChange(previousStore, itemId);
    }
  }
  for (const inventoryId of nextInventoryList) {
    if (!visitedInventories.has(inventoryId)) {
      dispatchInventoryChange(previousStore, inventoryId);
    }
  }
}

export function getInventoryStore() {
  return GLOBAL_STORE;
}

/**
 * @typedef {string} InventoryId
 * @typedef {string} ItemId
 * @typedef {'grid'|'socket'} InventoryType
 *
 * @typedef Inventory
 * @property {string} name
 * @property {InventoryType} type
 * @property {Array<ItemId>} slots
 * @property {number} width
 * @property {number} height
 */

/**
 * @param {InventoryStore} store
 * @param {string} inventoryId
 * @param {InventoryType} inventoryType
 * @param {number} inventoryWidth
 * @param {number} inventoryHeight
 * @returns {Inventory}
 */
export function createInventory(
  store,
  inventoryId = uuid(),
  inventoryType = 'grid',
  inventoryWidth = 1,
  inventoryHeight = 1
) {
  const inventory = {
    name: inventoryId,
    slots: new Array(inventoryWidth * inventoryHeight),
    width: inventoryWidth,
    height: inventoryHeight,
    type: inventoryType,
  };
  store.data.inventory[inventoryId] = inventory;
  dispatchInventoryListChange(store);
  dispatchInventoryChange(store, inventoryId);
  return inventory;
}

/**
 * @param store
 * @param inventoryId
 */
export function deleteInventory(store, inventoryId) {
  if (inventoryId in store.data.inventory) {
    delete store.data.inventory[inventoryId];
    dispatchInventoryListChange(store);
    dispatchInventoryChange(store, inventoryId);
  }
}

/**
 * @param store
 * @param inventoryId
 */
export function getInventory(store, inventoryId) {
  return store.data.inventory[inventoryId] || null;
}

/**
 * @param store
 * @param inventoryId
 * @param type
 */
export function changeInventoryType(store, inventoryId, type) {
  const inventory = getInventory(store, inventoryId);
  if (type !== inventory.type) {
    inventory.type = type;
    dispatchInventoryChange(store, inventoryId);
  }
}

/**
 * @param store
 * @param inventoryId
 * @param width
 * @param height
 */
export function changeInventorySize(store, inventoryId, width, height) {
  const inventory = getInventory(store, inventoryId);
  if (width !== inventory.width || height !== inventory.height) {
    inventory.width = width;
    inventory.height = height;
    dispatchInventoryChange(store, inventoryId);
  }
}

/**
 * @param store
 * @param inventoryId
 */
export function dispatchInventoryChange(store, inventoryId) {
  dispatchInventoryEvent(store, 'inventory', inventoryId);
}

/**
 * @param store
 * @param inventoryId
 * @param callback
 */
export function addInventoryChangeListener(store, inventoryId, callback) {
  addInventoryEventListener(store, 'inventory', inventoryId, callback);
}

/**
 * @param store
 * @param inventoryId
 * @param callback
 */
export function removeInventoryChangeListener(store, inventoryId, callback) {
  removeInventoryEventListener(store, 'inventory', inventoryId, callback);
}

/**
 * @param store
 */
export function dispatchInventoryListChange(store) {
  dispatchInventoryEvent(store, 'container', 'all');
}

/**
 * @param store
 * @param callback
 */
export function addInventoryListChangeListener(store, callback) {
  addInventoryEventListener(store, 'container', 'all', callback);
}

/**
 * @param store
 * @param callback
 */
export function removeInventoryListChangeListener(store, callback) {
  removeInventoryEventListener(store, 'container', 'all', callback);
}

/**
 * @param store
 */
export function getInventoryList(store) {
  return Object.values(store.data.inventory);
}

/**
 * @typedef Item
 * @property {ItemId} itemId
 * @property {number} width
 * @property {number} height
 * @property {string} imgSrc
 * @property {string} displayName
 * @property {string} description
 * @property {object} metadata
 */

/**
 * @param store
 * @param itemId
 */
export function resolveItem(store, itemId, state = undefined) {
  if (isItem(store, itemId)) {
    return getItem(store, itemId);
  }
  return createItem(store, state, itemId);
}

/**
 * @param store
 * @param state
 * @param {ItemId} itemId
 * @returns {Item}
 */
export function createItem(store, state, itemId = uuid()) {
  const item = {
    itemId,
    width: 1,
    height: 1,
    imgSrc: '',
    displayName: 'Item',
    description: 'A mundane item.',
    metadata: {},
    ...state,
  };
  store.data.item[itemId] = item;
  return item;
}

/**
 * @param store
 * @param itemId
 */
export function deleteItem(store, itemId) {
  delete store.data.item[itemId];
}

/**
 * @param store
 * @param itemId
 */
export function isItem(store, itemId) {
  return Boolean(store.data.item[itemId]);
}

/**
 * @param store
 * @param itemId
 */
export function getItem(store, itemId) {
  return store.data.item[itemId];
}

/**
 * @param store
 */
export function getItems(store) {
  return Object.values(store.data.item);
}

/**
 * @param store
 * @param itemId
 * @param state
 */
export function updateItem(store, itemId, state) {
  const item = store.data.item[itemId];
  if (!item) {
    throw new Error('Cannot update null item.');
  }

  store.data.item[itemId] = {
    ...item,
    ...state,
  };
  dispatchItemChange(store, itemId);
}

/**
 * @param store
 * @param itemId
 */
export function dispatchItemChange(store, itemId) {
  dispatchInventoryEvent(store, 'item', itemId);
}

/**
 * @param store
 * @param itemId
 * @param callback
 */
export function addItemChangeListener(store, itemId, callback) {
  addInventoryEventListener(store, 'item', itemId, callback);
}

/**
 * @param store
 * @param itemId
 * @param callback
 */
export function removeItemChangeListener(store, itemId, callback) {
  removeInventoryEventListener(store, 'item', itemId, callback);
}

/**
 * @param store
 * @param event
 * @param key
 * @param callback
 */
function addInventoryEventListener(store, event, key, callback) {
  if (!(event in store.listeners)) {
    throw new Error(
      `Cannot manage listener for unknown inventory event '${event}'.`
    );
  }

  let listeners = store.listeners[event][key];
  if (!listeners) {
    listeners = [];
    store.listeners[event][key] = listeners;
  }

  listeners.push(callback);
}

/**
 * @param store
 * @param event
 * @param key
 * @param callback
 */
function removeInventoryEventListener(store, event, key, callback) {
  if (!(event in store.listeners)) {
    throw new Error(
      `Cannot manage listener for unknown inventory event '${event}'.`
    );
  }

  const listeners = store.listeners[event][key];
  if (listeners) {
    const i = listeners.indexOf(callback);
    if (i >= 0) {
      listeners.splice(i, 1);
    }
  }
}

/**
 * @param store
 * @param event
 * @param key
 */
function dispatchInventoryEvent(store, event, key) {
  if (!(event in store.listeners)) {
    throw new Error(
      `Cannot dispatch event for unknown inventory event '${event}'.`
    );
  }

  const listeners = store.listeners[event][key];
  if (listeners) {
    for (const listener of listeners) {
      listener.call(undefined, store, key);
    }
  }
}
