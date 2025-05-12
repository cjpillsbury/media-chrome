import { MediaPlayButton as BaseMediaPlayButton } from 'media-chrome/react';

import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';
import type { ElementType } from 'react';
// import { EventOrAction } from '../../../../../../dist/media-store/state-mediator';

const PlayButton = ({
  component = BaseMediaPlayButton,
}: {
  component?: ElementType;
}) => {
  const Component = component;
  /**
   * The useMediaDispatch() hook is returns a function for dispatching media state change requests to the <MediaProvider/>'s
   * MediaStore. State change requests, or "actions," have a well defined "type" (defined in MediaActionTypes) and, depending on the type of request, may
   * also require some well defined "detail" about the request. For an example of a state change request, see below.
   */
  const dispatch = useMediaDispatch();
  /**
   * The useMediaSelector() hook is how you get the latest bit(s) of media state you care about in your component.
   * mediaVolumeLevel is an example of some "convenience media state" that the MediaStore provides to describe the "level"
   * of volume (high, medium, low, or off) based on both the media's volume and muted state.
   */
  const mediaPaused = useMediaSelector(
    (state) => typeof state.mediaPaused !== 'boolean' || state.mediaPaused
  );
  // @ts-ignore
  return (
    <Component
      {...{
        [`on${MediaActionTypes.MEDIA_PLAY_REQUEST}`]: dispatch,
        [`on${MediaActionTypes.MEDIA_PAUSE_REQUEST}`]: dispatch,
        // @ts-ignore
      }}
      mediaPaused={mediaPaused}
    ></Component>
  );
};

export default PlayButton;
