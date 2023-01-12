import { distanceSquared } from '../../lib/util/math';

const PLACE_BUFFER_RANGE = 10;
const PLACE_BUFFER_RANGE_SQUARED = PLACE_BUFFER_RANGE * PLACE_BUFFER_RANGE;

export class CursorState {
  constructor() {
    this.clientX = 0;
    this.clientY = 0;
    this.heldOffsetX = 0;
    this.heldOffsetY = 0;
    this.startHeldX = 0;
    this.startHeldY = 0;
    this.ignoreFirstPutDown = false;
    this.gridUnit = 50;
    
    this.visible = false;
    
    this.screenPos = [0, 0];
    this.forceUpdate = null;

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    this.onComponentMount = this.onComponentMount.bind(this);
  }

  /** @param {MouseEvent} e */
  onMouseMove(e) {
    this.clientX = e.clientX;
    this.clientY = e.clientY;
  }

  /** @param {WheelEvent} e */
  onMouseWheel(e) {
    this.screenPos[0] -= e.deltaX;
    this.screenPos[1] -= e.deltaY;
  }

  /** @param {number} now */
  onAnimationFrame(now) {
    if (this.ignoreFirstPutDown
      && distanceSquared(this.clientX, this.clientY, this.startHeldX, this.startHeldY) >= PLACE_BUFFER_RANGE_SQUARED) {
      // This is a drag motion. Next putDown should be intentful.
      this.ignoreFirstPutDown = false;
    }

    if (this.forceUpdate) {
      this.forceUpdate();
    }
  }

  /**
   * @param {Function} forceUpdate 
   */
  onComponentMount(forceUpdate) {
    this.forceUpdate = forceUpdate;
  }

  getCursorWorldX() {
    return (this.clientX - this.screenPos[0]);
  }

  getCursorWorldY() {
    return (this.clientY - this.screenPos[1]);
  }

  getCursorScreenX() {
    return this.clientX + this.heldOffsetX * this.gridUnit;
  }

  getCursorScreenY() {
    return this.clientY + this.heldOffsetY * this.gridUnit;
  }

  setFull(offsetX = 0, offsetY = 0) {
    this.visible = true;
    this.ignoreFirstPutDown = true;
    this.startHeldX = this.clientX;
    this.startHeldY = this.clientY;
    this.heldOffsetX = Math.min(0, offsetX);
    this.heldOffsetY = Math.min(0, offsetY);
    if (this.forceUpdate) {
      this.forceUpdate();
    }
    // playSound('pickup');
  }

  setEmpty() {
    this.visible = false;
    this.ignoreFirstPutDown = false;
    this.heldOffsetX = 0;
    this.heldOffsetY = 0;
    if (this.forceUpdate) {
      this.forceUpdate();
    }
  }
}

export function posToCoord(dst, posX, posY, gridUnit) {
  dst[0] = Math.floor(posX / gridUnit) * gridUnit;
  dst[1] = Math.floor(posY / gridUnit) * gridUnit;
  return dst;
}
