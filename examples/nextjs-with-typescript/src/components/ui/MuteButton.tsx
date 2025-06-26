/** @TODO This should be decoupled from at least root media store module & defs */
import {
  useMediaDispatch,
  MediaActionTypes,
} from 'media-chrome/react/media-store';
import type { MediaState } from 'media-chrome/react/media-store';
import type { ElementType, PropsWithChildren } from 'react';

/** @TODO Export more types. Define more contracts (CJP) */
type MediaCallbackType = ReturnType<typeof useMediaDispatch>;

type DefaultMuteButtonState = Pick<MediaState, 'mediaVolumeLevel'>;
/** @TODO Support camel case deeply for callbacks. Define these as consts and types in core lib with clear relationships to event types (CJP) */
type DefaultMuteButtonEventCallbacks = {
  onmediamuterequest: MediaCallbackType;
  onmediaunmuterequest: MediaCallbackType;
};
type ComponentType = ElementType<
  PropsWithChildren<
    Partial<DefaultMuteButtonState & DefaultMuteButtonEventCallbacks >
  >
>;

const MuteButton: ComponentType = ({
  mediaVolumeLevel,
  onmediamuterequest,
  onmediaunmuterequest,
  children,
  ...props
}) => {
  const mediaMuted = mediaVolumeLevel === 'off';
  return (
    <button
      {...props}
      data-muted={mediaMuted || undefined}
      data-volume-level={mediaVolumeLevel}
      onClick={() => {
        /** @TODO Discuss tradeoffs of requiring passing in object with type, esp. since callback already identifies action type (CJP) */
        mediaMuted
          ? onmediaunmuterequest?.({
              type: MediaActionTypes.MEDIA_UNMUTE_REQUEST,
            })
          : onmediamuterequest?.({
              type: MediaActionTypes.MEDIA_MUTE_REQUEST,
            });
      }}
    >
      {children}
    </button>
  );
};

export default MuteButton;
