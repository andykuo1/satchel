import styles from './FoundryBox.module.css';
import { uuid } from '../../lib/util/uuid';
import ContainerBox from '../box/ContainerBox';
import { containerMouseUpCallback, handleMouseDownCallback, itemMouseDownCallback } from '../cursor/CursorCallback';
import { createInvInStore, createViewInStore, InvStore } from '../store'
import { renderItems } from '../renderer/ItemsRenderer';
import { useRef } from 'react';
import { updateItem } from '../store/InvTransfer';

export default function FoundryBox({ store, view }) {
    const currentItem = useRef(null);

    function onContainerMouseUp(e) {
        return containerMouseUpCallback(e, store, view);
    }

    function onItemMouseDown(e) {
        return itemMouseDownCallback(e, store, view);
    }

    function onHandleMouseDown(e) {
        return handleMouseDownCallback(e, store, view);
    }

    function onChange(e) {
        if (!currentItem.current) {
            return;
        }
        const name = e.target.name;
        let state = null;
        switch(name) {
            case 'width': {
                let value = Math.max(1, Number(e.target.value));
                state = { width: value };
            } break;
            case 'height': {
                let value = Math.max(1, Number(e.target.value));
                state = { height: value };
            } break;
            case 'stackSize': {
                let value = Math.max(-1, Number(e.target.value));
                state = { stackSize: value };
            } break;
            case 'displayName': {
                let value = String(e.target.value);
                state = { displayName: value };
            } break;
            case 'description': {
                let value = String(e.target.value);
                state = { description: value };
            } break;
        }
        if (state) {
            updateItem(store, view.invId, currentItem.current.itemId, state);
        }
    }

    let inv = InvStore.useValue(store, view.invId);
    let maxWidth = 1;
    let maxHeight = 1;
    currentItem.current = null;
    let elements = renderItems(store, view, inv, (store, view, inv, item, i) => {
        let w = item.width;
        let h = item.height;
        maxWidth = Math.max(w, maxWidth);
        maxHeight = Math.max(h, maxHeight);
        currentItem.current = item;
        return { x: 0, y: 0, w, h, onMouseDown: onItemMouseDown };
    });
    let { width = '', height = '', stackSize = '', displayName = '', description = '' } = currentItem.current || {};
    return (
        <ContainerBox x={view.coordX} y={view.coordY} w={view.width} h={view.height}
            handleProps={{ onMouseDown: onHandleMouseDown }}>
            <fieldset className={styles.container}
                style={{
                    // @ts-ignore
                    '--item-w': maxWidth,
                    '--item-h': maxHeight,
                }}>
                <div className={styles.socket}
                    data-view-id={view.viewId}
                    onMouseUp={onContainerMouseUp}>
                    <div className={styles.item}>
                    {elements}
                    </div>
                    <input type="number" name="width" className={styles.width} value={width} placeholder="--" onChange={onChange}/>
                    <input type="number" name="height" className={styles.height} value={height} placeholder="--" onChange={onChange}/>
                    <span className={styles.stackSizeContainer}>
                        <span className={styles.stackSizeMarker}>×</span>
                        <input type="number" name="stackSize" className={styles.stackSize} value={stackSize} placeholder="--" onChange={onChange}/>
                    </span>
                </div>
                <div className={styles.detail}>
                    <div className={styles.header}>
                        <input type="text" name="displayName" className={styles.displayName} value={displayName} placeholder="--" onChange={onChange}/>
                    </div>
                    <textarea name="description" className={styles.description} value={description} placeholder="Notes..." onChange={onChange}/>
                    <button>Reset</button>
                    <button>Clone</button>
                    <button>Color</button>
                </div>
            </fieldset>
        </ContainerBox>
    );
}

export function createFoundryBoxInStore(store, coordX, coordY) {
    let invId = uuid();
    let viewId = uuid();
    createInvInStore(store, invId, 'single', 1, 1, 1);
    createViewInStore(store, viewId, invId, coordX, coordY, ['workspace'], 'all', 'foundry', 6, 8);
    return viewId;
}
