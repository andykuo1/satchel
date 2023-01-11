import GridViewRenderer from './views/GridViewRenderer';
import SocketViewRenderer from './views/SocketViewRenderer';
import CursorViewRenderer from './views/CursorViewRenderer';
import ListViewRenderer from './views/ListViewRenderer';

/**
 * @typedef {import('../store').Store} Store
 * @typedef {import('../inv/View').View} View
 * @typedef {import('../inv/Inv').Inv} Inv
 * @typedef {import('../inv/Item').Item} Item
 */

/**
 * @param {object} props
 * @param {Store} props.store
 * @param {View} props.view
 * @param {Inv} props.inv
 * @param {object} props.containerProps
 * @param {object} props.itemProps
 * @param {import('react').ReactNode} props.children
 */
export default function ViewRenderer({ store, view, inv, containerProps, itemProps, children }) {
  const containerPropsWithViewId = {
    'data-view-id': view.viewId,
    ...containerProps,
  };
  switch (view.type) {
    case 'cursor':
      return (
        <CursorViewRenderer store={store} view={view} inv={inv} containerProps={containerPropsWithViewId} itemProps={itemProps}>
          {children}
        </CursorViewRenderer>
      );
    case 'grid':
      return (
        <GridViewRenderer store={store} view={view} inv={inv} shadow="out" containerProps={containerPropsWithViewId} itemProps={itemProps}>
          {children}
        </GridViewRenderer>
      );
    case 'ground':
      return (
        <GridViewRenderer store={store} view={view} inv={inv} shadow="one" containerProps={containerPropsWithViewId} itemProps={itemProps}>
          {children}
        </GridViewRenderer>
      );
    case 'socket':
      return (
        <SocketViewRenderer store={store} view={view} inv={inv} containerProps={containerPropsWithViewId} itemProps={itemProps}>
          {children}
        </SocketViewRenderer>
      );
    case 'list':
      return (
        <ListViewRenderer store={store} view={view} inv={inv} containerProps={containerPropsWithViewId} itemProps={itemProps}>
          {children}
        </ListViewRenderer>
      );
  }
}

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
