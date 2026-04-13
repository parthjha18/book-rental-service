import { motion } from 'framer-motion';
import BookIcon from './BookIcon';
import BorderGlow from './BorderGlow';

/**
 * Empty state placeholder with icon, title, description, and optional action.
 */
const EmptyState = ({
  icon = '📭',
  title = 'Nothing here yet',
  description = '',
  action = null,
}) => {
  const renderIcon = () => {
    if (icon === '📚') return <BookIcon className="w-16 h-16" />;
    return icon;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <BorderGlow
        className="text-center py-20 rounded-2xl w-full"
        glowColor="30 90 60"
        colors={['#f97316', '#f59e0b', '#fbbf24']}
        backgroundColor="#09090b"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-5xl mb-5 flex justify-center"
        >
          {renderIcon()}
        </motion.div>
        <p className="text-xl font-semibold text-white mb-2">{title}</p>
        {description && (
          <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">{description}</p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </BorderGlow>
    </motion.div>
  );
};

export default EmptyState;
