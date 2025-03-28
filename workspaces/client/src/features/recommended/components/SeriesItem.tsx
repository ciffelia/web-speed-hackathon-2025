import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';

import { Ellipsis } from '@wsh-2025/client/src/features/layout/components/Ellipsis';

interface Props {
  series: {
    id: string;
    thumbnailUrl: string;
    title: string;
  };
}

export const SeriesItem = ({ series }: Props) => {
  return (
    <NavLink
      viewTransition
      className="block w-full cursor-pointer overflow-hidden hover:opacity-75"
      to={`/series/${series.id}`}
    >
      {({ isTransitioning }) => {
        return (
          <>
            <div className="relative overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]">
              <Flipped stagger flipId={isTransitioning ? `series-${series.id}` : 0}>
                <img alt="" className="aspect-video w-full" decoding="async" loading="lazy" src={series.thumbnailUrl} />
              </Flipped>
            </div>
            <div className="p-[8px]">
              <div className="text-[14px] font-bold text-[#ffffff]">
                <Ellipsis lines={2}>{series.title}</Ellipsis>
              </div>
            </div>
          </>
        );
      }}
    </NavLink>
  );
};
