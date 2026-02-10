import { ReactNode, memo } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  description: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  className?: string;
  colorScheme?: 'primary' | 'success' | 'warning' | 'danger';
}

const colorClasses = {
  primary: 'from-primary/10 to-primary/5 border-primary/20',
  success: 'from-success/10 to-success/5 border-success/20',
  warning: 'from-warning/10 to-warning/5 border-warning/20',
  danger: 'from-danger/10 to-danger/5 border-danger/20',
};

const iconColorClasses = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
};

const valueColorClasses = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

const progressBarClasses = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export const MetricCard = memo(function MetricCard({
  title,
  value,
  suffix = '%',
  description,
  icon,
  trend,
  trendValue,
  className,
  colorScheme = 'primary',
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 transition-all duration-300 hover:shadow-lg animate-in fade-in zoom-in-95 duration-500',
        colorClasses[colorScheme],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground tracking-tight">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className={cn('text-3xl font-bold tracking-tighter', valueColorClasses[colorScheme])}>
              {value}
            </span>
            <span className="text-lg text-muted-foreground font-medium">{suffix}</span>
          </div>
        </div>
        <div className={cn('p-3 rounded-xl shadow-inner-sm', iconColorClasses[colorScheme])}>
          {icon}
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground leading-snug">{description}</p>

      {trend && trendValue && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              'text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider',
              trend === 'up' && 'bg-success/10 text-success',
              trend === 'down' && 'bg-danger/10 text-danger',
              trend === 'stable' && 'bg-muted text-muted-foreground'
            )}
          >
            {trend === 'up' && '↑'} {trend === 'down' && '↓'} {trendValue}
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-out',
            progressBarClasses[colorScheme]
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
});
