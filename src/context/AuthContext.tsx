import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, GearReport, ActionProject, ResourceListing, ActivityLog, FeedPost, AppNotification } from '../types';
import { api, SharedDataPayload, getStoredToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup' | 'forgot' | 'reset';
  setAuthMode: (mode: 'login' | 'signup' | 'forgot' | 'reset') => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (params: { name: string; email: string; password: string; location?: string; chapter?: string; bio?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  switchDemoAccount: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; debugToken?: string }>;
  resetPassword: (token: string, newPass: string) => Promise<void>;

  // Shared live database
  sharedData: SharedDataPayload | null;
  refreshData: () => Promise<void>;
  isRealtimeConnected: boolean;

  // Convenient data accessors & mutations
  reports: GearReport[];
  projects: ActionProject[];
  listings: ResourceListing[];
  activityLogs: ActivityLog[];
  feedPosts: FeedPost[];
  testimonials: any[];
  notifications: AppNotification[];

  addReport: (data: Partial<GearReport>) => Promise<GearReport>;
  updateReportStatus: (id: string, status: string, assignedTeam?: string) => Promise<void>;
  joinProject: (projectId: string) => Promise<void>;
  leaveProject: (projectId: string) => Promise<void>;
  addListing: (listing: Partial<ResourceListing>) => Promise<ResourceListing>;
  logActivity: (data: { category: string; weightKg: number; hours: number; location: string; verificationMethod?: string }) => Promise<void>;
  createPost: (params: {
    content: string;
    imageUrl?: string | null;
    location?: string;
    category?: string;
    linkedProjectId?: string;
    linkedProjectTitle?: string;
    linkedReportId?: string;
    linkedReportTitle?: string;
  }) => Promise<void>;
  editPost: (
    postId: string,
    params: {
      content?: string;
      category?: string;
      imageUrl?: string | null;
      linkedProjectId?: string;
      linkedProjectTitle?: string;
      linkedReportId?: string;
      linkedReportTitle?: string;
    }
  ) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  commentPost: (postId: string, text: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;

  // Testimonials
  createTestimonial: (data: {
    authorName?: string;
    authorRole: string;
    affiliation?: string;
    story: string;
    authorAvatar?: string;
    consentGiven: boolean;
  }) => Promise<void>;
  editTestimonial: (
    id: string,
    data: {
      story?: string;
      authorRole?: string;
      affiliation?: string;
      authorAvatar?: string;
    }
  ) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  moderateTestimonial: (id: string, status: 'approved' | 'pending_review') => Promise<void>;
  uploadImage: (dataUrl: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');
  const [sharedData, setSharedData] = useState<SharedDataPayload | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  // Fetch shared database records
  const refreshData = useCallback(async () => {
    try {
      const data = await api.getSharedData();
      setSharedData(data);
    } catch (err) {
      console.error('Failed fetching shared database records:', err);
    }
  }, []);

  // Initialize Auth & Data on mount
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const token = getStoredToken();
        if (token) {
          try {
            const { user: authedUser } = await api.getMe();
            if (mounted) setUser(authedUser);
          } catch (err) {
            console.warn('Session expired or invalid token:', err);
            // Session expired, fallback to guest or demo
          }
        }
        await refreshData();
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [refreshData]);

  // Connect Server-Sent Events (SSE) for real-time live updates
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: any = null;

    function connectSSE() {
      try {
        eventSource = new EventSource('/api/events');

        eventSource.onopen = () => {
          setIsRealtimeConnected(true);
        };

        eventSource.addEventListener('connected', () => {
          setIsRealtimeConnected(true);
        });

        const handleUpdate = () => {
          refreshData();
        };

        eventSource.addEventListener('user_registered', handleUpdate);
        eventSource.addEventListener('report_created', handleUpdate);
        eventSource.addEventListener('report_updated', handleUpdate);
        eventSource.addEventListener('project_updated', handleUpdate);
        eventSource.addEventListener('listing_created', handleUpdate);
        eventSource.addEventListener('activity_logged', handleUpdate);
        eventSource.addEventListener('feed_updated', handleUpdate);
        eventSource.addEventListener('feed_post_deleted', handleUpdate);
        eventSource.addEventListener('testimonials_updated', handleUpdate);
        eventSource.addEventListener('profile_updated', (e: MessageEvent) => {
          try {
            const parsed = JSON.parse(e.data);
            if (parsed.user && user && parsed.user.id === user.id) {
              setUser(parsed.user);
            }
          } catch {
            // Ignore parse errors
          }
          handleUpdate();
        });

        eventSource.onerror = () => {
          setIsRealtimeConnected(false);
          eventSource?.close();
          retryTimeout = setTimeout(connectSSE, 4000);
        };
      } catch (e) {
        setIsRealtimeConnected(false);
        retryTimeout = setTimeout(connectSSE, 5000);
      }
    }

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [refreshData, user]);

  // Auth Operations
  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setUser(res.user);
    setAuthModalOpen(false);
    await refreshData();
  };

  const signup = async (params: {
    name: string;
    email: string;
    password: string;
    location?: string;
    chapter?: string;
    bio?: string;
  }) => {
    const res = await api.register(params);
    setUser(res.user);
    setAuthModalOpen(false);
    await refreshData();
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setAuthModalOpen(false);
    await refreshData();
  };

  const updateProfile = async (updates: Partial<User>) => {
    const res = await api.updateProfile(updates);
    setUser(res.user);
    await refreshData();
  };

  const switchDemoAccount = async (email: string) => {
    const res = await api.switchDemoAccount(email);
    setUser(res.user);
    setAuthModalOpen(false);
    await refreshData();
  };

  const forgotPassword = async (email: string) => {
    return api.forgotPassword(email);
  };

  const resetPassword = async (token: string, newPass: string) => {
    await api.resetPassword(token, newPass);
  };

  // Shared Data Operations
  const addReport = async (data: Partial<GearReport>): Promise<GearReport> => {
    const res = await api.createReport(data);
    await refreshData();
    return res.report;
  };

  const updateReportStatus = async (id: string, status: string, assignedTeam?: string) => {
    await api.updateReportStatus(id, status, assignedTeam);
    await refreshData();
  };

  const joinProject = async (projectId: string) => {
    await api.joinProject(projectId);
    // Refresh user stats as well
    if (user) {
      const { user: updatedUser } = await api.getMe();
      setUser(updatedUser);
    }
    await refreshData();
  };

  const leaveProject = async (projectId: string) => {
    await api.leaveProject(projectId);
    if (user) {
      const { user: updatedUser } = await api.getMe();
      setUser(updatedUser);
    }
    await refreshData();
  };

  const addListing = async (listing: Partial<ResourceListing>) => {
    const res = await api.createListing(listing);
    await refreshData();
    return res.listing;
  };

  const logActivity = async (data: {
    category: string;
    weightKg: number;
    hours: number;
    location: string;
    verificationMethod?: string;
  }) => {
    const res = await api.logActivity(data);
    setUser(res.user);
    await refreshData();
  };

  const createPost = async (params: {
    content: string;
    imageUrl?: string | null;
    location?: string;
    category?: string;
    linkedProjectId?: string;
    linkedProjectTitle?: string;
    linkedReportId?: string;
    linkedReportTitle?: string;
  }) => {
    await api.createFeedPost(params);
    await refreshData();
  };

  const editPost = async (
    postId: string,
    params: {
      content?: string;
      category?: string;
      imageUrl?: string | null;
      linkedProjectId?: string;
      linkedProjectTitle?: string;
      linkedReportId?: string;
      linkedReportTitle?: string;
    }
  ) => {
    await api.editFeedPost(postId, params);
    await refreshData();
  };

  const deletePost = async (postId: string) => {
    await api.deleteFeedPost(postId);
    await refreshData();
  };

  const likePost = async (postId: string) => {
    await api.likePost(postId);
    await refreshData();
  };

  const commentPost = async (postId: string, text: string) => {
    await api.commentPost(postId, text);
    await refreshData();
  };

  const deleteComment = async (postId: string, commentId: string) => {
    await api.deleteFeedComment(postId, commentId);
    await refreshData();
  };

  const createTestimonial = async (data: {
    authorName?: string;
    authorRole: string;
    affiliation?: string;
    story: string;
    authorAvatar?: string;
    consentGiven: boolean;
  }) => {
    await api.createTestimonial(data);
    await refreshData();
  };

  const editTestimonial = async (
    id: string,
    data: {
      story?: string;
      authorRole?: string;
      affiliation?: string;
      authorAvatar?: string;
    }
  ) => {
    await api.editTestimonial(id, data);
    await refreshData();
  };

  const deleteTestimonial = async (id: string) => {
    await api.deleteTestimonial(id);
    await refreshData();
  };

  const moderateTestimonial = async (id: string, status: 'approved' | 'pending_review') => {
    await api.moderateTestimonial(id, status);
    await refreshData();
  };

  const uploadImage = async (dataUrl: string) => {
    const res = await api.uploadImage(dataUrl);
    return res.url;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        signup,
        logout,
        updateProfile,
        switchDemoAccount,
        forgotPassword,
        resetPassword,
        sharedData,
        refreshData,
        isRealtimeConnected,

        reports: sharedData?.reports || [],
        projects: sharedData?.projects || [],
        listings: sharedData?.listings || [],
        activityLogs: sharedData?.activityLogs || [],
        feedPosts: sharedData?.feedPosts || [],
        testimonials: sharedData?.testimonials || [],
        notifications: sharedData?.notifications || [],

        addReport,
        updateReportStatus,
        joinProject,
        leaveProject,
        addListing,
        logActivity,
        createPost,
        editPost,
        deletePost,
        likePost,
        commentPost,
        deleteComment,
        createTestimonial,
        editTestimonial,
        deleteTestimonial,
        moderateTestimonial,
        uploadImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
