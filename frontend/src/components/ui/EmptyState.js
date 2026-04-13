import { motion } from 'framer-motion';

/**
 * Empty state placeholder with icon, title, description, and optional action.
 */
const EmptyState = ({
  icon = '📭',
  title = 'Nothing here yet',
  description = '',
  action = null,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="text-center py-20 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl"
  >
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="text-5xl mb-5"
    >
      {icon}
    </motion.div>
    <p className="text-xl font-semibold text-white mb-2">{title}</p>
    {description && (
      <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">{description}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </motion.div>
);

export default EmptyState;
