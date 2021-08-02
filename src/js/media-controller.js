/*
  The <media-chrome> can contain the control elements
  and the media element. Features:
  * Auto-set the `media` attribute on child media chrome elements
    * Uses the element with slot="media"
  * Take custom controls to fullscreen
  * Position controls at the bottom
  * Auto-hide controls on inactivity while playing
*/
import MediaContainer from './media-container.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Window as window, Document as document } from './utils/server-safe-globals.js';
import { fullscreenApi } from './utils/fullscreenApi.js';
import { constToCamel } from './utils/stringUtils.js';

import { MediaUIEvents, MediaUIAttributes } from './constants.js';
const {
  MEDIA_PLAY_REQUEST,
  MEDIA_PAUSE_REQUEST,
  MEDIA_MUTE_REQUEST,
  MEDIA_UNMUTE_REQUEST,
  MEDIA_VOLUME_REQUEST,
  MEDIA_ENTER_FULLSCREEN_REQUEST,
  MEDIA_EXIT_FULLSCREEN_REQUEST,
  MEDIA_SEEK_REQUEST,
  MEDIA_PREVIEW_REQUEST,
  MEDIA_ENTER_PIP_REQUEST,
  MEDIA_EXIT_PIP_REQUEST,
  MEDIA_PLAYBACK_RATE_REQUEST,
} = MediaUIEvents;

