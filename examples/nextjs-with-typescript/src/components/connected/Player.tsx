'use client';
/** @TODO !!! Revisit for SSR (CJP) */
import { MediaProvider } from 'media-chrome/react/media-store';
import {
  DetailedHTMLProps,
  PropsWithChildren,
  VideoHTMLAttributes,
} from 'react';

type PlayerProps = PropsWithChildren<
  DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>
>;

/**
 * @description This is the fully-packaged "media player" with UI that uses Material UI for all of its "chrome"/UI components.
 * @param props - The <Player/> props here are identical to a <video/> component's props (and the TypeScript types are also identical)
 * @returns A player react component instance
 */
const Player = (props: PlayerProps) => {
  const { children } = props;
  return (
    /**
     * <MediaProvider/> is a {@link https://react.dev/learn/passing-data-deeply-with-context#step-3-provide-the-context|React Context.Provider} for
     * getting media state and requesting changes to media state. For examples of this, you can check out the various components used "under the hood".
     * It's worth noting that, unlike many other Context <Provider/> use cases in React where you tend to push them up to the top of your application root,
     * for most folks most of the time, you'll want to keep your <MediaProvider/> close to the player itself, since it models media state for a particular
     * player UI. For example, with the implementation of <Player/> here, you can have several players on the page at the same time, and each would "own"
     * their own <MediaProvider/> to manage the media state + UI for *that player instance*.
     *
     */
    <MediaProvider>{children}</MediaProvider>
  );
};

export default Player;
