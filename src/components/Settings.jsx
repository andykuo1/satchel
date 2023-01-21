import { useState } from 'react';

import styles from './Settings.module.css';

import SettingsIcon from '@material-symbols/svg-400/outlined/settings.svg';
import Modal from './modals/Modal';
import IconButton from './lib/IconButton';

export default function Settings({ }) {
  const [open, setOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('satchel-test');
  return (
    <>
      <div className={styles.floating}>
        <IconButton Icon={SettingsIcon} className={styles.button} onClick={(e) => setOpen(!open)}/>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} vertical={true}>
        <span className={styles.roomCode}>
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
