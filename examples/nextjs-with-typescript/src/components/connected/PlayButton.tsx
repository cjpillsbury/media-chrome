import {
  useMediaDispatch,
  useMediaSelector,
} from 'media-chrome/react/media-store';
import type { MediaState } from 'media-chrome/react/media-store';
import type { CSSProperties, ElementType, PropsWithChildren } from 'react';

/** @TODO Export more types. Define more contracts (CJP) */
type MediaCallbackType = ReturnType<typeof useMediaDispatch>;

type DefaultPlayButtonState = Pick<MediaState, 'mediaPaused'>;
/** @TODO Support camel case deeply for callbacks. Define these as consts and types in core lib with clear relationships to event types (CJP) */
type DefaultPlayButtonEventCallbacks = {
  onmediaplayrequest: MediaCallbackType;
  onmediapauserequest: MediaCallbackType;
};
type ComponentType = ElementType<
  PropsWithChildren<
    Partial<
      DefaultPlayButtonState &
        DefaultPlayButtonEventCallbacks & {
          className: string | undefined;
          style: CSSProperties | undefined;
        }
    >
  >
>;

const PlayButton = ({
  component,
  children,
  ...props
}: PropsWithChildren<{
  component: ComponentType;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}>) => {
  const Component = component;
  const dispatch = useMediaDispatch();
  const mediaPaused = useMediaSelector(
    (state) => typeof state.mediaPaused !== 'boolean' || state.mediaPaused
  );
  return (
    <Component
      {...props}
      onmediaplayrequest={dispatch}
      onmediapauserequest={dispatch}
      mediaPaused={mediaPaused}
    >
      {children}
    </Component>
  );
};

export default PlayButton;
