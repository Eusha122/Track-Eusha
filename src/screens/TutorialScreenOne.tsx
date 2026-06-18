import { Button } from '../components/ui/Button';
import { RevealLines } from '../components/ui/RevealLines';
import { ScreenHeading } from '../components/ui/ScreenHeading';
import { ScreenShell } from '../components/ui/ScreenShell';

export function TutorialScreenOne({ onContinue }: { onContinue: () => void }) {
  return (
    <ScreenShell>
      <div className="flex flex-col items-center gap-10 text-center">
        <ScreenHeading>Welcome, Tasmia.</ScreenHeading>
        <RevealLines
          lines={[
            { text: 'So you think Eusha is impossible to find.', delay: 0.3 },
            {
              text: "You're not the first person to say that.",
              delay: 1.9,
              className: 'text-base leading-relaxed text-slate-500',
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
