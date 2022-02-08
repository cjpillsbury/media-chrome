import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import {
  MediaController,
  MediaControlBar,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaVolumeRange,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaCaptionsButton,
  MediaPlaybackRateButton,
  MediaPipButton,
  MediaFullscreenButton,
} from "media-chrome/dist/react";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

    <MediaController>
      <video
        slot="media"
        muted
        src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
        crossOrigin=""
      >
        <track
          label="thumbnails"
          default
          kind="metadata"
          crossOrigin=""
          src="https://image.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/storyboard.vtt"
        ></track>
        <track
          label="English"
          kind="captions"
          srcLang="en"
          crossOrigin=""
          src="./vtt/en-cc.vtt"
        ></track>
      </video>
      <MediaControlBar>
        <MediaPlayButton />
        <MediaSeekBackwardButton />
        <MediaSeekForwardButton />
        <MediaMuteButton />
        <MediaVolumeRange />
        <MediaTimeRange />
        <MediaTimeDisplay remaining/>
        <MediaCaptionsButton />
        <MediaPlaybackRateButton />
        <MediaPipButton />
        <MediaFullscreenButton />
      </MediaControlBar>
    </MediaController>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
