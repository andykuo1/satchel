import { useRef } from 'react';
import styles from './FoundryBox.module.css';

import { uuid } from '../../lib/util/uuid';
import ContainerBox from '../container/ContainerBox';
import { containerMouseUpCallback, handleMouseDownCallback, itemMouseDownCallback } from '../cursor/CursorCallback';
import { createInvInStore, createViewInStore } from '../store'

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
