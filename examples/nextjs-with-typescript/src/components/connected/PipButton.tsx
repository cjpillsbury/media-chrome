import { MediaPipButton as BaseComponent } from 'media-chrome/react';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';
import type { ElementType } from 'react';

const PipButton = ({
  component = BaseComponent,
}: {
  component?: ElementType;
}) => {
  const Component = component;
  const dispatch = useMediaDispatch();
  const mediaIsPip = useMediaSelector((state) => state.mediaIsPip);
  /** @TODO Figure out why this is not properly applied to <media-pip-button> web component (CJP) */
  const mediaPipUnavailable = useMediaSelector(
    (state) => state.mediaPipUnavailable
  );
  return (
    <Component
      {...{
        [`on${MediaActionTypes.MEDIA_EXIT_PIP_REQUEST}`]: dispatch,
        [`on${MediaActionTypes.MEDIA_ENTER_PIP_REQUEST}`]: dispatch,
      }}
      mediaIsPip={mediaIsPip}
      mediaPipUnavailable={mediaPipUnavailable}
    ></Component>
  );
};

export default PipButton;
