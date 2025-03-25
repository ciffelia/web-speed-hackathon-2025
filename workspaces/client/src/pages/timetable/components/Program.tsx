import type { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/api/schema';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import type { ArrayValues } from 'type-fest';

import { useIsAfter } from '../hooks/useIsAfter';

import { Ellipsis } from '@wsh-2025/client/src/features/layout/components/Ellipsis';
import { ProgramDetailDialog } from '@wsh-2025/client/src/pages/timetable/components/ProgramDetailDialog';
import { useColumnWidth } from '@wsh-2025/client/src/pages/timetable/hooks/useColumnWidth';
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

  const startAt = useMemo(() => DateTime.fromISO(program.startAt), [program.startAt]);
  const endAt = useMemo(() => DateTime.fromISO(program.endAt), [program.endAt]);

  const isStarted = useIsAfter(startAt);
  const isArchived = useIsAfter(endAt);
  const isBroadcasting = isStarted && !isArchived;

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
          <div className="mb-[8px] flex flex-row items-start justify-start">
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
          <div className={`__arema_program_page_reveal_container aspect-video w-full`}>
            <img
              alt=""
              className="pointer-events-none h-full w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
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
