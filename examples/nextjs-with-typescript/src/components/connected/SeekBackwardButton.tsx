import { t } from 'media-chrome';
import { MediaSeekBackwardButton as BaseComponent } from 'media-chrome/react';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';
import type { ElementType } from 'react';

const propsToTooltipLabel = (_props: any) => {
  return t('Seek backward');
};

const propsToAriaLabel = ({ seekOffset = 0 }: { seekOffset: number }) => {
  return t('seek back {seekOffset} seconds', { seekOffset });
};

const DEFAULT_SEEK_OFFSET = 30;
const SeekBackwardButton = ({
  component = BaseComponent,
  seekOffset = DEFAULT_SEEK_OFFSET,
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
      ariaLabel={propsToAriaLabel({ seekOffset })}
      tooltipLabel={propsToTooltipLabel({ seekOffset })}
    ></Component>
  );
};

export default SeekBackwardButton;
