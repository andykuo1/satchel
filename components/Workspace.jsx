import { useState } from 'react';
import styles from '../styles/Workspace.module.css';
import { posToCoord } from './cursor/CursorState';
import { getCursor, putDownInGround } from './cursor/CursorTransfer';
import Playground from './Playground';
import { useStore } from './store';

export default function Workspace() {
  const store = useStore();
  return (
    <Playground className={styles.workspace}
      topic="workspace"
      backgroundProps={{
        onMouseUp(e) {
          const cursor = getCursor(store);
          let [gridX, gridY] = posToCoord([0, 0], cursor.getCursorWorldX(), cursor.getCursorWorldY(), cursor.gridUnit);
          gridX += cursor.heldOffsetX;
          gridY += cursor.heldOffsetY;
          if (putDownInGround(cursor, store, gridX, gridY)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        },
      }}/>
  );
}
