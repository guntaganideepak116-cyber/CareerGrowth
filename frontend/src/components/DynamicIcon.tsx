import {
  Cpu,
  Stethoscope,
  FlaskConical,
  Palette,
  TrendingUp,
  Scale,
  GraduationCap,
  Film,
  Shield,
  Sprout,
  Plane,
  Dumbbell,
  Wrench,
  Building2,
  Briefcase,
  Heart,
  LucideIcon,
  HelpCircle,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Cpu,
  Stethoscope,
  FlaskConical,
  Palette,
  TrendingUp,
  Scale,
  GraduationCap,
  Film,
  Shield,
  Sprout,
  Plane,
  Dumbbell,
  Wrench,
  Building2,
  Briefcase,
  Heart,
};

interface DynamicIconProps {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, className }: DynamicIconProps) {
  const Icon = iconMap[name] || HelpCircle;
  return <Icon className={className} />;
}

export function getIconComponent(name: string): LucideIcon {
  return iconMap[name] || HelpCircle;
}
