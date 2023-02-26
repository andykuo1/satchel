import { GroundViewTransfer } from '../../inv/transfer/GroundViewTransfer';
import { useStore } from '../../stores';
import Container from '../../styles/Container.module.css';
import Playground from './Playground';
import Styles from './Workspace.module.css';

export default function Workspace() {
  const store = useStore();
  return (
    <Playground
      className={[
        Container.containerInset,
        Styles.workspace,
        Styles.gridProvider,
      ].join(' ')}
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
