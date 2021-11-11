import MediaTextDisplay from "./media-text-display.js";
import {defineCustomElement} from "./utils/defineCustomElement.js";
import {formatTime} from "./utils/time.js";
import {MediaUIAttributes} from "./constants.js";
class MediaCurrentTimeDisplay extends MediaTextDisplay {
  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_CURRENT_TIME];
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_CURRENT_TIME) {
      this.container.innerHTML = formatTime(newValue);
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}
defineCustomElement("media-current-time-display", MediaCurrentTimeDisplay);
export default MediaCurrentTimeDisplay;
