import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export function StatsCard({ title, value, subtitle, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white px-6 py-5',
        className
      )}
    >
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