class MediaController extends MediaContainer {
  constructor() {
    super();

    // Track externally associated control elements
    this.associatedElements = [];

    const mutationCallback = (mutationsList, _observer) => {
      const { addedNodes, removedNodes } = toNextMediaChromeNodesState(mutationsList);
      addedNodes.forEach(this.associateElement.bind(this));
      removedNodes.forEach(this.unassociateElement.bind(this));
    };

    const observer = new MutationObserver(mutationCallback);
    observer.observe(this, { childList: true, attributes: true, subtree: true });

    /** option 2, controller side */
    this.addEventListener(MediaUIEvents.MEDIA_CHROME_ELEMENT_CONNECTED, ({ target, path = [] }) => {
      const el = path?.[0] ?? target;
      this.associateElement(el);
    });
    this.addEventListener(MediaUIEvents.MEDIA_CHROME_ELEMENT_DISCONNECTED,  ({ target, path = [] }) => {
      const el = path?.[0] ?? target;
      this.unassociateElement(el);
    });

    // Capture request events from internal controls
    const mediaUIEventHandlers = {
      MEDIA_PLAY_REQUEST: () => this.media.play(),
      MEDIA_PAUSE_REQUEST: () => this.media.pause(),
      MEDIA_MUTE_REQUEST: () => this.media.muted = true,
      MEDIA_UNMUTE_REQUEST: () => {
        const media = this.media;

        media.muted = false;

        // Avoid confusion by bumping the volume on unmute
        if (media.volume === 0) {
          media.volume = 0.25;
        }
      },
      MEDIA_VOLUME_REQUEST: (e) => {
        const media = this.media;
        const volume = e.detail;

        media.volume = volume;

        // If the viewer moves the volume we should unmute for them.
        if (volume > 0 && media.muted) {
          media.muted = false;
        }

        // Store the last set volume as a local preference, if ls is supported
        try {
          window.localStorage.setItem(
            'media-chrome-pref-volume',
            volume.toString()
          );
        } catch (err) { }
      },

      // This current assumes that the media controller is the fullscreen element
      // which may be true in most cases but not all.
      // The prior version of media-chrome support alt fullscreen elements
      // and that's something we can work towards here
      MEDIA_ENTER_FULLSCREEN_REQUEST: () => {
        const docOrRoot = this.getRootNode();

        if (docOrRoot.pictureInPictureElement) {
          // Should be async
          docOrRoot.exitPictureInPicture();
        }

        super[fullscreenApi.enter]();
      },
      MEDIA_EXIT_FULLSCREEN_REQUEST: () => {
        this.getRootNode()[fullscreenApi.exit]();
      },
      MEDIA_ENTER_PIP_REQUEST: () => {
        const docOrRoot = this.getRootNode();
        const media = this.media;

        if (!docOrRoot.pictureInPictureEnabled) return;

        // Exit fullscreen if needed
        if (docOrRoot[fullscreenApi.element]) {
          docOrRoot[fullscreenApi.exit]();
        }

        media.requestPictureInPicture();
      },
      MEDIA_EXIT_PIP_REQUEST: () => {
        const docOrRoot = this.getRootNode();

        if (docOrRoot.exitPictureInPicture) docOrRoot.exitPictureInPicture();
      },
      MEDIA_SEEK_REQUEST: (e) => {
        const media = this.media;
        const time = e.detail;

        // Can't set the time before the media is ready
        // Ignore if readyState isn't supported
        if (media.readyState > 0 || media.readyState === undefined) {
          media.currentTime = time;
        }
      },
      MEDIA_PLAYBACK_RATE_REQUEST: (e) => {
        this.media.playbackRate = e.detail;
        this.propagateMediaState('media-playback-rate', this.media.playbackRate);
      },
      MEDIA_PREVIEW_REQUEST: (e) => {
        const media = this.media;
        const time = e.detail;

        if (media && media.textTracks && media.textTracks.length) {
          let track = Array.prototype.find.call(media.textTracks, (t) => {
            return t.label == 'thumbnails';
          });

          if (!track) return;
          if (!track.cues) return;

          let cue = Array.prototype.find.call(track.cues, c => c.startTime >= time);

          if (cue) {
            const url = new URL(cue.text);
            const previewCoordsStr = new URLSearchParams(url.hash).get('#xywh');
            this.propagateMediaState('media-preview-image', url.href);
            this.propagateMediaState('media-preview-coords', previewCoordsStr.split(',').join(' '));
          }
        }
      }
    };

    // Apply ui event listeners
    Object.keys(mediaUIEventHandlers).forEach((key) => {
      const handlerName = `_handle${constToCamel(key, true)}`;

      this[handlerName] = (e) => {
        // Stop media UI events from continuing to bubble
        e.stopPropagation();

        if (!this.media) {
          console.warn('MediaController: No media available.');
          return;
        }

        mediaUIEventHandlers[key](e, this.media);
      };
      this.addEventListener(MediaUIEvents[key], this[handlerName]);
    });

    // Pass media state to child and associated control elements
    this._mediaStatePropagators = {
      'play,pause': () => {
        this.propagateMediaState('media-paused', this.media.paused);
      },
      'volumechange': () => {
        const { muted, volume } = this.media;

        let level = 'high';
        if (volume == 0 || muted) {
          level = 'off';
        } else if (volume < 0.5) {
          level = 'low';
        } else if (volume < 0.75) {
          level = 'medium';
        }

        this.propagateMediaState('media-muted', muted);
        this.propagateMediaState('media-volume', volume);
        this.propagateMediaState('media-volume-level', level);
      },
      [fullscreenApi.event]: () => {
        // Might be in the shadow dom
        const fullscreenEl = this.getRootNode()[fullscreenApi.element];
        this.propagateMediaState('media-is-fullscreen', fullscreenEl === this);
      },
      'enterpictureinpicture,leavepictureinpicture': (e) => {
        let isPip;

        // Rely on event type for state first
        // in case this doesn't work well for custom elements using internal <video>
        if (e) {
          isPip = e.type == 'enterpictureinpicture';
        } else {
          isPip = this.media == this.getRootNode().pictureInPictureElement
        }
        this.propagateMediaState('media-is-pip', isPip);
      },
      'timeupdate,loadedmetadata': () => {
        this.propagateMediaState('media-current-time', this.media.currentTime);
      },
      'durationchange,loadedmetadata': () => {
        this.propagateMediaState('media-duration', this.media.duration);
      },
      'ratechange': () => {
        this.propagateMediaState('media-playback-rate', this.media.playbackRate);
      }
    }

    this.associateElement(this);
  }

  connectedCallback() {
    const addedNodes = toMediaChromeNodeDescendantsOf(this);
    addedNodes.forEach(this.associateElement.bind(this));
    super.connectedCallback();
  }

