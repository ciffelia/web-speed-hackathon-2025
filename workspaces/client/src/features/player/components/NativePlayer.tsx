import type { Ref } from 'react';
import { useEffect, useRef } from 'react';
import invariant from 'tiny-invariant';
import { assignRef } from 'use-callback-ref';

import type { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

interface Props {
  className?: string;
  playerRef: Ref<PlayerWrapper | null>;
  videoUrl: string;
}

export const NativePlayer = ({ className, playerRef, videoUrl }: Props) => {
  const mountRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mountElement = mountRef.current;
    invariant(mountElement);

    assignRef(playerRef, new NativePlayerWrapper(mountElement));
  }, []);

  return (
    <div className={className}>
      <div className="relative size-full">
        <video
          ref={mountRef}
          autoPlay
          muted
          playsInline
          className="size-full"
          controls={false}
          preload="auto"
          src={videoUrl}
        />
        <div className="absolute inset-0 z-[-10] grid place-content-center">
          <div className="i-line-md:loading-twotone-loop size-[48px] text-[#ffffff]" />
        </div>
      </div>
    </div>
  );
};

export class NativePlayerWrapper implements PlayerWrapper {
  constructor(readonly videoElement: HTMLVideoElement) {
    videoElement.volume = 0.25;
  }

  get currentTime(): number {
    const currentTime = this.videoElement.currentTime;
    return Number.isNaN(currentTime) ? 0 : currentTime;
  }
  get paused(): boolean {
    return this.videoElement.paused;
  }
  get duration(): number {
    const duration = this.videoElement.duration;
    return Number.isNaN(duration) ? 0 : duration;
  }
  get muted(): boolean {
    return this.videoElement.muted;
  }

  load(): void {}
  play(): void {
    void this.videoElement.play();
  }
  pause(): void {
    this.videoElement.pause();
  }
  seekTo(second: number): void {
    this.videoElement.currentTime = second;
  }
  setMuted(muted: boolean): void {
    this.videoElement.muted = muted;
  }
  destory(): void {}
}
