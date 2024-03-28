import { IconButton, Tooltip } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const FullscreenButton = () => {
  const dispatch = useMediaDispatch();
  const mediaIsFullscreen = useMediaSelector(
    (state) => state.mediaIsFullscreen
  );
  const IconComponent = mediaIsFullscreen ? FullscreenExitIcon : FullscreenIcon;
  const label = mediaIsFullscreen ? 'Exit full screen' : 'Full screen';
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
        color="primary"
        onClick={() => {
          const type = mediaIsFullscreen
            ? MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST
            : MediaActionTypes.MEDIA_ENTER_FULLSCREEN_REQUEST;
          dispatch({ type });
        }}
      >
        <IconComponent />
      </IconButton>
    </Tooltip>
  );
};

export default FullscreenButton;
