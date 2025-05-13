import { IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { MediaActionTypes } from 'media-chrome/react/media-store';

type EventOrAction<D = undefined> = {
  type: string;
  detail?: D;
  target?: EventTarget;
};

/**
 * A simple play/pause button
 */
const PlayButton = ({
  onmediaplayrequest = () => {},
  onmediapauserequest = () => {},
  mediaPaused = true,
}: {
  /** @TODO improve type composition crud (CJP) */
  onmediaplayrequest?: (eventOrAction: EventOrAction) => void;
  onmediapauserequest?: (eventOrAction: EventOrAction) => void;
  mediaPaused?: boolean;
}) => {
  /**
   * Here we're picking which MUI icon to show based on whether or not we're paused
   */
  const IconComponent = mediaPaused ? PlayArrowIcon : PauseIcon;
  /**
   * And also changing the text for both the tooltip and our aria-label (for a11y)
   */
  const label = mediaPaused ? 'Play' : 'Pause';
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
        color="primary"
        /**
         * This is an example of using dispatch() to make a state change request. In this case, whenever
         * someone clicks the play button, we want to either make a MEDIA_PLAY_REQUEST (if we're currently paused)
         * or a MEDIA_PAUSE_REQUEST (if we're currently not paused).
         */
        onClick={() => {
          if (mediaPaused) {
            onmediaplayrequest({
              type: MediaActionTypes.MEDIA_PLAY_REQUEST,
            });
          } else {
            onmediapauserequest({ type: MediaActionTypes.MEDIA_PAUSE_REQUEST });
          }
        }}
      >
        <IconComponent />
      </IconButton>
    </Tooltip>
  );
};

export default PlayButton;
