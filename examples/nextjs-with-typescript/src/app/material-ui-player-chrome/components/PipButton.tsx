import { IconButton, Tooltip } from '@mui/material';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import { MediaActionTypes } from 'media-chrome/react/media-store';

type EventOrAction<D = undefined> = {
  type: string;
  detail?: D;
  target?: EventTarget;
};

/**
 * A simple button to enter/exit picture in picture mode
 */
const MUIMediaPipButton = ({
  onmediaenterpiprequest = () => {},
  onmediaexitpiprequest = () => {},
  mediaIsPip = false,
}: {
  /** @TODO improve type composition crud (CJP) */
  onmediaenterpiprequest?: (eventOrAction: EventOrAction) => void;
  onmediaexitpiprequest?: (eventOrAction: EventOrAction) => void;
  mediaIsPip?: boolean;
}) => {
  /**
   * We'll also change the text for both the tooltip and our aria-label (for a11y) based on mediaIsPiP
   */
  const label = mediaIsPip ? 'Exit picture in picture' : 'Picture in picture';
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
        color="primary"
        /**
         * This is an example of using dispatch() to make a state change request. In this case, whenever
         * someone clicks the pip button, we want to either make a MEDIA_EXIT_PIP_REQUEST (if we're currently in pip mode)
         * or a MEDIA_ENTER_PIP_REQUEST (if we're not).
         */
        onClick={() => {
          if (mediaIsPip) {
            onmediaexitpiprequest({
              type: MediaActionTypes.MEDIA_EXIT_PIP_REQUEST,
            });
          } else {
            onmediaenterpiprequest({
              type: MediaActionTypes.MEDIA_ENTER_PIP_REQUEST,
            });
          }
        }}
      >
        <PictureInPictureIcon />
      </IconButton>
    </Tooltip>
  );
};

export default MUIMediaPipButton;
