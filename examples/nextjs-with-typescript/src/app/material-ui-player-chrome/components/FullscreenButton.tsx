import { IconButton, Tooltip } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  MediaActionTypes,
} from 'media-chrome/react/media-store';

type EventOrAction<D = undefined> = {
  type: string;
  detail?: D;
  target?: EventTarget;
};

/**
 * A simple button to enter/exit fullscreen mode
 */
const FullscreenButton = ({
  onmediaenterfullsreenrequest = () => {},
  onmediaexitfullscreenrequest = () => {},
  mediaIsFullscreen = false,
}: {
  /** @TODO improve type composition crud (CJP) */
  onmediaenterfullsreenrequest?: (eventOrAction: EventOrAction) => void;
  onmediaexitfullscreenrequest?: (eventOrAction: EventOrAction) => void;
  mediaIsFullscreen?: boolean;
}) => {
  /**
   * Here we're picking which MUI icon to show based on whether or not we're in fullscreen mode
   */
  const IconComponent = mediaIsFullscreen ? FullscreenExitIcon : FullscreenIcon;
  /**
   * And also changing the text for both the tooltip and our aria-label (for a11y)
   */
  const label = mediaIsFullscreen ? 'Exit full screen' : 'Full screen';
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
        color="primary"
        /**
         * This is an example of using dispatch() to make a state change request. In this case, whenever
         * someone clicks the pip button, we want to either make a MEDIA_EXIT_FULLSCREEN_REQUEST (if we're currently in fullscreen mode)
         * or a MEDIA_ENTER_FULLSCREEN_REQUEST (if we're not).
         */
        onClick={() => {
          if (mediaIsFullscreen) {
            onmediaexitfullscreenrequest({
              type: MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST,
            });
          } else {
            onmediaenterfullsreenrequest({
              type: MediaActionTypes.MEDIA_ENTER_FULLSCREEN_REQUEST,
            });
          }
        }}
      >
        <IconComponent />
      </IconButton>
    </Tooltip>
  );
};

export default FullscreenButton;
