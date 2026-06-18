import { Button } from '../components/ui/Button';
import { RevealLines } from '../components/ui/RevealLines';
import { ScreenHeading } from '../components/ui/ScreenHeading';
import { ScreenShell } from '../components/ui/ScreenShell';

export function TutorialScreenOne({ onContinue }: { onContinue: () => void }) {
  return (
    <ScreenShell>
      <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto">
        <ScreenHeading delay={0.1}>Welcome, Tasmia.</ScreenHeading>
        
        <div className="w-full mt-4">
          <RevealLines
            lines={[
              { text: 'So you think Eusha is impossible to find.', delay: 0.5 },
              {
                text: "You're not the first person to say that.",
                delay: 2.0,
                className: 'text-[13px] font-medium text-slate-500 leading-relaxed',
              },
            ]}
          />
        </div>

        <div className="mt-4 w-full">
          <Button delay={3.5} onClick={onContinue} className="w-full">
            Continue
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}
