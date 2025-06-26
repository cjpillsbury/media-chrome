import MuteButton from '@/components/connected-with-defaults/MuteButton';
import VolumeHighIcon from '@/components/icons/VolumeHighIcon';
import VolumeLowIcon from '@/components/icons/VolumeLowIcon';
import VolumeOffIcon from '@/components/icons/VolumeOffIcon';
import styles from './styles.module.css';

export default function AppMuteButton() {
  return (
    <MuteButton className={styles.Root}>
      <VolumeOffIcon className={styles.VolumeOffIcon} />
      <VolumeLowIcon className={styles.VolumeLowIcon} />
      <VolumeHighIcon className={styles.VolumeHighIcon} />
    </MuteButton>
  );
}
