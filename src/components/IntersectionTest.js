// https://noonat.github.io/intersect/
const EPSILON = 1e-8;

/**
 * @typedef AxisAlignedBoundingBox
 * @property {Number} x
 * @property {Number} y
 * @property {Number} rx
 * @property {Number} ry
 */

/**
 * @typedef HitResult
 * @property {Number} x
 * @property {Number} y
 * @property {Number} dx
 * @property {Number} dy
 * @property {Number} nx
 * @property {Number} ny
 * @property {Number} time
 */

/**
 * @typedef SweepResult
 * @property {Number} x The next x-position the target should be at to satisfy constraints.
 * @property {Number} y The next y-position the target should be at to satisfy constraints.
 * @property {Number} dx The next x-motion the target should be travelling at.
 * @property {Number} dy The next y-motion the target should be travelling at.
 * @property {Number} time The time along the sweep segment the hit occurred.
 * @property {AxisAlignedBoundingBox} other The sweep hit box.
 * @property {HitResult} hit The sweep hit info.
 */

/**
 * Clamp the value between the given range.
 *
 * @param {Number} value The value to be clamped.
 * @param {Number} min The minimum possible value, inclusive.
 * @param {Number} max The maximum possible value, inclusive.
 * @returns {Number} The clamped value.
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} nx
 * @param {Number} ny
 * @param {Number} time
 * @returns {HitResult}
 */
function createHitResult(x, y, dx, dy, nx, ny, time) {
  return {
    x,
    y,
    dx,
    dy,
    nx,
    ny,
    time,
  };
}

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} time
 * @param {HitResult} hit
 * @returns {SweepResult}
 */
function createSweepResult(x, y, dx, dy, time, other, hit) {
  return {
    x,
    y,
    dx,
    dy,
    time,
    other,
    hit,
  };
}

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} rx
 * @param {Number} ry
 * @returns {AxisAlignedBoundingBox}
 */
export function createAxisAlignedBoundingBox(x, y, rx, ry) {
  return {
    x,
    y,
    rx,
    ry,
  };
}

/**
 * Tests and gets the intersection info of a static axis-aligned bounding
 * box against a point.
 *
 * @param {number} ax The box position x.
 * @param {number} ay The box position y.
 * @param {number} arx The box half width.
 * @param {number} ary The box half height.
 * @param {number} x The x position of the point.
 * @param {number} y The y position of the point.
 * @returns {HitResult|null} The hit result info.
 */
export function intersectPoint(ax, ay, arx, ary, x, y) {
  let dx = x - ax;
  let px = arx - Math.abs(dx);
  if (px < 0) return null;
  let dy = y - ay;
  let py = ary - Math.abs(dy);
  if (py < 0) return null;
  if (px < py) {
    let sx = Math.sign(dx);
    return createHitResult(ax + arx * sx, y, px * sx, 0, sx, 0, 0);
  } else {
    let sy = Math.sign(dy);
    return createHitResult(x, ay + ary * sy, 0, py * sy, 0, sy, 0);
  }
}

/**
 * Tests and gets the intersection info of a static axis-aligned bounding
 * box against a segment.
 *
 * @param {number} ax The box position x.
 * @param {number} ay The box position y.
 * @param {number} arx The box half width.
 * @param {number} ary The box half height.
 * @param {number} x The x position of the root of the segment.
 * @param {number} y The y position of the root of the segment.
 * @param {number} dx The x-axis delta from the root of the segment.
 * @param {number} dy The y-axis delta from the root of the segment.
 * @param {number} px The x-axis padding away from the segment.
 * @param {number} py The y-axis padding away from the segment.
 * @returns {HitResult|null} The hit result info.
 */
export function intersectSegment(
  ax,
  ay,
  arx,
  ary,
  x,
  y,
  dx,
  dy,
  px = 0,
  py = 0,
) {
  if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON && px === 0 && py === 0)
    return intersectPoint(ax, ay, arx, ary, x, y);
  let bpx = px;
  let bpy = py;
  let scaleX = 1.0 / (dx || EPSILON);
  let scaleY = 1.0 / (dy || EPSILON);
  let signX = Math.sign(scaleX);
  let signY = Math.sign(scaleY);
  let nearTimeX = (ax - signX * (arx + bpx) - x) * scaleX;
  let nearTimeY = (ay - signY * (ary + bpy) - y) * scaleY;
  let farTimeX = (ax + signX * (arx + bpx) - x) * scaleX;
  let farTimeY = (ay + signY * (ary + bpy) - y) * scaleY;
  if (nearTimeX > farTimeY || nearTimeY > farTimeX) return null;
  let nearTime = Math.max(nearTimeX, nearTimeY);
  let farTime = Math.min(farTimeX, farTimeY);
  if (nearTime > 1 || farTime < 0) return null;
  let time = clamp(nearTime, 0, 1);
  let hitdx = (1 - time) * -dx;
  let hitdy = (1 - time) * -dy;
  let hitx = x + dx * time;
  let hity = y + dy * time;
  if (nearTimeX > nearTimeY) {
    return createHitResult(hitx, hity, hitdx, hitdy, -signX, 0, time);
  } else {
    return createHitResult(hitx, hity, hitdx, hitdy, 0, -signY, time);
  }
}

