import { uuid } from '../../lib/util/uuid';

/**
 * @typedef {string} ViewId
 * @typedef {string} InvId
 *
 * @typedef View
 * @property {ViewId} viewId
 * @property {InvId} invId
 * @property {number} coordX
 * @property {number} coordY
 * @property {Array<string>} topics
 */

/**
 * Create a view.
 *
 * @param {ViewId} viewId
 * @param {InvId} invId
 * @param {number} coordX
 * @param {number} coordY
 * @param {Array<string>} topics
 * @returns {View}
 */
export function createView(viewId, invId, coordX, coordY, topics) {
  let view = {
    viewId,
    invId,
    coordX,
    coordY,
    topics,
  };
  return view;
}

/**
 * @param {View} other
 * @param {View} [dst]
 * @returns {View}
 */
export function copyView(other, dst = undefined) {
  let result = cloneView(other, dst);
  if (result.viewId === other.viewId) {
    result.viewId = uuid();
  }
  return result;
}

/**
 * @param {View} other
 * @param {View} [dst]
 * @param {object} [opts]
 * @returns {View}
 */
export function cloneView(other, dst = undefined, opts = {}) {
  const viewId = other.viewId || uuid();
  const invId = other.invId || '';
  const coordX = Number(other.coordX) || 1;
  const coordY = Number(other.coordY) || 1;
  const topics = [...other.topics] || [];
  if (!dst) {
    dst = createView(viewId, invId, coordX, coordY, topics);
  } else {
    dst.viewId = viewId;
    dst.invId = invId;
    dst.coordX = coordX;
    dst.coordY = coordY;
    dst.topics = topics;
  }
  return dst;
}
