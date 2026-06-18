import { Button } from '../components/ui/Button';
import { RevealLines } from '../components/ui/RevealLines';
import { ScreenHeading } from '../components/ui/ScreenHeading';
import { ScreenShell } from '../components/ui/ScreenShell';

export function TutorialScreenTwo({ onContinue }: { onContinue: () => void }) {
  return (
    <ScreenShell>
      <div className="flex flex-col items-center gap-10 text-center">
        <ScreenHeading>Mission Accepted</ScreenHeading>
        <RevealLines
          lines={[
            {
              text: 'This application has been authorized to assist in locating one (1) Eusha.',
              delay: 0.3,
            },
            {
              text: 'Current Status:',
              delay: 1.8,
              className: 'text-sm uppercase tracking-widest text-slate-400',
            },
            {
              text: 'Still missing.',
              delay: 2.3,
              className: 'text-lg font-medium text-slate-800',
            },
          ]}
        />
        <Button delay={3.1} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </ScreenShell>
  );
}
