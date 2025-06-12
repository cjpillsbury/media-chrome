import { MediaCaptionsButton as BaseComponent } from 'media-chrome/react';
import { t } from 'media-chrome';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';
import type { MediaState } from 'media-chrome/react/media-store';
import { ElementType } from 'react';

/** @TODO These should probably reflect the fact that this is a switch (nouns) and not a toggle/action (verbs, like current) (CJP) */
const propsToTooltipLabel = ({
  mediaSubtitlesShowing,
}: Partial<Pick<MediaState, 'mediaSubtitlesShowing'>>) => {
  return mediaSubtitlesShowing?.length
    ? t('Disable captions')
    : t('Enable captions');
};

const propsToAriaLabel = (_props: any) => t('closed captions');

const CaptionsButton = ({
  component = BaseComponent,
}: {
  component?: ElementType;
}) => {
  const Component = component;
  const dispatch = useMediaDispatch();
  const mediaSubtitlesShowing = useMediaSelector(
    (state) => state.mediaSubtitlesShowing
  );
  return (
    <Component
      {...{
        // [`on${MediaActionTypes.MEDIA_TOGGLE_SUBTITLES_REQUEST}`]: dispatch,
        [`on${MediaActionTypes.MEDIA_TOGGLE_SUBTITLES_REQUEST}`]: () => {
          const type = MediaActionTypes.MEDIA_TOGGLE_SUBTITLES_REQUEST;
          dispatch({ type });
        },
      }}
      mediaSubtitlesShowing={mediaSubtitlesShowing}
      ariaLabel={propsToAriaLabel({ mediaSubtitlesShowing })}
      tooltipLabel={propsToTooltipLabel({ mediaSubtitlesShowing })}
    ></Component>
  );
};

export default CaptionsButton;
