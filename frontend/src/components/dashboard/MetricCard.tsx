import { ReactNode } from 'react';
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

export function MetricCard({
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

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 transition-all duration-300 hover:shadow-lg',
        colorClasses[colorScheme],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className={cn('text-3xl font-bold', valueColorClasses[colorScheme])}>
              {value}
            </span>
            <span className="text-lg text-muted-foreground">{suffix}</span>
          </div>
        </div>
        <div className={cn('p-3 rounded-xl', iconColorClasses[colorScheme])}>
          {icon}
        </div>
      </div>
      
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      
      {trend && trendValue && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              'text-xs font-medium px-2 py-1 rounded-full',
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
      <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000',
            colorScheme === 'primary' && 'bg-primary',
            colorScheme === 'success' && 'bg-success',
            colorScheme === 'warning' && 'bg-warning',
            colorScheme === 'danger' && 'bg-danger'
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
