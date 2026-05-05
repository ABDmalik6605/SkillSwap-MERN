const LoadingSkeleton = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, idx) => (
      <div key={idx} className="h-4 bg-slate-200 rounded animate-pulse" />
    ))}
  </div>
);

export default LoadingSkeleton;
