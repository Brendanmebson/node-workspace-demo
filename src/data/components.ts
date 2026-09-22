import type { SvgIconComponent } from '@mui/icons-material';
import LensOutlined from '@mui/icons-material/LensOutlined';
import RadioButtonCheckedOutlined from '@mui/icons-material/RadioButtonCheckedOutlined';
import type { CatalogItem } from '../types/workflow';

export const nodeIcons: Record<string, SvgIconComponent> = {
  circle1: RadioButtonCheckedOutlined,
  circle2: LensOutlined,
};

/** The two circle components that can be dragged out of the left column. */
export const catalog: CatalogItem[] = [
  {
    type: 'circle-1',
    label: 'Circle 1',
    description: 'Circular node with connecting dots',
    category: 'start',
    icon: 'circle1',
    color: '#0B7A67',
    bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #E6F4F1 100%)',
  },
  {
    type: 'circle-2',
    label: 'Circle 2',
    description: 'Circular node with connecting dots',
    category: 'action',
    icon: 'circle2',
    color: '#4F46E5',
    bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #EEF2FF 100%)',
  },
];

export const catalogByType: Record<string, CatalogItem> = Object.fromEntries(
  catalog.map((item) => [item.type, item]),
);

