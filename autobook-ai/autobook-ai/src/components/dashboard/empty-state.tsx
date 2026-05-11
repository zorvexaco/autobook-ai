import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-16 text-center',
        className
      )}
    >
      {icon && (
        <span className="text-4xl" aria-hidden="true">
          {icon}
        </span>
      )}
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
