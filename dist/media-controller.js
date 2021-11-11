import MediaContainer from "./media-container.js";
import {defineCustomElement} from "./utils/defineCustomElement.js";
import {Window as window, Document as document} from "./utils/server-safe-globals.js";
import {fullscreenApi} from "./utils/fullscreenApi.js";
import {constToCamel} from "./utils/stringUtils.js";
import {MediaUIEvents, MediaUIAttributes, TextTrackKinds, TextTrackModes} from "./constants.js";
import {stringifyTextTrackList, getTextTracksList, updateTracksModeTo} from "./utils/captions.js";
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
  MEDIA_PLAYBACK_RATE_REQUEST
} = MediaUIEvents;
class MediaController extends MediaContainer {
  constructor() {
    super();
    this.mediaStateReceivers = [];
    this.associatedElementSubscriptions = new Map();
    this.associatedElements = [];
    this.associateElement(this);
    const mediaUIEventHandlers = {
      MEDIA_PLAY_REQUEST: () => this.media.play(),
      MEDIA_PAUSE_REQUEST: () => this.media.pause(),
      MEDIA_MUTE_REQUEST: () => this.media.muted = true,
      MEDIA_UNMUTE_REQUEST: () => {
        const media = this.media;
        media.muted = false;
        if (media.volume === 0) {
          media.volume = 0.25;
        }
      },
      MEDIA_VOLUME_REQUEST: (e) => {
        const media = this.media;
        const volume = e.detail;
        media.volume = volume;
        if (volume > 0 && media.muted) {
          media.muted = false;
        }
        try {
          window.localStorage.setItem("media-chrome-pref-volume", volume.toString());
        } catch (err) {
        }
      },
      MEDIA_ENTER_FULLSCREEN_REQUEST: () => {
        const docOrRoot = this.getRootNode();
        if (docOrRoot.pictureInPictureElement) {
          docOrRoot.exitPictureInPicture();
        }
        super[fullscreenApi.enter]();
      },
      MEDIA_EXIT_FULLSCREEN_REQUEST: () => {
        document[fullscreenApi.exit]();
      },
      MEDIA_ENTER_PIP_REQUEST: () => {
        const docOrRoot = this.getRootNode();
        const media = this.media;
        if (!docOrRoot.pictureInPictureEnabled)
          return;
        if (docOrRoot[fullscreenApi.element]) {
          docOrRoot[fullscreenApi.exit]();
        }
        media.requestPictureInPicture();
      },
      MEDIA_EXIT_PIP_REQUEST: () => {
        const docOrRoot = this.getRootNode();
        if (docOrRoot.exitPictureInPicture)
          docOrRoot.exitPictureInPicture();
      },
      MEDIA_SEEK_REQUEST: (e) => {
        const media = this.media;
        const time = e.detail;
        if (media.readyState > 0 || media.readyState === void 0) {
          media.currentTime = time;
        }
      },
      MEDIA_PLAYBACK_RATE_REQUEST: (e) => {
        this.media.playbackRate = e.detail;
      },
      MEDIA_PREVIEW_REQUEST: (e) => {
        const media = this.media;
        if (!media)
          return;
        const [track] = getTextTracksList(media, {kind: TextTrackKinds.METADATA, label: "thumbnails"});
        if (!(track && track.cues))
          return;
        const time = e.detail;
        const cue = Array.prototype.find.call(track.cues, (c) => c.startTime >= time);
        if (!cue)
          return;
        const url = new URL(cue.text);
        const previewCoordsStr = new URLSearchParams(url.hash).get("#xywh");
        this.propagateMediaState(MediaUIAttributes.MEDIA_PREVIEW_IMAGE, url.href);
        this.propagateMediaState(MediaUIAttributes.MEDIA_PREVIEW_COORDS, previewCoordsStr.split(",").join(" "));
      },
      MEDIA_SHOW_CAPTIONS_REQUEST: (e) => {
        const tracks = this.captionTracks;
        const {detail: tracksToUpdate = []} = e;
        updateTracksModeTo(TextTrackModes.SHOWING, tracks, tracksToUpdate);
      },
      MEDIA_DISABLE_CAPTIONS_REQUEST: (e) => {
        const tracks = this.captionTracks;
        const {detail: tracksToUpdate = []} = e;
        updateTracksModeTo(TextTrackModes.DISABLED, tracks, tracksToUpdate);
      },
      MEDIA_SHOW_SUBTITLES_REQUEST: (e) => {
        const tracks = this.subtitleTracks;
        const {detail: tracksToUpdate = []} = e;
        updateTracksModeTo(TextTrackModes.SHOWING, tracks, tracksToUpdate);
      },
      MEDIA_DISABLE_SUBTITLES_REQUEST: (e) => {
        const tracks = this.subtitleTracks;
        const {detail: tracksToUpdate = []} = e;
        updateTracksModeTo(TextTrackModes.DISABLED, tracks, tracksToUpdate);
      }
    };
    Object.keys(mediaUIEventHandlers).forEach((key) => {
      const handlerName = `_handle${constToCamel(key, true)}`;
      this[handlerName] = (e) => {
        e.stopPropagation();
        if (!this.media) {
          console.warn("MediaController: No media available.");
          return;
        }
        mediaUIEventHandlers[key](e, this.media);
      };
      this.addEventListener(MediaUIEvents[key], this[handlerName]);
    });
    this._mediaStatePropagators = {
      "play,pause": () => {
        this.propagateMediaState(MediaUIAttributes.MEDIA_PAUSED, this.media.paused);
      },
      volumechange: () => {
        const {muted, volume} = this.media;
        let level = "high";
        if (volume == 0 || muted) {
          level = "off";
        } else if (volume < 0.5) {
          level = "low";
        } else if (volume < 0.75) {
          level = "medium";
        }
        this.propagateMediaState(MediaUIAttributes.MEDIA_MUTED, muted);
        this.propagateMediaState(MediaUIAttributes.MEDIA_VOLUME, volume);
        this.propagateMediaState(MediaUIAttributes.MEDIA_VOLUME_LEVEL, level);
      },
      [fullscreenApi.event]: () => {
        const fullscreenEl = this.getRootNode()[fullscreenApi.element];
        this.propagateMediaState(MediaUIAttributes.MEDIA_IS_FULLSCREEN, fullscreenEl === this);
      },
      "enterpictureinpicture,leavepictureinpicture": (e) => {
        let isPip;
        if (e) {
          isPip = e.type == "enterpictureinpicture";
        } else {
          isPip = this.media == this.getRootNode().pictureInPictureElement;
        }
        this.propagateMediaState(MediaUIAttributes.MEDIA_IS_PIP, isPip);
      },
      "timeupdate,loadedmetadata": () => {
        this.propagateMediaState(MediaUIAttributes.MEDIA_CURRENT_TIME, this.media.currentTime);
      },
      "durationchange,loadedmetadata": () => {
        this.propagateMediaState(MediaUIAttributes.MEDIA_DURATION, this.media.duration);
      },
      ratechange: () => {
        this.propagateMediaState(MediaUIAttributes.MEDIA_PLAYBACK_RATE, this.media.playbackRate);
      }
    };
    this._textTrackMediaStatePropagators = {
      "addtrack,removetrack": () => {
        this.propagateMediaState(MediaUIAttributes.MEDIA_CAPTIONS_LIST, stringifyTextTrackList(this.captionTracks) || void 0);
        this.propagateMediaState(MediaUIAttributes.MEDIA_SUBTITLES_LIST, stringifyTextTrackList(this.subtitleTracks) || void 0);
        this.propagateMediaState(MediaUIAttributes.MEDIA_CAPTIONS_SHOWING, stringifyTextTrackList(this.showingCaptionTracks) || void 0);
        this.propagateMediaState(MediaUIAttributes.MEDIA_SUBTITLES_SHOWING, stringifyTextTrackList(this.showingSubtitleTracks) || void 0);
      },
      change: () => {
        this.propagateMediaState(MediaUIAttributes.MEDIA_CAPTIONS_SHOWING, stringifyTextTrackList(this.showingCaptionTracks) || void 0);
        this.propagateMediaState(MediaUIAttributes.MEDIA_SUBTITLES_SHOWING, stringifyTextTrackList(this.showingSubtitleTracks) || void 0);
      }
    };
  }
  mediaSetCallback(media) {
    if (!super.mediaSetCallback(media))
      return;
    Object.keys(this._mediaStatePropagators).forEach((key) => {
      const events = key.split(",");
      const handler = this._mediaStatePropagators[key];
      events.forEach((event) => {
        const target = event == fullscreenApi.event ? this.getRootNode() : media;
        target.addEventListener(event, handler);
      });
      handler();
    });
    Object.entries(this._textTrackMediaStatePropagators).forEach(([eventsStr, handler]) => {
      const events = eventsStr.split(",");
      events.forEach((event) => {
        media.textTracks.addEventListener(event, handler);
      });
      handler();
    });
    try {
      const volPref = window.localStorage.getItem("media-chrome-pref-volume");
      if (volPref !== null)
        media.volume = volPref;
    } catch (e) {
      console.debug("Error getting volume pref", e);
    }
  }
  mediaUnsetCallback(media) {
    super.mediaUnsetCallback(media);
    Object.keys(this._mediaStatePropagators).forEach((key) => {
      const {events, handler} = this.mediaStatePropagators[key];
      events.forEach((event) => {
        const target = event == fullscreenApi.event ? this.getRootNode() : media;
        target.removeEventListener(event, handler);
      });
    });
    Object.entries(this._textTrackMediaStatePropagators).forEach(([eventsStr, handler]) => {
      const events = eventsStr.split(",");
      events.forEach((event) => {
        media.textTracks.removeEventListener(event, handler);
      });
      handler();
    });
    this.propagateMediaState(MediaUIAttributes.MEDIA_PAUSED, true);
  }
  propagateMediaState(stateName, state) {
    propagateMediaState(this.mediaStateReceivers, stateName, state);
  }
  associateElement(element) {
    if (!element)
      return;
    const {associatedElementSubscriptions} = this;
    if (associatedElementSubscriptions.has(element))
      return;
    const registerMediaStateReceiver = this.registerMediaStateReceiver.bind(this);
    const unregisterMediaStateReceiver = this.unregisterMediaStateReceiver.bind(this);
    const unsubscribe = monitorForMediaStateReceivers(element, registerMediaStateReceiver, unregisterMediaStateReceiver);
    Object.keys(MediaUIEvents).forEach((key) => {
      element.addEventListener(MediaUIEvents[key], this[`_handle${constToCamel(key, true)}`]);
    });
    associatedElementSubscriptions.set(element, unsubscribe);
  }
  unassociateElement(element) {
    if (!element)
      return;
    const {associatedElementSubscriptions} = this;
    if (!associatedElementSubscriptions.has(element))
      return;
    const unsubscribe = associatedElementSubscriptions.get(element);
    unsubscribe();
    associatedElementSubscriptions.delete(element);
    Object.keys(MediaUIEvents).forEach((key) => {
      element.removeEventListener(MediaUIEvents[key], this[`_handle${constToCamel(key, true)}`]);
    });
  }
  registerMediaStateReceiver(el) {
    if (!el)
      return;
    const els = this.mediaStateReceivers;
    const index = els.indexOf(el);
    if (index > -1)
      return;
    els.push(el);
    if (this.media) {
      propagateMediaState([el], MediaUIAttributes.MEDIA_CAPTIONS_LIST, stringifyTextTrackList(this.captionTracks) || void 0);
      propagateMediaState([el], MediaUIAttributes.MEDIA_SUBTITLES_LIST, stringifyTextTrackList(this.subtitleTracks) || void 0);
      propagateMediaState([el], MediaUIAttributes.MEDIA_CAPTIONS_SHOWING, stringifyTextTrackList(this.showingCaptionTracks) || void 0);
      propagateMediaState([el], MediaUIAttributes.MEDIA_SUBTITLES_SHOWING, stringifyTextTrackList(this.showingSubtitleTracks) || void 0);
      propagateMediaState([el], MediaUIAttributes.MEDIA_PAUSED, this.media.paused);
      propagateMediaState([el], MediaUIAttributes.MEDIA_MUTED, this.media.muted);
      propagateMediaState([el], MediaUIAttributes.MEDIA_VOLUME, this.media.volume);
      propagateMediaState([el], MediaUIAttributes.MEDIA_CURRENT_TIME, this.media.currentTime);
      propagateMediaState([el], MediaUIAttributes.MEDIA_DURATION, this.media.duration);
      propagateMediaState([el], MediaUIAttributes.MEDIA_PLAYBACK_RATE, this.media.playbackRate);
    }
  }
  unregisterMediaStateReceiver(el) {
    const els = this.mediaStateReceivers;
    const index = els.indexOf(el);
    if (index < 0)
      return;
    els.splice(index, 1);
  }
  play() {
    this.dispatchEvent(new window.CustomEvent(MEDIA_PLAY_REQUEST));
  }
  pause() {
    this.dispatchEvent(new window.CustomEvent(MEDIA_PAUSE_REQUEST));
  }
  get muted() {
    return !!(this.media && this.media.muted);
  }
  set muted(mute) {
    const eventName = mute ? MEDIA_MUTE_REQUEST : MEDIA_UNMUTE_REQUEST;
    this.dispatchEvent(new window.CustomEvent(eventName));
  }
  get volume() {
    const media = this.media;
    return media ? media.volume : 1;
  }
  set volume(volume) {
    this.dispatchEvent(new window.CustomEvent(MEDIA_VOLUME_REQUEST, {detail: volume}));
  }
  requestFullscreen() {
    this.dispatchEvent(new window.CustomEvent(MEDIA_ENTER_FULLSCREEN_REQUEST));
  }
  exitFullscreen() {
    this.dispatchEvent(new window.CustomEvent(MEDIA_EXIT_FULLSCREEN_REQUEST));
  }
  get currentTime() {
    const media = this.media;
    return media ? media.currentTime : 0;
  }
  set currentTime(time) {
    this.dispatchEvent(new window.CustomEvent(MEDIA_SEEK_REQUEST, {detail: time}));
  }
  get playbackRate() {
    const media = this.media;
    return media ? media.playbackRate : 1;
  }
  set playbackRate(rate) {
    this.dispatchEvent(new window.CustomEvent(MEDIA_PLAYBACK_RATE_REQUEST, {detail: rate}));
  }
  get subtitleTracks() {
    return getTextTracksList(this.media, {kind: TextTrackKinds.SUBTITLES});
  }
  get captionTracks() {
    return getTextTracksList(this.media, {kind: TextTrackKinds.CAPTIONS});
  }
  get showingSubtitleTracks() {
    return getTextTracksList(this.media, {kind: TextTrackKinds.SUBTITLES, mode: TextTrackModes.SHOWING});
  }
  get showingCaptionTracks() {
    return getTextTracksList(this.media, {kind: TextTrackKinds.CAPTIONS, mode: TextTrackModes.SHOWING});
  }
  requestPictureInPicture() {
    this.dispatchEvent(new window.CustomEvent(MEDIA_ENTER_PIP_REQUEST));
  }
  exitPictureInPicture() {
    this.dispatchEvent(new window.CustomEvent(MEDIA_EXIT_PIP_REQUEST));
  }
  requestPreview(time) {
    this.dispatchEvent(new window.CustomEvent(MEDIA_PREVIEW_REQUEST, {detail: time}));
  }
}
const MEDIA_UI_ATTRIBUTE_NAMES = Object.values(MediaUIAttributes);
const getMediaUIAttributesFrom = (child) => {
  var _a, _b, _c;
  const {constructor: {observedAttributes}} = child;
  const mediaChromeAttributesList = (_c = (_b = (_a = child == null ? void 0 : child.getAttribute) == null ? void 0 : _a.call(child, MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES)) == null ? void 0 : _b.split) == null ? void 0 : _c.call(_b, /\s+/);
  if (!Array.isArray(observedAttributes || mediaChromeAttributesList))
    return [];
  return (observedAttributes || mediaChromeAttributesList).filter((attrName) => MEDIA_UI_ATTRIBUTE_NAMES.includes(attrName));
};
const isMediaStateReceiver = (child) => !!getMediaUIAttributesFrom(child).length;
const setAttr = (child, attrName, attrValue) => {
  if (attrValue == void 0) {
    return child.removeAttribute(attrName);
  }
  if (typeof attrValue === "boolean") {
    if (attrValue)
      return child.setAttribute(attrName, "");
    return child.removeAttribute(attrName);
  }
  if (Number.isNaN(attrValue)) {
    return child.removeAttribute(attrName);
  }
  return child.setAttribute(attrName, attrValue);
};
const isMediaSlotElementDescendant = (el) => {
  var _a;
  return !!((_a = el.closest) == null ? void 0 : _a.call(el, '*[slot="media"]'));
};
const traverseForMediaStateReceivers = (rootNode, mediaStateReceiverCallback) => {
  if (isMediaSlotElementDescendant(rootNode)) {
    return;
  }
  const traverseForMediaStateReceiversSync = (rootNode2, mediaStateReceiverCallback2) => {
    var _a, _b;
    if (isMediaStateReceiver(rootNode2)) {
      mediaStateReceiverCallback2(rootNode2);
    }
    const {children = []} = rootNode2 != null ? rootNode2 : {};
    const shadowChildren = (_b = (_a = rootNode2 == null ? void 0 : rootNode2.shadowRoot) == null ? void 0 : _a.children) != null ? _b : [];
    const allChildren = [...children, ...shadowChildren];
    allChildren.forEach((child) => traverseForMediaStateReceivers(child, mediaStateReceiverCallback2));
  };
  const name = rootNode == null ? void 0 : rootNode.nodeName.toLowerCase();
  if (name.includes("-") && !isMediaStateReceiver(rootNode)) {
    window.customElements.whenDefined(name).then(() => {
      traverseForMediaStateReceiversSync(rootNode, mediaStateReceiverCallback);
    });
    return;
  }
  ;
  traverseForMediaStateReceiversSync(rootNode, mediaStateReceiverCallback);
};
const propagateMediaState = (els, stateName, val) => {
  els.forEach((el) => {
    const relevantAttrs = getMediaUIAttributesFrom(el);
    if (!relevantAttrs.includes(stateName))
      return;
    setAttr(el, stateName, val);
  });
};
const monitorForMediaStateReceivers = (rootNode, registerMediaStateReceiver, unregisterMediaStateReceiver) => {
  traverseForMediaStateReceivers(rootNode, registerMediaStateReceiver);
  const registerMediaStateReceiverHandler = (evt) => {
    var _a;
    const el = (_a = evt == null ? void 0 : evt.composedPath()[0]) != null ? _a : evt.target;
    registerMediaStateReceiver(el);
  };
  const unregisterMediaStateReceiverHandler = (evt) => {
    var _a;
    const el = (_a = evt == null ? void 0 : evt.composedPath()[0]) != null ? _a : evt.target;
    unregisterMediaStateReceiver(el);
  };
  rootNode.addEventListener(MediaUIEvents.REGISTER_MEDIA_STATE_RECEIVER, registerMediaStateReceiverHandler);
  rootNode.addEventListener(MediaUIEvents.UNREGISTER_MEDIA_STATE_RECEIVER, unregisterMediaStateReceiverHandler);
  const mutationCallback = (mutationsList, _observer) => {
    mutationsList.forEach((mutationRecord) => {
      const {addedNodes = [], removedNodes = [], type, target, attributeName} = mutationRecord;
      if (type === "childList") {
        Array.prototype.forEach.call(addedNodes, (node) => traverseForMediaStateReceivers(node, registerMediaStateReceiver));
        Array.prototype.forEach.call(removedNodes, (node) => traverseForMediaStateReceivers(node, unregisterMediaStateReceiver));
      } else if (type === "attributes" && attributeName === MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES) {
        if (isMediaStateReceiver(target)) {
          registerMediaStateReceiver(target);
        } else {
          unregisterMediaStateReceiver(target);
        }
      }
    });
  };
  const observer = new MutationObserver(mutationCallback);
  observer.observe(rootNode, {childList: true, attributes: true, subtree: true});
  const unsubscribe = () => {
    traverseForMediaStateReceivers(rootNode, unregisterMediaStateReceiver);
    observer.disconnect();
    rootNode.removeEventListener(MediaUIEvents.REGISTER_MEDIA_STATE_RECEIVER, registerMediaStateReceiverHandler);
    rootNode.removeEventListener(MediaUIEvents.UNREGISTER_MEDIA_STATE_RECEIVER, unregisterMediaStateReceiverHandler);
  };
  return unsubscribe;
};
defineCustomElement("media-controller", MediaController);
export default MediaController;
