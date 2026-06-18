import { Button } from '../components/ui/Button';
import { RevealLines } from '../components/ui/RevealLines';
import { ScreenHeading } from '../components/ui/ScreenHeading';
import { ScreenShell } from '../components/ui/ScreenShell';

export function TutorialScreenThree({ onContinue }: { onContinue: () => void }) {
  return (
    <ScreenShell>
      <div className="flex flex-col items-center gap-10 text-center">
        <ScreenHeading>Good News</ScreenHeading>
        <RevealLines
          lines={[
            {
              text: 'For the first time in recorded history, you now have a chance.',
              delay: 0.3,
            },
            {
              text: "Let's begin.",
              delay: 1.9,
              className: 'text-lg font-medium text-slate-800',
            },
          ]}
        />
        <Button delay={2.7} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </ScreenShell>
  );
}
