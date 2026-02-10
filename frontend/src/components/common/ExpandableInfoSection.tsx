import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpandableInfoSectionProps {
    title: string;
    content: string | undefined | null;
    icon: LucideIcon;
    isOpen: boolean;
    onToggle: () => void;
    variant?: 'primary' | 'blue' | 'emerald' | 'secondary';
    fieldId?: string;
    contextType?: 'career' | 'roadmap' | 'skill';
}

export function ExpandableInfoSection({
    title,
    content,
    icon: Icon,
    isOpen,
    onToggle,
    variant = 'primary',
}: ExpandableInfoSectionProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | string>(0);

    useEffect(() => {
        if (isOpen && contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        } else {
            setHeight(0);
        }
    }, [isOpen, content]);

    const variants = {
        primary: {
            bg: 'bg-primary/5',
            border: 'border-primary/20',
            iconBg: 'bg-primary/10',
            iconColor: 'text-primary',
            accent: 'border-primary/30',
        },
        blue: {
            bg: 'bg-blue-50/50',
            border: 'border-blue-100',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            accent: 'border-blue-200',
        },
        emerald: {
            bg: 'bg-emerald-50/50',
            border: 'border-emerald-100',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            accent: 'border-emerald-200',
        },
        secondary: {
            bg: 'bg-secondary/30',
            border: 'border-secondary',
            iconBg: 'bg-secondary/50',
            iconColor: 'text-secondary-foreground',
            accent: 'border-border',
        },
    };

    const v = variants[variant];
    const displayContent = content || 'Detailed explanation coming soon.';

    return (
        <div className={cn('rounded-xl border transition-all duration-300 overflow-hidden', v.border, v.bg)}>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 text-left group transition-colors hover:bg-black/[0.02]"
            >
                <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg transition-transform duration-300 group-hover:scale-110', v.iconBg, v.iconColor)}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-foreground/80">{title}</h4>
                </div>
                <ChevronDown
                    className={cn(
                        'w-5 h-5 text-muted-foreground transition-transform duration-300',
                        isOpen ? 'rotate-180' : 'rotate-0'
                    )}
                />
            </button>

            <div
                className="transition-all duration-300 ease-in-out"
                style={{ height: height, opacity: isOpen ? 1 : 0 }}
            >
                <div ref={contentRef} className="px-4 pb-4 pl-15">
                    <div className={cn('border-l-2 pl-4 py-1 animate-in fade-in slide-in-from-left-2 duration-500', v.accent)}>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {displayContent}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
