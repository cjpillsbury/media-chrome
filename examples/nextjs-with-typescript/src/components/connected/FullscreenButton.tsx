import { MediaFullscreenButton as BaseComponent } from 'media-chrome/react';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';
import type { ElementType } from 'react';

const FullscreenButton = ({
  component = BaseComponent,
}: {
  component?: ElementType;
}) => {
  const Component = component;
  const dispatch = useMediaDispatch();
  const mediaIsFullscreen = useMediaSelector((state) => state.mediaIsFullscreen);
  return (
    <Component
      {...{
        [`on${MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST}`]: dispatch,
        [`on${MediaActionTypes.MEDIA_ENTER_FULLSCREEN_REQUEST}`]: dispatch,
      }}
      mediaIsFullscreen={mediaIsFullscreen}
    ></Component>
  );
};

export default FullscreenButton;
