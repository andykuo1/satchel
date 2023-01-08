import { uuid } from '../../lib/util/uuid';

/**
 * @typedef {string} ViewId
 * @typedef {string} InvId
 * @typedef {'all'|'readonly'|'inputonly'|'outputonly'|'copy'} ViewUsage
 * @typedef {'cursor'|'grid'|'socket'} ViewType
 *
 * @typedef View
 * @property {ViewId} viewId
 * @property {InvId} invId
 * @property {number} coordX
 * @property {number} coordY
 * @property {Array<string>} topics
 * @property {ViewUsage} usage
 * @property {ViewType} type
 */

/**
 * Create a view.
 *
 * @param {ViewId} viewId
 * @param {InvId} invId
 * @param {number} coordX
 * @param {number} coordY
 * @param {Array<string>} topics
 * @param {ViewUsage} usage
 * @param {ViewType} type
 * @returns {View}
 */
export function createView(viewId, invId, coordX, coordY, topics, usage, type) {
  let view = {
    viewId,
    invId,
    coordX,
    coordY,
    topics,
    usage,
    type,
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
  const usage = other.usage || 'all';
  const type = other.type || 'grid';
  if (!dst) {
    dst = createView(viewId, invId, coordX, coordY, topics, usage, type);
  } else {
    dst.viewId = viewId;
    dst.invId = invId;
    dst.coordX = coordX;
    dst.coordY = coordY;
    dst.topics = topics;
    dst.usage = usage;
    dst.type = type;
  }
  return dst;
}

/**
 * @param {View} view
 */
export function isOutputDisabled(view) {
  return view.usage === 'inputonly';
}

/**
 * @param {View} view
 */
export function isInputDisabled(view) {
  return view.usage === 'outputonly' || view.usage === 'copy';
}

/**
 * @param {View} view
 */
export function isOutputCopied(view) {
  return view.usage === 'copy';
}
