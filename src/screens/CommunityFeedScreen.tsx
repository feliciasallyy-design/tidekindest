import React, { useState, useRef, useEffect } from 'react';
import { ASSETS } from '../data/assets';
import { ScreenId, FeedPost, PostCategory, TestimonialRole, CommunityTestimonial } from '../types';
import { useAuth } from '../context/AuthContext';

interface CommunityFeedScreenProps {
  onNavigate: (screen: ScreenId) => void;
  showToast: (msg: string, icon?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const POST_CATEGORIES: PostCategory[] = [
  'Beach Cleanup',
  'Ghost Gear Reports',
  'Marine Life',
  'Community Projects',
  'Recycling',
  'Educational Tips',
];

const TESTIMONIAL_ROLES: TestimonialRole[] = [
  'Volunteer',
  'Student',
  'Fisher',
  'Community Organizer',
  'Environmental Organization',
];

export const CommunityFeedScreen: React.FC<CommunityFeedScreenProps> = ({
  onNavigate,
  showToast,
}) => {
  const {
    user,
    feedPosts,
    testimonials,
    projects,
    reports,
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
    setAuthModalOpen,
    refreshData,
  } = useAuth();

  // Primary Tab: Feed vs Stories
  const [mainTab, setMainTab] = useState<'feed' | 'stories'>('feed');

  // Feed Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [feedSearch, setFeedSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Post Detail Modal
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);

  // Create Post Modal State
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>('Community Projects');
  const [newPostLocation, setNewPostLocation] = useState(user?.location || 'Sanur, Bali');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [linkedProjectId, setLinkedProjectId] = useState<string>('');
  const [linkedReportId, setLinkedReportId] = useState<string>('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // Edit Post Modal State
  const [editingPost, setEditingPost] = useState<FeedPost | null>(null);
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState<PostCategory>('Community Projects');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Camera Capture State for Feed Post
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Comment submission per post
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Testimonials Filter & Search
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [storySearch, setStorySearch] = useState('');

  // Submit Testimonial Modal
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [testimonialName, setTestimonialName] = useState(user?.name || '');
  const [testimonialRole, setTestimonialRole] = useState<TestimonialRole>('Volunteer');
  const [testimonialAffiliation, setTestimonialAffiliation] = useState(user?.chapter || user?.location || '');
  const [testimonialStory, setTestimonialStory] = useState('');
  const [testimonialAvatar, setTestimonialAvatar] = useState(user?.avatar || '');
  const [testimonialConsent, setTestimonialConsent] = useState(false);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const [storyError, setStoryError] = useState<string | null>(null);

  // Edit Testimonial Modal
  const [editingStory, setEditingStory] = useState<CommunityTestimonial | null>(null);
  const [editStoryContent, setEditStoryContent] = useState('');
  const [editStoryRole, setEditStoryRole] = useState<TestimonialRole>('Volunteer');
  const [editStoryAffiliation, setEditStoryAffiliation] = useState('');
  const [isSubmittingStoryEdit, setIsSubmittingStoryEdit] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setTestimonialName(user.name);
      setTestimonialAvatar(user.avatar || '');
      setNewPostLocation(user.location || 'Sanur, Bali');
    }
  }, [user]);

  // Handle Refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      showToast('Community feed updated from ocean network!', 'sync', 'success');
    } catch {
      showToast('Failed to refresh feed', 'error', 'error');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Camera Management
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError(err.message || 'Unable to access device camera. Please check permissions or choose file upload.');
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setNewPostImage(dataUrl);
      showToast('Photo captured!', 'photo_camera', 'success');
    }
    stopCamera();
  };

  // File Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp|gif)$/i)) {
      showToast('Please upload a valid JPG, PNG, or WEBP image', 'warning', 'warning');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image file size must be under 8MB', 'warning', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setNewPostImage(result);
        showToast('Image attached to post!', 'image', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Like Toggle
  const handleToggleLike = async (postId: string) => {
    if (!user) {
      setAuthModalOpen(true);
      showToast('Please sign in to like community posts', 'lock', 'info');
      return;
    }
    try {
      await likePost(postId);
    } catch (err: any) {
      showToast(err.message || 'Failed to update endorsement', 'error', 'error');
    }
  };

  // Create Post
  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError(null);

    if (!user) {
      setAuthModalOpen(true);
      showToast('Sign in to publish community posts', 'lock', 'info');
      return;
    }

    if (!newPostText.trim()) {
      setPostError('Post content cannot be empty.');
      return;
    }

    setIsSubmittingPost(true);
    try {
      const selectedProject = projects.find((p) => p.id === linkedProjectId);
      const selectedReport = reports.find((r) => r.id === linkedReportId);

      await createPost({
        content: newPostText.trim(),
        imageUrl: newPostImage,
        location: newPostLocation,
        category: newPostCategory,
        linkedProjectId: selectedProject?.id,
        linkedProjectTitle: selectedProject?.title,
        linkedReportId: selectedReport?.id,
        linkedReportTitle: selectedReport?.gearType,
      });

      setNewPostText('');
      setNewPostImage(null);
      setLinkedProjectId('');
      setLinkedReportId('');
      setIsCreatePostOpen(false);
      stopCamera();
      showToast('Your update was published to the live ocean feed!', 'check_circle', 'success');
    } catch (err: any) {
      setPostError(err.message || 'Failed to publish post. Your draft has been kept.');
      showToast(err.message || 'Publishing failed', 'error', 'error');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Edit Post
  const handleSaveEditedPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editText.trim()) return;

    setIsSubmittingEdit(true);
    try {
      await editPost(editingPost.id, {
        content: editText.trim(),
        category: editCategory,
      });
      setEditingPost(null);
      showToast('Post updated successfully!', 'check_circle', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed editing post', 'error', 'error');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Delete Post
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(postId);
      if (selectedPost?.id === postId) setSelectedPost(null);
      showToast('Post removed from community feed', 'delete', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed deleting post', 'error', 'error');
    }
  };

  // Comment Submission
  const handleAddComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      showToast('Please sign in to comment', 'lock', 'info');
      return;
    }
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      await commentPost(postId, commentText.trim());
      setCommentText('');
      showToast('Comment published!', 'chat', 'success');
      // If selected post is open, update its reference
      if (selectedPost && selectedPost.id === postId) {
        const fresh = feedPosts.find((p) => p.id === postId);
        if (fresh) setSelectedPost(fresh);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed adding comment', 'error', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await deleteComment(postId, commentId);
      showToast('Comment deleted', 'delete', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed removing comment', 'error', 'error');
    }
  };

  // Testimonial Submission
  const handlePublishTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoryError(null);

    if (!user) {
      setAuthModalOpen(true);
      showToast('Please sign in to submit your conservation story', 'lock', 'info');
      return;
    }

    if (!testimonialStory.trim() || testimonialStory.trim().length < 15) {
      setStoryError('Please write at least 15 characters for your story.');
      return;
    }

    if (!testimonialConsent) {
      setStoryError('You must agree to the public display consent checkbox.');
      return;
    }

    setIsSubmittingStory(true);
    try {
      await createTestimonial({
        authorName: testimonialName.trim(),
        authorRole: testimonialRole,
        affiliation: testimonialAffiliation.trim(),
        story: testimonialStory.trim(),
        authorAvatar: testimonialAvatar || user.avatar,
        consentGiven: true,
      });

      setTestimonialStory('');
      setTestimonialConsent(false);
      setIsTestimonialModalOpen(false);
      showToast('Your story was submitted! It will appear after community review.', 'verified', 'success');
    } catch (err: any) {
      setStoryError(err.message || 'Failed submitting story');
      showToast(err.message || 'Submission failed', 'error', 'error');
    } finally {
      setIsSubmittingStory(false);
    }
  };

  // Save Edited Testimonial
  const handleSaveEditedStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory || !editStoryContent.trim()) return;

    setIsSubmittingStoryEdit(true);
    try {
      await editTestimonial(editingStory.id, {
        story: editStoryContent.trim(),
        authorRole: editStoryRole,
        affiliation: editStoryAffiliation.trim(),
      });
      setEditingStory(null);
      showToast('Story updated!', 'check_circle', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed saving edits', 'error', 'error');
    } finally {
      setIsSubmittingStoryEdit(false);
    }
  };

  // Delete Testimonial
  const handleDeleteStory = async (id: string) => {
    if (!window.confirm('Delete your story submission?')) return;
    try {
      await deleteTestimonial(id);
      showToast('Story removed', 'delete', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed deleting story', 'error', 'error');
    }
  };

  // Moderate Testimonial (Approve / Reject)
  const handleToggleModerateStory = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'approved' ? 'pending_review' : 'approved';
    try {
      await moderateTestimonial(id, nextStatus);
      showToast(`Story marked as ${nextStatus === 'approved' ? 'Approved' : 'Pending Review'}`, 'verified', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed moderating story', 'error', 'error');
    }
  };

  // Share Link
  const handleShare = (title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(`Link to "${title.substring(0, 30)}..." copied to clipboard!`, 'share', 'success');
    }
  };

  // Filtered Feed Posts (Newest first)
  const filteredFeed = feedPosts
    .filter((post) => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch =
        feedSearch.trim() === '' ||
        post.content.toLowerCase().includes(feedSearch.toLowerCase()) ||
        post.authorName.toLowerCase().includes(feedSearch.toLowerCase()) ||
        post.location.toLowerCase().includes(feedSearch.toLowerCase()) ||
        post.category.toLowerCase().includes(feedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

  // Filtered Testimonials
  const filteredTestimonials = testimonials.filter((story) => {
    // Only show approved stories, or user's own submissions
    const isVisible = story.status === 'approved' || (user && story.authorId === user.id) || (user && user.role === 'Admin');
    const matchesRole = selectedRole === 'all' || story.authorRole === selectedRole;
    const matchesSearch =
      storySearch.trim() === '' ||
      story.story.toLowerCase().includes(storySearch.toLowerCase()) ||
      story.authorName.toLowerCase().includes(storySearch.toLowerCase()) ||
      (story.affiliation && story.affiliation.toLowerCase().includes(storySearch.toLowerCase()));
    return isVisible && matchesRole && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-lg mx-auto px-4 space-y-4">
      {/* Top Main Navigation Tabs: Community Feed vs Stories & Testimonials */}
      <div className="bg-[#e8eff7] p-1 rounded-2xl flex items-center shadow-inner">
        <button
          type="button"
          onClick={() => setMainTab('feed')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mainTab === 'feed'
              ? 'btn-cool-primary text-white shadow-md'
              : 'text-[#41484b] hover:text-[#151c22]'
          }`}
        >
          <span className="material-symbols-outlined text-base">forum</span>
          <span>Community Feed</span>
          <span className="bg-[#90f4e9] text-[#00504a] text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-1">
            {feedPosts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab('stories')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mainTab === 'stories'
              ? 'btn-cool-primary text-white shadow-md'
              : 'text-[#41484b] hover:text-[#151c22]'
          }`}
        >
          <span className="material-symbols-outlined text-base">record_voice_over</span>
          <span>Stories &amp; Voices</span>
          <span className="bg-white/80 text-[#002531] text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-1">
            {filteredTestimonials.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COMMUNITY FEED */}
      {/* ========================================================================= */}
      {mainTab === 'feed' && (
        <>
          {/* Post Composer Trigger Card */}
          <section className="bg-white rounded-3xl p-4 shadow-sm border border-[#e8eff7] space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar || ASSETS.userProfile}
                alt={user?.name || 'Ocean Steward'}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-[#006a63]/40 bg-[#eef4fc] shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = ASSETS.userProfile;
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    setAuthModalOpen(true);
                    showToast('Please sign in or create an account to post', 'lock', 'info');
                  } else {
                    setIsCreatePostOpen(true);
                  }
                }}
                className="flex-1 text-left bg-[#f6faff] hover:bg-[#eef4fc] text-[#72787c] text-xs font-semibold py-3 px-4 rounded-2xl border border-[#dce3eb] transition-all flex items-center justify-between"
              >
                <span>
                  {user ? `Share a field update, ${user.name.split(' ')[0]}...` : 'Sign in to share ocean updates...'}
                </span>
                <span className="material-symbols-outlined text-[#006a63] text-lg">edit_note</span>
              </button>
            </div>

            {/* Quick Media Action Row */}
            <div className="flex items-center justify-between pt-2 border-t border-[#f0f4f8] text-xs">
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    setAuthModalOpen(true);
                  } else {
                    setIsCreatePostOpen(true);
                    setTimeout(() => startCamera(), 200);
                  }
                }}
                className="flex items-center gap-1.5 text-[#006a63] hover:text-[#004d48] font-bold py-1 px-2.5 rounded-xl hover:bg-[#eef4fc] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">photo_camera</span>
                <span>Camera</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    setAuthModalOpen(true);
                  } else {
                    setIsCreatePostOpen(true);
                    setTimeout(() => fileInputRef.current?.click(), 200);
                  }
                }}
                className="flex items-center gap-1.5 text-[#006a63] hover:text-[#004d48] font-bold py-1 px-2.5 rounded-xl hover:bg-[#eef4fc] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">image</span>
                <span>Upload Photo</span>
              </button>

              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1 text-[#41484b] hover:text-[#002531] font-semibold py-1 px-2 rounded-xl hover:bg-[#eef4fc] transition-colors"
                title="Refresh feed"
              >
                <span className={`material-symbols-outlined text-base ${isRefreshing ? 'animate-spin text-[#006a63]' : ''}`}>
                  refresh
                </span>
                <span className="text-[11px]">Refresh</span>
              </button>
            </div>
          </section>

          {/* Search & Category Filter Section */}
          <div className="space-y-2">
            {/* Search Input */}
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[#006a63] absolute left-3.5 pointer-events-none text-lg">
                search
              </span>
              <input
                value={feedSearch}
                onChange={(e) => setFeedSearch(e.target.value)}
                className="w-full bg-white text-[#151c22] text-xs font-semibold pl-10 pr-10 py-2.5 rounded-2xl shadow-xs border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63] placeholder:text-[#72787c]"
                placeholder="Search posts, cleanups, marine sightings, locations..."
                type="text"
              />
              {feedSearch && (
                <button
                  type="button"
                  onClick={() => setFeedSearch('')}
                  className="absolute right-3 text-[#72787c] hover:text-[#151c22]"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>

            {/* Category Filter Horizontal Scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#006a63] text-white shadow-xs'
                    : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
                }`}
              >
                All Categories ({feedPosts.length})
              </button>
              {POST_CATEGORIES.map((cat) => {
                const count = feedPosts.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                      selectedCategory === cat
                        ? 'bg-[#002531] text-white shadow-xs ring-1 ring-[#90f4e9]'
                        : 'bg-[#eef4fc] text-[#41484b] hover:bg-[#dce3eb]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-75 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Posts Feed List */}
          <div className="space-y-4">
            {filteredFeed.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#e8eff7] shadow-sm space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#eef4fc] text-[#72787c] flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">forum</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#151c22]">No posts found</h3>
                  <p className="text-xs text-[#41484b] mt-1 max-w-xs mx-auto">
                    {feedSearch
                      ? `No updates match "${feedSearch}". Try a different keyword.`
                      : 'There are no updates in this category yet. Be the first to share!'}
                  </p>
                </div>
                <div className="flex gap-2 justify-center pt-1">
                  {feedSearch && (
                    <button
                      type="button"
                      onClick={() => setFeedSearch('')}
                      className="px-4 py-2 rounded-full bg-[#e8eff7] text-[#002531] text-xs font-bold"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) setAuthModalOpen(true);
                      else setIsCreatePostOpen(true);
                    }}
                    className="btn-cool-primary px-5 py-2 rounded-full text-xs font-bold shadow-md"
                  >
                    + Create First Post
                  </button>
                </div>
              </div>
            ) : (
              filteredFeed.map((post) => {
                const isLiked = Boolean(user && post.likedBy?.includes(user.id));
                const isAuthor = Boolean(user && post.authorId === user.id);
                const isSample = post.id.startsWith('post_00');

                return (
                  <article
                    key={post.id}
                    className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-[#e8eff7] flex flex-col gap-3 transition-all hover:shadow-md"
                  >
                    {/* Post Header: Author, Category & Options */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={post.authorAvatar || ASSETS.userProfile}
                          alt={post.authorName}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-[#006a63]/40 bg-[#eef4fc] shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = ASSETS.userProfile;
                          }}
                        />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-bold text-[#151c22] truncate">{post.authorName}</span>
                            {isSample && (
                              <span className="bg-[#eef4fc] text-[#41484b] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#dce3eb]">
                                Demo Post
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#41484b] truncate font-medium">{post.authorRole}</span>
                          <span className="text-[10px] text-[#72787c] flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs text-[#006a63]">schedule</span>
                            <span>{post.timeAgo || 'Recent'}</span>
                            <span>•</span>
                            <span className="material-symbols-outlined text-xs text-[#006a63]">location_on</span>
                            <span className="truncate">{post.location}</span>
                          </span>
                        </div>
                      </div>

                      {/* Category Badge & Post Owner Controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="bg-[#90f4e9]/35 text-[#00504a] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#90f4e9]">
                          {post.category || 'Field Sortie'}
                        </span>

                        {isAuthor && (
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPost(post);
                                setEditText(post.content);
                                setEditCategory(post.category);
                              }}
                              className="w-7 h-7 rounded-full text-[#72787c] hover:text-[#002531] hover:bg-[#eef4fc] flex items-center justify-center transition-colors"
                              title="Edit post"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              className="w-7 h-7 rounded-full text-[#ba1a1a] hover:bg-[#ffdad6] flex items-center justify-center transition-colors"
                              title="Delete post"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Post Text Content */}
                    <p className="text-xs sm:text-sm text-[#151c22] leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Linked Action Project Card if linked */}
                    {post.linkedProjectId && (
                      <div
                        onClick={() => onNavigate('project-details')}
                        className="p-3 rounded-2xl bg-[#eef4fc] hover:bg-[#e2e9f1] border border-[#dce3eb] flex items-center justify-between cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-[#006a63] text-white flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-base">sailing</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-[#006a63] uppercase tracking-wider">
                              Linked Action Project
                            </span>
                            <span className="text-xs font-bold text-[#151c22] truncate group-hover:underline">
                              {post.linkedProjectTitle || 'View Field Project'}
                            </span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[#006a63] text-sm shrink-0">
                          arrow_forward
                        </span>
                      </div>
                    )}

                    {/* Linked Ghost Gear Report if linked */}
                    {post.linkedReportId && (
                      <div
                        onClick={() => onNavigate('dossiers')}
                        className="p-3 rounded-2xl bg-[#ffdad6]/40 hover:bg-[#ffdad6]/60 border border-[#ffdad6] flex items-center justify-between cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-base">warning</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-[#ba1a1a] uppercase tracking-wider">
                              Linked Ghost Gear Hazard #{post.linkedReportId}
                            </span>
                            <span className="text-xs font-bold text-[#151c22] truncate group-hover:underline">
                              {post.linkedReportTitle || 'View Triage Dossier'}
                            </span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[#ba1a1a] text-sm shrink-0">
                          arrow_forward
                        </span>
                      </div>
                    )}

                    {/* Post Image with Lightbox click */}
                    {post.imageUrl && (
                      <div
                        onClick={() => setSelectedPost(post)}
                        className="rounded-2xl overflow-hidden max-h-72 w-full bg-[#001f29] cursor-pointer relative group border border-[#e8eff7]"
                      >
                        <img
                          src={post.imageUrl}
                          alt="Post photo"
                          className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">zoom_in</span>
                          <span>View Detail</span>
                        </div>
                      </div>
                    )}

                    {/* Interaction Bar: Like, Comment, Share */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#f0f4f8]">
                      {/* Like Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                          isLiked
                            ? 'bg-[#90f4e9] text-[#00504a] shadow-xs'
                            : 'text-[#41484b] hover:bg-[#eef4fc]'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-lg"
                          style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          thumb_up
                        </span>
                        <span>{post.likesCount || 0}</span>
                        <span className="hidden xs:inline">{post.likesCount === 1 ? 'Endorsement' : 'Endorsements'}</span>
                      </button>

                      {/* Comment Count / Drawer Trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                          activeCommentPostId === post.id ? 'bg-[#e8eff7] text-[#006a63]' : 'text-[#41484b] hover:bg-[#eef4fc]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">chat_bubble</span>
                        <span>{post.comments?.length || 0}</span>
                        <span className="hidden xs:inline">Comments</span>
                      </button>

                      {/* Detail View Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedPost(post)}
                        className="flex items-center gap-1 text-[#006a63] hover:text-[#004d48] text-xs font-bold py-1.5 px-2 rounded-full hover:bg-[#eef4fc]"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                        <span className="hidden sm:inline">Thread</span>
                      </button>

                      {/* Share Button */}
                      <button
                        type="button"
                        onClick={() => handleShare(post.content)}
                        className="text-[#41484b] hover:text-[#002531] p-1.5 rounded-full hover:bg-[#eef4fc] transition-colors"
                        title="Share post link"
                      >
                        <span className="material-symbols-outlined text-lg">share</span>
                      </button>
                    </div>

                    {/* Inline Comment Section (Toggleable) */}
                    {activeCommentPostId === post.id && (
                      <div className="pt-2 border-t border-[#f0f4f8] space-y-3">
                        {/* Comments List */}
                        {post.comments && post.comments.length > 0 && (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {post.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="p-2.5 rounded-2xl bg-[#f6faff] border border-[#e8eff7] flex items-start justify-between gap-2"
                              >
                                <div className="flex items-start gap-2 min-w-0">
                                  <img
                                    src={comment.authorAvatar || ASSETS.userProfile}
                                    alt={comment.authorName}
                                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                                  />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-[#151c22]">{comment.authorName}</span>
                                      <span className="text-[10px] text-[#72787c]">{comment.createdAt}</span>
                                    </div>
                                    <p className="text-xs text-[#41484b] mt-0.5">{comment.text}</p>
                                  </div>
                                </div>
                                {user && comment.authorId === user.id && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteComment(post.id, comment.id)}
                                    className="text-[#ba1a1a] p-1 hover:bg-[#ffdad6] rounded-full"
                                    title="Delete comment"
                                  >
                                    <span className="material-symbols-outlined text-xs">close</span>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Comment Input Form */}
                        <form
                          onSubmit={(e) => handleAddComment(post.id, e)}
                          className="flex items-center gap-2"
                        >
                          <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder={user ? 'Write a comment...' : 'Sign in to comment...'}
                            disabled={!user || isSubmittingComment}
                            className="flex-1 bg-[#f6faff] text-[#151c22] text-xs px-3.5 py-2 rounded-2xl border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
                          />
                          <button
                            type="submit"
                            disabled={!user || !commentText.trim() || isSubmittingComment}
                            className="btn-cool-primary px-3.5 py-2 rounded-2xl text-xs font-bold shadow-xs disabled:opacity-50"
                          >
                            {isSubmittingComment ? 'Sending...' : 'Post'}
                          </button>
                        </form>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STORIES & TESTIMONIALS */}
      {/* ========================================================================= */}
      {mainTab === 'stories' && (
        <>
          {/* Voices Intro & CTA Banner */}
          <section className="bg-[#123b4a] text-white p-5 rounded-3xl shadow-sm relative overflow-hidden space-y-3 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#90f4e9] text-[#00504a] text-xs font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">record_voice_over</span>
                <span>Community Voices</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!user) setAuthModalOpen(true);
                  else setIsTestimonialModalOpen(true);
                }}
                className="btn-cool-primary px-4 py-1.5 rounded-full text-xs font-bold active:scale-95 shadow-md flex items-center gap-1 text-white"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Share Your Story</span>
              </button>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Ocean Conservation Experiences</h2>
              <p className="text-xs text-[#c2e8fb] mt-1 leading-relaxed">
                First-hand accounts from artisanal fishers, student volunteers, and coastal organizers rescuing marine life from ghost gear.
              </p>
            </div>
          </section>

          {/* Role Filter & Story Search */}
          <div className="space-y-2">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[#006a63] absolute left-3.5 pointer-events-none text-lg">
                search
              </span>
              <input
                value={storySearch}
                onChange={(e) => setStorySearch(e.target.value)}
                className="w-full bg-white text-[#151c22] text-xs font-semibold pl-10 pr-10 py-2.5 rounded-2xl shadow-xs border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63] placeholder:text-[#72787c]"
                placeholder="Search experiences by name, co-op, or keyword..."
                type="text"
              />
              {storySearch && (
                <button
                  type="button"
                  onClick={() => setStorySearch('')}
                  className="absolute right-3 text-[#72787c] hover:text-[#151c22]"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>

            {/* Role filter chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => setSelectedRole('all')}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedRole === 'all'
                    ? 'bg-[#006a63] text-white shadow-xs'
                    : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
                }`}
              >
                All Roles ({testimonials.length})
              </button>
              {TESTIMONIAL_ROLES.map((role) => {
                const count = testimonials.filter((t) => t.authorRole === role).length;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                      selectedRole === role
                        ? 'bg-[#002531] text-white shadow-xs ring-1 ring-[#90f4e9]'
                        : 'bg-[#eef4fc] text-[#41484b] hover:bg-[#dce3eb]'
                    }`}
                  >
                    <span>{role}</span>
                    <span className="text-[10px] opacity-75 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Testimonials List */}
          <div className="space-y-4">
            {filteredTestimonials.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#e8eff7] shadow-sm space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#eef4fc] text-[#72787c] flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">record_voice_over</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#151c22]">No stories match your criteria</h3>
                  <p className="text-xs text-[#41484b] mt-1 max-w-xs mx-auto">
                    {storySearch
                      ? `No testimonials match "${storySearch}".`
                      : 'No approved stories for this role yet. Be the first to submit your experience!'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!user) setAuthModalOpen(true);
                    else setIsTestimonialModalOpen(true);
                  }}
                  className="btn-cool-primary px-5 py-2.5 rounded-full text-xs font-bold shadow-md"
                >
                  + Submit Your Story
                </button>
              </div>
            ) : (
              filteredTestimonials.map((story) => {
                const isAuthor = Boolean(user && story.authorId === user.id);
                const isAdmin = Boolean(user && (user.role === 'Admin' || user.role === 'Coordinator'));

                return (
                  <article
                    key={story.id}
                    className="bg-white rounded-3xl p-5 shadow-sm border border-[#e8eff7] flex flex-col gap-3 transition-all hover:shadow-md relative overflow-hidden"
                  >
                    {/* Top author information */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={story.authorAvatar || ASSETS.userProfile}
                          alt={story.authorName}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#006a63]/30 bg-[#eef4fc] shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = ASSETS.userProfile;
                          }}
                        />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-bold text-[#151c22] truncate">{story.authorName}</span>
                            <span className="bg-[#e8eff7] text-[#002531] text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {story.authorRole}
                            </span>
                          </div>
                          {story.affiliation && (
                            <span className="text-xs text-[#006a63] font-semibold truncate flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-xs">anchor</span>
                              <span>{story.affiliation}</span>
                            </span>
                          )}
                          <span className="text-[10px] text-[#72787c]">{story.date}</span>
                        </div>
                      </div>

                      {/* Status / Development Badges */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {story.isSample && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-300">
                            Sample Story
                          </span>
                        )}
                        {story.status === 'pending_review' ? (
                          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            Pending Review
                          </span>
                        ) : (
                          <span className="bg-[#90f4e9]/40 text-[#00504a] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#90f4e9]">
                            Verified Story
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Story Narrative */}
                    <div className="relative pl-3 border-l-2 border-[#006a63]/40 py-1">
                      <p className="text-xs sm:text-sm text-[#151c22] leading-relaxed italic">
                        "{story.story}"
                      </p>
                    </div>

                    {/* Author & Moderator Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#f0f4f8] text-xs">
                      <div className="flex items-center gap-1.5 text-[#72787c]">
                        <span className="material-symbols-outlined text-xs text-[#006a63]">verified_user</span>
                        <span className="text-[10px]">Consent granted for public display</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleToggleModerateStory(story.id, story.status)}
                            className="px-2.5 py-1 rounded-full bg-[#e8eff7] text-[#002531] text-[11px] font-bold hover:bg-[#dce3eb]"
                          >
                            {story.status === 'approved' ? 'Mark Pending' : 'Approve'}
                          </button>
                        )}

                        {isAuthor && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingStory(story);
                                setEditStoryContent(story.story);
                                setEditStoryRole(story.authorRole);
                                setEditStoryAffiliation(story.affiliation || '');
                              }}
                              className="w-7 h-7 rounded-full text-[#72787c] hover:text-[#002531] hover:bg-[#eef4fc] flex items-center justify-center"
                              title="Edit Story"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStory(story.id)}
                              className="w-7 h-7 rounded-full text-[#ba1a1a] hover:bg-[#ffdad6] flex items-center justify-center"
                              title="Delete Story"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW POST */}
      {/* ========================================================================= */}
      {isCreatePostOpen && (
        <div className="fixed inset-0 z-50 bg-[#002531]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-[#e8eff7]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">post_add</span>
                <h3 className="text-base font-bold text-[#151c22]">Create Community Update</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setIsCreatePostOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Author Persona Info */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f6faff] border border-[#e8eff7]">
              <img
                src={user?.avatar || ASSETS.userProfile}
                alt={user?.name || 'Author'}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#006a63]/40"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#151c22]">{user?.name || 'Ocean Steward'}</span>
                <span className="text-[10px] text-[#41484b]">{user?.badge} • {user?.chapter}</span>
              </div>
            </div>

            <form onSubmit={handlePublishPost} className="space-y-3.5">
              {/* Category Picker */}
              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">
                  Update Category <span className="text-[#ba1a1a]">*</span>
                </label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value as PostCategory)}
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
                >
                  {POST_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Post Textarea */}
              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">
                  What did you observe or salvage? <span className="text-[#ba1a1a]">*</span>
                </label>
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Share details about ghost gear recovered, reef sightings, volunteer sweeps, or recycling tips..."
                  rows={4}
                  required
                  className="w-full p-3 rounded-2xl bg-[#f6faff] text-xs text-[#151c22] border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63] placeholder:text-[#72787c] resize-none"
                />
                <span className="text-[10px] text-[#72787c] text-right block mt-0.5">
                  {newPostText.length} characters
                </span>
              </div>

              {/* Live Camera Stream Capture Component */}
              {isCameraActive && (
                <div className="rounded-2xl overflow-hidden bg-black p-2 relative flex flex-col items-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full max-h-56 rounded-xl object-cover bg-black"
                  />
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="btn-cool-primary px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 text-white shadow-md"
                    >
                      <span className="material-symbols-outlined text-base">photo_camera</span>
                      <span>Capture Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-2 rounded-full bg-white/20 text-white text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200">
                  {cameraError}
                </div>
              )}

              {/* Photo Preview & Attach Controls */}
              {newPostImage ? (
                <div className="relative rounded-2xl overflow-hidden max-h-48 border border-[#006a63] bg-[#001f29]">
                  <img src={newPostImage} alt="Post preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setNewPostImage(null)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
                    title="Remove Image"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="p-3 rounded-2xl bg-[#f6faff] hover:bg-[#eef4fc] border border-dashed border-[#006a63] flex flex-col items-center justify-center gap-1 transition-colors text-center"
                  >
                    <span className="material-symbols-outlined text-[#006a63] text-2xl">photo_camera</span>
                    <span className="text-xs font-bold text-[#002531]">Use Camera</span>
                    <span className="text-[10px] text-[#72787c]">Live device capture</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-2xl bg-[#f6faff] hover:bg-[#eef4fc] border border-dashed border-[#006a63] flex flex-col items-center justify-center gap-1 transition-colors text-center"
                  >
                    <span className="material-symbols-outlined text-[#006a63] text-2xl">upload_file</span>
                    <span className="text-xs font-bold text-[#002531]">Upload Image</span>
                    <span className="text-[10px] text-[#72787c]">JPG, PNG, WEBP</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageFileChange}
                  />
                </div>
              )}

              {/* Link to Action Project / Ghost Gear Report */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-[#41484b] mb-1">
                    Link Field Project (Optional)
                  </label>
                  <select
                    value={linkedProjectId}
                    onChange={(e) => setLinkedProjectId(e.target.value)}
                    className="w-full h-10 px-2.5 rounded-xl bg-[#f6faff] text-xs border border-[#dce3eb]"
                  >
                    <option value="">None</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#41484b] mb-1">
                    Link Hazard Report (Optional)
                  </label>
                  <select
                    value={linkedReportId}
                    onChange={(e) => setLinkedReportId(e.target.value)}
                    className="w-full h-10 px-2.5 rounded-xl bg-[#f6faff] text-xs border border-[#dce3eb]"
                  >
                    <option value="">None</option>
                    {reports.map((r) => (
                      <option key={r.id} value={r.id}>
                        #{r.id} - {r.gearType}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {postError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                  {postError}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setIsCreatePostOpen(false);
                  }}
                  className="flex-1 py-3 rounded-full bg-[#e8eff7] text-[#002531] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPost || !newPostText.trim()}
                  className="flex-1 py-3 rounded-full btn-cool-primary text-white text-xs font-bold shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmittingPost ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">send</span>
                      <span>Publish to Feed</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: POST DETAIL VIEW & COMMENTS */}
      {/* ========================================================================= */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-[#002531]/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-[#e8eff7]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-xl">forum</span>
                <h3 className="text-sm font-bold text-[#151c22]">Community Discussion</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Author info */}
            <div className="flex items-center gap-3">
              <img
                src={selectedPost.authorAvatar || ASSETS.userProfile}
                alt={selectedPost.authorName}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-[#006a63]/40"
              />
              <div>
                <span className="text-sm font-bold text-[#151c22] block">{selectedPost.authorName}</span>
                <span className="text-[11px] text-[#41484b] block">{selectedPost.authorRole}</span>
                <span className="text-[10px] text-[#72787c]">{selectedPost.timeAgo} • {selectedPost.location}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#151c22] leading-relaxed whitespace-pre-line">
              {selectedPost.content}
            </p>

            {selectedPost.imageUrl && (
              <div className="rounded-2xl overflow-hidden max-h-80 bg-black">
                <img src={selectedPost.imageUrl} alt="Detail" className="w-full h-full object-contain" />
              </div>
            )}

            {/* Comments Thread */}
            <div className="space-y-2 pt-2 border-t border-[#e8eff7]">
              <span className="text-xs font-bold text-[#002531]">
                Comments ({selectedPost.comments?.length || 0})
              </span>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedPost.comments && selectedPost.comments.length > 0 ? (
                  selectedPost.comments.map((c) => (
                    <div key={c.id} className="p-3 rounded-2xl bg-[#f6faff] border border-[#e8eff7] flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        <img src={c.authorAvatar || ASSETS.userProfile} alt={c.authorName} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#151c22]">{c.authorName}</span>
                            <span className="text-[10px] text-[#72787c]">{c.createdAt}</span>
                          </div>
                          <p className="text-xs text-[#41484b] mt-0.5">{c.text}</p>
                        </div>
                      </div>
                      {user && c.authorId === user.id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(selectedPost.id, c.id)}
                          className="text-[#ba1a1a] p-1 hover:bg-[#ffdad6] rounded-full"
                          title="Delete comment"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#72787c] italic py-2 text-center">No comments yet. Start the conversation!</p>
                )}
              </div>

              {/* Comment submission form */}
              <form onSubmit={(e) => handleAddComment(selectedPost.id, e)} className="flex items-center gap-2 pt-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={user ? 'Add to the discussion...' : 'Sign in to comment...'}
                  disabled={!user || isSubmittingComment}
                  className="flex-1 bg-[#f6faff] text-xs px-3.5 py-2.5 rounded-2xl border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
                />
                <button
                  type="submit"
                  disabled={!user || !commentText.trim() || isSubmittingComment}
                  className="btn-cool-primary px-4 py-2.5 rounded-2xl text-xs font-bold disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SUBMIT TESTIMONIAL / STORY */}
      {/* ========================================================================= */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#002531]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-[#e8eff7]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63] text-2xl">sentiment_satisfied</span>
                <h3 className="text-base font-bold text-[#151c22]">Share Your Conservation Story</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handlePublishTestimonial} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#002531] mb-1">
                    Your Name <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    value={testimonialName}
                    onChange={(e) => setTestimonialName(e.target.value)}
                    required
                    className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002531] mb-1">
                    Role / Capacity <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <select
                    value={testimonialRole}
                    onChange={(e) => setTestimonialRole(e.target.value as TestimonialRole)}
                    className="w-full h-11 px-2.5 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                  >
                    {TESTIMONIAL_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">
                  Community Affiliation or Harbor <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  value={testimonialAffiliation}
                  onChange={(e) => setTestimonialAffiliation(e.target.value)}
                  placeholder="e.g. Sanur Fishermen Co-op, Udayana Marine Club"
                  required
                  className="w-full h-11 px-3 rounded-2xl bg-[#f6faff] text-xs font-semibold border border-[#dce3eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">
                  Your Conservation Experience <span className="text-[#ba1a1a]">*</span>
                </label>
                <textarea
                  value={testimonialStory}
                  onChange={(e) => setTestimonialStory(e.target.value)}
                  placeholder="Describe how ghost gear recovery, net mending, or beach cleanups have impacted your community or local marine wildlife..."
                  rows={4}
                  required
                  className="w-full p-3 rounded-2xl bg-[#f6faff] text-xs text-[#151c22] border border-[#dce3eb] resize-none"
                />
              </div>

              {/* Consent Checkbox (Mandatory) */}
              <div className="p-3 rounded-2xl bg-[#eef4fc] border border-[#dce3eb] flex items-start gap-2.5">
                <input
                  id="consentCheckbox"
                  type="checkbox"
                  checked={testimonialConsent}
                  onChange={(e) => setTestimonialConsent(e.target.checked)}
                  required
                  className="w-4 h-4 text-[#006a63] rounded mt-0.5 shrink-0"
                />
                <label htmlFor="consentCheckbox" className="text-xs font-semibold text-[#002531] leading-snug cursor-pointer">
                  I confirm and agree to have my conservation story, name, and role displayed publicly on TIDEKIND.
                </label>
              </div>

              {storyError && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                  {storyError}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="flex-1 py-3 rounded-full bg-[#e8eff7] text-[#002531] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStory || !testimonialConsent || !testimonialStory.trim()}
                  className="flex-1 py-3 rounded-full btn-cool-primary text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {isSubmittingStory ? 'Submitting...' : 'Submit Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT POST */}
      {/* ========================================================================= */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-[#002531]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-[#e8eff7]">
              <h3 className="text-sm font-bold text-[#151c22]">Edit Your Post</h3>
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="w-7 h-7 rounded-full bg-[#e8eff7] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEditedPost} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as PostCategory)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f6faff] text-xs border border-[#dce3eb]"
                >
                  {POST_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">Content</label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={4}
                  required
                  className="w-full p-3 rounded-2xl bg-[#f6faff] text-xs text-[#151c22] border border-[#dce3eb] resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="flex-1 py-2.5 rounded-full bg-[#e8eff7] text-[#002531] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit || !editText.trim()}
                  className="flex-1 py-2.5 rounded-full btn-cool-primary text-white text-xs font-bold"
                >
                  {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT TESTIMONIAL */}
      {/* ========================================================================= */}
      {editingStory && (
        <div className="fixed inset-0 z-50 bg-[#002531]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-[#e8eff7]">
              <h3 className="text-sm font-bold text-[#151c22]">Edit Your Story</h3>
              <button
                type="button"
                onClick={() => setEditingStory(null)}
                className="w-7 h-7 rounded-full bg-[#e8eff7] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEditedStory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">Role</label>
                <select
                  value={editStoryRole}
                  onChange={(e) => setEditStoryRole(e.target.value as TestimonialRole)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f6faff] text-xs border border-[#dce3eb]"
                >
                  {TESTIMONIAL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">Affiliation / Harbor</label>
                <input
                  value={editStoryAffiliation}
                  onChange={(e) => setEditStoryAffiliation(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f6faff] text-xs border border-[#dce3eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002531] mb-1">Story Narrative</label>
                <textarea
                  value={editStoryContent}
                  onChange={(e) => setEditStoryContent(e.target.value)}
                  rows={4}
                  required
                  className="w-full p-3 rounded-2xl bg-[#f6faff] text-xs text-[#151c22] border border-[#dce3eb] resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStory(null)}
                  className="flex-1 py-2.5 rounded-full bg-[#e8eff7] text-[#002531] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStoryEdit || !editStoryContent.trim()}
                  className="flex-1 py-2.5 rounded-full btn-cool-primary text-white text-xs font-bold"
                >
                  {isSubmittingStoryEdit ? 'Saving...' : 'Save Edits'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
