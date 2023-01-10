import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Playground.module.css';
import { containerMouseUpCallback, itemMouseDownCallback } from './cursor/CursorCallback';
import { getCursor } from './cursor/CursorTransfer';
import { getItemByItemId } from './inv/InvItems';
import { getClosestItemForElement, getItemIdForElement } from './ItemRenderer';
import { InvStore, useStore, ViewStore } from './store';
import { getView, isInvEmpty } from './store/InvTransfer';
import ViewRenderer, { getClosestViewForElement } from './ViewRenderer';

export default function Playground({ className = '', pannable = true, topic='', backgroundProps = {} }) {
  const [pos, setPos] = useState([0, 0]);
  const store = useStore();
  function onWheel(e) {
    if (!pannable) return;
    const cursor = getCursor(store);
    cursor.onMouseWheel(e);
    setPos([cursor.screenPos[0], cursor.screenPos[1]]);
  }
  return (
    <PositionalPlayground containerProps={{ className }} gridOffsetX={pos[0]} gridOffsetY={pos[1]}>
      <div className={styles.background} onWheel={onWheel} {...backgroundProps}></div>
      <Views topic={topic}/>
    </PositionalPlayground>
  );
}

/**
 * @param {object} props
 * @param {object} props.containerProps
 * @param {number} props.gridOffsetX
 * @param {number} props.gridOffsetY
 * @param {import('react').ReactNode} props.children
 */
function PositionalPlayground({ containerProps = {}, gridOffsetX, gridOffsetY, children }) {
  const { className: classNameContainer = {}, style: styleContainer = {}, ...propsContainer } = containerProps;
  return (
    <div className={`${styles.view} ${styles.grid} ${classNameContainer}`}
      style={{
        // @ts-ignore
        '--grid-offset-x': `${gridOffsetX}px`,
        '--grid-offset-y': `${gridOffsetY}px`,
        ...styleContainer,
      }}
      {...propsContainer}>
      {children}
    </div>
  );
}

function Views({ topic = '' }) {
  const store = useStore();
  let viewIds = ViewStore.useKeys(store);
  if (topic) {
    viewIds = viewIds.filter(viewId => getView(store, viewId).topics.includes(topic));
  }
  return (
    <>
    {viewIds.map(viewId => <View key={viewId} store={store} viewId={viewId}/>)}
    </>
  );
}

function View({ store, viewId }) {
  const view = ViewStore.useValue(store, viewId);
  const inv = InvStore.useValue(store, view ? view.invId : '');
  useEffect(() => {
    if (!view || !inv) {
      return;
    }
    if (view.type === 'ground') {
      if (isInvEmpty(store, inv.invId)) {
        InvStore.delete(store, inv.invId);
      }
    }
  });
  if (!view || !inv) {
    return null;
  }
  return (
    <ViewRenderer key={viewId}
      store={store}
      view={view}
      inv={inv}
      containerProps={{
        onMouseUp(e) {
          let containerElement = getClosestViewForElement(e.target);
          return containerMouseUpCallback(e, store, view, containerElement);
        }
      }}
      itemProps={{
        onMouseDown(e) {
          let itemElement = getClosestItemForElement(e.target);
          let itemId = getItemIdForElement(itemElement);
          let item = getItemByItemId(inv, itemId);
          let containerElement = getClosestViewForElement(e.target);
          return itemMouseDownCallback(e, store, item, view, containerElement);
        }
      }}/>
  );
}