/**
 * Tests and gets the intersection info of two static axis-aligned bounding
 * boxes.
 *
 * @param {number} ax The box position x.
 * @param {number} ay The box position y.
 * @param {number} arx The box half width.
 * @param {number} ary The box half height.
 * @param {number} bx The other box position x.
 * @param {number} by The other box position y.
 * @param {number} brx The other box half width.
 * @param {number} bry The other box half height.
 * @returns {HitResult|null} The hit result info.
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
    return createHitResult(ax + arx * sx, by, px * sx, 0, sx, 0, 0);
  } else {
    let sy = Math.sign(dy);
    return createHitResult(bx, ay + ary * sy, 0, py * sy, 0, sy, 0);
  }
}

/**
 * Tests collision of a moving axis-aligned bounding box against other
 * boxes.
 *
 * @param {AxisAlignedBoundingBox} a The box to test against.
 * @param {Number} dx The x-axis motion of the box.
 * @param {Number} dy The y-axis motion of the box.
 * @param {AxisAlignedBoundingBox} other The other box.
 * @returns {SweepResult} The collision result info.
 */
export function sweepInto(ax, ay, arx, ary, dx, dy, others) {
  let nearest = createSweepResult(ax + dx, ay + dy, dx, dy, 1, null, null);
  let out = createSweepResult(0, 0, 0, 0, 0, null, null);
  let insides = [];
  for (let b of others) {
    sweep(out, a, dx, dy, b);
    if (out.time < nearest.time) {
      nearest.x = out.x;
      nearest.y = out.y;
      nearest.dx = out.dx;
      nearest.dy = out.dy;
      nearest.time = out.time;
      nearest.other = out.other;
      nearest.hit = out.hit;
    } else if (out.time <= 0) {
      if (!nearest.hit.nx) {
        nearest.hit.nx = out.hit.nx;
        nearest.hit.dx = out.hit.dx;
        nearest.dx = out.dx;
      }
      if (!nearest.hit.ny) {
        nearest.hit.ny = out.hit.ny;
        nearest.hit.dy = out.hit.dy;
        nearest.dy = out.dy;
      }
    }
    if (out.time <= 0) insides.push(out.other);
  }

  // If stuck in multiple boxes, try to get out... (this also applies to corners)
  if (insides.length > 0) {
    let cx = ax;
    let cy = ay;
    let crx = arx;
    let cry = ary;
    for (let other of insides) {
      let resolved = intersectAxisAlignedBoundingBox(cx, cy, crx, cry, other);
      if (resolved) {
        cx -= resolved.dx + EPSILON * 2 * resolved.nx;
        cy -= resolved.dy + EPSILON * 2 * resolved.ny;
      }
    }
    nearest.x = cx;
    nearest.y = cy;
  }
  return nearest;
}

/**
 * @param {SweepResult} out The output to write the results to.
 * @param {AxisAlignedBoundingBox} a
 * @param {Number} dx
 * @param {Number} dy
 * @param {AxisAlignedBoundingBox} b
 * @returns {SweepResult} The output with new result values.
 */
function sweep(out, a, dx, dy, b) {
  let hit = intersectSegment(b, a.x, a.y, dx, dy, a.rx, a.ry);
  if (hit) {
    // NOTE: Usually this is just EPSILON, but due to inprecision the
    // positive x-axis requires padding greater than EPSILON.
    let time = clamp(hit.time - EPSILON * 2, 0, 1);
    let length = Math.sqrt(dx * dx + dy * dy);
    let normaldx;
    let normaldy;
    if (length) {
      normaldx = dx / length;
      normaldy = dy / length;
    } else {
      normaldx = 0;
      normaldy = 0;
    }
    hit.x = clamp(hit.x + normaldx * a.rx, b.x - b.rx, b.x + b.rx);
    hit.y = clamp(hit.y + normaldy * a.ry, b.y - b.ry, b.y + b.ry);
    hit.dx = hit.dx * -1;
    hit.dy = hit.dy * -1;
    hit.nx = hit.nx * -1;
    hit.ny = hit.ny * -1;

    out.x = a.x + dx * time;
    out.y = a.y + dy * time;
    out.dx = hit.nx && Math.sign(hit.nx) === Math.sign(dx) ? 0 : dx;
    out.dy = hit.ny && Math.sign(hit.ny) === Math.sign(dy) ? 0 : dy;
    out.time = time;
    out.other = b;
    out.hit = hit;
  } else {
    out.x = a.x + dx;
    out.y = a.y + dy;
    out.dx = dx;
    out.dy = dy;
    out.time = 1;
    out.other = null;
    out.hit = null;
  }
  return out;
}
