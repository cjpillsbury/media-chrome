import { t } from 'media-chrome';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';
import type { ElementType } from 'react';

/** @TODO These should probably reflect the fact that this is a switch (nouns) and not a toggle/action (verbs, like current) (CJP) */
const propsToTooltipLabel = ({ seekOffset }: { seekOffset: number }) => {
  return seekOffset < 0 ? t('Seek backward') : t('Seek forward');
};

const propsToAriaLabel = ({ seekOffset }: { seekOffset: number }) => {
  return seekOffset < 0
    ? t('seek back {seekOffset} seconds', { seekOffset })
    : t('seek forward {seekOffset} seconds', { seekOffset });
};

const SeekButton = ({
  component,
  seekOffset,
}: {
  component: ElementType;
  seekOffset: number;
}) => {
  const dispatch = useMediaDispatch();
  const mediaCurrentTime = useMediaSelector(
    (state) => state.mediaCurrentTime ?? 0
  );
  const Component = component;
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

export default SeekButton;
