import MediaChromeButton from './media-chrome-button.js';
import { Window as window, Document as document } from './utils/server-safe-globals.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';

const playIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
const pauseIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_PAUSED}]) slot[name=pause] > *, 
  :host([${MediaUIAttributes.MEDIA_PAUSED}]) ::slotted([slot=pause]) {
    display: none;
  }

  :host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) slot[name=play] > *, 
  :host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) ::slotted([slot=play]) {
    display: none;
  }
  </style>

  <slot name="play">${playIcon}</slot>
  <slot name="pause">${pauseIcon}</slot>
`;

class MediaPlayButton extends MediaChromeButton {

  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_PAUSED];
  }

  constructor(options={}) {
    super({ slotTemplate, ...options });
    
    const resizeBorderBoxObserver = new ResizeObserver((entries) => {
      Array.prototype.forEach.call(entries, entry => console.log('RESIZE BORDER BOX ENTRY', entry));
    });
    resizeBorderBoxObserver.observe(this, { box: 'border-box' });
    
    const resizeContentBoxObserver = new ResizeObserver((entries) => {
      Array.prototype.forEach.call(entries, entry => console.log('RESIZE CONTENT BOX ENTRY', entry));
    });
    resizeContentBoxObserver.observe(this, { box: 'content-box' });
  }

  connectedCallback() {
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
  }

  handleClick(_e) {
    const eventName = (this.getAttribute(MediaUIAttributes.MEDIA_PAUSED) != null)
      ? MediaUIEvents.MEDIA_PLAY_REQUEST
      : MediaUIEvents.MEDIA_PAUSE_REQUEST;
    this.dispatchEvent(new window.CustomEvent(eventName, { composed: true, bubbles: true }));
  }
}

defineCustomElement('media-play-button', MediaPlayButton);

export default MediaPlayButton;
