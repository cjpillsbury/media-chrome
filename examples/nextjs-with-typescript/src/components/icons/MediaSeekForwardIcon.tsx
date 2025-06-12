import type { IconProps } from './types';

const DEFAULT_SEEK_OFFSET = 30;
type ComponentIconProps = IconProps & { seekOffset?: number };
const MediaSeekForwardIcon = ({
  color = 'currentColor',
  seekOffset = DEFAULT_SEEK_OFFSET,
  ...props
}: ComponentIconProps) => {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 24" {...props}>
      <text
        className="value"
        color={`var(--media-icon-color, var(--media-primary-color, ${color}))`}
        style={{
          fontSize: 8,
          fontFamily: 'Arial-BoldMT,Arial',
          fontWeight: 700,
        }}
        transform="translate(8.9 19.87)"
      >
        {seekOffset}
      </text>
      <path
        fill={`var(--media-icon-color, var(--media-primary-color, ${color}))`}
        d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"
      />
    </svg>
  );
};

export default MediaSeekForwardIcon;
