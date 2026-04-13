import { motion } from 'framer-motion';

/**
 * Reusable section header with animated badge, title, and subtitle.
 */
const SectionHeader = ({
  badge,
  title,
  highlightedTitle,
  subtitle,
  className = '',
  align = 'center',
}) => {
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col ${alignCls} mb-16 ${className}`}>
      {badge && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-block text-xs font-semibold tracking-widest text-orange-400 uppercase
                     border border-orange-500/30 bg-orange-500/8 px-4 py-1.5 rounded-full mb-4"
        >
          {badge}
        </motion.span>
      )}

      {(title || highlightedTitle) && (
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight"
        >
          {title}
          {highlightedTitle && (
            <>
              <br className="hidden sm:block" />{' '}
              <span className="gradient-text">{highlightedTitle}</span>
            </>
          )}
        </motion.h2>
      )}

      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`text-zinc-500 mt-4 text-sm leading-relaxed ${
            align === 'center' ? 'max-w-md mx-auto' : 'max-w-lg'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeader;