  mediaSetCallback(media) {
    // Might wait for custom media el to be ready
    if (!super.mediaSetCallback(media)) return;

    // Listen for media state changes and propagate them to children and associated els
    Object.keys(this._mediaStatePropagators).forEach((key) => {
      const events = key.split(',');
      const handler = this._mediaStatePropagators[key];

      events.forEach((event) => {
        // If this is fullscreen apply to the document
        const target = (event == fullscreenApi.event) ? this.getRootNode() : media;

        target.addEventListener(event, handler);
      });
      handler();
    });

    // Update the media with the last set volume preference
    // This would preferably live with the media element,
    // not a control.
    try {
      const volPref = window.localStorage.getItem('media-chrome-pref-volume');
      if (volPref !== null) media.volume = volPref;
    } catch (e) {
      console.debug('Error getting volume pref', e);
    }
  }

  mediaUnsetCallback(media) {
    super.mediaUnsetCallback(media);

    // Remove all state change propagators
    Object.keys(this._mediaStatePropagators).forEach((key) => {
      const { events, handler } = this.mediaStatePropagators[key];

      events.forEach((event) => {
        const target = (event == fullscreenApi.event) ? this.getRootNode() : media;
        target.removeEventListener(event, handler);
      });
    });

    // Reset to paused state
    this.propagateMediaState('media-paused', true);
  }

  propagateMediaState(stateName, state) {
    propagateMediaState(this.associatedElements, stateName, state);
  }

  associateElement(el) {
    if (!el) return;
    const els = this.associatedElements;
    const index = els.indexOf(el);
    if (index > -1) return;

    els.push(el);

    // TODO: Update to handle all request events
    // Could just attach all releveant listeners to every associated el
    // or could use the `on${eventName}` prop detection method to know
    // which events the el intends to dispatch
    // The latter requires authors to actually follow that paradigm
    // which is probably a stretch
    Object.keys(MediaUIEvents).forEach((key) => {
      el.addEventListener(MediaUIEvents[key], this[`_handle${constToCamel(key, true)}`]);
    });

    // TODO: Update to propagate all states when registered
    if (this.media) {
      propagateMediaState([el], 'media-paused', this.media.paused);
      // propagateMediaState([el], 'media-volume-level', level);
      propagateMediaState([el], 'media-muted', this.media.muted);
      propagateMediaState([el], 'media-volume', this.media.volume);
      // const fullscreenEl = this.getRootNode()[fullscreenApi.element];
      // propagateMediaState([el], 'media-is-fullscreen', fullscreenEl === this);
      // propagateMediaState([el], 'media-is-pip', isPip);
      propagateMediaState([el], 'media-current-time', this.media.currentTime);
      propagateMediaState([el], 'media-duration', this.media.duration);
      propagateMediaState([el], 'media-playback-rate', this.media.playbackRate);
    }
  }

  unassociateElement(el) {
    const els = this.associatedElements;

    const index = els.indexOf(el);
    if (index < 0) return;
    
    els.splice(index, 1);
    // Remove all media UI event listeners
    Object.keys(MediaUIEvents).forEach((key) => {
      el.removeEventListener(MediaUIEvents[key], this[`_handle${constToCamel(key, true)}`]);
    });
  }

  // Mimick the media element API, but use it to dispatch media UI events
  // so that everything happens through the events.
  // Not sure how far we should take this API
  play() {
    this.dispatchMediaEvent(MEDIA_PLAY_REQUEST);
  }

  pause() {
    this.dispatchMediaEvent(MEDIA_PAUSE_REQUEST);
  }

  get muted() {
    return !!(this.media && this.media.muted);
  }

  set muted(mute) {
    const event = (mute) ? MEDIA_MUTE_REQUEST : MEDIA_UNMUTE_REQUEST;
    this.dispatchMediaEvent(event);
  }

  get volume() {
    const media = this.media;

    return media ? media.volume : 1;
  }

  set volume(volume) {
    this.dispatchMediaEvent(MEDIA_VOLUME_REQUEST, {
      detail: volume
    });
  }

  requestFullscreen() {
    this.dispatchMediaEvent(MEDIA_ENTER_FULLSCREEN_REQUEST);
  }

  exitFullscreen() {
    this.dispatchMediaEvent(MEDIA_EXIT_FULLSCREEN_REQUEST);
  }

