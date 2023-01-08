import { useEffect, useRef } from 'react';
import { useStore, ViewStore } from './store';
import { getView } from './store/InvTransfer'

import { fisherYatesShuffle } from '../lib/util/shuf';

export function useViewOrganizer() {
    const store = useStore();
    const viewIds = ViewStore.useKeys(store);
    const handleRef = useRef(null);

    function organize() {
        fisherYatesShuffle(viewIds);
        for (let viewId of viewIds) {
            let view = getView(store, viewId);
            for (let otherId of viewIds) {
                if (viewId === otherId) {
                    continue;
                }
                let other = getView(store, otherId);
                let arx = view.width / 2;
                let ary = view.height / 2;
                let ax = view.coordX + arx;
                let ay = view.coordY + ary;
                let brx = other.width / 2;
                let bry = other.height / 2;
                let bx = other.coordX + brx;
                let by = other.coordY + bry;
                let result = intersectAxisAlignedBoundingBox(
                    ax, ay, arx, ary,
                    bx, by, brx, bry);
                if (result) {
                    if (result.nx === 0 && result.ny === 0) {
                        result.ny = Math.max(view.height, other.height);
                    }
                    view.coordX -= Math.round(result.nx);
                    view.coordY -= Math.round(result.ny);
                    ViewStore.dispatch(store, viewId);
                }
            }
        }
    }

    useEffect(() => {
        handleRef.current = setInterval(organize, 200);
        return () => {
            clearInterval(handleRef.current);
        };
    });
}

/**
 * Tests and gets the intersection info of two static axis-aligned bounding
 * boxes.
 * 
 * @returns The hit result info.
 */
export function intersectAxisAlignedBoundingBox(ax, ay, arx, ary, bx, by, brx, bry) {
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
