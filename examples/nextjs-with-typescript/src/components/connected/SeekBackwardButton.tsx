import { MediaSeekBackwardButton as BaseComponent } from 'media-chrome/react';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';
import type { ElementType } from 'react';

const SeekBackwardButton = ({
  component = BaseComponent,
  seekOffset,
}: {
  component?: ElementType;
  seekOffset?: number;
}) => {
  const Component = component;
  const dispatch = useMediaDispatch();
  const mediaCurrentTime = useMediaSelector(
    (state) => state.mediaCurrentTime ?? 0
  );
  return (
    <Component
      {...{
        [`on${MediaActionTypes.MEDIA_SEEK_REQUEST}`]: dispatch,
      }}
      mediaCurrentTime={mediaCurrentTime}
      seekOffset={seekOffset}
    ></Component>
  );
};

export default SeekBackwardButton;
