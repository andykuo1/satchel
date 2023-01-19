import { useEffect } from 'react';

import { InvStore, ViewStore, createInvViewInStore } from '../../stores';
import { isInvEmpty } from '../../inv/transfer/InvTransfer';
import { registerView } from '../ViewRegistry';
import InvBox from './InvBox';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../../inv/View').ViewId} ViewId
 * @typedef {import('../../inv/View').ViewUsage} ViewUsage
 */

registerView('ground', GroundBox);

export default function GroundBox({ store, view }) {
  const inv = InvStore.useValue(store, view.invId);
  useEffect(() => {
    if (isInvEmpty(store, inv.invId)) {
      ViewStore.delete(store, view.viewId);
      InvStore.delete(store, inv.invId);
    }
  });
  return <InvBox store={store} view={view} />;
}

/**
 * @param {Store} store
 * @param {number} width
 * @param {number} height
 * @param {number} coordX
 * @param {number} coordY
 * @returns {ViewId}
 */
export function createGroundBoxInStore(store, width, height, coordX, coordY) {
  return createInvViewInStore(
    store,
    coordX,
    coordY,
    width,
    height,
    'ground',
    'connected',
    width * height,
    width,
    height,
    'all',
    ['workspace'],
  );
}
