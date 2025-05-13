import { MediaSeekForwardButton as BaseComponent } from 'media-chrome/react';

import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';
import type { ElementType } from 'react';
// import { EventOrAction } from '../../../../../../dist/media-store/state-mediator';

const SeekForwardButton = ({
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
  // @ts-ignore
  return (
    <Component
      {...{
        [`on${MediaActionTypes.MEDIA_SEEK_REQUEST}`]: dispatch,
        // @ts-ignore
      }}
      mediaCurrentTime={mediaCurrentTime}
      seekOffset={seekOffset}
    ></Component>
  );
};

export default SeekForwardButton;
