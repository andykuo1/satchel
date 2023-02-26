import Styles from './StackBox.module.css';

import { createInvViewInStore, useStore } from '@/stores';
import { registerView } from '../ViewRegistry';
import BoundedBox from '../boxes/BoundedBox';
import SocketSlot from '../slots/SocketSlot';
import { getInv } from '@/inv/transfer/InvTransfer';
import { useState } from 'react';

import NavigateNext from '@material-symbols/svg-400/rounded/navigate_next.svg';
import NavigateBefore from '@material-symbols/svg-400/rounded/navigate_before.svg';
import IconButton from '../lib/IconButton';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../../inv/View').View} View
 * @typedef {import('../../inv/View').ViewId} ViewId
 * @typedef {import('../../inv/View').ViewUsage} ViewUsage
 */

registerView('stack', StackBox);

/**
 * @param {object} props
 * @param {Store} props.store
 * @param {View} props.view
 */
export default function StackBox({ store, view }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const inv = getInv(store, view.invId);
  const invLength = inv.length;
  let pips = [];
  for(let i = 0; i < invLength; ++i) {
    pips.push(i);
  }

  function onNext() {
    setCurrentIndex((i) => Math.min(invLength - 1, i + 1));
  }

  function onPrev() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }

  return (
    <BoundedBox store={store} view={view}>
      <div className={Styles.center}>
        <div className={Styles.socket}>
          <SocketSlot
            store={store}
            view={view}
            slotIndex={currentIndex}
          />
        </div>
        <div className={Styles.subtitle}>
          {pips.map((i) => <span key={i} className={[Styles.pip, currentIndex === i ? Styles.pipActive : Styles.pipInactive].join(' ')}>&#x2022;</span>)}
        </div>
        <IconButton Icon={NavigateNext} className={[Styles.navigate, Styles.navigateNext].join(' ')} onClick={onNext}/>
        <IconButton Icon={NavigateBefore} className={[Styles.navigate, Styles.navigatePrev].join(' ')} onClick={onPrev}/>
      </div>
    </BoundedBox>
  );
}

/**
 * @param {Store} store
 * @param {number} coordX
 * @param {number} coordY
 * @returns {ViewId}
 */
export function createStackBoxInStore(store, coordX, coordY) {
  return createInvViewInStore(
    store,
    coordX,
    coordY,
    2,
    2,
    'stack',
    'single',
    3,
    1,
    3,
    'all',
    ['workspace'],
  );
}
