export type ScreenId =
  | 'welcome'
  | 'home'
  | 'explore'
  | 'actions'
  | 'project-details'
  | 'shorescan'
  | 'report-gear'
  | 'dossiers'
  | 'community-feed'
  | 'recycling'
  | 'profile'
  | 'auth'
  | 'navigator';

export interface ToastMessage {
  id: string;
  message: string;
  icon?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export interface UserStats {
  gearDivertedKg: number;
  hoursLogged: number;
  projectsDone: number;
  sortiesCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  chapter: string;
  role: 'Steward' | 'Coordinator' | 'Admin' | string;
  badge: string;
  stats: UserStats;
  createdAt?: string;
}

export interface MapLocationItem {
  id: string;
  name: string;
  address: string;
  region: 'indonesia' | 'pacific' | 'mediterranean' | 'atlantic' | 'all';
  regionLabel: string;
  distance: string;
  type: 'collection' | 'repair' | 'recovery' | 'recycling' | 'sanctuary';
  statusBadge: string;
  hours: string;
  capacityLeft: string;
  capacityPercent: number;
  accepted: string[];
  lat: number;
  lng: number;
  country: string;
}

export interface GearReport {
  id: string;
  gearType: string;
  condition: string;
  locationName: string;
  coords: string;
  date: string;
  time: string;
  notes: string;
  threatLevel: string;
  hasWildlifeEntanglement: boolean;
  status: 'Under Review' | 'Action Planned' | 'Verified & Salvaged';
  imageUrl?: string;
  submittedAt: string;
  confidence?: string;
  assignedTeam?: string;
  creatorId?: string;
  creatorName?: string;
}

export interface ShoreScanSample {
  id: string;
  key: 'sanur' | 'reef' | 'buoy' | 'clean';
  title: string;
  icon: string;
  bgUrl: string;
  badgeText: string;
  confText: string;
  category: string;
  risk: string;
  notes: string;
  hasBox: boolean;
  coordinates: string;
  temp: string;
  ram: string;
  exposure: string;
}

export interface ProjectParticipant {
  userId: string;
  name: string;
  avatar: string;
  role?: string;
}

export interface ActionProject {
  id: string;
  title: string;
  location: string;
  date: string;
  meetingPoint: string;
  targetTonnage: string;
  maxParticipants: number;
  description: string;
  urgent: boolean;
  status: string;
  imageUrl: string;
  participants: ProjectParticipant[];
}

export interface ResourceListing {
  id: string;
  title: string;
  category: string;
  quantity: number;
  unit: string;
  condition: string;
  location: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  status: string;
  createdAt: string;
  description: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  category: string;
  weightKg: number;
  hours: number;
  location: string;
  verificationMethod: string;
  date: string;
  timestamp: number;
}

export type PostCategory =
  | 'Beach Cleanup'
  | 'Ghost Gear Reports'
  | 'Marine Life'
  | 'Community Projects'
  | 'Recycling'
  | 'Educational Tips';

export interface FeedComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  category: PostCategory;
  timeAgo: string;
  location: string;
  content: string;
  imageUrl?: string | null;
  linkedProjectId?: string;
  linkedProjectTitle?: string;
  linkedReportId?: string;
  linkedReportTitle?: string;
  likesCount: number;
  likedBy: string[];
  comments: FeedComment[];
  createdAt?: string;
}

export type TestimonialRole =
  | 'Volunteer'
  | 'Student'
  | 'Fisher'
  | 'Community Organizer'
  | 'Environmental Organization';

export interface CommunityTestimonial {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: TestimonialRole;
  affiliation?: string;
  story: string;
  date: string;
  createdAt: string;
  consentGiven: boolean;
  status: 'approved' | 'pending_review';
  isSample?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  read: boolean;
  linkScreen?: ScreenId;
}

