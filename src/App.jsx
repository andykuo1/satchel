import Content from './components/Content';
import Settings from './components/Settings';
import Toolbar from './components/toolbar/Toolbar';
import { StoreProvider } from './stores';

export default function App() {
  return (
    <StoreProvider>
      <Content />
      <Settings />
      <Toolbar />
    </StoreProvider>
  );
}
