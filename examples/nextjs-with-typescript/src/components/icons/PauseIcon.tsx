import * as React from 'react';
import type { IconProps } from './types';
const PauseIcon = ({ color = 'currentColor', ...props }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
    <path
      fill={`var(--media-icon-color, var(--media-primary-color, ${color}))`}
      d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"
    />
  </svg>
);
export default PauseIcon;
