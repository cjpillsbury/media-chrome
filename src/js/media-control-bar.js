/*
  <media-control-bar>

  Auto position contorls in a line and set some base colors
*/
import { MediaUIAttributes } from './constants.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { getElementBySelectorOrId } from './utils/elementUtils.js';
import { Window as window, Document as document } from './utils/server-safe-globals.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      /* Need position to display above video for some reason */
      position: relative;
      box-sizing: border-box;
      display: inline-flex;

      /* Allows putting the progress range at full width on other lines */
      flex-wrap: wrap;

      color: var(--media-icon-color, #eee);
    }

    ::slotted(*), :host > * {
      /* position: relative; */
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

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        const mediaControllerEl = getElementBySelectorOrId(oldValue, attrName);
        mediaControllerEl?.unassociateDescendantsOf?.(this);
      }
      if (newValue) {
        const mediaControllerEl = getElementBySelectorOrId(newValue, attrName);
        mediaControllerEl?.associateDescendantsOf?.(this);
      }
    }
  }

  connectedCallback() {
    const mediaControllerSelector = this.getAttribute(MediaUIAttributes.MEDIA_CONTROLLER);
    if (mediaControllerSelector) {
      const mediaControllerEl = getElementBySelectorOrId(mediaControllerSelector, MediaUIAttributes.MEDIA_CONTROLLER);
      mediaControllerEl?.associateDescendantsOf?.(this);
    }
  }

  disconnectedCallback() {
    const mediaControllerSelector = this.getAttribute(MediaUIAttributes.MEDIA_CONTROLLER);
    if (mediaControllerSelector) {
      const mediaControllerEl = getElementBySelectorOrId(mediaControllerSelector, MediaUIAttributes.MEDIA_CONTROLLER);
      mediaControllerEl?.unassociateDescendantsOf?.(this);
    }
  }
}

defineCustomElement('media-control-bar', MediaControlBar);

export default MediaControlBar;
