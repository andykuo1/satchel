import { useState } from 'react';

import { createInvViewInStore } from '../../stores';
import { registerView } from '../ViewRegistry';
import ContainerBox from '../container/ContainerBox';
import GridSlots from '../slots/GridSlots';
import SocketSlot from '../slots/SocketSlot';
import styles from './AlbumBox.module.css';
import PaginatedBox from './PaginatedBox';

registerView('album', AlbumBox);

export default function AlbumBox({ store, view }) {
  const [pageIndex, setPageIndex] = useState(0);
  return (
    <PaginatedBox
      store={store}
      view={view}
      pageIndex={pageIndex}
      setPageIndex={setPageIndex}>
      <GridSlots store={store} view={view} />
    </PaginatedBox>
  );
}

export function createAlbumBoxInStore(store, coordX, coordY, size = 10) {
  let w = 6;
  let h = 6;
  return createInvViewInStore(
    store,
    coordX,
    coordY,
    6,
    7,
    'album',
    'connected',
    w * h,
    w,
    h,
    'all',
    ['workspace'],
  );
}
