import { MediaPlayButton as BaseComponent } from 'media-chrome/react';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';
import type { ElementType } from 'react';

const PlayButton = ({
  component = BaseComponent,
}: {
  component?: ElementType;
}) => {
  const Component = component;
  const dispatch = useMediaDispatch();
  const mediaPaused = useMediaSelector(
    (state) => typeof state.mediaPaused !== 'boolean' || state.mediaPaused
  );
  return (
    <Component
      {...{
        [`on${MediaActionTypes.MEDIA_PLAY_REQUEST}`]: dispatch,
        [`on${MediaActionTypes.MEDIA_PAUSE_REQUEST}`]: dispatch,
      }}
      mediaPaused={mediaPaused}
    ></Component>
  );
};

export default PlayButton;
