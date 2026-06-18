import { Button } from '../components/ui/Button';
import { RevealLines } from '../components/ui/RevealLines';
import { ScreenHeading } from '../components/ui/ScreenHeading';
import { ScreenShell } from '../components/ui/ScreenShell';

export function TutorialScreenThree({ onContinue }: { onContinue: () => void }) {
  return (
    <ScreenShell>
      <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto">
        <ScreenHeading delay={0.1}>Your Mission</ScreenHeading>
        <div className="w-full mt-4">
          <RevealLines
            lines={[
              {
                text: 'We have granted you access to the Command Center.',
                delay: 0.4,
              },
              {
                text: 'Use the radar, analyze distance metrics, and intercept his signal.',
                delay: 1.5,
              },
              {
                text: "Let's begin.",
                delay: 3.0,
                className: 'text-xs font-bold text-indigo-600 uppercase tracking-widest mt-2 block',
              },
            ]}
          />
        </div>
        <div className="mt-4 w-full">
          <Button delay={4.0} onClick={onContinue} className="w-full">
            Access Command Center
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}
