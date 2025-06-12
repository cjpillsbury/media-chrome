import MediaSeekForwardIcon from "@/components/icons/MediaSeekForwardIcon";

export const MomentaryPush = {
  Root: (_props: { onPressed: (x?: any) => void; children: Element }) => {
    return <></>;
  },
  Indicator: (_props: { asChild: any }) => {
    return <></>;
  },
};

export const LatchingPush = {
    Root: (_props: { onPressed: (x?: any) => void; children: Element }) => {
      return <></>;
    },
    Indicator: (_props: { asChild: any }) => {
      return <></>;
    },
    IndicatorOn: (_props: { asChild: any }) => {
      return <></>;
    },
    IndicatorOff: (_props: { asChild: any }) => {
      return <></>;
    },
  };

const DEFAULT_SEEK_OFFSET = 15;
export const MediaSeekForwardButton = ({
  seekOffset = DEFAULT_SEEK_OFFSET, // Component State
  mediaCurrentTime = 0, // Media State
  onMediaSeekRequest = () => {}, // Media State Change Request Callback
}: {
  seekOffset?: number;
  mediaCurrentTime?: number;
  onMediaSeekRequest?: (props: {
    type: 'mediaseekrequest';
    detail: number;
  }) => void;
}) => {
  return (
    <MomentaryPush.Root
      onPressed={() => {
        onMediaSeekRequest({
          type: 'mediaseekrequest',
          detail: mediaCurrentTime + seekOffset,
        });
      }}
    >
      {/* @ts-ignore */}
      <MomentaryPush.Indicator>
        <MediaSeekForwardIcon seekOffset={seekOffset} />
      </MomentaryPush.Indicator>
    </MomentaryPush.Root>
  );
};

export const MediaCaptionsButton = ({
  seekOffset = DEFAULT_SEEK_OFFSET, // Component State
  mediaCurrentTime = 0, // Media State
  onMediaSeekRequest = () => {}, // Media State Change Request Callback
}: {
  seekOffset?: number;
  mediaCurrentTime?: number;
  onMediaSeekRequest?: (props: {
    type: 'mediaseekrequest';
    detail: number;
  }) => void;
}) => {
  return (
    <MomentaryPush.Root
      onPressed={() => {
        onMediaSeekRequest({
          type: 'mediaseekrequest',
          detail: mediaCurrentTime + seekOffset,
        });
      }}
    >
      {/* @ts-ignore */}
      <MomentaryPush.Indicator>
        <MediaSeekForwardIcon seekOffset={seekOffset} />
      </MomentaryPush.Indicator>
    </MomentaryPush.Root>
  );
};

export const Player = () => {};
