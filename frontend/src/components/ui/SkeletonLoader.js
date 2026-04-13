import { motion } from 'framer-motion';

/* ── Skeleton primitives for loading states ─────────────────────────── */
export const SkeletonLine = ({ className = '' }) => (
  <div className={`skeleton h-4 rounded-md ${className}`} />
);

export const SkeletonCircle = ({ size = 'w-10 h-10' }) => (
  <div className={`skeleton rounded-full ${size}`} />
);

export const SkeletonCard = () => (
  <div className="bg-zinc-950 border border-zinc-800/50 rounded-2xl overflow-hidden">
    <div className="skeleton h-52 rounded-none" />
    <div className="p-4 space-y-3">
      <SkeletonLine className="w-3/4 h-4" />
      <SkeletonLine className="w-1/2 h-3" />
      <SkeletonLine className="w-full h-3" />
      <div className="flex gap-2 pt-2">
        <SkeletonLine className="w-20 h-8 rounded-xl" />
        <SkeletonLine className="flex-1 h-8 rounded-xl" />
      </div>
    </div>
  </div>
);

export const SkeletonBookGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.05 }}
      >
        <SkeletonCard />
      </motion.div>
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <SkeletonLine key={j} className="flex-1 h-12 rounded-xl" />
        ))}
      </div>
    ))}
  </div>
);

/* ── Premium full-page loading spinner ────────────────────────────────── */
export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="relative w-14 h-14 mx-auto mb-5">
        <div className="absolute inset-0 rounded-full border-2 border-orange-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-orange-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-amber-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      <p className="text-zinc-500 text-sm font-medium">{message}</p>
    </motion.div>
  </div>
);

export default SkeletonCard;
