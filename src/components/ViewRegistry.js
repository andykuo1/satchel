/** @typedef {import('../stores/inv/View').ViewType} ViewType */

/**
 * @typedef {import('react').FC<{ store: import('../stores').Store, view: import('../stores/inv/View').View }>} ViewRenderer
 */

/** @type {Record<string, ViewRenderer>} */
const RENDERERS = {};

/**
 *
 * @param {ViewType} viewType
 * @param {ViewRenderer} renderer
 */
export function registerView(viewType, renderer) {
  RENDERERS[viewType] = renderer;
}

/**
 * @param {ViewType} viewType
 * @returns {ViewRenderer}
 */
export function getViewRenderer(viewType) {
  return RENDERERS[viewType];
}
