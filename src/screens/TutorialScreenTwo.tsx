import { Button } from '../components/ui/Button';
import { RevealLines } from '../components/ui/RevealLines';
import { ScreenHeading } from '../components/ui/ScreenHeading';
import { ScreenShell } from '../components/ui/ScreenShell';

export function TutorialScreenTwo({ onContinue }: { onContinue: () => void }) {
  return (
    <ScreenShell>
      <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto">
        <ScreenHeading delay={0.1}>The Target</ScreenHeading>
        <div className="w-full mt-4">
          <RevealLines
            lines={[
              {
                text: 'Eusha uses an advanced scrambling device.',
                delay: 0.4,
              },
              {
                text: 'Standard GPS tracking methods will fail.',
                delay: 1.5,
              },
              {
                text: 'Current Status: Still missing.',
                delay: 2.8,
                className: 'text-xs font-bold text-rose-600 uppercase tracking-widest mt-2 block',
              },
            ]}
          />
        </div>
        <div className="mt-4 w-full">
          <Button delay={4.0} onClick={onContinue} className="w-full">
            Next
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}
