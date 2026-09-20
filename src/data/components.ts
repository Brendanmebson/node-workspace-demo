import type { SvgIconComponent } from '@mui/icons-material';
import ApiOutlined from '@mui/icons-material/ApiOutlined';
import BoltOutlined from '@mui/icons-material/BoltOutlined';
import CallSplitOutlined from '@mui/icons-material/CallSplitOutlined';
import MailOutlineOutlined from '@mui/icons-material/MailOutlineOutlined';
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined';
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import StorageOutlined from '@mui/icons-material/StorageOutlined';
import WorkOutlineOutlined from '@mui/icons-material/WorkOutlineOutlined';
import type { CatalogItem } from '../types/workflow';

export const nodeIcons: Record<string, SvgIconComponent> = {
  trigger: BoltOutlined,
  job: WorkOutlineOutlined,
  user: PersonOutlineOutlined,
  search: SearchOutlined,
  email: MailOutlineOutlined,
  notification: NotificationsNoneOutlined,
  database: StorageOutlined,
  api: ApiOutlined,
  condition: CallSplitOutlined,
};

/** Everything that can be dragged out of the sidebar. */
export const catalog: CatalogItem[] = [
  { type: 'trigger', label: 'Trigger', description: 'Start a workflow', category: 'start', icon: 'trigger' },
  { type: 'job', label: 'Job', description: 'Run a job action', category: 'action', icon: 'job' },
  { type: 'user', label: 'User', description: 'Look up a user', category: 'data', icon: 'user' },
  { type: 'search', label: 'Search', description: 'Find records', category: 'data', icon: 'search' },
  { type: 'email', label: 'Email', description: 'Send an email', category: 'action', icon: 'email' },
  { type: 'notification', label: 'Notification', description: 'Alert someone', category: 'action', icon: 'notification' },
  { type: 'database', label: 'Database', description: 'Read or write rows', category: 'data', icon: 'database' },
  { type: 'api-request', label: 'API request', description: 'Call a web service', category: 'action', icon: 'api' },
  { type: 'condition', label: 'Condition', description: 'Branch on a rule', category: 'logic', icon: 'condition' },
];

export const catalogByType: Record<string, CatalogItem> = Object.fromEntries(
  catalog.map((item) => [item.type, item]),
);
