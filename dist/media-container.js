import {defineCustomElement} from "./utils/defineCustomElement.js";
import {Window as window, Document as document} from "./utils/server-safe-globals.js";
import {MediaUIEvents, MediaUIAttributes} from "./constants.js";
import {nouns} from "./labels/labels.js";
const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      background-color: #000;
    }

    :host(:not([audio])) *[part~=layer] {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-flow: column nowrap;
      align-items: start;
      pointer-events: none;
      background: none;
    }

    :host(:not([audio])) :is([part~=gestures-layer],[part~=media-layer]) {
      pointer-events: auto;
    }
    
    :host(:not([audio])) *[part~=layer][part~=centered-layer] {
      align-items: center;
      justify-content: center;
    }

    .spacer {
      pointer-events: none;
      background: none;
    }

    /* Position the media element to fill the container */
    ::slotted([slot=media]) {
      width: 100%;
      height: 100%;
    }

    /* Video specific styles */
    :host(:not([audio])) {
      aspect-ratio: var(--media-aspect-ratio, auto 3 / 2);
      width: 720px;
    }

    :host(:not([audio])) .spacer {
      flex-grow: 1;
    }

    @supports not (aspect-ratio: 1 / 1) {
      :host(:not([audio])) {
        height: 480px;
      }
    }

    /* Safari needs this to actually make the element fill the window */
    :host(:-webkit-full-screen) {
      /* Needs to use !important otherwise easy to break */
      width: 100% !important;
      height: 100% !important;
    }

    /* Hide controls when inactive and not paused and not audio */
    ::slotted(:not([slot=media])) {
      opacity: 1;
      transition: opacity 0.25s;
      visibility: visible;
      pointer-events: auto;
    }

    ::slotted(media-control-bar)  {
      align-self: stretch;
    }

    :host([user-inactive]:not([${MediaUIAttributes.MEDIA_PAUSED}]):not([audio])) ::slotted(:not([slot=media])) {
      opacity: 0;
      transition: opacity 1s;
    }
  </style>

  <span part="layer media-layer">
    <slot name="media"></slot>
  </span>
  <span part="layer gesture-layer">
    <slot name="gestures-chrome"></slot>
  </span>
  <span part="layer vertical-layer">
    <slot name="top-chrome"></slot>
    <span class="spacer"><slot name="middle-chrome"></slot></span>
    <!-- default, effectively "bottom-chrome" -->
    <slot></slot>
  </span>
  <span part="layer centered-layer">
    <slot name="centered-chrome"></slot>
  </span>
`;
const MEDIA_UI_ATTRIBUTE_NAMES = Object.values(MediaUIAttributes);
class MediaContainer extends window.HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const mutationCallback = (mutationsList, observer2) => {
      const media = this.media;
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.removedNodes.forEach((node) => {
            if (node.slot == "media" && mutation.target == this) {
              let previousSibling = mutation.previousSibling && mutation.previousSibling.previousElementSibling;
              if (!previousSibling || !media) {
                this.mediaUnsetCallback(node);
              } else {
                let wasFirst = previousSibling.slot !== "media";
                while ((previousSibling = previousSibling.previousSibling) !== null) {
                  if (previousSibling.slot == "media")
                    wasFirst = false;
                }
                if (wasFirst)
                  this.mediaUnsetCallback(node);
              }
            }
          });
          if (media) {
            mutation.addedNodes.forEach((node) => {
              if (node == media) {
                this.mediaSetCallback(node);
              }
            });
          }
        }
      }
    };
    const observer = new MutationObserver(mutationCallback);
    observer.observe(this, {childList: true, subtree: true});
  }
  static get observedAttributes() {
    return ["autohide"].concat(MEDIA_UI_ATTRIBUTE_NAMES);
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName.toLowerCase() == "autohide") {
      this.autohide = newValue;
    }
  }
  get media() {
    let media = this.querySelector(":scope > [slot=media]");
    if ((media == null ? void 0 : media.nodeName) == "SLOT")
      media = media.assignedElements({flatten: true})[0];
    return media;
  }
  mediaSetCallback(media) {
    if (!media) {
      console.error('<media-chrome>: Media element set with slot="media" does not appear to be compatible.', media);
      return false;
    }
    const mediaName = media.nodeName.toLowerCase();
    if (mediaName.includes("-") && !window.customElements.get(mediaName)) {
      window.customElements.whenDefined(mediaName).then(() => {
        this.mediaSetCallback(media);
      });
      return false;
    }
    this._mediaClickPlayToggle = (e) => {
      const eventName = media.paused ? MediaUIEvents.MEDIA_PLAY_REQUEST : MediaUIEvents.MEDIA_PAUSE_REQUEST;
      this.dispatchEvent(new window.CustomEvent(eventName, {composed: true, bubbles: true}));
    };
    return true;
  }
  mediaUnsetCallback(media) {
  }
  connectedCallback() {
    const isAudioChrome = this.getAttribute("audio") != null;
    const label = isAudioChrome ? nouns.AUDIO_PLAYER() : nouns.VIDEO_PLAYER();
    this.setAttribute("role", "region");
    this.setAttribute("aria-label", label);
    if (this.media) {
      this.mediaSetCallback(this.media);
    }
    const scheduleInactive = () => {
      this.removeAttribute("user-inactive");
      window.clearTimeout(this.inactiveTimeout);
      if (this.autohide < 0)
        return;
      this.inactiveTimeout = window.setTimeout(() => {
        this.setAttribute("user-inactive", "user-inactive");
      }, this.autohide * 1e3);
    };
    this.addEventListener("keyup", (e) => {
      scheduleInactive();
    });
    this.addEventListener("keyup", (e) => {
      this.setAttribute("media-keyboard-control", "media-keyboard-control");
    });
    this.addEventListener("mouseup", (e) => {
      this.removeAttribute("media-keyboard-control");
    });
    this.addEventListener("mousemove", (e) => {
      if (e.target === this)
        return;
      this.removeAttribute("user-inactive");
      window.clearTimeout(this.inactiveTimeout);
      if (e.target === this.media) {
        scheduleInactive();
      }
    });
    this.addEventListener("mouseout", (e) => {
      if (this.autohide > -1)
        this.setAttribute("user-inactive", "user-inactive");
    });
  }
  set autohide(seconds) {
    seconds = Number(seconds);
    this._autohide = isNaN(seconds) ? 0 : seconds;
  }
  get autohide() {
    return this._autohide === void 0 ? 2 : this._autohide;
  }
}
defineCustomElement("media-container-temp", MediaContainer);
export default MediaContainer;
