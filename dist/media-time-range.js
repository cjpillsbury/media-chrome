import MediaChromeRange from "./media-chrome-range.js";
import {defineCustomElement} from "./utils/defineCustomElement.js";
import {
  Window as window,
  Document as document
} from "./utils/server-safe-globals.js";
import {MediaUIEvents, MediaUIAttributes} from "./constants.js";
import {nouns} from "./labels/labels.js";
import {formatAsTimePhrase} from "./utils/time.js";
const DEFAULT_MISSING_TIME_PHRASE = "video not loaded, unknown time.";
const updateAriaValueText = (el) => {
  const range = el.range;
  const currentTimePhrase = formatAsTimePhrase(+range.value);
  const totalTimePhrase = formatAsTimePhrase(+range.max);
  const fullPhrase = !(currentTimePhrase && totalTimePhrase) ? DEFAULT_MISSING_TIME_PHRASE : `${currentTimePhrase} of ${totalTimePhrase}`;
  range.setAttribute("aria-valuetext", fullPhrase);
};
const template = document.createElement("template");
template.innerHTML = `
  <style>
    #thumbnailContainer {
      display: none;
      position: absolute;
      top: 0;
    }

    media-thumbnail-preview {
      position: absolute;
      bottom: 10px;
      border: 2px solid #fff;
      border-radius: 2px;
      background-color: #000;
      width: 160px;
      height: 90px;

      /* Negative offset of half to center on the handle */
      margin-left: -80px;
    }

    /* Can't get this working. Trying a downward triangle. */
    /* media-thumbnail-preview::after {
      content: "";
      display: block;
      width: 300px;
      height: 300px;
      margin: 100px;
      background-color: #ff0;
    } */

    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]:hover) #thumbnailContainer {
      display: block;
      animation: fadeIn ease 0.5s;
    }

    @keyframes fadeIn {
      0% {
        /* transform-origin: bottom center; */
        /* transform: scale(0.7); */
        margin-top: 10px;
        opacity: 0;
      }
      100% {
        /* transform-origin: bottom center; */
        /* transform: scale(1); */
        margin-top: 0;
        opacity: 1;
      }
    }
  </style>
  <div id="thumbnailContainer">
    <media-thumbnail-preview></media-thumbnail-preview>
  </div>
`;
class MediaTimeRange extends MediaChromeRange {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      "thumbnails",
      MediaUIAttributes.MEDIA_DURATION,
      MediaUIAttributes.MEDIA_CURRENT_TIME,
      MediaUIAttributes.MEDIA_PREVIEW_IMAGE
    ];
  }
  constructor() {
    super();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.range.addEventListener("input", () => {
      const newTime = this.range.value;
      const detail = newTime;
      const evt = new window.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
        composed: true,
        bubbles: true,
        detail
      });
      this.dispatchEvent(evt);
    });
    this.enableThumbnails();
  }
  connectedCallback() {
    this.range.setAttribute("aria-label", nouns.SEEK());
    super.connectedCallback();
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_CURRENT_TIME) {
      this.range.value = +newValue;
      updateAriaValueText(this);
      this.updateBar();
    }
    if (attrName === MediaUIAttributes.MEDIA_DURATION) {
      this.range.max = +newValue;
      updateAriaValueText(this);
      this.updateBar();
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
  getBarColors() {
    let colorsArray = super.getBarColors();
    if (!this.mediaBuffered || !this.mediaBuffered.length || this.mediaDuration <= 0) {
      return colorsArray;
    }
    const buffered = this.mediaBuffered;
    const buffPercent = buffered[buffered.length - 1][1] / this.mediaDuration * 100;
    colorsArray.splice(1, 0, [
      "var(--media-time-buffered-color, #777)",
      buffPercent
    ]);
    return colorsArray;
  }
  enableThumbnails() {
    this.thumbnailPreview = this.shadowRoot.querySelector("media-thumbnail-preview");
    const thumbnailContainer = this.shadowRoot.querySelector("#thumbnailContainer");
    thumbnailContainer.classList.add("enabled");
    let mouseMoveHandler;
    const trackMouse = () => {
      mouseMoveHandler = (evt) => {
        const duration = +this.getAttribute(MediaUIAttributes.MEDIA_DURATION);
        if (!duration)
          return;
        const rangeRect = this.range.getBoundingClientRect();
        let mousePercent = (evt.clientX - rangeRect.left) / rangeRect.width;
        mousePercent = Math.max(0, Math.min(1, mousePercent));
        const leftPadding = rangeRect.left - this.getBoundingClientRect().left;
        const thumbnailLeft = leftPadding + mousePercent * rangeRect.width;
        this.thumbnailPreview.style.left = `${thumbnailLeft}px`;
        const detail = mousePercent * duration;
        const mediaPreviewEvt = new window.CustomEvent(MediaUIEvents.MEDIA_PREVIEW_REQUEST, {composed: true, bubbles: true, detail});
        this.dispatchEvent(mediaPreviewEvt);
      };
      window.addEventListener("mousemove", mouseMoveHandler, false);
    };
    const stopTrackingMouse = () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
    };
    let rangeEntered = false;
    let rangeMouseMoveHander = (evt) => {
      const mediaDurationStr = this.getAttribute(MediaUIAttributes.MEDIA_DURATION);
      if (!rangeEntered && mediaDurationStr) {
        rangeEntered = true;
        trackMouse();
        let offRangeHandler = (evt2) => {
          if (evt2.target != this && !this.contains(evt2.target)) {
            window.removeEventListener("mousemove", offRangeHandler);
            rangeEntered = false;
            stopTrackingMouse();
          }
        };
        window.addEventListener("mousemove", offRangeHandler, false);
      }
    };
    this.addEventListener("mousemove", rangeMouseMoveHander, false);
  }
}
defineCustomElement("media-time-range", MediaTimeRange);
export default MediaTimeRange;
