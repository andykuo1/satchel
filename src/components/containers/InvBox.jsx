import { createInvViewInStore } from '../../stores';
import { registerView } from '../ViewRegistry';
import ContainerBox from '../container/ContainerBox';
import GridSlots from '../slots/GridSlots';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../../inv/View').ViewId} ViewId
 * @typedef {import('../../inv/View').ViewUsage} ViewUsage
 */

registerView('grid', InvBox);

export default function InvBox({ store, view }) {
  return (
    <ContainerBox store={store} view={view}>
      <GridSlots store={store} view={view} />
    </ContainerBox>
  );
}

/**
 * @param {Store} store
 * @param {number} width
 * @param {number} height
 * @param {number} coordX
 * @param {number} coordY
 * @returns {ViewId}
 */
export function createInvBoxInStore(store, width, height, coordX, coordY) {
  return createInvViewInStore(
    store,
    coordX,
    coordY,
    width,
    height,
    'grid',
    'connected',
    width * height,
    width,
    height,
    'all',
    ['workspace'],
  );
}
