// Centralized icon exports for the app
// Using react-icons library (Heroicons, Font Awesome, Material Design)

// Heroicons (Modern, clean icons)
import { 
  AcademicCapIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  StarIcon,
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperAirplaneIcon,
  HandRaisedIcon,
  SparklesIcon,
  BoltIcon,
  ClockIcon,
  ComputerDesktopIcon,
  PencilSquareIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ChartBarIcon,
  InboxIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  FireIcon,
  LightBulbIcon,
  TrophyIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

// Solid versions for filled icons
import {
  AcademicCapIcon as AcademicCapSolid,
  StarIcon as StarSolid,
  CheckCircleIcon as CheckCircleSolid,
  XCircleIcon as XCircleSolid,
  HeartIcon as HeartSolid,
  FireIcon as FireSolid,
  BoltIcon as BoltSolid,
  SparklesIcon as SparklesSolid
} from '@heroicons/react/24/solid';

// Export organized by category
export const Icons = {
  // Brand & Logo
  logo: AcademicCapIcon,
  logoSolid: AcademicCapSolid,
  
  // Navigation
  home: HomeIcon,
  discover: MagnifyingGlassIcon,
  dashboard: ChartBarIcon,
  profile: UserCircleIcon,
  menu: Bars3Icon,
  close: XMarkIcon,
  
  // Actions
  search: MagnifyingGlassIcon,
  send: PaperAirplaneIcon,
  edit: PencilSquareIcon,
  logout: ArrowRightOnRectangleIcon,
  next: ArrowRightIcon,
  check: CheckCircleIcon,
  checkSolid: CheckCircleSolid,
  cancel: XCircleIcon,
  cancelSolid: XCircleSolid,
  
  // Features
  chat: ChatBubbleLeftRightIcon,
  chatBubbleLeftRight: ChatBubbleLeftRightIcon,
  calendar: CalendarDaysIcon,
  calendarDays: CalendarDaysIcon,
  star: StarIcon,
  starSolid: StarSolid,
  users: UserGroupIcon,
  location: MapPinIcon,
  mapPin: MapPinIcon,
  handshake: HandRaisedIcon,
  handRaised: HandRaisedIcon,
  sparkles: SparklesIcon,
  sparklesSolid: SparklesSolid,
  bolt: BoltIcon,
  boltSolid: BoltSolid,
  clock: ClockIcon,
  computer: ComputerDesktopIcon,
  inbox: InboxIcon,
  heart: HeartIcon,
  heartSolid: HeartSolid,
  fire: FireIcon,
  fireSolid: FireSolid,
  lightbulb: LightBulbIcon,
  trophy: TrophyIcon,
  rocket: RocketLaunchIcon,
  globe: GlobeAltIcon,
  academicCap: AcademicCapIcon,
  paperAirplane: PaperAirplaneIcon,
  xMark: XMarkIcon,
  link: LinkIcon,
  
  // Status & Feedback
  success: CheckCircleSolid,
  error: XCircleSolid,
  warning: BoltSolid,
  info: SparklesSolid
};

// Icon wrapper component for consistent sizing
export const Icon = ({ icon: IconComponent, className = '', size = 'md', ...props }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
    '3xl': 'w-12 h-12'
  };
  
  return <IconComponent className={`${sizeClasses[size]} ${className}`} {...props} />;
};

export default Icons;
