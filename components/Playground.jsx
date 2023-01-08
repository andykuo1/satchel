import { useRef } from 'react';
import styles from '../styles/Playground.module.css';
import { containerMouseUpCallback, itemMouseDownCallback } from './cursor/CursorCallback';
import { InvStore, useStore, ViewStore } from './store';
import ViewRenderer from './ViewRenderer';

export default function Playground({ className = '', gridOffsetX = 0, gridOffsetY = 0, viewIds = [], backgroundProps = {} }) {
  const store = useStore();
  return (
    <div className={styles.view + ' ' + styles.grid + ' ' + className}
      style={{
        // @ts-ignore
        '--grid-offset-x': `${gridOffsetX}px`,
        '--grid-offset-y': `${gridOffsetY}px`,
      }}>
      <div className={styles.background} {...backgroundProps}>
      </div>
      {viewIds.map(viewId => <View key={viewId} store={store} viewId={viewId}/>)}
    </div>
  );
}

function View({ store, viewId }) {
  const view = ViewStore.useValue(store, viewId);
  const inv = InvStore.useValue(store, view ? view.invId : '');
  const containerRef = useRef(null);
  if (!view || !inv) {
    return null;
  }
  return (
    <ViewRenderer key={viewId}
      store={store}
      view={view}
      inv={inv}
      containerProps={{
        ref: containerRef,
        onMouseUp(e) {
          return containerMouseUpCallback(e, store, view, containerRef.current);
        }
      }}
      itemContainerPropsCallback={(store, view, item) => ({
        onMouseDown(e) {
          return itemMouseDownCallback(e, store, item, view, containerRef.current);
        }
      })}/>
  );
}