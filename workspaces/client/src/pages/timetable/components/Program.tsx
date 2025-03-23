import type { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/api/schema';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import type { ReactElement } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ArrayValues } from 'type-fest';

import { Ellipsis } from '@wsh-2025/client/src/features/layout/components/Ellipsis';
import { ProgramDetailDialog } from '@wsh-2025/client/src/pages/timetable/components/ProgramDetailDialog';
import { useColumnWidth } from '@wsh-2025/client/src/pages/timetable/hooks/useColumnWidth';
import { useCurrentUnixtimeMs } from '@wsh-2025/client/src/pages/timetable/hooks/useCurrentUnixtimeMs';
import { useSelectedProgramId } from '@wsh-2025/client/src/pages/timetable/hooks/useSelectedProgramId';

interface Props {
  height: number;
  program: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
}

export const Program = ({ height, program }: Props): ReactElement => {
  const width = useColumnWidth(program.channelId);

  const [selectedProgramId, setProgram] = useSelectedProgramId();
  const shouldProgramDetailDialogOpen = program.id === selectedProgramId;
  const onClick = () => {
    setProgram(program);
  };

  const [startAt, endAt] = useMemo(() => {
    const startAt = DateTime.fromISO(program.startAt);
    const endAt = DateTime.fromISO(program.endAt);
    return [startAt, endAt];
  }, [program.startAt, program.endAt]);

  const currentUnixtimeMs = useCurrentUnixtimeMs();
  const isBroadcasting = startAt.toMillis() <= currentUnixtimeMs && currentUnixtimeMs < endAt.toMillis();
  const isArchived = endAt.toMillis() <= currentUnixtimeMs;

  const titleRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [shouldImageBeVisible, setShouldImageBeVisible] = useState<boolean>(false);
  useEffect(() => {
    const interval = setInterval(() => {
      const imageHeight = imageRef.current?.clientHeight ?? 0;
      const titleHeight = titleRef.current?.clientHeight ?? 0;
      setShouldImageBeVisible(imageHeight <= height - titleHeight);
    }, 250);
    return () => {
      clearInterval(interval);
    };
  }, [height]);

  return (
    <>
      <button
        className={classNames(
          `w-auto cursor-pointer border-[1px] border-solid border-[#000000] px-[12px] py-[8px] text-left`,
          isArchived ? 'hover:brightness-200' : 'hover:brightness-125',
        )}
        style={{
          background: isBroadcasting ? '#FCF6E5' : '#212121',
          height: `${height}px`,
          opacity: isArchived ? 0.5 : 1,
          width,
        }}
        type="button"
        onClick={onClick}
      >
        <div className="flex size-full flex-col overflow-hidden">
          <div ref={titleRef} className="mb-[8px] flex flex-row items-start justify-start">
            <span
              className={`mr-[8px] shrink-0 grow-0 text-[14px] font-bold`}
              style={{
                color: isBroadcasting ? '#767676' : '#999999',
              }}
            >
              {startAt.toFormat('mm')}
            </span>
            <div
              className={`grow-1 shrink-1 overflow-hidden text-[14px] font-bold`}
              style={{
                color: isBroadcasting ? '#212121' : '#ffffff',
              }}
            >
              <Ellipsis lines={3}>{program.title}</Ellipsis>
            </div>
          </div>
          <div
            className={`w-full`}
            style={{
              opacity: shouldImageBeVisible ? 1 : 0,
            }}
          >
            <img
              ref={imageRef}
              alt=""
              className="pointer-events-none aspect-video w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
              decoding="async"
              loading="lazy"
              src={program.thumbnailUrl}
            />
          </div>
        </div>
      </button>
      <ProgramDetailDialog isOpen={shouldProgramDetailDialogOpen} program={program} />
    </>
  );
};
