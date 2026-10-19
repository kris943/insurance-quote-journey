import type { IconName } from '@/components/icons/Icon';

const PAGE_ICONS: Record<string, IconName> = {
  'your details': 'mail',
  'about you': 'user',
  lifestyle: 'heartPulse',
};

export const getPageIcon = (title: string): IconName =>
  PAGE_ICONS[title.toLowerCase()] ?? 'clipboard';
