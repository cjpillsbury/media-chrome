/*
  <media-thumbnail-preview media="#myVideo" time="10.00">

  Uses the "thumbnails" track of a video element to show an image relative to
  the video time given in the `time` attribute.
*/
import { Window as window, Document as document } from './utils/server-safe-globals.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MediaUIEvents, MediaUIAttributes } from './constants';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      background-color: #000;
      width: 284px;
      height: 160px;
      overflow: hidden;
    }

    img {
      position: absolute;
      left: 0;
      top: 0;
    }
  </style>
  <img crossorigin loading="eager" decoding="async" />
`;

class MediaThumbnailPreviewElement extends window.HTMLElement {
  static get observedAttributes() {
    return ['time', MediaUIAttributes.MEDIA_PREVIEW_IMAGE, MediaUIAttributes.MEDIA_PREVIEW_COORDS];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    /** Option 1 */
    const detail = this.constructor.observedAttributes;
    const evt = new window.CustomEvent(MediaUIEvents.MEDIA_CHROME_ELEMENT_CONNECTED, { composed: true, bubbles: true, detail });
    this.dispatchEvent(evt);
    /** Option 2 */
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
  }

  attributeChangedCallback(attrName, _oldValue, newValue) {
    this.update();
  }

  update() {
    const mediaPreviewCoordsStr = this.getAttribute(MediaUIAttributes.MEDIA_PREVIEW_COORDS);
    const mediaPreviewImage = this.getAttribute(MediaUIAttributes.MEDIA_PREVIEW_IMAGE);
    if (!(mediaPreviewCoordsStr && mediaPreviewImage)) return;
    // const { offsetWidth } = this;
    const offsetWidth = this.offsetWidth;
    const img = this.shadowRoot.querySelector('img');
    const [x,y,w,_h] = mediaPreviewCoordsStr.split(/\s+/).map(coord => +coord);
    const src = mediaPreviewImage;
    const scale = (offsetWidth / w) || 1;

    const resize = () => {
      img.style.width = `${scale * img.naturalWidth}px`;
      img.style.height = `${scale * img.naturalHeight}px`;
    };

    if (img.src !== src) {
      img.onload = resize;
      img.src = src;
      resize();
    }

    resize();
    img.style.left = `-${scale * x}px`;
    img.style.top = `-${scale * y}px`;
  }
}

defineCustomElement('media-thumbnail-preview', MediaThumbnailPreviewElement);

export default MediaThumbnailPreviewElement;