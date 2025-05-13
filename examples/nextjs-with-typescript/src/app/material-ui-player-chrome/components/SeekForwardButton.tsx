import { IconButton, Tooltip } from '@mui/material';
import Forward30Icon from '@mui/icons-material/Forward30';
import { MediaActionTypes } from 'media-chrome/react/media-store';

const label = 'Seek forward';

type EventOrAction<D = undefined> = {
  type: string;
  detail?: D;
  target?: EventTarget;
};

/**
 * A simple seek forward button
 */
const SeekForwardButton = ({
  mediaCurrentTime = 0,
  onmediaseekrequest = () => {},
}: // NOTE: Does not support seekOffset due to icon impl
// seekOffset = 30,
{
  mediaCurrentTime?: number;
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
         * to the <MediaProvider/>'s MediaStore to seek back 30 seconds after the mediaCurrentTime
         */
        onClick={() => {
          const type = MediaActionTypes.MEDIA_SEEK_REQUEST;
          const detail = mediaCurrentTime + 30;
          onmediaseekrequest({ type, detail });
        }}
      >
        <Forward30Icon />
      </IconButton>
    </Tooltip>
  );
};

export default SeekForwardButton;
