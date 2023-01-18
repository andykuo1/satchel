import { uuid } from '../../utils/uuid';

/**
 * @typedef {string} ViewId
 * @typedef {string} InvId
 * @typedef {'all'|'readonly'|'inputonly'|'outputonly'|'copy'} ViewUsage
 * @typedef {'cursor'|'grid'|'socket'|'ground'|'list'|'foundry'|'timer'|'connectorIn'|'connectorOut'|'crafting'} ViewType
 *
 * @typedef View
 * @property {ViewId} viewId
 * @property {ViewType} type
 * @property {ViewUsage} usage
 * @property {InvId} invId
 * @property {number} coordX
 * @property {number} coordY
 * @property {number} width
 * @property {number} height
 * @property {Array<string>} topics
 */

/**
 * Create a view.
 *
 * @param {ViewId} viewId
 * @param {InvId} invId
 * @param {ViewType} type
 * @param {ViewUsage} usage
 * @param {Array<string>} topics
 * @returns {View}
 */
export function createView(viewId, invId, type, usage, topics) {
  let view = {
    viewId,
    type,
    usage,
    invId,
    coordX: 0,
    coordY: 0,
    width: 1,
    height: 1,
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
  const type = other.type || 'grid';
  const usage = other.usage || 'all';
  const invId = other.invId || '';
  const coordX = Number(other.coordX) || 0;
  const coordY = Number(other.coordY) || 0;
  const width = Number(other.width) || 1;
  const height = Number(other.height) || 1;
  const topics = [...other.topics] || [];
  if (!dst) {
    dst = createView(viewId, invId, type, usage, topics);
    dst.coordX = coordX;
    dst.coordY = coordY;
    dst.width = width;
    dst.height = height;
  } else {
    dst.viewId = viewId;
    dst.type = type;
    dst.usage = usage;
    dst.invId = invId;
    dst.coordX = coordX;
    dst.coordY = coordY;
    dst.width = width;
    dst.height = height;
    dst.topics = topics;
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
