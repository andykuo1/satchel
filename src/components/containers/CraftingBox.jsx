import { createInvViewInStore } from '../../stores';
import { registerView } from '../ViewRegistry';
import ContainerBox from '../container/ContainerBox';
import Styles from './CraftingBox.module.css';

registerView('crafting', CraftingBox);

export default function CraftingBox({ store, view }) {
  return (
    <ContainerBox store={store} view={view}>
      <fieldset className={Styles.container}>
        <button>HELLO</button>
      </fieldset>
    </ContainerBox>
  );
}

export function createCraftingBoxInStore(store, coordX, coordY) {
  return createInvViewInStore(
    store,
    coordX,
    coordY,
    6,
    7,
    'crafting',
    'single',
    9,
    3,
    3,
    'all',
    ['workspace'],
  );
}
