import { addHours, startOfDay } from 'date-fns';
import { useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { ChannelTitle } from '@wsh-2025/client/src/pages/timetable/components/ChannelTitle';
import { NewTimetableFeatureDialog } from '@wsh-2025/client/src/pages/timetable/components/NewTimetableFeatureDialog';
import { ProgramList } from '@wsh-2025/client/src/pages/timetable/components/ProgramList';
import { TimelineYAxis } from '@wsh-2025/client/src/pages/timetable/components/TimelineYAxis';
import { useShownNewFeatureDialog } from '@wsh-2025/client/src/pages/timetable/hooks/useShownNewFeatureDialog';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const now = new Date();
  const since = addHours(startOfDay(addHours(now, 9)), -9).toISOString();
  const until = addHours(since, 24).toISOString();

  const channels = await store.getState().features.channel.fetchChannels();
  const programs = await store.getState().features.timetable.fetchTimetable({ since, until });
  return { channels, programs };
};

export const TimetablePage = () => {
  const shownNewFeatureDialog = useShownNewFeatureDialog();

  const { channels, programs } = useLoaderData<typeof prefetch>();
  const channelIds = channels.map((channel) => channel.id);
  const programLists = channels.map((channel) => {
    const filteredPrograms = [];
    for (const program of programs) {
      if (program.channelId === channel.id) {
        filteredPrograms.push(program);
      }
    }
    return filteredPrograms.sort((a, b) => {
      return a.startAtUnix - b.startAtUnix;
    });
  });

  return (
    <>
      <title>番組表 - AremaTV</title>

      <div className="relative grid size-full overflow-x-auto overflow-y-auto [grid-template-areas:'channel_channel''hours_content']">
        <div className="sticky top-0 z-20 flex w-fit flex-row bg-[#000000] pl-[24px] [grid-area:channel]">
          {channelIds.map((channelId) => (
            <div key={channelId} className="shrink-0 grow-0">
              <ChannelTitle channelId={channelId} />
            </div>
          ))}
        </div>

        <div className="sticky inset-y-0 left-0 z-10 shrink-0 grow-0 bg-[#000000] [grid-area:hours]">
          <TimelineYAxis />
        </div>
        <div className="flex flex-row [grid-area:content]">
          {programLists.map((programList, index) => {
            const channelId = channelIds[index];
            invariant(channelId);
            return (
              <div key={channelIds[index]} className="shrink-0 grow-0">
                <ProgramList channelId={channelId} programList={programList} />
              </div>
            );
          })}
        </div>
      </div>

      <NewTimetableFeatureDialog isOpen={shownNewFeatureDialog} />
    </>
  );
};
