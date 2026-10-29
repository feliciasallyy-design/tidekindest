import React, { useState } from 'react';
import { ASSETS } from '../data/assets';
import { ScreenId, FeedPost } from '../types';
import { useAuth } from '../context/AuthContext';

interface CommunityFeedScreenProps {
  onNavigate: (screen: ScreenId) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const CommunityFeedScreen: React.FC<CommunityFeedScreenProps> = ({
  onNavigate,
  showToast,
}) => {
  const { user, feedPosts, createPost, likePost, commentPost, setAuthModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'volunteer' | 'repair' | 'verified'>('all');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Comment Drawer state
  const [activeCommentPost, setActiveCommentPost] = useState<FeedPost | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleToggleLike = async (postId: string) => {
    if (!user) {
      setAuthModalOpen(true);
      showToast('Sign in to endorse and like community field reports', 'info');
      return;
    }
    try {
      await likePost(postId);
      showToast('Updated helpful endorsement', 'thumb_up');
    } catch (err: any) {
      showToast(err.message || 'Failed liking post', 'error');
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      setAuthModalOpen(true);
      showToast('Sign in or register to publish community updates', 'info');
      return;
    }
    if (!newPostText.trim()) return;

    setIsSubmittingPost(true);
    try {
      await createPost(newPostText.trim(), ASSETS.fishermenRepairing, user.location);
      setIsComposerOpen(false);
      setNewPostText('');
      showToast('Field update published to live community feed!', 'task_alt');
    } catch (err: any) {
      showToast(err.message || 'Failed publishing update', 'error');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      showToast('Sign in to comment on community posts', 'info');
      return;
    }
    if (!activeCommentPost || !commentInput.trim()) return;

    setIsSubmittingComment(true);
    try {
      await commentPost(activeCommentPost.id, commentInput.trim());
      setCommentInput('');
      showToast('Comment added!', 'chat');
      // Update local active post reference
      const updated = feedPosts.find((p) => p.id === activeCommentPost.id);
      if (updated) setActiveCommentPost(updated);
    } catch (err: any) {
      showToast(err.message || 'Failed submitting comment', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    showToast('Feed link copied to clipboard!', 'share');
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-lg mx-auto px-4 space-y-4">
      {/* Guidelines Notice Banner */}
      <div className="bg-[#123b4a] text-white rounded-3xl p-4 shadow-sm relative overflow-hidden flex items-start gap-3 border border-white/10">
        <div className="p-2 rounded-full bg-[#006a63] text-white shrink-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-base">verified_user</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#90f4e9] uppercase tracking-wider">
              Field Standards
            </span>
            <span className="material-symbols-outlined text-xs opacity-60">info</span>
          </div>
          <p className="text-xs text-[#dce3eb] mt-1 leading-relaxed">
            All posts are tagged with GPS harbor stamps to coordinate ghost gear retrieval and avoid duplicate dives.
          </p>
        </div>
      </div>

      {/* Composer Trigger Bar */}
      <div className="bg-white rounded-3xl p-3 shadow-sm border border-[#e8eff7] flex items-center gap-3">
        <img
          src={user?.avatar || ASSETS.userProfile}
          alt={user?.name || 'Steward'}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#006a63]/40 bg-[#eef4fc]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = ASSETS.userProfile;
          }}
        />
        <button
          onClick={() => {
            if (!user) {
              setAuthModalOpen(true);
            } else {
              setIsComposerOpen(true);
            }
          }}
          className="flex-1 text-left bg-[#f6faff] hover:bg-[#eef4fc] text-[#72787c] text-xs font-semibold py-2.5 px-4 rounded-full border border-[#dce3eb] transition-colors"
        >
          {user ? `What did you salvage today, ${user.name.split(' ')[0]}?` : 'Sign in to share a field report...'}
        </button>
        <button
          onClick={() => {
            if (!user) setAuthModalOpen(true);
            else setIsComposerOpen(true);
          }}
          className="w-10 h-10 rounded-full bg-[#006a63] text-white flex items-center justify-center shadow-xs hover:bg-[#00504a] active:scale-95 transition-all"
          title="Create Update"
        >
          <span className="material-symbols-outlined text-xl">edit</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All Updates' },
          { id: 'volunteer', label: 'Volunteer Requests' },
          { id: 'repair', label: 'Repair & Repurposing' },
          { id: 'verified', label: 'Verified Outcomes' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#006a63] text-white shadow-xs'
                : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed Container */}
      <div className="space-y-4">
        {(() => {
          const filtered = feedPosts.filter((post) => {
            if (activeTab === 'all') return true;
            const text = (post.content + ' ' + post.authorRole).toLowerCase();
            if (activeTab === 'volunteer') return text.includes('volunteer') || text.includes('sweep') || text.includes('crew') || text.includes('needed') || text.includes('request');
            if (activeTab === 'repair') return text.includes('mend') || text.includes('repair') || text.includes('yarn') || text.includes('circular') || text.includes('spinning') || text.includes('repurpose');
            if (activeTab === 'verified') return text.includes('survey') || text.includes('completed') || text.includes('verified') || text.includes('extricat') || text.includes('dispatched');
            return true;
          });

          if (filtered.length === 0) {
            return (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#e8eff7]">
                <span className="material-symbols-outlined text-4xl text-[#72787c] mb-2">forum</span>
                <p className="text-sm font-bold text-[#151c22]">No updates in this category</p>
                <p className="text-xs text-[#41484b] mt-1">Switch to "All Updates" to view all global field sorties.</p>
              </div>
            );
          }

          return filtered.map((post) => {
            const isLikedByUser = Boolean(user && post.likedBy?.includes(user.id));
            return (
              <article
                key={post.id}
                className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-[#e8eff7] flex flex-col gap-3 transition-all hover:shadow-md"
              >
                {/* Author Header */}
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
                        <span className="text-xs font-bold text-[#151c22] truncate">{post.authorName}</span>
                        <span className="material-symbols-outlined text-[#006a63] text-sm">verified</span>
                      </div>
                      <span className="text-[11px] text-[#41484b] truncate font-medium">{post.authorRole}</span>
                      <span className="text-[10px] text-[#72787c] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#006a63]">location_on</span>
                        <span>{post.timeAgo} • {post.location}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast('Field report endorsed for marine archive', 'verified')}
                    className="text-[#72787c] hover:text-[#006a63] p-1 rounded-full active:scale-90"
                    title="Bookmark"
                  >
                    <span className="material-symbols-outlined text-lg">bookmark</span>
                  </button>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-[#151c22] leading-relaxed whitespace-pre-line font-normal">
                  {post.content}
                </p>

                {/* Optional Media */}
                {post.imageUrl && (
                  <div className="rounded-2xl overflow-hidden bg-[#002531] relative h-48 border border-white/10">
                    <img src={post.imageUrl} alt="Field post attachment" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Actions with Cool Buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-[#e8eff7]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                        isLikedByUser
                          ? 'btn-cool-accent shadow-xs'
                          : 'bg-[#f6faff] hover:bg-[#e8eff7] text-[#002531] border border-[#dce3eb]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isLikedByUser ? 'thumb_up' : 'thumb_up_off_alt'}
                      </span>
                      <span>{post.likesCount || 0} Helpful</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPost(post)}
                      className="btn-cool-glow flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#90f4e9] active:scale-95"
                    >
                      <span className="material-symbols-outlined text-base">chat_bubble</span>
                      <span>{post.comments?.length || 0}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#f6faff] hover:bg-[#e8eff7] text-[#41484b] text-xs font-semibold active:scale-95 border border-[#dce3eb]"
                  >
                    <span className="material-symbols-outlined text-base">share</span>
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </article>
            );
          });
        })()}
      </div>

      {/* Post Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 bg-[#002531]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-[#e8eff7]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63]">campaign</span>
                <h3 className="text-base font-bold text-[#151c22]">Share Field Update</h3>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="What did you observe or salvage today? Share details, coordinates or request sorting volunteers..."
              className="w-full p-3 rounded-2xl bg-[#f6faff] text-xs text-[#151c22] border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63] resize-none"
              rows={4}
            ></textarea>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Attached net repair photo', 'photo_camera')}
                  className="px-3 py-1.5 rounded-full bg-[#e8eff7] text-[#002531] text-xs font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-base">photo_camera</span>
                  <span>Photo</span>
                </button>
                <span className="text-[11px] text-[#72787c]">Posting as {user?.name}</span>
              </div>

              <button
                type="button"
                disabled={isSubmittingPost || !newPostText.trim()}
                onClick={handleCreatePost}
                className="px-5 py-2.5 rounded-full bg-[#006a63] text-white text-xs font-bold active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmittingPost ? 'Posting...' : 'Post Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Drawer / Modal */}
      {activeCommentPost && (
        <div className="fixed inset-0 z-50 bg-[#002531]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-3 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-2 border-[#e8eff7]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a63]">mode_comment</span>
                <h3 className="text-sm font-bold text-[#151c22]">
                  Comments ({activeCommentPost.comments?.length || 0})
                </h3>
              </div>
              <button
                onClick={() => setActiveCommentPost(null)}
                className="w-8 h-8 rounded-full bg-[#e8eff7] flex items-center justify-center text-[#41484b]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
              {activeCommentPost.comments && activeCommentPost.comments.length > 0 ? (
                activeCommentPost.comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-2xl bg-[#f6faff] border border-[#e8eff7] flex gap-2.5">
                    <img
                      src={c.authorAvatar || ASSETS.userProfile}
                      alt={c.authorName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#151c22]">{c.authorName}</span>
                        <span className="text-[10px] text-[#72787c]">{c.createdAt}</span>
                      </div>
                      <p className="text-xs text-[#41484b] mt-0.5">{c.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#72787c] text-center py-6">
                  No comments on this field report yet. Share your feedback below!
                </p>
              )}
            </div>

            {/* Submit Comment Form */}
            <form onSubmit={handleAddComment} className="pt-2 flex gap-2 border-t border-[#e8eff7]">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={user ? `Reply as ${user.name}...` : 'Sign in to comment...'}
                disabled={!user}
                className="flex-1 h-10 px-3 rounded-full bg-[#f6faff] text-xs border border-[#dce3eb] outline-none"
              />
              <button
                type="submit"
                disabled={isSubmittingComment || !commentInput.trim() || !user}
                className="px-4 h-10 rounded-full bg-[#006a63] text-white text-xs font-bold active:scale-95 disabled:opacity-50"
              >
                {isSubmittingComment ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
