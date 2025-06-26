import * as React from 'react';
import type { IconProps } from './types';
const PlayIcon = ({ color = 'currentColor', ...props }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
    <path
      fill={`var(--media-icon-color, var(--media-primary-color, ${color}))`}
      d="m6 21 15-9L6 3v18Z"
    />
  </svg>
);
export default PlayIcon;
