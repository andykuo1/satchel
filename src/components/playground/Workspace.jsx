import { useStore } from '../../stores';
import { GroundViewTransfer } from '../../inv/transfer/GroundViewTransfer';
import Playground from './Playground';
import styles from './Workspace.module.css';

export default function Workspace() {
  const store = useStore();
  return (
    <Playground
      className={styles.workspace}
      topic="workspace"
      backgroundProps={{
        onMouseUp(e) {
          GroundViewTransfer.containerMouseUpCallback(
            e,
            store,
            null,
            null,
            e.target,
          );
        },
      }}
    />
  );
}
