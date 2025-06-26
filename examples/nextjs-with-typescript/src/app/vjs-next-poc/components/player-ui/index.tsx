// We can, for example, make this the "default" component export if this is where we want to steer folks.
import PlayerUI from '@/components/connected-with-defaults/PlayerUI';
import styles from './styles.module.css';
import { ReactNode } from 'react';
import PlayButton from '../play-button';
import MuteButton from '../mute-button';

export default function AppPlayerUI({ children }: { children?: ReactNode }) {
  return (
    <PlayerUI className={styles.Root}>
      {/* This is the <Video/> Component */}
      {children}
      <div className={styles.ControlsLayer}>
        <div className={styles.Spacer}></div>
        <div className={styles.ControlBar}>
          <PlayButton />
          <MuteButton />
        </div>
      </div>
    </PlayerUI>
  );
}
