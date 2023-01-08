import { useState } from 'react';
import styles from '../styles/Workspace.module.css';
import Playground from './Playground';
import { ViewStore, useStore } from './store';

export default function Workspace() {
  const store = useStore();
  const viewIds = ViewStore.useKeys(store)
    .filter(viewId => ViewStore.get(store, viewId).topics.includes('workspace'));
  const [pos, setPos] = useState([0, 0]);
  return (
    <Playground className={styles.workspace}
      viewIds={viewIds}
      gridOffsetX={pos[0]}
      gridOffsetY={pos[1]}
      backgroundProps={{
        onWheel(e) {
          setPos([pos[0] - e.deltaX, pos[1] - e.deltaY]);
        }
      }}/>
  );
}
