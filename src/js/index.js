export * as constants from './constants.js';
export { default as labels } from './labels/labels.js';
export * as timeUtils from './utils/time.js';
import MediaAirplayButton from './media-airplay-button.js';
import MediaCastButton from './media-cast-button.js';
import MediaChromeButton from './media-chrome-button.js';
import MediaGestureReceiver from './media-gesture-receiver.js';
import MediaController from './media-controller.js';
import MediaChromeRange from './media-chrome-range.js';
import MediaControlBar from './media-control-bar.js';
import MediaCurrentTimeDisplay from './media-current-time-display.js';
import MediaDurationDisplay from './media-duration-display.js';
import MediaTimeDisplay from './media-time-display.js';
import MediaCaptionsButton from './media-captions-button.js';
import MediaSeekForwardButton from './media-seek-forward-button.js';
import MediaFullscreenButton from './media-fullscreen-button.js';
import MediaMuteButton from './media-mute-button.js';
import MediaPipButton from './media-pip-button.js';
import MediaPlayButton from './media-play-button.js';
import MediaPlaybackRateButton from './media-playback-rate-button.js';
import MediaPosterImage from './media-poster-image.js';
import MediaProgressRange from './media-progress-range.js';
import MediaSeekBackwardButton from './media-seek-backward-button.js';
import MediaPreviewTimeDisplay from './media-preview-time-display.js';
import MediaPreviewThumbnail from './media-preview-thumbnail.js';
import MediaTimeRange from './media-time-range.js';
import MediaLoadingIndicator from './media-loading-indicator.js';
import MediaTitleElement from './media-title-element.js';
import MediaVolumeRange from './media-volume-range.js';
import MediaTheme from './themes/media-theme.js';
import { Window as window } from './utils/server-safe-globals.js';

// Alias <media-controller> as <media-chrome>
// Might move MediaChrome to include default controls
class MediaChrome extends MediaController {}
if (!window.customElements.get('media-chrome')) {
  window.customElements.define('media-chrome', MediaChrome);
}

// Alias <media-controller> as <media-container>
// to not break existing installs in transition.
// Eventually expose media-container as unique element
class MediaContainer extends MediaController {
  constructor() {
    super();
    console.warn(
      'MediaChrome: <media-container> is deprecated. Use <media-controller>.'
    );
  }
}
if (!window.customElements.get('media-container')) {
  window.customElements.define('media-container', MediaContainer);
}

export {
  MediaAirplayButton,
  MediaCastButton,
  MediaChromeButton,
  MediaGestureReceiver,
  MediaContainer,
  MediaController,
  MediaChromeRange,
  MediaControlBar,
  MediaCurrentTimeDisplay,
  MediaDurationDisplay,
  MediaTimeDisplay,
  MediaCaptionsButton,
  MediaSeekForwardButton,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPipButton,
  MediaPlayButton,
  MediaPlaybackRateButton,
  MediaPosterImage,
  MediaProgressRange,
  MediaSeekBackwardButton,
  MediaPreviewTimeDisplay,
  MediaPreviewThumbnail,
  MediaTimeRange,
  MediaTitleElement,
  MediaLoadingIndicator,
  MediaVolumeRange,
  MediaTheme
};
