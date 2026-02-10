import { useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoTooltipProps {
    title: string;
    description: string;
    children?: React.ReactNode;
    className?: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
}

export function InfoTooltip({
    title,
    description,
    children,
    className,
    side = 'top',
}: InfoTooltipProps) {
    const [open, setOpen] = useState(false);

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip open={open} onOpenChange={setOpen}>
                <TooltipTrigger asChild>
                    {children || (
                        <button
                            className={cn(
                                'inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors',
                                className
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(!open);
                            }}
                        >
                            <Info className="w-3 h-3 text-muted-foreground" />
                        </button>
                    )}
                </TooltipTrigger>
                <TooltipContent
                    side={side}
                    className="max-w-xs p-4 space-y-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="font-semibold text-foreground">{title}</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

// Wrapper component for inline text with tooltip
interface InfoTextProps {
    text: string;
    tooltip: string;
    className?: string;
}

export function InfoText({ text, tooltip, className }: InfoTextProps) {
    return (
        <span className={cn('inline-flex items-center gap-1', className)}>
            <span>{text}</span>
            <InfoTooltip title={text} description={tooltip} />
        </span>
    );
}
