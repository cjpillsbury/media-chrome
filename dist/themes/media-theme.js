class MediaTheme extends HTMLElement {
  constructor(template = ``, options = {}) {
    super();
    options = Object.assign({}, options);
    this.template = template;
    const templateEl = document.createElement("template");
    templateEl.innerHTML = template;
    const shadow = this.attachShadow({mode: "open"});
    shadow.appendChild(templateEl.content.cloneNode(true));
    this.mediaController = shadow.querySelector("media-controller");
  }
}
if (!customElements.get("media-theme")) {
  customElements.define("media-theme", MediaTheme);
}
export default MediaTheme;
