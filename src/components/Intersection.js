import { ViewStore } from '../stores';
import { getView } from '../inv/transfer/InvTransfer';

export function findEmptyViewArea(out, store, x, y, w, h) {
  const viewIds = ViewStore.keys(store);
  let arx = w / 2 - 0.1;
  let ary = h / 2 - 0.1;
  let ax = x + arx;
  let ay = y + ary;
  let nextX = x;
  let nextY = y;
  for (let otherId of viewIds) {
    let other = getView(store, otherId);
    if (!other.topics.includes('workspace')) {
      continue;
    }
    let brx = other.width / 2 - 0.1;
    let bry = other.height / 2 - 0.1;
    let bx = other.coordX + brx;
    let by = other.coordY + bry;
    let result = intersectAxisAlignedBoundingBox(
      ax,
      ay,
      arx,
      ary,
      bx,
      by,
      brx,
      bry,
    );
    if (result) {
      nextX = Math.round(nextX - result.dx);
      nextY = Math.round(nextY - result.dy);
      ax = nextX + arx;
      ay = nextY + ary;
    }
  }
  if (isEmptyViewArea(store, nextX, nextY, w, h)) {
    out[0] = nextX;
    out[1] = nextY;
    return out;
  } else {
    out[0] = x;
    out[1] = y;
    return null;
  }
}

export function isEmptyViewArea(store, x, y, w, h) {
  const viewIds = ViewStore.keys(store);
  let arx = w / 2 - 0.1;
  let ary = h / 2 - 0.1;
  let ax = x + arx;
  let ay = y + ary;
  for (let otherId of viewIds) {
    let other = getView(store, otherId);
    if (!other.topics.includes('workspace')) {
      continue;
    }
    let brx = other.width / 2 - 0.1;
    let bry = other.height / 2 - 0.1;
    let bx = other.coordX + brx;
    let by = other.coordY + bry;
    let result = intersectAxisAlignedBoundingBox(
      ax,
      ay,
      arx,
      ary,
      bx,
      by,
      brx,
      bry,
    );
    if (result) {
      return false;
    }
  }
  return true;
}

export function getViewAtCoords(store, x, y) {
  const viewIds = ViewStore.keys(store);
  let arx = 1 / 2 - 0.1;
  let ary = 1 / 2 - 0.1;
  let ax = x + arx;
  let ay = y + ary;
  for (let otherId of viewIds) {
    let other = getView(store, otherId);
    if (!other.topics.includes('workspace')) {
      continue;
    }
    let brx = other.width / 2 - 0.1;
    let bry = other.height / 2 - 0.1;
    let bx = other.coordX + brx;
    let by = other.coordY + bry;
    let result = intersectAxisAlignedBoundingBox(
      ax,
      ay,
      arx,
      ary,
      bx,
      by,
      brx,
      bry,
    );
    if (result) {
      return other;
    }
  }
  return null;
}

export function getViewsWithin(out, store, x, y, w, h) {
  const viewIds = ViewStore.keys(store);
  let arx = w / 2 - 0.1;
  let ary = h / 2 - 0.1;
  let ax = x + arx;
  let ay = y + ary;
  for (let otherId of viewIds) {
    let other = getView(store, otherId);
    if (!other.topics.includes('workspace')) {
      continue;
    }
    let brx = other.width / 2 - 0.1;
    let bry = other.height / 2 - 0.1;
    let bx = other.coordX + brx;
    let by = other.coordY + bry;
    let result = intersectAxisAlignedBoundingBox(
      ax,
      ay,
      arx,
      ary,
      bx,
      by,
      brx,
      bry,
    );
    if (result) {
      out.push(other);
    }
  }
  return out;
}

export function testViews(views, x, y, w, h) {
  let arx = w / 2 - 0.1;
  let ary = h / 2 - 0.1;
  let ax = x + arx;
  let ay = y + ary;
  for (let view of views) {
    let brx = view.width / 2 - 0.1;
    let bry = view.height / 2 - 0.1;
    let bx = view.coordX + brx;
    let by = view.coordY + bry;
    if (intersectAxisAlignedBoundingBox(ax, ay, arx, ary, bx, by, brx, bry)) {
      return view;
    }
  }
  return null;
}

/**
 * Tests and gets the intersection info of two static axis-aligned bounding
 * boxes.
 *
 * @returns The hit result info.
 */
export function intersectAxisAlignedBoundingBox(
  ax,
  ay,
  arx,
  ary,
  bx,
  by,
  brx,
  bry,
) {
  let dx = bx - ax;
  let px = brx + arx - Math.abs(dx);
  if (px < 0) return null;
  let dy = by - ay;
  let py = bry + ary - Math.abs(dy);
  if (py < 0) return null;
  if (px < py) {
    let sx = Math.sign(dx);
    return {
      x: ax + arx * sx,
      y: by,
      dx: px * sx,
      dy: 0,
      nx: sx,
      ny: 0,
      dt: 0,
    };
  } else {
    let sy = Math.sign(dy);
    return {
      x: bx,
      y: ay + ary * sy,
      dx: 0,
      dy: py * sy,
      nx: 0,
      ny: sy,
      dt: 0,
    };
  }
}
