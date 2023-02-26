import { createInvViewInStore } from '../../stores';
import { registerView } from '../ViewRegistry';
import ContainerBox from '../container/ContainerBox';
import SocketSlot from '../slots/SocketSlot';
import Styles from './SocketBox.module.css';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../../inv/View').ViewId} ViewId
 * @typedef {import('../../inv/View').ViewUsage} ViewUsage
 */

registerView('socket', SocketBox);

export default function SocketBox({ store, view }) {
  return (
    <ContainerBox store={store} view={view}>
      <SocketSlot
        className={Styles.socket}
        store={store}
        view={view}
        slotIndex={0}
      />
    </ContainerBox>
  );
}

/**
 * @param {Store} store
 * @param {number} coordX
 * @param {number} coordY
 * @returns {ViewId}
 */
export function createSocketBoxInStore(store, coordX, coordY) {
  return createInvViewInStore(
    store,
    coordX,
    coordY,
    1,
    1,
    'socket',
    'single',
    1,
    1,
    1,
    'all',
    ['workspace'],
  );
}
