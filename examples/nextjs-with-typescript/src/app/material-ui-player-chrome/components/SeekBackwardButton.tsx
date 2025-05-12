import { IconButton, Tooltip } from '@mui/material';
import Replay30Icon from '@mui/icons-material/Replay30';
import {
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const label = 'Seek backward';

type EventOrAction<D = undefined> = {
  type: string;
  detail?: D;
  target?: EventTarget;
};

/**
 * A simple seek backward button
 */
const MUIMediaSeekBackwardButton = ({
  mediaCurrentTime = 0,
  onmediaseekrequest = () => {},
  // NOTE: Does not support seekOffset due to icon impl
  // seekOffset = 30,
}: {
  mediaCurrentTime?: number,
  onmediaseekrequest?: (eventOrAction: EventOrAction<number>) => void;
}) => {
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
        color="primary"
        /**
         * This is an example of using dispatch() to make a state change request. In this case, whenever
         * someone clicks the seek backward button, we want to make a MEDIA_SEEK_REQUEST
         * to the <MediaProvider/>'s MediaStore to seek back 30 seconds before the mediaCurrentTime
         */
        onClick={() => {
          const type = MediaActionTypes.MEDIA_SEEK_REQUEST;
          const detail = mediaCurrentTime - 30;
          onmediaseekrequest({ type, detail });
        }}
      >
        <Replay30Icon />
      </IconButton>
    </Tooltip>
  );
};

export default MUIMediaSeekBackwardButton;
