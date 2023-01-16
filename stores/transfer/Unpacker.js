import { createInvBoxInStore } from '../../components/containers/InvBox';
import { isEmptyViewArea } from '../../components/Intersection';

export function tryUnpackItem(store, item, coordX, coordY) {
    if (!canUnpackItem(store, item, coordX, coordY)) {
        return false;
    }
    
    const { type, width, height } = item.metadata.packed;
    switch(type) {
        case 'grid':
            createInvBoxInStore(store, width, height, coordX, coordY);
            break;
        default:
            throw new Error('Unsupported operation.');
    }
    return true;
}

export function canUnpackItem(store, item, coordX, coordY) {
    if (!item.metadata.packed) {
        return false;
    }

    const { type, width, height } = item.metadata.packed;
    if (!isEmptyViewArea(store, coordX, coordY, width, height)) {
        return false;
    }

    return true;
}

export function getPackedInfo(store, item) {
    if (!item.metadata) {
        return null;
    }
    return item.metadata.packed;
}
