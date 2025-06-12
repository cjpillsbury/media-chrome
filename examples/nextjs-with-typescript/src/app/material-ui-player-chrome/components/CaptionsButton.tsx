import { IconButton, Tooltip } from '@mui/material';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import ClosedCaptionDisabledIcon from '@mui/icons-material/ClosedCaptionDisabled';
import { MediaActionTypes } from 'media-chrome/react/media-store';

type EventOrAction<D = undefined> = {
  type: string;
  detail?: D;
  target?: EventTarget;
};

const DEFAULT_LABEL = 'Subtitles/closed captions';
const CaptionsButton = ({
  onmediatogglesubtitlesrequest = () => {},
  mediaSubtitlesShowing = [],
  tooltipLabel = DEFAULT_LABEL,
  ariaLabel = tooltipLabel,
}: {
  /** @TODO improve type composition crud (CJP) */
  onmediatogglesubtitlesrequest?: (eventOrAction: EventOrAction) => void;
  mediaSubtitlesShowing?: any[];
  tooltipLabel: string;
  ariaLabel: string;
}) => {
  const showingSubtitles = !!mediaSubtitlesShowing?.length;

  /**
   * Here we're picking which MUI icon to show based on whether or not we're paused
   */
  const IconComponent = showingSubtitles
    ? ClosedCaptionIcon
    : ClosedCaptionDisabledIcon;
  return (
    <Tooltip title={tooltipLabel} placement="top">
      <IconButton
        color="primary"
        role="switch"
        aria-checked={showingSubtitles}
        aria-label={ariaLabel}
        // disabled={!mediaSubtitlesList?.length}
        /**
         * This is an example of using dispatch() to make a state change request. In this case, whenever
         * someone clicks the captions button, we want make a MEDIA_TOGGLE_SUBTITLES_REQUEST, a convenient way to
         * toggle between having (any) subtitles on (showing) or off (disabled).
         */
        onClick={() => {
          const type = MediaActionTypes.MEDIA_TOGGLE_SUBTITLES_REQUEST;
          onmediatogglesubtitlesrequest({ type });
        }}
      >
        <IconComponent />
      </IconButton>
    </Tooltip>
  );
};

export default CaptionsButton;
