import styles from '../styles/Workspace.module.css';
import Playground from './Playground';
import { useStore } from './store';
import { GroundViewTransfer } from './transfer/GroundViewTransfer';

export default function Workspace() {
  const store = useStore();
  return (
    <Playground className={styles.workspace}
      topic="workspace"
      backgroundProps={{
        onMouseUp(e) {
          GroundViewTransfer.containerMouseUpCallback(e, store, null, null, e.target);
        },
      }}/>
  );
}
