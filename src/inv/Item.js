import { uuid } from '@/utils/uuid';

/**
 * @typedef {string} ItemId
 *
 * @typedef Item
 * @property {ItemId} itemId
 * @property {number} width
 * @property {number} height
 * @property {string} imgSrc
 * @property {string} displayName
 * @property {string} description
 * @property {number} stackSize
 * @property {string} background
 * @property {object} metadata
 */

/**
 * @param {ItemId} itemId
 * @returns {Item}
 */
export function createItem(itemId) {
  // NOTE: Order matters! New properties should always be added at the end.
  let item = {
    itemId,
    width: 1,
    height: 1,
    stackSize: -1,
    imgSrc: '',
    displayName: '',
    description: '',
    background: '',
    metadata: {},
  };
  return item;
}

/**
 * @param {Item} other
 * @param {Item} [dst]
 * @returns {Item}
 */
export function copyItem(other, dst = undefined) {
  let result = cloneItem(other, dst);
  if (result.itemId === other.itemId) {
    result.itemId = uuid();
  }
  return result;
}

/**
 * @param {Item} item
 * @param {Item} other
 */
export function compareItem(item, other) {
  if (item.displayName !== other.displayName) {
    return item.displayName.localeCompare(other.displayName);
  }
  if (item.background !== other.background) {
    return item.background.localeCompare(other.background);
  }
  if (item.imgSrc !== other.imgSrc) {
    return item.background.localeCompare(other.background);
  }
  if (item.width !== other.width) {
    return item.width - other.width;
  }
  if (item.height !== other.height) {
    return item.height - other.height;
  }
  if (item.description !== other.description) {
    return item.description.localeCompare(other.description);
  }
  if (item.stackSize !== other.stackSize) {
    return item.stackSize - other.stackSize;
  }
  if (item.itemId !== other.itemId) {
    return item.itemId.localeCompare(other.itemId);
  }
  return 0;
}

/**
 * @param {Item} other
 * @param {Item} [dst]
 * @returns {Item}
 */
export function cloneItem(other, dst = undefined) {
  const itemId = other.itemId;
  if (!dst) {
    dst = createItem(itemId || uuid());
  } else if (itemId) {
    dst.itemId = itemId;
  } else if (!dst.itemId) {
    dst.itemId = uuid();
  }
  if (typeof other.width === 'number') {
    dst.width = other.width;
  }
  if (typeof other.height === 'number') {
    dst.height = other.height;
  }
  if (typeof other.imgSrc === 'string') {
    dst.imgSrc = other.imgSrc;
  }
  if (typeof other.displayName === 'string') {
    dst.displayName = other.displayName;
  }
  if (typeof other.description === 'string') {
    dst.description = other.description;
  }
  if (typeof other.stackSize === 'number') {
    dst.stackSize = other.stackSize;
  }
  if (typeof other.background === 'string') {
    dst.background = other.background;
  }
  if (typeof other.metadata === 'object') {
    try {
      dst.metadata = JSON.parse(JSON.stringify(other.metadata));
    } catch (e) {
      dst.metadata = {};
    }
  }
  return dst;
}

export class ItemBuilder {
  static from(baseItem) {
    return new ItemBuilder().fromItem(baseItem);
  }

  constructor() {
    /** @private */
    this._itemId = null;
    /** @private */
    this._width = 1;
    /** @private */
    this._height = 1;
    /** @private */
    this._imageSrc = '';
    /** @private */
    this._displayName = '';
    /** @private */
    this._description = '';
    /** @private */
    this._stackSize = -1;
    /** @private */
    this._background = '';
    /** @private */
    this._metadata = {};
  }

  /**
   * @param {ItemBuilder} itemBuilder
   */
  fromItemBuilder(itemBuilder) {
    this._itemId = itemBuilder._itemId;
    this._width = itemBuilder._width;
    this._height = itemBuilder._height;
    this._imageSrc = itemBuilder._imageSrc;
    this._displayName = itemBuilder._displayName;
    this._description = itemBuilder._description;
    this._stackSize = itemBuilder._stackSize;
    this._background = itemBuilder._background;
    this._metadata = JSON.parse(JSON.stringify(itemBuilder._metadata));
    return this;
  }

  /**
   * @param {Item} item
   */
  fromItem(item) {
    let newItem = cloneItem(item);
    this._itemId = newItem.itemId;
    this._width = newItem.width;
    this._height = newItem.height;
    this._imageSrc = newItem.imgSrc;
    this._displayName = newItem.displayName;
    this._description = newItem.description;
    this._stackSize = newItem.stackSize;
    this._background = newItem.background;
    this._metadata = newItem.metadata;
    return this;
  }

  fromDefault() {
    this._itemId = null;
    this._width = 1;
    this._height = 1;
    this._imageSrc = '/images/potion.png';
    this._displayName = '';
    this._description = '';
    this._stackSize = -1;
    this._background = '';
    this._metadata = {};
    return this;
  }

  /**
   * @param {ItemId} itemId
   */
  itemId(itemId) {
    this._itemId = itemId;
    return this;
  }

  /**
   * @param {number} width
   */
  width(width) {
    this._width = width;
    return this;
  }

  /**
   * @param {number} height
   */
  height(height) {
    this._height = height;
    return this;
  }

  /**
   * @param {string} src
   */
  imageSrc(src) {
    this._imageSrc = src;
    return this;
  }

  /**
   * @param {string} displayName
   */
  displayName(displayName) {
    this._displayName = displayName;
    return this;
  }

  /**
   * @param {string} description
   */
  description(description) {
    this._description = description;
    return this;
  }

  /**
   * @param {number} stackSize
   */
  stackSize(stackSize) {
    this._stackSize = stackSize;
    return this;
  }

  /**
   * @param {string} background
   */
  background(background) {
    this._background = background;
    return this;
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  metadata(key, value) {
    this._metadata[key] = value;
    return this;
  }

  /**
   * @returns {Item}
   */
  build() {
    let itemId = this._itemId !== null ? this._itemId : uuid();
    if (!itemId) {
      throw new Error(`Invalid item id '${itemId}'.`);
    }
    let width = Number(this._width);
    let height = Number(this._height);
    if (!Number.isFinite(width) || !Number.isSafeInteger(width) || width <= 0) {
      throw new Error(
        'Invalid item width - must be a finite positive integer.',
      );
    }
    if (
      !Number.isFinite(height) ||
      !Number.isSafeInteger(height) ||
      height <= 0
    ) {
      throw new Error(
        'Invalid item height - must be a finite positive integer.',
      );
    }
    let imgSrc = String(this._imageSrc.trim());
    let displayName = String(this._displayName.trim());
    let description = String(this._description);
    let stackSize = Number(this._stackSize);
    let background = String(this._background);
    let metadata;
    try {
      metadata = JSON.parse(JSON.stringify(this._metadata));
    } catch (e) {
      throw new Error(`Invalid json for metadata - ${e}`);
    }
    let item = createItem(itemId);
    item.width = width;
    item.height = height;
    item.imgSrc = imgSrc;
    item.displayName = displayName;
    item.description = description;
    item.stackSize = stackSize;
    item.background = background;
    item.metadata = metadata;
    return item;
  }
}
