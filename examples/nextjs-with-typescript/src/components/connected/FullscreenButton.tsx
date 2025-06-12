import { MediaFullscreenButton as BaseComponent } from 'media-chrome/react';
import { t } from 'media-chrome';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';
import type { MediaState } from 'media-chrome/react/media-store';
import type { ElementType } from 'react';

export const propsToAriaLabel = ({
  mediaIsFullscreen,
}: Pick<MediaState, 'mediaIsFullscreen'>) =>
  mediaIsFullscreen ? t('exit fullscreen mode') : t('enter fullscreen mode');
export const propsToTooltipLabel = ({
  mediaIsFullscreen,
}: Pick<MediaState, 'mediaIsFullscreen'>) =>
  mediaIsFullscreen ? t('Exit fullscreen mode') : t('Enter fullscreen mode');

const FullscreenButton = ({
  component = BaseComponent,
}: {
  component?: ElementType;
}) => {
  const Component = component;
  const dispatch = useMediaDispatch();
  const mediaIsFullscreen = useMediaSelector(
    (state) => !!state.mediaIsFullscreen
  );
  return (
    <Component
      {...{
        [`on${MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST}`]: dispatch,
        [`on${MediaActionTypes.MEDIA_ENTER_FULLSCREEN_REQUEST}`]: dispatch,
      }}
      mediaIsFullscreen={mediaIsFullscreen}
      ariaLabel={propsToAriaLabel({ mediaIsFullscreen })}
      tooltipLabel={propsToTooltipLabel({ mediaIsFullscreen })}
    ></Component>
  );
};

export default FullscreenButton;
