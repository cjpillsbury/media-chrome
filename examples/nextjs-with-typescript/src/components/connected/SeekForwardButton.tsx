import { t } from 'media-chrome';
import { MediaSeekForwardButton as BaseComponent } from 'media-chrome/react';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';
import type { ElementType } from 'react';

const propsToTooltipLabel = (_props: any) => {
  return t('Seek forward');
};

const propsToAriaLabel = ({ seekOffset = 0 }: { seekOffset: number }) => {
  return t('seek forward {seekOffset} seconds', { seekOffset });
};

const DEFAULT_SEEK_OFFSET = 30;
const SeekForwardButton = ({
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
  // @ts-ignore
  return (
    <Component
      {...{
        [`on${MediaActionTypes.MEDIA_SEEK_REQUEST}`]: dispatch,
        // @ts-ignore
      }}
      mediaCurrentTime={mediaCurrentTime}
      seekOffset={seekOffset}
      ariaLabel={propsToAriaLabel({ seekOffset })}
      tooltipLabel={propsToTooltipLabel({ seekOffset })}
    ></Component>
  );
};

export default SeekForwardButton;
