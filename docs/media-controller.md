# `<media-controller/>`

The `<media-controller/>` manages communication of state and state change requests between a `media` element and control elements. It also provides some built in sizing and layout to make styling your player as easy as possible.

# Layout - Slots
Slots are used to tell `<media-controller/>` where you want your controls positioned. Even if you aren't explicitly naming a slot, you're still using one (the "default slot"). Below is a discussion of available slots and how they work.

Slots are used to tell `<media-controller/>` where you want your controls positioned. Most commonly, you'll put media control elements like `<media-play-button/>` or `<media-fullscreen-button/>` inside slots. But any arbitrary markup can be placed inside a lot.

This gives you the flexibility to customize your player. For example, here is a player that has an h3 title in the top slot and a play button in the centered slot.

```html
<media-controller>
  <video slot="media"></video>
  <div slot="top-chrome">
    <h3>Episode 2</h3>
  </div>
  <div slot="centered-chrome">
    <media-play-button></media-play-button>
  </div>
  <div> <!-- This will go in the default slot, aka "bottom-chrome" -->
    <media-play-button></media-play-button>
  </div>
</media-controller>
```

You also may want to show different slots on mobile vs. desktop. For example, here's a player that uses `slot="centered-chrome"` on mobile and uses a `<media-control-bar/>` in the default slot (aka "`bottom-chrome`") on desktop:

```html
<style>
  .desktop {
    display: none;
  }
  @media (min-width: 768px) {
    .mobile {
      display: none;
    }
    .desktop {
      display: block;
    }
  }
</style>

<media-controller>
  <video slot="media"></video>
  <div slot="top-chrome">
    <h3>Episode 2</h3>
  </div>
  <div slot="centered-chrome" class="mobile">
    <media-play-button></media-play-button>
  </div>
  <media-control-bar class="desktop">
    <media-play-button></media-play-button>
  </media-control-bar>
</media-controller>
```


(**NOTE**: slots are actually [part of the Web Components / Custom Elements specification](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots), but you shouldn't need to understand these technical details to work with them in `<media-chrome/>`)

## Working with slots (video)

![media controller slots layout](./assets/media-controller-slots.png)

For an interactive example of how each of the slots render for `video`, check out [this demo](https://media-chrome.mux.dev/examples/slots-demo.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/slots-demo.html)).

### Default Slot (effectively the "`bottom-chrome`")
* Render Location: Each child that doesn't specify a slot will render at the bottom of the <media-controller/>. If you have more than element like this they will be stacked vertically.

* Common/Example use cases: showing one or more rows of controls at the bottom of the `<media-controller/>`. For many use cases, you can simply add a `<media-control-bar/>` for each row of controls you'd like.
  * [Basic example](https://media-chrome.mux.dev/examples/basic.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/basic.html))
  * [Mobile example](https://media-chrome.mux.dev/examples/mobile.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/mobile.html))
  * [Youtube theme](https://media-chrome.mux.dev/examples/themes/youtube-theme.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/themes/youtube-theme.html))
  * [Netflix theme](https://media-chrome.mux.dev/examples/themes/netflix-theme.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/themes/netflix-theme.html))

### `top-chrome`
* Render Location: Each child that specifies `slot="top-chrome"` will render at the top of the <media-controller/>. If you have more than element like this they will be stacked vertically.

* Common/Example use cases: showing one or more rows of controls at the top of the `<media-controller/>`. For many use cases, you can simply add a `<media-control-bar/>` for each row of controls you'd like.
  * [Demuxed 2021 theme](https://media-chrome.mux.dev/examples/themes/demuxed-2021-theme.html) (mobile screen sizes only) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/themes/demuxed-2021-theme.html))

### `middle-chrome`

* Render Location: Children that specify `slot="middle-chrome"` will show up in the available space between any "`top-chrome`" children and any default slot/"`bottom-chrome`" children.

* Common/Example use cases: `middle-chrome` would generally be used for more specific cases, such as custom subtitle/caption rendering, or additional related content you'd like to show while the media is paused or has finished playback. While you **_can_** have multiple children that are "slotted to" `middle-chrome`, most likely, you'll want to use one and style it to size/layout any custom content you'd like.
  * (Examples coming!)

### `centered-chrome`

* Render Location: The child that specifies `slot="centered-chrome"` will cover all of the `<media-controller/>` and will be "above" anything in the default slot / "`bottom-chrome`", `top-chrome`, or `middle-chrome`. By default, the `centered-chrome` element will layout all children within a centered [flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) row with each child spaced evenly apart from one another.

* Common/Example use cases: "big button" controls that are centered and horizontally layed out "on top of" the media. While you **_can_** have multiple children that are "slotted to" `centered-chrome`, most likely, you'll want to use one to take advantage of the built in layout.
  * [Mobile example](https://media-chrome.mux.dev/examples/mobile.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/mobile.html))
  * [Demuxed 2021 theme](https://media-chrome.mux.dev/examples/themes/demuxed-2021-theme.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/themes/demuxed-2021-theme.html))

## Working with slots (audio)

Since `audio` chromes vary much more than `video`, it's recommended that you only use the default slot and only add a single element (e.g. a single `<media-control-bar/>`) and style it however you'd like.

As we work through other common use cases, both internally and with the community, we may start adding additional "built-in" styling and layout for `<media-control-bar/>` slots used with `audio`.

* Example use cases:
  * [Basic example](https://media-chrome.mux.dev/examples/basic.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/basic.html))
  * [Spotify theme](https://media-chrome.mux.dev/examples/themes/spotify-theme.html) ([view source](https://github.com/muxinc/media-chrome/blob/main/examples/themes/spotify-theme.html))