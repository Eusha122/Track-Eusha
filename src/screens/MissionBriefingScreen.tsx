import { MissionBriefing } from '../components/command-center/MissionBriefing';
import { ScreenShell } from '../components/ui/ScreenShell';

export function MissionBriefingScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <ScreenShell maxWidthClassName="max-w-md">
      <MissionBriefing onBegin={onBegin} />
    </ScreenShell>
  );
}
