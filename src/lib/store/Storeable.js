/**
 * @template T, V
 */
export class Storeable {
  /**
   * @abstract
   * @param {T} store
   * @returns {V}
   */
  get(store) {
    throw new Error('Unsupported operation.');
  }

  /**
   * @abstract
   * @param {T} store
   * @returns {boolean}
   */
  has(store) {
    throw new Error('Unsupported operation.');
  }

  /**
   * @abstract
   * @param {T} store
   * @returns {Array<Function>}
   */
  listeners(store) {
    throw new Error('Unsupported operation.');
  }

  /**
   * @abstract
   * @param {T} store
   */
  dispatch(store) {
    throw new Error('Unsupported operation.');
  }

  /**
   * @abstract
   * @param {T} store
   * @returns {V}
   */
  use(store) {
    throw new Error('Unsupported operation.');
  }
}
