/**
 * @typedef {import('@/stores').Store} Store
 * @typedef {import('@/inv/Inv').Inv} Inv
 * @typedef {import('@/inv/Inv').InvId} InvId
 */
import { getInv } from '../transfer/InvTransfer';

/**
 * @typedef {ReturnType<setInvPaged>} InvPaged
 */

/**
 * @param {Inv} inv
 */
export function isInvPaged(inv) {
  return inv.metadata && 'paged' in inv.metadata;
}

/**
 * @param {Inv} inv
 * @param {InvId} prevInvId
 * @param {InvId} nextInvId
 * @param {boolean} sealed
 */
export function setInvPaged(inv, prevInvId, nextInvId, sealed = false) {
  let paged = {
    prevInvId,
    nextInvId,
    sealed,
  };
  inv.metadata.paged = paged;
  return paged;
}

/**
 * @param {Inv} inv
 * @returns {InvPaged}
 */
export function getInvPaged(inv) {
  return inv.metadata.paged;
}

const MAX_PAGE_COUNT = 100;

/**
 * @param {Store} store
 * @param {Inv} inv
 * @returns {InvId}
 */
export function findFirstPageInvId(store, inv) {
  let prev = inv;
  for (let i = 0; i < MAX_PAGE_COUNT; ++i) {
    let paged = getInvPaged(prev);
    if (!paged.prevInvId) {
      return prev.invId;
    } else {
      prev = getInv(store, paged.prevInvId);
    }
  }
  throw new Error('Cannot find first page within MAX_PAGE_COUNT.');
}

/**
 * @param {Store} store
 * @param {Inv} inv
 * @returns {InvId}
 */
export function findLastPageInvId(store, inv) {
  let next = inv;
  for (let i = 0; i < MAX_PAGE_COUNT; ++i) {
    let paged = getInvPaged(next);
    if (!paged.nextInvId) {
      return next.invId;
    } else {
      next = getInv(store, paged.nextInvId);
    }
  }
  throw new Error('Cannot find last page within MAX_PAGE_COUNT.');
}

/**
 * @param {Store} store
 * @param {Inv} inv
 * @param {number} count
 * @returns {InvId}
 */
export function findNextPageInvId(store, inv, count = 1) {
  let next = inv;
  for (let i = 0; i < count; ++i) {
    let paged = getInvPaged(next);
    if (paged.nextInvId) {
      next = getInv(store, paged.nextInvId);
    } else {
      // End of pages!
      break;
    }
  }
  return next.invId;
}

/**
 * @param {Store} store
 * @param {Inv} inv
 */
export function countPagesRemaining(store, inv) {
  let result = 0;
  let next = inv;
  for (let i = 0; i < MAX_PAGE_COUNT; ++i) {
    let paged = getInvPaged(next);
    if (!paged.nextInvId) {
      return result;
    } else {
      next = getInv(store, paged.nextInvId);
      ++result;
    }
  }
  return MAX_PAGE_COUNT;
}
