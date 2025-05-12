import { IconButton, Tooltip } from '@mui/material';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { MediaActionTypes } from 'media-chrome/react/media-store';
// import { EventOrAction } from '../../../../../../dist/media-store/state-mediator';

/**
 * In the future, we may add these
 */
const VolumeLevel = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  OFF: 'off',
} as const;

/**
 * A simple lookup table/map object to correlate the current volume level with
 * the corresponding button icon we'd like to display
 */
const VolumeIconComponentMap = {
  [VolumeLevel.HIGH]: VolumeUpIcon,
  [VolumeLevel.MEDIUM]: VolumeDownIcon,
  [VolumeLevel.LOW]: VolumeDownIcon,
  [VolumeLevel.OFF]: VolumeOffIcon,
  DEFAULT: VolumeOffIcon,
} as const;

type EventOrAction<D = undefined> = {
  type: string;
  detail?: D;
  target?: EventTarget;
};

const MUIMediaMuteButton = ({
  onmediamuterequest = () => {},
  onmediaunmuterequest = () => {},
  mediaVolumeLevel = 'DEFAULT',
}: {
  /** @TODO improve type composition crud (CJP) */
  onmediamuterequest?: (eventOrAction: EventOrAction) => void;
  onmediaunmuterequest?: (eventOrAction: EventOrAction) => void;
  mediaVolumeLevel?:
    | keyof typeof VolumeIconComponentMap
    | 'DEFAULT'
    | undefined;
}) => {
  /**
   * Treat the volume level "off" as muted state for our state change requests.
   */
  const mediaPseudoMuted = mediaVolumeLevel === VolumeLevel.OFF;
  /**
   * And also for changing the text for both the tooltip and our aria-label (for a11y)
   */
  const label = mediaPseudoMuted ? 'Unmute' : 'Mute';
  /**
   * Pick which icon we should show based on the current mediaVolumeLevel
   */
  const IconComponent = VolumeIconComponentMap[mediaVolumeLevel];
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
        color="primary"
        /**
         * This is an example of using dispatch() to make a state change request. In this case, whenever
         * someone clicks the mute button, we want to either make a MEDIA_UNMUTE_REQUEST (if we're currently "pseudo muted")
         * or a MEDIA_MUTE_REQUEST (if we're not).
         */
        onClick={() => {
          if (mediaPseudoMuted) {
            onmediaunmuterequest({
              type: MediaActionTypes.MEDIA_UNMUTE_REQUEST,
            });
          } else {
            onmediamuterequest({ type: MediaActionTypes.MEDIA_MUTE_REQUEST });
          }
        }}
      >
        <IconComponent />
      </IconButton>
    </Tooltip>
  );
};

export default MUIMediaMuteButton;
