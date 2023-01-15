import styles from '../styles/Workspace.module.css';
import Playground from './Playground';
import { useStore } from '../stores';
import { GroundViewTransfer } from '../stores/transfer/GroundViewTransfer';

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
