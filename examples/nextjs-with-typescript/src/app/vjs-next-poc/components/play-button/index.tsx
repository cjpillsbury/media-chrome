import PlayButton from '@/components/connected-with-defaults/PlayButton';
import styles from './styles.module.css';
import PlayIcon from '@/components/icons/PlayIcon';
import PauseIcon from '@/components/icons/PauseIcon';

export default function AppPlayButton() {
  return (
    <PlayButton className={styles.Root}>
      <PlayIcon className={styles.PlayIcon}  />
      <PauseIcon className={styles.PauseIcon}  />
    </PlayButton>
  );
}
