import type { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/api/schema';
import { useEffect, useRef, useState } from 'react';
import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';
import invariant from 'tiny-invariant';
import type { ArrayValues } from 'type-fest';

import { Ellipsis } from '@wsh-2025/client/src/features/layout/components/Ellipsis';

interface Props {
  loading?: 'lazy' | 'eager';
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const JumbotronSection = ({ loading = 'lazy', module }: Props) => {
  const episode = module.items[0]?.episode;
  invariant(episode);

  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          ref.current?.play();
        }
      }
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <NavLink
      viewTransition
      className="block flex h-[260px] w-full cursor-pointer flex-row items-center justify-center overflow-hidden rounded-[8px] bg-[#171717] hover:opacity-50"
      to={`/episodes/${episode.id}`}
    >
      {({ isTransitioning }) => {
        return (
          <>
            <div className="grow-1 shrink-1 p-[24px]">
              <div className="mb-[16px] w-full text-center text-[22px] font-bold text-[#ffffff]">
                <Ellipsis lines={2}>{episode.title}</Ellipsis>
              </div>
              <div className="w-full text-center text-[14px] font-bold text-[#ffffff]">
                <Ellipsis lines={3}>{episode.description}</Ellipsis>
              </div>
            </div>

            <Flipped stagger flipId={isTransitioning ? `episode-${episode.id}` : 0}>
              <div className="h-full w-auto shrink-0 grow-0">
                <video
                  ref={ref}
                  disablePictureInPicture
                  disableRemotePlayback
                  loop
                  muted
                  playsInline
                  autoPlay={loading === 'eager'}
                  className="size-full"
                  controls={false}
                  preload={loading === 'eager' ? 'auto' : 'none'}
                  src={`/streams/episode/${episode.id}/video-small.mp4`}
                />
              </div>
            </Flipped>
          </>
        );
      }}
    </NavLink>
  );
};
