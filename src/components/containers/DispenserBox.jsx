import { useState } from 'react';

import { getInv } from '@/inv/transfer/InvTransfer';

import { createInvViewInStore } from '../../stores';
import { registerView } from '../ViewRegistry';
import ContainerBox from '../container/ContainerBox';
import SocketSlot from '../slots/SocketSlot';
import Styles from './DispenserBox.module.css';

registerView('dispenser', DispenserBox);

export default function DispenserBox({ store, view }) {
  let [page, setPage] = useState(0);
  let inv = getInv(store, view.invId);
  let max = inv.length;
  return (
    <ContainerBox store={store} view={view}>
      <fieldset className={Styles.container}>
        <SocketSlot store={store} view={view} slotIndex={page} />
        <button
          disabled={page <= 0}
          onClick={() => {
            setPage((p) => p - 1);
          }}>
          {'<'}
        </button>
        <button
          disabled={page >= max}
          onClick={() => {
            setPage((p) => p + 1);
          }}>
          {'>'}
        </button>
      </fieldset>
    </ContainerBox>
  );
}

export function createDispenserBoxInStore(store, coordX, coordY) {
  return createInvViewInStore(
    store,
    coordX,
    coordY,
    5,
    5,
    'dispenser',
    'single',
    9,
    3,
    3,
    'all',
    ['workspace'],
  );
}
