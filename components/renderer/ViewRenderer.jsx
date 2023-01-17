/**
 * @param {Element} element
 */
export function getViewIdForElement(element) {
  if (element.hasAttribute('data-view-id')) {
    return element.getAttribute('data-view-id');
  } else {
    throw new Error('Cannot get view id for non-view element.');
  }
}

/**
 * @param {Element} element
 * @returns {HTMLElement}
 */
export function getClosestViewForElement(element) {
  return element.closest('[data-view-id]');
}
