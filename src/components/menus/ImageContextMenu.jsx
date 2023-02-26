import AddPhoto from '@material-symbols/svg-400/outlined/add_photo_alternate.svg';
import { useEffect, useRef, useState } from 'react';

import { updateItem } from '@/inv/transfer/InvTransfer';

import IconButton from '../lib/IconButton';
import Styles from './ImageContextMenu.module.css';

export default function ImageContextMenu({ store, view, itemRef, disabled }) {
  let [visible, setVisible] = useState(false);
  let menuRef = useRef(null);

  function onFocus(e) {
    e.target.setSelectionRange(0, e.target.value.length);
  }

  function onChange(e) {
    if (!itemRef.current) {
      return;
    }
    let value = String(e.target.value);
    updateItem(store, view.invId, itemRef.current.itemId, { imgSrc: value });
  }

  function onClick() {
    setVisible((visible) => !visible);
  }

  function onOutside(e) {
    const rect = menuRef.current.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x > rect.right || x < rect.left || y > rect.bottom || y < rect.top) {
      setVisible(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', onOutside, true);
    document.addEventListener('contextmenu', onOutside, true);
    return () => {
      document.removeEventListener('click', onOutside, true);
      document.removeEventListener('contextmenu', onOutside, true);
    };
  });

  let item = itemRef.current;
  let imgSrc = item ? item.imgSrc : '';
  return (
    <>
      <ImageButton
        store={store}
        view={view}
        itemRef={itemRef}
        disabled={disabled}
        onClick={onClick}
      />
      <div
        className={Styles.contextMenu + ' ' + (!visible && Styles.hidden)}
        ref={menuRef}>
        <input
          type="url"
          name="imgSrc"
          value={imgSrc}
          placeholder="/images/potion.png"
          onChange={onChange}
          onFocus={onFocus}
          disabled={disabled}
        />
      </div>
    </>
  );
}

function ImageButton({ store, view, itemRef, disabled, onClick }) {
  return <IconButton Icon={AddPhoto} disabled={disabled} onClick={onClick} />;
}
