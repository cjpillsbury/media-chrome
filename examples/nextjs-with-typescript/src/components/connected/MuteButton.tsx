import { MediaMuteButton as BaseComponent } from 'media-chrome/react';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';
import type { ElementType } from 'react';

const MuteButton = ({
  component = BaseComponent,
}: {
  component?: ElementType;
}) => {
  const Component = component;
  const dispatch = useMediaDispatch();
  const mediaVolumeLevel = useMediaSelector((state) => state.mediaVolumeLevel);
  return (
    <Component
      {...{
        [`on${MediaActionTypes.MEDIA_MUTE_REQUEST}`]: dispatch,
        [`on${MediaActionTypes.MEDIA_UNMUTE_REQUEST}`]: dispatch,
      }}
      mediaVolumeLevel={mediaVolumeLevel}
    ></Component>
  );
};

export default MuteButton;
