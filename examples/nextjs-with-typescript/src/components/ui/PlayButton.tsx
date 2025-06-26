/** @TODO This should be decoupled from at least root media store module & defs */
import {
  useMediaDispatch,
  MediaActionTypes,
} from 'media-chrome/react/media-store';
import type { MediaState } from 'media-chrome/react/media-store';
import type { ElementType, PropsWithChildren } from 'react';

/** @TODO Export more types. Define more contracts (CJP) */
type MediaCallbackType = ReturnType<typeof useMediaDispatch>;

type DefaultPlayButtonState = Pick<MediaState, 'mediaPaused'>;
/** @TODO Support camel case deeply for callbacks. Define these as consts and types in core lib with clear relationships to event types (CJP) */
type DefaultPlayButtonEventCallbacks = {
  onmediaplayrequest: MediaCallbackType;
  onmediapauserequest: MediaCallbackType;
};
type ComponentType = ElementType<
  Partial<
    PropsWithChildren<DefaultPlayButtonState & DefaultPlayButtonEventCallbacks>
  >
>;

const PlayButton: ComponentType = ({
  mediaPaused,
  onmediaplayrequest,
  onmediapauserequest,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      data-paused={mediaPaused || undefined}
      onClick={() => {
        /** @TODO Discuss tradeoffs of requiring passing in object with type, esp. since callback already identifies action type (CJP) */
        mediaPaused
          ? onmediaplayrequest?.({ type: MediaActionTypes.MEDIA_PLAY_REQUEST })
          : onmediapauserequest?.({
              type: MediaActionTypes.MEDIA_PAUSE_REQUEST,
            });
      }}
    >
      {children}
    </button>
  );
};

export default PlayButton;
