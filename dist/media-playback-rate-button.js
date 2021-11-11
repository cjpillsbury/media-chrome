import MediaChromeButton from "./media-chrome-button.js";
import {defineCustomElement} from "./utils/defineCustomElement.js";
import {Window as window, Document as document} from "./utils/server-safe-globals.js";
import {MediaUIEvents, MediaUIAttributes} from "./constants.js";
import {nouns} from "./labels/labels.js";
const DEFAULT_RATES = [1, 1.25, 1.5, 1.75, 2];
const DEFAULT_RATE = 1;
const slotTemplate = document.createElement("template");
slotTemplate.innerHTML = `
  <style>
  :host {
    font-size: 14px;
    line-height: 24px;
    font-weight: bold;
  }

  #container {
    height: var(--media-text-content-height, 24px);
  }
  </style>

  <span id="container"></span>
`;
class MediaPlaybackRateButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_PLAYBACK_RATE, "rates"];
  }
  constructor(options = {}) {
    super({slotTemplate, ...options});
    this._rates = DEFAULT_RATES;
    this.container = this.shadowRoot.querySelector("#container");
    this.container.innerHTML = `${DEFAULT_RATE}x`;
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "rates") {
      const newRates = (newValue != null ? newValue : "").split(/,\s?/).map((str) => str ? +str : Number.NaN).filter((num) => !Number.isNaN(num)).sort();
      this._rates = newRates.length ? newRates : DEFAULT_RATES;
      return;
    }
    if (attrName === MediaUIAttributes.MEDIA_PLAYBACK_RATE) {
      const newPlaybackRate = newValue ? +newValue : Number.NaN;
      const playbackRate = !Number.isNaN(newPlaybackRate) ? newPlaybackRate : DEFAULT_RATE;
      this.container.innerHTML = `${playbackRate}x`;
      this.setAttribute("aria-label", nouns.PLAYBACK_RATE({playbackRate}));
      return;
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
  handleClick(_e) {
    var _a, _b;
    const currentRate = +this.getAttribute(MediaUIAttributes.MEDIA_PLAYBACK_RATE) || DEFAULT_RATE;
    const detail = (_b = (_a = this._rates.find((r) => r > currentRate)) != null ? _a : this._rates[0]) != null ? _b : DEFAULT_RATE;
    const evt = new window.CustomEvent(MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST, {composed: true, bubbles: true, detail});
    this.dispatchEvent(evt);
  }
}
defineCustomElement("media-playback-rate-button", MediaPlaybackRateButton);
export default MediaPlaybackRateButton;
