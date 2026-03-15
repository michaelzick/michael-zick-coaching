import type { ComponentType } from 'react';
import { Heart, Mountain, Shield, Star, Target, Users, type IconProps } from '@/lib/icons';
import type { CoachIcon } from '@/types/coach';

export const coachIconMap: Record<CoachIcon, ComponentType<IconProps>> = {
  Target,
  Shield,
  Heart,
  Mountain,
  Users,
  Star,
};

export const coachIconOptions: Array<{ value: CoachIcon; label: string }> = [
  { value: 'Target', label: 'Target' },
  { value: 'Shield', label: 'Shield' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Mountain', label: 'Mountain' },
  { value: 'Users', label: 'Users' },
  { value: 'Star', label: 'Star' },
];

export function getCoachIcon(icon: CoachIcon) {
  return coachIconMap[icon] ?? Star;
}