  get currentTime() {
    const media = this.media;

    return media ? media.currentTime : 0;
  }

  set currentTime(time) {
    this.dispatchMediaEvent(MEDIA_SEEK_REQUEST, {
      detail: time
    });
  }

  get playbackRate() {
    const media = this.media;

    return media ? media.currentTime : 1;
  }

  set playbackRate(rate) {
    this.dispatchMediaEvent(MEDIA_PLAYBACK_RATE_REQUEST, {
      detail: rate
    });
  }

  requestPictureInPicture() {
    this.dispatchMediaEvent(MEDIA_ENTER_PIP_REQUEST, {
      detail: time
    });
  }

  exitPictureInPicture() {
    this.dispatchMediaEvent(MEDIA_EXIT_PIP_REQUEST, {
      detail: time
    });
  }

  requestPreview(time) {
    this.dispatchMediaEvent(MEDIA_PREVIEW_REQUEST, {
      detail: time
    });
  }
}

const MEDIA_CONTROLLER_ATTRIBUTES = Object.values(MediaUIAttributes);

const getMediaControllerAttributesFrom = (child) => {
  const { constructor: { observedAttributes } } = child;
  const mediaChromeAttributesList = child?.getAttribute?.(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES)?.split?.(/\s+/);
  if (!Array.isArray(observedAttributes || mediaChromeAttributesList)) return [];
  return (observedAttributes || mediaChromeAttributesList).filter(attrName => MEDIA_CONTROLLER_ATTRIBUTES.includes(attrName));
}

const isMediaControllerElement = (child) => !!getMediaControllerAttributesFrom(child).length;

const setAttr = (child, attrName, attrValue) => {
  if (typeof attrValue === 'boolean') {
    if (attrValue) return child.setAttribute(attrName, '');
    return child.removeAttribute(attrName);
  }
  return child.setAttribute(attrName, attrValue);
}

const toMediaChromeNodeDescendantsOf = (rootNode) => {
  const { childNodes } = rootNode;
  const seedNodes = isMediaControllerElement(rootNode) ? [rootNode] : [];
  /* leaf node that is either a mediaChromeNode or not */
  if (!(childNodes && childNodes.length)) return seedNodes;
  return [
    ...seedNodes,
    ...Array.prototype.flatMap.call(childNodes, toMediaChromeNodeDescendantsOf)
  ];
};

const toNextMediaChromeNodesState = (mutationsList = []) => {
  const mediaChromeNodesState = mutationsList.reduce((prevMediaChromeNodesState, mutationRecord) => {
    const { addedNodes = [], removedNodes = [], type, target, attributeName } = mutationRecord;
    if (type === 'childList') {
      const addedMediaChromeNodes = Array.prototype.filter.call(addedNodes, isMediaControllerElement);
      const removedMediaChromeNodes = Array.prototype.filter.call(removedNodes, isMediaControllerElement);
      prevMediaChromeNodesState.addedNodes.push(...addedMediaChromeNodes);
      prevMediaChromeNodesState.removedNodes.push(...removedMediaChromeNodes);
      return prevMediaChromeNodesState;
    }
    /** option 1, controller side */
    if (type === 'attributes' && attributeName === MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES) {
      const attrs = getMediaControllerAttributesFrom(target);
      if (attrs.length) {
        prevMediaChromeNodesState.addedNodes.push(target);
      }
      else {
        prevMediaChromeNodesState.removedNodes.push(target);
      }
      return prevMediaChromeNodesState;
    }
    return prevMediaChromeNodesState;
  }, {
    addedNodes: [],
    removedNodes: [],
  });
  return mediaChromeNodesState;
};

const propagateMediaState = (els, stateName, val) => {
  els.forEach(el => {
    /** @TODO confirm this is still needed; otherwise, remove (CJP) */
    // Don't propagate into media elements, UI can't live in <video>
    // so just avoid potential conflicts
    if (el.slot === 'media') return;
    
    const relevantAttrs = getMediaControllerAttributesFrom(el);
    if (!relevantAttrs.includes(stateName)) return;

    setAttr(el, stateName, val);
  });
}

defineCustomElement('media-controller', MediaController);

export default MediaController;
