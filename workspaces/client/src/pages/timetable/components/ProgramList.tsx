import type { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/api/schema';
import { DateTime } from 'luxon';
import { type ReactElement, useMemo } from 'react';
import type React from 'react';
import type { ArrayValues } from 'type-fest';

import { HEIGHT_ONE_HOUR } from '@wsh-2025/client/src/features/timetable/constants/grid_size';
import { Gutter } from '@wsh-2025/client/src/pages/timetable/components/Gutter';
import { Program } from '@wsh-2025/client/src/pages/timetable/components/Program';

interface Props {
  channelId: string;
  programList: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>[];
}

export const ProgramList = ({ channelId, programList }: Props): ReactElement => {
  return (
    <div className="relative">
      <div className="flex flex-col">
        {programList.map((program) => (
          <ProgramListItem key={program.id} program={program} />
        ))}
      </div>

      <div className="absolute inset-y-0 right-[-4px] z-10 w-[8px]">
        <Gutter channelId={channelId} />
      </div>
    </div>
  );
};

export const ProgramListItem: React.FC<{
  program: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
}> = ({ program }) => {
  const startAt = useMemo(() => DateTime.fromISO(program.startAt), [program.startAt]);
  const endAt = useMemo(() => DateTime.fromISO(program.endAt), [program.endAt]);

  const duration = useMemo(() => endAt.diff(startAt, 'minutes').minutes, [startAt, endAt]);
  const height = HEIGHT_ONE_HOUR * (duration / 60);

  return (
    <div key={program.id} className="shrink-0 grow-0">
      <Program height={height} program={program} />
    </div>
  );
};
