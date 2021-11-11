import {MediaUIAttributes} from "./constants.js";
import {defineCustomElement} from "./utils/defineCustomElement.js";
import {Window as window, Document as document} from "./utils/server-safe-globals.js";
const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      /* Need position to display above video for some reason */
      box-sizing: border-box;
      display: inline-flex;

      color: var(--media-icon-color, #eee);
    }

    media-time-range,
    ::slotted(media-time-range),
    ::slotted(media-progress-range),
    ::slotted(media-clip-selector) {
      flex-grow: 1;
    }
  </style>

  <slot></slot>
`;
class MediaControlBar extends window.HTMLElement {
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_CONTROLLER];
  }
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    var _a, _b;
    if (attrName === MediaUIAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        const mediaControllerEl = document.getElementById(oldValue);
        (_a = mediaControllerEl == null ? void 0 : mediaControllerEl.unassociateElement) == null ? void 0 : _a.call(mediaControllerEl, this);
      }
      if (newValue) {
        const mediaControllerEl = document.getElementById(newValue);
        (_b = mediaControllerEl == null ? void 0 : mediaControllerEl.associateElement) == null ? void 0 : _b.call(mediaControllerEl, this);
      }
    }
  }
  connectedCallback() {
    var _a;
    const mediaControllerId2 = this.getAttribute(MediaUIAttributes.MEDIA_CONTROLLER);
    if (mediaControllerId2) {
      const mediaControllerEl = document.getElementById(mediaControllerId2);
      (_a = mediaControllerEl == null ? void 0 : mediaControllerEl.associateElement) == null ? void 0 : _a.call(mediaControllerEl, this);
    }
  }
  disconnectedCallback() {
    var _a;
    const mediaControllerSelector = this.getAttribute(MediaUIAttributes.MEDIA_CONTROLLER);
    if (mediaControllerSelector) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      (_a = mediaControllerEl == null ? void 0 : mediaControllerEl.unassociateElement) == null ? void 0 : _a.call(mediaControllerEl, this);
    }
  }
}
defineCustomElement("media-control-bar", MediaControlBar);
export default MediaControlBar;
