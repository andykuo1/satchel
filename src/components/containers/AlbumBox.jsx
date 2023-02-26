import { useState } from 'react';

import {
  countPagesRemaining,
  findFirstPageInvId,
  findLastPageInvId,
  findNextPageInvId,
  isInvPaged,
  setInvPaged,
} from '@/inv/metadata/Paged';
import { getInv, getView } from '@/inv/transfer/InvTransfer';
import { uuid } from '@/utils/uuid';

import {
  InvStore,
  ViewStore,
  createInvInStore,
  createInvViewInStore,
} from '../../stores';
import { registerView } from '../ViewRegistry';
import GridSlots from '../slots/GridSlots';
import PaginatedBox from './PaginatedBox';

/**
 * @typedef {import('@/stores').Store} Store
 * @typedef {import('@/inv/View').View} View
 */

registerView('album', AlbumBox);

/**
 *
 * @param {object} props
 * @param {Store} props.store
 * @param {View} props.view
 */
export default function AlbumBox({ store, view }) {
  const [pageIndex, setPageIndex] = useState(0);
  const inv = InvStore.useValue(store, view.invId);
  if (!isInvPaged(inv)) {
    throw new Error('Cannot render non-paged inv with album view.');
  }

  function nextPage(nextPageIndex) {
    let pageCount = countPagesRemaining(store, inv);
    console.log(nextPageIndex, pageCount);
    if (nextPageIndex > pageCount) {
      // createNextPageInAlbum(store, view.viewId);
      console.log(nextPageIndex, pageCount);
      nextPageIndex = pageCount;
      return;
    }
    let firstInvId = findFirstPageInvId(store, inv);
    let firstInv = getInv(store, firstInvId);
    let nextInvId = findNextPageInvId(store, firstInv, nextPageIndex);
    view.invId = nextInvId;
    ViewStore.dispatch(store, view.viewId);
    setPageIndex(nextPageIndex);
  }

  return (
    <PaginatedBox
      store={store}
      view={view}
      pageIndex={pageIndex}
      setPageIndex={nextPage}>
      <GridSlots store={store} view={view} />
    </PaginatedBox>
  );
}

export function createAlbumBoxInStore(store, coordX, coordY, size = 10) {
  let w = 6;
  let h = 6;
  let viewId = createInvViewInStore(
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
  let view = getView(store, viewId);
  let inv = getInv(store, view.invId);
  setInvPaged(inv, '', '', false);
}

function createNextPageInAlbum(store, viewId) {
  let view = getView(store, viewId);
  let inv = getInv(store, view.invId);
  let lastInvId = findLastPageInvId(store, inv);
  let w = 6;
  let h = 6;
  let nextInv = createInvInStore(store, uuid(), 'connected', w * h, w, h);
  setInvPaged(nextInv, lastInvId, '', false);
}
