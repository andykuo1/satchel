import { createInvViewInStore } from '../../stores';
import { registerView } from '../ViewRegistry';
import SocketSlot from '../slots/SocketSlot';
import Styles from './SocketBox.module.css';
import BoundedBox from './BoundedBox';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../../inv/View').View} View
 */

registerView('socket', SocketBox);

/**
 * @param {object} props 
 * @param {Store} props.store
 * @param {View} props.view
 */
export default function SocketBox({ store, view }) {
  return (
    <BoundedBox store={store} view={view}>
      <SocketSlot
        className={Styles.socket}
        store={store}
        view={view}
        slotIndex={0}
      />
    </BoundedBox>
  );
}

/**
 * @param {Store} store
 * @param {number} coordX
 * @param {number} coordY
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
