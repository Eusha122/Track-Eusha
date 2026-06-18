import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CommandCenterScreen } from './screens/CommandCenterScreen';
import { LandingScreen } from './screens/LandingScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { MissionBriefingScreen } from './screens/MissionBriefingScreen';
import { TrackerScreen } from './screens/TrackerScreen';
import { TutorialScreenOne } from './screens/TutorialScreenOne';
import { TutorialScreenThree } from './screens/TutorialScreenThree';
import { TutorialScreenTwo } from './screens/TutorialScreenTwo';
import { nextScreen, type ScreenId } from './lib/navigation';
import { GradientBackdrop } from './components/ui/GradientBackdrop';

const isTrackerRoute = window.location.pathname.replace(/\/+$/, '') === '/tracker';

function App() {
  const [screen, setScreen] = useState<ScreenId>('loading');
  const advance = () => setScreen((current) => nextScreen(current));

  if (isTrackerRoute) {
    return <TrackerScreen />;
  }

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-slate-50 text-slate-800 selection:bg-indigo-500/30">
      <GradientBackdrop />
      <AnimatePresence>
        {screen === 'loading' && <LoadingScreen key="loading" onComplete={advance} />}
        {screen === 'landing' && <LandingScreen key="landing" onBegin={advance} />}
        {screen === 'tutorial-1' && <TutorialScreenOne key="tutorial-1" onContinue={advance} />}
        {screen === 'tutorial-2' && <TutorialScreenTwo key="tutorial-2" onContinue={advance} />}
        {screen === 'tutorial-3' && (
          <TutorialScreenThree key="tutorial-3" onContinue={advance} />
        )}
        {screen === 'briefing' && <MissionBriefingScreen key="briefing" onBegin={advance} />}
        {screen === 'command-center' && <CommandCenterScreen key="command-center" />}
      </AnimatePresence>
    </div>
  );
}

export default App;
