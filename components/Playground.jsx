import styles from './Playground.module.css';

import { useState } from 'react';
import { getCursor } from './cursor/CursorTransfer';
import { useStore, ViewStore } from './store';
import { getView } from './store/InvTransfer';
import Viewport from './Viewport';
import InvBox from './boxes/InvBox';
import GroundBox from './boxes/GroundBox';
import ListBox from './boxes/ListBox';
import SocketBox from './boxes/SocketBox';
import TimerBox from './boxes/TimerBox';
import FoundryBox from './boxes/FoundryBox';

export default function Playground({ className = '', topic = '', backgroundProps = {} }) {
  const [pos, setPos] = useState([0, 0]);
  const store = useStore();
  function onWheel(e) {
    const cursor = getCursor(store);
    cursor.onMouseWheel(e);
    setPos([cursor.screenPos[0], cursor.screenPos[1]]);
  }
  return (
    <Viewport gridOffsetX={pos[0]} gridOffsetY={pos[1]} containerProps={{ className }}>
      <div className={styles.background} onWheel={onWheel} {...backgroundProps}></div>
      <Views topic={topic} />
    </Viewport>
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
      {viewIds.map(viewId => <View key={viewId} store={store} viewId={viewId} />)}
    </>
  );
}

function View({ store, viewId }) {
  const view = ViewStore.useValue(store, viewId);
  if (!view) {
    return null;
  }
  switch(view.type) {
    case 'grid':
      return (<InvBox store={store} view={view}/>);
    case 'ground':
      return (<GroundBox store={store} view={view}/>);
    case 'list':
      return (<ListBox store={store} view={view}/>);
    case 'socket':
      return (<SocketBox store={store} view={view}/>);
    case 'foundry':
      return (<FoundryBox store={store} view={view}/>);
    case 'timer':
      return (<TimerBox store={store} view={view}/>);
    default:
      return null;
  }
}
