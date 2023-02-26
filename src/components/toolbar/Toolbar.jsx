import ArrowSelectorTool from '@material-symbols/svg-400/rounded/arrow_selector_tool.svg';
import PanToolAlt from '@material-symbols/svg-400/rounded/pan_tool_alt.svg';

import { getCursor } from '@/inv/transfer/CursorTransfer';
import { useStore } from '@/stores';
import Container from '@/styles/Container.module.css';
import Content from '@/styles/Content.module.css';

import IconButton from '../lib/IconButton';
import Styles from './Toolbar.module.css';

export default function Toolbar() {
  const store = useStore();
  const cursor = getCursor(store);

  function onUsingClick() {
    cursor.changeMode('action');
  }

  function onMovingClick() {
    cursor.changeMode('move');
  }

  return (
    <div className={[Styles.floating, Container.containerFlex].join(' ')}>
      <div className={Content.contentFlex}></div>
      <div className={Styles.center}>
        <IconButton Icon={ArrowSelectorTool} onClick={onUsingClick} />
        <IconButton Icon={PanToolAlt} onClick={onMovingClick} />
      </div>
      <div className={Content.contentFlex}></div>
    </div>
  );
}
