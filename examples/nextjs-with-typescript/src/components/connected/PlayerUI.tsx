'use client';
/** @TODO !!! Revisit for SSR (CJP) */
// NOTE: This is an example of a "skeletal" connected component definition of a Mute Button. It "knows about" A Media (UI) Store and expects
// to be provided a non-connected component
import {
  useMediaFullscreenRef,
  useMediaSelector,
} from 'media-chrome/react/media-store';
import type { MediaState } from 'media-chrome/react/media-store';
import type { CSSProperties, ElementType, PropsWithChildren, Ref } from 'react';

type DefaultPlayerUIState = Pick<MediaState, 'mediaPaused'>;

type ComponentType = ElementType<
  PropsWithChildren<
    Partial<
      DefaultPlayerUIState & {
        className: string | undefined;
        style: CSSProperties | undefined;
      }
    >
  > & { ref: Ref<HTMLDivElement> }
>;

const PlayerUI = ({
  component,
  children,
  ...props
}: PropsWithChildren<{
  component: ComponentType;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}>) => {
  const Component = component;
  const fullscreenRefCallback = useMediaFullscreenRef();
  const mediaPaused = useMediaSelector(
    (state) => typeof state.mediaPaused !== 'boolean' || state.mediaPaused
  );
  return (
    <Component {...props} ref={fullscreenRefCallback} mediaPaused={mediaPaused}>
      {children}
    </Component>
  );
};

export default PlayerUI;
