import { useState } from 'react';

import styles from './Settings.module.css';

import SettingsIcon from '@material-symbols/svg-400/rounded/settings.svg';

export default function Settings({}) {
  const [open, setOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('satchel-test');
  return (
    <>
      <div className={styles.floating}>
        <button className={styles.button} onClick={(e) => setOpen(!open)}>
          <SettingsIcon fill="white"/>
        </button>
      </div>
      <div className={styles.container + ' ' + (!open && styles.hidden)}>
        <div className={styles.padding} onClick={(e) => setOpen(!open)} />
        <dialog className={styles.outer} open={open}>
          <div className={styles.content}>
            <div className={styles.padding}></div>
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
            <div className={styles.padding}></div>
          </div>
        </dialog>
        <div className={styles.padding} onClick={(e) => setOpen(!open)} />
      </div>
    </>
  );
}
