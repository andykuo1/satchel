import SettingsIcon from '@material-symbols/svg-400/outlined/settings.svg';
import { useState } from 'react';

import Styles from './Settings.module.css';
import IconButton from './lib/IconButton';
import Modal from './modals/Modal';

export default function Settings({}) {
  const [open, setOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('satchel-test');
  return (
    <>
      <div className={Styles.floating}>
        <IconButton
          Icon={SettingsIcon}
          className={Styles.button}
          onClick={(e) => setOpen(!open)}
        />
      </div>
      <Modal open={open} onClose={() => setOpen(false)} vertical={true}>
        <span className={Styles.roomCode}>
          <label>Room:</label>
          <input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
        </span>
        <button>Host Party</button>
        <button>Join Party</button>
        <button>Return Home</button>
        <hr />
        <button>Sound On/Off</button>
        <button>Change Profile</button>
        <hr />
        <button onClick={(e) => setOpen(!open)}>Back</button>
      </Modal>
    </>
  );
}
