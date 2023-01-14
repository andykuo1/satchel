import { Map as YMap } from 'yjs';
import { uuid } from '../../../lib/util/uuid';
import { createProxyYMap } from './YProxy';

/** @typedef {ReturnType<createYView>} YView */

/**
 * @param {import('yjs').Map} src 
 * @param {import('../View').ViewId} viewId 
 * @param {import('../Inv').InvId} invId 
 * @param {import('../View').ViewType} viewType 
 * @param {import('../View').ViewUsage} usage 
 * @param {Array<string>} topics
 */
export function createYView(src, viewId, invId, viewType, usage, topics) {
    src.set('viewId', viewId);
    src.set('invId', invId);
    src.set('type', viewType);
    src.set('usage', usage);
    src.set('topics', topics);
    src.set('coordX', 0);
    src.set('coordY', 0);
    src.set('width', 1);
    src.set('height', 1);
    let metadata = new YMap();
    src.set('metadata', metadata);
    return toYView(src);
}

/**
 * @param {YMap} src
 */
export function toYView(src) {
    let view = {
        get viewId() {
            return src.get('viewId');
        },
        get invId() {
            return src.get('invId');
        },
        set invId(value) {
            src.set('invId', value);
        },
        get type() {
            return src.get('type');
        },
        get usage() {
            return src.get('usage');
        },
        set usage(value) {
            src.set('usage', value);
        },
        get width() {
            return src.get('width');
        },
        set width(value) {
            src.set('width', value);
        },
        get height() {
            return src.get('height');
        },
        set height(value) {
            src.set('height', value);
        },
        get coordX() {
            return src.get('coordX');
        },
        set coordX(value) {
            src.set('coordX', value);
        },
        get coordY() {
            return src.get('coordY');
        },
        set coordY(value) {
            src.set('coordY', value);
        },
        get topics() {
            return src.get('topics');
        },
        set topics(value) {
            src.set('topics', value);
        },
        _metadata: null,
        get metadata() {
            let result = this._metadata;
            if (!result) {
                result = createProxyYMap(src.get('metadata'));
                this._metadata = result;
            }
            return result;
        },
        __src: src,
    };
    return view;
}

/**
 * @param {YView} other 
 * @param {YView} [dst]
 */
export function copyYView(other, dst = undefined) {
    if (!dst) {
        dst = createYView(other.__src, uuid(),
            other.invId, other.type,
            other.usage, other.topics);
    }
    dst.displayName = other.displayName;
    dst.invId = other.invId;
    dst.usage = other.usage;
    dst.coordX = other.coordX;
    dst.coordY = other.coordY;
    dst.width = other.width;
    dst.height = other.height;
    dst.topics = other.topics;

    for (let key of Object.keys(other.metadata)) {
        dst.metadata[key] = other.metadata[key];
    }
    return dst;
}
