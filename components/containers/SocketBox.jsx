import styles from './SocketBox.module.css';
import { createInvInStore, createViewInStore } from '../../stores';
import { uuid } from '../../lib/util/uuid';
import ContainerBox from '../container/ContainerBox';
import SocketSlot from '../slots/SocketSlot';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../../stores/inv/View').ViewId} ViewId
 * @typedef {import('../../stores/inv/View').ViewUsage} ViewUsage
 */

export default function SocketBox({ store, view }) {
    return (
        <ContainerBox store={store} view={view}>
            <SocketSlot className={styles.socket} store={store} view={view} slotIndex={0}/>
        </ContainerBox>
    );
}

/**
 * @param {Store} store 
 * @param {number} coordX
 * @param {number} coordY
 * @param {ViewUsage} [usage]
 * @returns {ViewId}
 */
export function createSocketBoxInStore(store, coordX, coordY, usage = 'all') {
    let invId = uuid();
    let viewId = uuid();
    createInvInStore(store, invId, 'single', 1, 1, 1);
    createViewInStore(store, viewId, invId, coordX, coordY, ['workspace'], usage, 'socket', 1, 1);
    return viewId;
}
