'use client';
import Player from '@/components/connected/Player';
import PlayerUI from './player-ui';
import Video from '@/components/connected-with-defaults/Video';
// This still needs to be pulled out to demo the "chromeless media player" parts of the architecture. TL;DR - It will likely rely on useImperativeHandle for
// unopinionated abstraction of Media (UI) State Owner & Playback Engine
// import Video from './Video';

export default function AppPlayer() {
  return (
    <Player>
      <PlayerUI>
        <Video
          // @ts-ignore
          src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
          crossOrigin="anonymous"
        />
      </PlayerUI>
    </Player>
  );
}
