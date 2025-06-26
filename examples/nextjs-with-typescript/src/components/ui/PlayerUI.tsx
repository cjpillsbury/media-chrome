import type { ElementType, PropsWithChildren, Ref } from 'react';
import type { MediaState } from 'media-chrome/react/media-store';
type DefaultPlayButtonState = Pick<MediaState, 'mediaPaused'>;
type ComponentType = ElementType<
  Partial<DefaultPlayButtonState & PropsWithChildren> & {
    ref: Ref<HTMLDivElement>;
  }
>;

const PlayerUI: ComponentType = ({ mediaPaused, children, ...props }) => {
  return (
    <div {...props} data-paused={mediaPaused || undefined}>
      {children}
    </div>
  );
};

export default PlayerUI;
