/** @TODO Split out "playable" vs. "audible" and compose via factory (current mixin pattern or spreadable mixin pattern) (CJP) */
export const Events = ['volumechange', 'pause', 'play', 'playing'] as const;

export interface IBaseMediaStateOwner<
  T extends Pick<HTMLMediaElement, 'src'> = Pick<HTMLMediaElement, 'src'>
> extends EventTarget,
    Pick<HTMLMediaElement, 'src'> {
  mediaElement?: T;
}

export interface IPlayableMediaStateOwner
  extends EventTarget,
    IBaseMediaStateOwner,
    Pick<HTMLMediaElement, 'play' | 'pause' | 'paused'> {}

export interface IAudibleMediaStateOwner
  extends EventTarget,
    IBaseMediaStateOwner,
    Pick<HTMLMediaElement, 'muted' | 'volume'> {}

export class PlayableMediaStateOwner
  extends EventTarget
  implements IPlayableMediaStateOwner, IAudibleMediaStateOwner
{
  private _mediaElement:
    | (IPlayableMediaStateOwner & IAudibleMediaStateOwner)
    | undefined;

  get mediaElement() {
    return this._mediaElement;
  }

  set mediaElement(value) {
    if (value === this.mediaElement) return;
    if (typeof this.mediaElement) {
      Events.forEach((eventType) => {
        this.mediaElement?.removeEventListener(eventType, this);
      });
    }
    this._mediaElement = value;
    if (this.mediaElement) {
      /** @TODO Fixme in conditional (CJP) */
      // @ts-ignore
      this.mediaElement.src = value;
      Events.forEach((eventType) => {
        this.mediaElement?.addEventListener(eventType, this);
      });
    }
  }

  get paused() {
    return this.mediaElement?.paused ?? false;
  }

  pause() {
    /** @TODO implement deferred state etc. for cases where media has yet to be set */
    if (!this.mediaElement) return;
    return this.mediaElement.pause();
  }

  play() {
    /** @TODO implement deferred state etc. for cases where media has yet to be set */
    if (!this.mediaElement) return Promise.reject();
    return this.mediaElement.play();
  }

  get muted() {
    return this.mediaElement?.muted ?? false;
  }

  set muted(value) {
    if (value === this.muted) return;
    /** @TODO implement deferred state etc. for cases where media has yet to be set */
    if (!this.mediaElement) return;
    this.mediaElement.muted = value;
  }

  get volume() {
    return this.mediaElement?.volume ?? 0;
  }

  set volume(value) {
    if (value === this.volume) return;
    /** @TODO implement deferred state etc. for cases where media has yet to be set */
    if (!this.mediaElement) return;
    this.mediaElement.volume = value;
  }

  _src: string = '';

  get src() {
    return this.mediaElement?.src ?? this._src;
  }

  set src(value) {
    if (value === this.src) return;
    /** @TODO implement deferred state etc. for cases where media has yet to be set */
    if (!this.mediaElement) {
      this._src = value;
      return;
    }
    this._src = value;
    this.mediaElement.src = value;
  }

  handleEvent(event: Event): void {
    if (event.target === this.mediaElement) {
      // @ts-ignore
      const clonedEvent = new event.constructor(event.type, event);
      this.dispatchEvent(clonedEvent);
    }
  }
}
