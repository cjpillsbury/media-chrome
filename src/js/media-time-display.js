import MediaTextDisplay from './media-text-display.js';
import { getOrInsertCSSRule } from './utils/element-utils.js';
import { window } from './utils/server-safe-globals.js';
import { formatAsTimePhrase, formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';

export const Attributes = {
  REMAINING: 'remaining',
  SHOW_DURATION: 'showduration',
};


// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
//

const ButtonPressedKeys = ['Enter', ' '];

const DEFAULT_TIMES_SEP = '&nbsp;/&nbsp;';

const formatTimesLabel = (el, { timesSep = DEFAULT_TIMES_SEP } = {}) => {
  const showRemaining = el.showRemaining;
  const showDuration = el.showDuration;
  const currentTime = el.mediaCurrentTime ?? 0;
  const endTime = el.mediaDuration ?? el.mediaSeekableEnd ?? 0;

  const timeLabel = showRemaining
    ? formatTime(0 - (endTime - currentTime))
    : formatTime(currentTime);

  if (!showDuration) return timeLabel;
  return `${timeLabel}${timesSep}${formatTime(endTime)}`;
};

const DEFAULT_MISSING_TIME_PHRASE = 'video not loaded, unknown time.';

const updateAriaValueText = (el) => {
  const currentTime = el.mediaCurrentTime;
  const endTime = el.mediaDuration || el.mediaSeekableEnd;
  if (currentTime == null || endTime == null) {
    el.setAttribute('aria-valuetext', DEFAULT_MISSING_TIME_PHRASE);
    return;
  }
  const showRemaining = el.remaining;
  const showDuration = el.showDuration;

  const currentTimePhrase = showRemaining
    ? formatAsTimePhrase(0 - (endTime - currentTime))
    : formatAsTimePhrase(currentTime);

  if (!showDuration) {
    el.setAttribute('aria-valuetext', currentTimePhrase);
    return;
  }
  const totalTimePhrase = formatAsTimePhrase(endTime);
  const fullPhrase = `${currentTimePhrase} of ${totalTimePhrase}`;
  el.setAttribute('aria-valuetext', fullPhrase);
};

class MediaTimeDisplay extends MediaTextDisplay {
  #slot;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_CURRENT_TIME,
      MediaUIAttributes.MEDIA_DURATION,
      MediaUIAttributes.MEDIA_SEEKABLE,
      Attributes.REMAINING,
      Attributes.SHOW_DURATION,
      'disabled',
    ];
  }

  /** @type boolean | undefined */
  #_showDuration;
  /** @type boolean | undefined */
  #_remaining;

  constructor() {
    super();

    this.#slot = this.shadowRoot.querySelector('slot');
    this.#slot.innerHTML = `${formatTimesLabel(this)}`;

    const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
    style.setProperty('cursor', 'pointer');
  }

  connectedCallback() {
    if (!this.hasAttribute('disabled')) {
      this.enable();
    }

    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-label', nouns.PLAYBACK_TIME());

    const keyUpHandler = (evt) => {
      const { key } = evt;
      if (!ButtonPressedKeys.includes(key)) {
        this.removeEventListener('keyup', keyUpHandler);
        return;
      }

      this.toggleTimeDisplay();
    };

    this.addEventListener('keydown', (evt) => {
      const { metaKey, altKey, key } = evt;
      if (metaKey || altKey || !ButtonPressedKeys.includes(key)) {
        this.removeEventListener('keyup', keyUpHandler);
        return;
      }
      this.addEventListener('keyup', keyUpHandler);
    });

    this.addEventListener('click', this.toggleTimeDisplay);

    super.connectedCallback();
  }

  toggleTimeDisplay() {
    if (this.hasAttribute('remaining')) {
      this.removeAttribute('remaining');
    } else {
      this.setAttribute('remaining', '');
    }
  }

  disconnectedCallback() {
    this.disable();
    super.disconnectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === Attributes.SHOW_DURATION) {
      this.showDuration = newValue != null;
    } else if (attrName === Attributes.REMAINING) {
      this.remaining = newValue != null;
    } else if (
      [
        MediaUIAttributes.MEDIA_CURRENT_TIME,
        MediaUIAttributes.MEDIA_DURATION,
        MediaUIAttributes.MEDIA_SEEKABLE,
      ].includes(attrName)
    ) {
      this.update();
    } else if (attrName === 'disabled' && newValue !== oldValue) {
      if (newValue == null) {
        this.enable();
      } else {
        this.disable();
      }
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  enable() {
    this.tabIndex = 0;
  }

  disable() {
    this.tabIndex = -1;
  }

  get showDuration() {
    return this.#_showDuration ?? false;
  }

  set showDuration(val) {
    if (val === this.showDuration) return;
    this.#_showDuration = val;
    this.update();
  }

  get remaining() {
    return this.#_remaining ?? false;
  }

  set remaining(val) {
    if (val === this.remaining) return;
    this.#_remaining = val;
    this.update();
  }

  get mediaDuration() {
    const attrVal = this.getAttribute(MediaUIAttributes.MEDIA_DURATION);
    return attrVal != null ? +attrVal : undefined;
  }

  get mediaCurrentTime() {
    const attrVal = this.getAttribute(MediaUIAttributes.MEDIA_CURRENT_TIME);
    return attrVal != null ? +attrVal : undefined;
  }

  get mediaSeekable() {
    const seekable = this.getAttribute(MediaUIAttributes.MEDIA_SEEKABLE);
    if (!seekable) return undefined;
    // Only currently supports a single, contiguous seekable range (CJP)
    return seekable.split(':').map((time) => +time);
  }

  get mediaSeekableEnd() {
    const [, end] = this.mediaSeekable ?? [];
    return end;
  }

  get mediaSeekableStart() {
    const [start] = this.mediaSeekable ?? [];
    return start;
  }

  update() {
    const timesLabel = formatTimesLabel(this);
    updateAriaValueText(this);
    // Only update if it changed, timeupdate events are called a few times per second.
    if (timesLabel !== this.#slot.innerHTML) {
      this.#slot.innerHTML = timesLabel;
    }
  }
}

if (!window.customElements.get('media-time-display')) {
  window.customElements.define('media-time-display', MediaTimeDisplay);
}

export default MediaTimeDisplay;
