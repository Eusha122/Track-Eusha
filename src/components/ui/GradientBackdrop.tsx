export function GradientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -left-16 -top-24 h-72 w-72 rounded-full bg-sky-300/50 blur-3xl" />
      <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-indigo-300/40 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
    </div>
  );
}
