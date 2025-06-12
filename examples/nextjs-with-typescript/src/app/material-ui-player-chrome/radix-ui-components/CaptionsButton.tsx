import { Toggle } from 'radix-ui';
import { MediaActionTypes } from 'media-chrome/react/media-store';
import ClosedCaptionsOnIcon from '@/components/icons/ClosedCaptionsOnIcon';
import ClosedCaptionsOffIcon from '@/components/icons/ClosedCaptionsOffIcon';
import styles from './styles.captions.module.css';
import React, { ReactNode } from 'react';
// import Tooltip from './Tooltip';

type EventOrAction<D = undefined> = {
  type: string;
  detail?: D;
  target?: EventTarget;
};

const DEFAULT_LABEL = 'Subtitles/closed captions';
const CaptionsButton = ({
  onmediatogglesubtitlesrequest = () => {},
  mediaSubtitlesShowing = [],
  tooltipLabel = DEFAULT_LABEL,
  ariaLabel = tooltipLabel,
}: {
  /** @TODO improve type composition crud (CJP) */
  onmediatogglesubtitlesrequest?: (eventOrAction: EventOrAction) => void;
  mediaSubtitlesShowing?: any[];
  tooltipLabel: string;
  ariaLabel: string;
}) => {
  const showingSubtitles = !!mediaSubtitlesShowing?.length;
  return (
    <Toggle.Root
      className={styles.Toggle}
      aria-label={ariaLabel}
      pressed={showingSubtitles}
      onPressedChange={() => {
        const type = MediaActionTypes.MEDIA_TOGGLE_SUBTITLES_REQUEST;
        onmediatogglesubtitlesrequest({ type });
      }}
    >
      <ClosedCaptionsOnIcon className={styles.IndicatorOn} />
      <ClosedCaptionsOffIcon className={styles.IndicatorOff} />
      {/* <Toggle.Indicator>
        <Toggle.Indicator.On asChild>
          <ClosedCaptionsOnIcon className={styles.IndicatorOn} />
        </Toggle.Indicator.On>
        <Toggle.Indicator.Off asChild>
          <ClosedCaptionsOffIcon className={styles.IndicatorOff} />
        </Toggle.Indicator.Off>
      </Toggle.Indicator> */}
      {/* <Toggle.Indicator asChild>
        <AnimatedCCIcon className={styles.IndicatorOff}/>
      </Toggle.Indicator> */}
    </Toggle.Root>
  );
};

const Root = ({
  onmediatogglesubtitlesrequest = () => {},
  mediaSubtitlesShowing = [],
  tooltipLabel = DEFAULT_LABEL,
  ariaLabel = tooltipLabel,
  children,
}: {
  /** @TODO improve type composition crud (CJP) */
  onmediatogglesubtitlesrequest?: (eventOrAction: EventOrAction) => void;
  mediaSubtitlesShowing?: any[];
  tooltipLabel: string;
  ariaLabel: string;
  children: ReactNode;
}) => {};

const Indicator = ({
  children,
  pressed = false,
}: {
  children: ReactNode;
  pressed: boolean;
}) => {

  return <>{children}</>;
};

const On = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

const Off = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

// const CaptionsButton = ({
//   onmediatogglesubtitlesrequest = () => {},
//   mediaSubtitlesShowing = [],
//   tooltipLabel = DEFAULT_LABEL,
//   ariaLabel = tooltipLabel,
// }: {
//   /** @TODO improve type composition crud (CJP) */
//   onmediatogglesubtitlesrequest?: (eventOrAction: EventOrAction) => void;
//   mediaSubtitlesShowing?: any[];
//   tooltipLabel: string;
//   ariaLabel: string;
// }) => {
//   const showingSubtitles = !!mediaSubtitlesShowing?.length;
//   return (
//     <Tooltip content={tooltipLabel}>
//       <Toggle.Root
//         className={styles.Toggle}
//         aria-label={ariaLabel}
//         pressed={showingSubtitles}
//         onPressedChange={() => {
//           const type = MediaActionTypes.MEDIA_TOGGLE_SUBTITLES_REQUEST;
//           onmediatogglesubtitlesrequest({ type });
//         }}
//       >
//         <ClosedCaptionsOnIcon className={styles.IndicatorOn} />
//         <ClosedCaptionsOffIcon className={styles.IndicatorOff} />
//       </Toggle.Root>
//     </Tooltip>
//   );
// };

export default CaptionsButton;
