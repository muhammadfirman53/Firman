import React, { useState, useEffect } from 'react';
import {
  ParticipantProfile,
  TopicId,
  ThreePillarsRow,
  MindsetTransformationRow,
  ActionPlanData,
  Modul1AssignmentData,
  Reflection321Data,
  ForumPost,
  PadletNote,
  AuthSession,
  AdminUser,
  ParticipantUser,
  CourseMaterial,
  GoogleMeetConfig,
  ParticipantTopicReviews,
  TopicReviewRecord,
  TopicUnlockStatus
} from './types';
import {
  loadProfile,
  saveProfile,
  loadProgress,
  saveProgress,
  loadThreePillars,
  saveThreePillars,
  loadMindsetTransformations,
  saveMindsetTransformations,
  loadActionPlan,
  saveActionPlan,
  loadAssignmentModul1,
  saveAssignmentModul1,
  loadReflection321,
  saveReflection321,
  loadForumPosts,
  saveForumPosts,
  loadPadletNotes,
  savePadletNotes,
  loadScores,
  savePreTestScore,
  savePostTestScore,
  loadAuthSession,
  saveAuthSession,
  clearAuthSession,
  loadRegisteredAdmins,
  saveRegisteredAdmin,
  loadRegisteredParticipants,
  saveRegisteredParticipant,
  deleteParticipant,
  clearAllRegisteredParticipants,
  loadCourseMaterials,
  saveSingleMaterial,
  deleteSingleMaterial,
  loadMeetConfig,
  saveMeetConfig,
  loadTopicReviews,
  saveTopicReviews,
  saveSingleTopicReview,
  loadParticipantFullBundle,
  DEFAULT_PROFILE
} from './utils/storage';
import { detectPortalRole, updatePortalUrl } from './utils/urlRouter';
import { initFirestoreSync } from './utils/firestoreService';
import { COURSE_TOPICS } from './data/courseData';
import { getAllTopicsUnlockStatus, checkCertificateEligibility } from './utils/topicProgression';
import { ShieldCheck } from 'lucide-react';

import { Header } from './components/Header';
import { CourseNavigation } from './components/CourseNavigation';
import { CourseOverview } from './components/CourseOverview';
import { TopicOrientation } from './components/TopicOrientation';
import { TopicModul1 } from './components/TopicModul1';
import { TopicModul2 } from './components/TopicModul2';
import { TopicActionPlanning } from './components/TopicActionPlanning';
import { TopicEvaluation } from './components/TopicEvaluation';
import { LockedTopicNotice } from './components/LockedTopicNotice';
import { ProfileModal } from './components/ProfileModal';
import { VirtualScheduleModal } from './components/VirtualScheduleModal';
import { CertificateModal } from './components/CertificateModal';
import { AuthGateway } from './components/AuthGateway';
import { AdminDashboard } from './components/AdminDashboard';
import { TrainingHeaderBanner } from './components/TrainingHeaderBanner';


const ALL_TASKS = [
  'orientasi-video',
  'pre-test',
  'forum-perkenalan',
  'relate-menti',
  'explore-pandi',
  'apply-pillars',
  'learnagain-padlet1',
  'modul1-assignment',
  'relate-kegagalan',
  'explore-mindset',
  'apply-reframing',
  'learnagain-padlet2',
  'modul2-forum',
  'action-plan',
  'post-test',
  'reflection-321'
];

export default function App() {
  // Authentication & Session
  const [authSession, setAuthSession] = useState<AuthSession | null>(loadAuthSession);
  const [registeredAdmins, setRegisteredAdmins] = useState<AdminUser[]>(loadRegisteredAdmins);
  const [registeredParticipants, setRegisteredParticipants] = useState<ParticipantUser[]>(loadRegisteredParticipants);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Participant profile state
  const [profile, setProfile] = useState<ParticipantProfile>(() => {
    const session = loadAuthSession();
    if (session && session.role === 'peserta') {
      return session.user as ParticipantUser;
    }
    return loadProfile();
  });

  // Active topic
  const [activeTopic, setActiveTopic] = useState<TopicId>(() => {
    const session = loadAuthSession();
    if (session && session.role === 'admin') {
      return 'admin-dashboard';
    }
    return 'overview';
  });

  const getInitialParticipantId = () => {
    const session = loadAuthSession();
    if (session && session.role === 'peserta' && session.user?.id) {
      return session.user.id;
    }
    return undefined;
  };

  const [progressMap, setProgressMap] = useState<Record<string, boolean>>(() => loadProgress(getInitialParticipantId()));
  const [scores, setScores] = useState(() => loadScores(getInitialParticipantId()));
  const [threePillars, setThreePillars] = useState<ThreePillarsRow[]>(() => loadThreePillars(getInitialParticipantId()));
  const [mindsetTransformations, setMindsetTransformations] = useState<MindsetTransformationRow[]>(() => loadMindsetTransformations(getInitialParticipantId()));
  const [actionPlan, setActionPlan] = useState<ActionPlanData>(() => loadActionPlan(getInitialParticipantId()));
  const [assignment, setAssignment] = useState<Modul1AssignmentData>(() => loadAssignmentModul1(getInitialParticipantId()));
  const [reflection321, setReflection321] = useState<Reflection321Data>(() => loadReflection321(getInitialParticipantId()));
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(loadForumPosts);
  const [padletNotes, setPadletNotes] = useState<PadletNote[]>(loadPadletNotes);

  // Dynamic Course Materials & Google Meet Configuration (Admin CMS)
  const [materials, setMaterials] = useState<CourseMaterial[]>(loadCourseMaterials);
  const [meetConfig, setMeetConfig] = useState<GoogleMeetConfig>(loadMeetConfig);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Impersonation mode for Admin to directly manage participant view
  const [impersonatedParticipant, setImpersonatedParticipant] = useState<ParticipantUser | null>(null);
  const activeParticipantId = impersonatedParticipant
    ? impersonatedParticipant.id
    : (authSession?.role === 'peserta' ? (authSession.user?.id || profile.id) : profile.id);

  // Progress count
  const completedTasksCount = ALL_TASKS.filter((task) => progressMap[task]).length;
  const progressPercent = Math.round((completedTasksCount / ALL_TASKS.length) * 100);

  // Topic Reviews & Gated Progression
  const [topicReviewsMap, setTopicReviewsMap] = useState<ParticipantTopicReviews>(loadTopicReviews);

  // Synchronize registered participants and reviews across browser events & Firebase Firestore
  useEffect(() => {
    const handleStorageChange = () => {
      setRegisteredParticipants(loadRegisteredParticipants());
      setTopicReviewsMap(loadTopicReviews());
      setMaterials(loadCourseMaterials());
      setMeetConfig(loadMeetConfig());
      setForumPosts(loadForumPosts());
      setPadletNotes(loadPadletNotes());

      const activeId = activeParticipantId || profile.id;
      if (activeId) {
        const freshBundle = loadParticipantFullBundle(activeId);
        setProgressMap(freshBundle.progress);
        setScores(freshBundle.scores);
        setThreePillars(freshBundle.threePillars);
        setMindsetTransformations(freshBundle.mindset);
        setActionPlan(freshBundle.actionPlan);
        setAssignment(freshBundle.assignment);
        setReflection321(freshBundle.reflection321);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('participants-synced', handleStorageChange);
    window.addEventListener('bundle-synced', handleStorageChange);
    window.addEventListener('settings-synced', handleStorageChange);

    const unsubFirestore = initFirestoreSync(handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('participants-synced', handleStorageChange);
      window.removeEventListener('bundle-synced', handleStorageChange);
      window.removeEventListener('settings-synced', handleStorageChange);
      unsubFirestore();
    };
  }, [activeParticipantId, profile.id]);

  const handleSaveTopicReview = (participantId: string, topicId: string, review: TopicReviewRecord) => {
    const updated = saveSingleTopicReview(participantId, topicId, review);
    setTopicReviewsMap(updated);
  };

  const handleBatchApproveAllTopics = (participantId: string) => {
    const current = { ...topicReviewsMap };
    const pReviews = current[participantId] || {};
    for (const t of COURSE_TOPICS) {
      pReviews[t.id] = {
        isApproved: true,
        score: pReviews[t.id]?.score ?? 90,
        feedback: pReviews[t.id]?.feedback || 'Telah diverifikasi dan disetujui fasilitator.',
        reviewedBy: 'Muhamad Firman, S.Pd (Fasilitator)',
        reviewedAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
      };
    }
    current[participantId] = pReviews;
    saveTopicReviews(current);
    setTopicReviewsMap({ ...current });
  };

  // Participant Direct Management (Simulasi / Kelola oleh Admin)
  const handleSelectParticipantPreview = (p: ParticipantUser, targetTopic: TopicId = 'overview') => {
    const bundle = loadParticipantFullBundle(p.id);
    setImpersonatedParticipant(p);
    setProfile(p);
    setProgressMap(bundle.progress);
    setScores(bundle.scores);
    setThreePillars(bundle.threePillars);
    setMindsetTransformations(bundle.mindset);
    setActionPlan(bundle.actionPlan);
    setAssignment(bundle.assignment);
    setReflection321(bundle.reflection321);
    setActiveTopic(targetTopic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitImpersonation = () => {
    setImpersonatedParticipant(null);
    setActiveTopic('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login handler
  const handleLogin = (session: AuthSession) => {
    setAuthSession(session);
    saveAuthSession(session);
    setIsAuthModalOpen(false);
    updatePortalUrl(session.role);
    setImpersonatedParticipant(null);

    if (session.role === 'admin') {
      setActiveTopic('admin-dashboard');
    } else {
      const p = session.user as ParticipantUser;
      setProfile(p);
      saveProfile(p, p.id);
      saveRegisteredParticipant(p);
      setRegisteredParticipants(loadRegisteredParticipants());

      const pBundle = loadParticipantFullBundle(p.id);
      setProgressMap(pBundle.progress);
      setScores(pBundle.scores);
      setThreePillars(pBundle.threePillars);
      setMindsetTransformations(pBundle.mindset);
      setActionPlan(pBundle.actionPlan);
      setAssignment(pBundle.assignment);
      setReflection321(pBundle.reflection321);

      setActiveTopic('overview');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logout handler
  const handleLogout = () => {
    const previousRole = authSession?.role;
    clearAuthSession();
    setAuthSession(null);
    setImpersonatedParticipant(null);

    const pBundle = loadParticipantFullBundle(profile.id);
    setProgressMap(pBundle.progress);
    setScores(pBundle.scores);
    setThreePillars(pBundle.threePillars);
    setMindsetTransformations(pBundle.mindset);
    setActionPlan(pBundle.actionPlan);
    setAssignment(pBundle.assignment);
    setReflection321(pBundle.reflection321);

    if (previousRole === 'peserta') {
      updatePortalUrl('peserta');
    } else {
      updatePortalUrl(null);
    }
  };

  // Register Admin handler
  const handleRegisterAdmin = (admin: AdminUser) => {
    saveRegisteredAdmin(admin);
    setRegisteredAdmins(loadRegisteredAdmins());
  };

  // Register Participant handler
  const handleRegisterParticipant = (participant: ParticipantUser) => {
    saveRegisteredParticipant(participant);
    setRegisteredParticipants(loadRegisteredParticipants());
  };

  // Participant Management handlers for Admin
  const handleRefreshData = () => {
    setRegisteredParticipants(loadRegisteredParticipants());
    setTopicReviewsMap(loadTopicReviews());
    setMaterials(loadCourseMaterials());
    setMeetConfig(loadMeetConfig());
  };

  const handleAddParticipant = (participant: ParticipantUser) => {
    saveRegisteredParticipant(participant);
    setRegisteredParticipants(loadRegisteredParticipants());
  };

  const handleUpdateParticipant = (participant: ParticipantUser) => {
    saveRegisteredParticipant(participant);
    setRegisteredParticipants(loadRegisteredParticipants());
  };

  const handleDeleteParticipant = (participantId: string) => {
    deleteParticipant(participantId);
    setRegisteredParticipants(loadRegisteredParticipants());
    if (impersonatedParticipant?.id === participantId) {
      setImpersonatedParticipant(null);
      setActiveTopic('admin-dashboard');
    }
  };

  // Clear all registered participants (reset to brand new state)
  const handleClearParticipants = () => {
    clearAllRegisteredParticipants();
    setRegisteredParticipants([]);
    setProfile(DEFAULT_PROFILE);
    setProgressMap({});
    setScores({ preTestScore: null, postTestScore: null });
    setTopicReviewsMap({});
    setImpersonatedParticipant(null);
  };


  const handleMarkTaskComplete = (taskId: string) => {
    setProgressMap((prev) => {
      const updated = { ...prev, [taskId]: true };
      saveProgress(updated, activeParticipantId);
      return updated;
    });
  };

  const handleSaveProfile = (updated: ParticipantProfile) => {
    setProfile(updated);
    saveProfile(updated, activeParticipantId);
  };

  const handleSavePreScore = (score: number | null) => {
    setScores((prev) => ({ ...prev, preTestScore: score }));
    savePreTestScore(score, activeParticipantId);
  };

  const handleSavePostScore = (score: number) => {
    setScores((prev) => ({ ...prev, postTestScore: score }));
    savePostTestScore(score, activeParticipantId);
  };

  const handleSaveThreePillars = (data: ThreePillarsRow[]) => {
    setThreePillars(data);
    saveThreePillars(data, activeParticipantId);
  };

  const handleSaveMindsetTransformations = (data: MindsetTransformationRow[]) => {
    setMindsetTransformations(data);
    saveMindsetTransformations(data, activeParticipantId);
  };

  const handleSaveActionPlan = (data: ActionPlanData) => {
    setActionPlan(data);
    saveActionPlan(data, activeParticipantId);
  };

  const handleSaveAssignment = (data: Modul1AssignmentData) => {
    setAssignment(data);
    saveAssignmentModul1(data, activeParticipantId);
  };

  const handleSaveReflection = (data: Reflection321Data) => {
    setReflection321(data);
    saveReflection321(data, activeParticipantId);
  };

  const handleAddForumPost = (post: ForumPost) => {
    const updated = [post, ...forumPosts];
    setForumPosts(updated);
    saveForumPosts(updated);
  };

  const handleLikeForumPost = (postId: string) => {
    const updated = forumPosts.map((p) =>
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    );
    setForumPosts(updated);
    saveForumPosts(updated);
  };

  const handleReplyForumPost = (postId: string, replyText: string) => {
    const newReply = {
      id: 'rep-' + Date.now(),
      authorName: profile.name,
      schoolName: profile.schoolName,
      content: replyText,
      timestamp: 'Baru saja'
    };

    const updated = forumPosts.map((p) =>
      p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p
    );
    setForumPosts(updated);
    saveForumPosts(updated);
  };

  const handleAddPadletNote = (note: PadletNote) => {
    const updated = [note, ...padletNotes];
    setPadletNotes(updated);
    savePadletNotes(updated);
  };

  const handleLikePadletNote = (noteId: string) => {
    const updated = padletNotes.map((n) =>
      n.id === noteId ? { ...n, likes: n.likes + 1 } : n
    );
    setPadletNotes(updated);
    savePadletNotes(updated);
  };

  // Dynamic Course Materials Handlers (Admin CMS)
  const handleSaveMaterial = (material: CourseMaterial) => {
    const updated = saveSingleMaterial(material);
    setMaterials(updated);
  };

  const handleDeleteMaterial = (materialId: string) => {
    const updated = deleteSingleMaterial(materialId);
    setMaterials(updated);
  };

  // Dynamic Google Meet Config Handler (Admin CMS)
  const handleSaveMeetConfig = (newConfig: GoogleMeetConfig) => {
    saveMeetConfig(newConfig);
    setMeetConfig(newConfig);
  };

  // URL-based portal routing check
  const targetUrlRole = detectPortalRole();
  const isRoleMismatch = targetUrlRole && authSession && authSession.role !== targetUrlRole;

  // If no user is logged in, or if user navigated to a link for a different role
  if (!authSession || isRoleMismatch) {
    return (
      <AuthGateway
        onLogin={handleLogin}
        registeredAdmins={registeredAdmins}
        registeredParticipants={registeredParticipants}
        onRegisterAdmin={handleRegisterAdmin}
        onRegisterParticipant={handleRegisterParticipant}
        initialRole={targetUrlRole || undefined}
      />
    );
  }

  const isAdmin = authSession.role === 'admin';
  const isStaffExempt = isAdmin && !impersonatedParticipant;
  const currentParticipantReviews = topicReviewsMap[activeParticipantId] || {};
  const unlockStatusMap = getAllTopicsUnlockStatus(progressMap, currentParticipantReviews, isStaffExempt);
  const certEligibility = checkCertificateEligibility(progressMap, currentParticipantReviews);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Header Bar */}
      <Header
        profile={profile}
        authSession={authSession}
        activeTopic={activeTopic}
        meetConfig={meetConfig}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSchedule={() => setIsScheduleOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminDashboard={() => {
          if (impersonatedParticipant) setImpersonatedParticipant(null);
          setActiveTopic('admin-dashboard');
        }}
        onOpenCourse={() => setActiveTopic('overview')}
        onLogout={handleLogout}
        progressPercent={progressPercent}
        completedTasksCount={completedTasksCount}
        totalTasksCount={ALL_TASKS.length}
        isCertificateEligible={certEligibility.isEligible}
        completedTopicsCount={certEligibility.completedTopicsCount}
        awaitingTopic5Review={certEligibility.awaitingTopic5Review}
      />

      {/* Impersonation top banner for Admin */}
      {impersonatedParticipant && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md border-b-2 border-amber-600 sticky top-0 z-40">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <div className="w-6 h-6 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span>Mode Fasilitator: Mengelola Akun Peserta: </span>
              <strong className="text-slate-950 underline underline-offset-2">{impersonatedParticipant.name}</strong>
              <span className="opacity-90 font-medium ml-1">({impersonatedParticipant.schoolName})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                handleBatchApproveAllTopics(impersonatedParticipant.id);
                const updated = { ...progressMap };
                for (const t of ALL_TASKS) updated[t] = true;
                setProgressMap(updated);
                saveProgress(updated, impersonatedParticipant.id);
              }}
              className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              ⚡ Buka & Tuntaskan Semua Topik
            </button>

            <button
              type="button"
              onClick={handleExitImpersonation}
              className="px-3.5 py-1 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              ← Kembali ke Dasbor Fasilitator
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Official Header Banner on LMS */}
        <TrainingHeaderBanner
          subtitle={
            isAdmin && !impersonatedParticipant
              ? 'LMS Moodle PKB • Dasbor Pengelolaan Fasilitator & Administrator'
              : `LMS Moodle PKB • Selamat Belajar, ${profile.name} (${profile.schoolName})`
          }
        />

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Navigation Sidebar */}
          <CourseNavigation
            activeTopic={activeTopic}
            onSelectTopic={(t) => {
              setActiveTopic(t);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            progressMap={progressMap}
            unlockStatusMap={unlockStatusMap}
            isAdmin={isAdmin}
          />

          {/* Main Topic Content Area */}
          <main className="flex-1 min-w-0">
            
            {/* Admin Dashboard view */}
            {activeTopic === 'admin-dashboard' && isAdmin && (
              <AdminDashboard
                admin={authSession.user as AdminUser}
                participants={registeredParticipants}
                materials={materials}
                meetConfig={meetConfig}
                topicReviews={topicReviewsMap}
                onSelectParticipantPreview={(p) => {
                  handleSelectParticipantPreview(p, 'overview');
                }}
                onNavigateTopic={(t) => {
                  setActiveTopic(t);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onClearParticipants={handleClearParticipants}
                onSaveMaterial={handleSaveMaterial}
                onDeleteMaterial={handleDeleteMaterial}
                onSaveMeetConfig={handleSaveMeetConfig}
                onSaveTopicReview={handleSaveTopicReview}
                onBatchApproveAllTopics={handleBatchApproveAllTopics}
                onRefreshData={handleRefreshData}
                onAddParticipant={handleAddParticipant}
                onUpdateParticipant={handleUpdateParticipant}
                onDeleteParticipant={handleDeleteParticipant}
              />
            )}

            {activeTopic === 'overview' && (
              <CourseOverview
                profile={profile}
                meetConfig={meetConfig}
                materials={materials}
                onSelectTopic={(t) => {
                  setActiveTopic(t);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenSchedule={() => setIsScheduleOpen(true)}
                progressPercent={progressPercent}
                completedTasksCount={completedTasksCount}
                totalTasksCount={ALL_TASKS.length}
                unlockStatusMap={unlockStatusMap}
              />
            )}

            {activeTopic === 'topik-1' && (
              !isStaffExempt && unlockStatusMap['topik-1'] && !unlockStatusMap['topik-1'].isUnlocked ? (
                <LockedTopicNotice
                  topicId="topik-1"
                  unlockStatus={unlockStatusMap['topik-1']}
                  progressMap={progressMap}
                  onSelectTopic={(t) => {
                    setActiveTopic(t);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ) : (
                <TopicOrientation
                  profile={profile}
                  forumPosts={forumPosts}
                  onAddForumPost={handleAddForumPost}
                  onLikeForumPost={handleLikeForumPost}
                  onReplyForumPost={handleReplyForumPost}
                  preScore={scores.preTestScore}
                  onSavePreScore={handleSavePreScore}
                  onMarkTaskComplete={handleMarkTaskComplete}
                />
              )
            )}

            {activeTopic === 'topik-2' && (
              !isStaffExempt && unlockStatusMap['topik-2'] && !unlockStatusMap['topik-2'].isUnlocked ? (
                <LockedTopicNotice
                  topicId="topik-2"
                  unlockStatus={unlockStatusMap['topik-2']}
                  progressMap={progressMap}
                  onSelectTopic={(t) => {
                    setActiveTopic(t);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ) : (
                <TopicModul1
                  profile={profile}
                  threePillars={threePillars}
                  onSaveThreePillars={handleSaveThreePillars}
                  padletNotes={padletNotes}
                  onAddPadletNote={handleAddPadletNote}
                  onLikePadletNote={handleLikePadletNote}
                  assignment={assignment}
                  onSaveAssignment={handleSaveAssignment}
                  onMarkTaskComplete={handleMarkTaskComplete}
                />
              )
            )}

            {activeTopic === 'topik-3' && (
              !isStaffExempt && unlockStatusMap['topik-3'] && !unlockStatusMap['topik-3'].isUnlocked ? (
                <LockedTopicNotice
                  topicId="topik-3"
                  unlockStatus={unlockStatusMap['topik-3']}
                  progressMap={progressMap}
                  onSelectTopic={(t) => {
                    setActiveTopic(t);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ) : (
                <TopicModul2
                  profile={profile}
                  transformations={mindsetTransformations}
                  onSaveTransformations={handleSaveMindsetTransformations}
                  onMarkTaskComplete={handleMarkTaskComplete}
                />
              )
            )}

            {activeTopic === 'topik-4' && (
              !isStaffExempt && unlockStatusMap['topik-4'] && !unlockStatusMap['topik-4'].isUnlocked ? (
                <LockedTopicNotice
                  topicId="topik-4"
                  unlockStatus={unlockStatusMap['topik-4']}
                  progressMap={progressMap}
                  onSelectTopic={(t) => {
                    setActiveTopic(t);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ) : (
                <TopicActionPlanning
                  profile={profile}
                  actionPlan={actionPlan}
                  onSaveActionPlan={handleSaveActionPlan}
                  onMarkTaskComplete={handleMarkTaskComplete}
                />
              )
            )}

            {activeTopic === 'topik-5' && (
              !isStaffExempt && unlockStatusMap['topik-5'] && !unlockStatusMap['topik-5'].isUnlocked ? (
                <LockedTopicNotice
                  topicId="topik-5"
                  unlockStatus={unlockStatusMap['topik-5']}
                  progressMap={progressMap}
                  onSelectTopic={(t) => {
                    setActiveTopic(t);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ) : (
                <TopicEvaluation
                  profile={profile}
                  preScore={scores.preTestScore}
                  postScore={scores.postTestScore}
                  onSavePostScore={handleSavePostScore}
                  reflection321={reflection321}
                  onSaveReflection321={handleSaveReflection}
                  onOpenCertificate={() => setIsCertificateOpen(true)}
                  onMarkTaskComplete={handleMarkTaskComplete}
                  isCertificateEligible={certEligibility.isEligible}
                  completedTopicsCount={certEligibility.completedTopicsCount}
                  missingTopics={certEligibility.missingTopics}
                  isTopic5Approved={certEligibility.isTopic5Approved}
                  topic5Review={certEligibility.topic5Review}
                  awaitingTopic5Review={certEligibility.awaitingTopic5Review}
                  onNavigateTopic={(t) => {
                    setActiveTopic(t);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )
            )}
          </main>


        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-700">
            Pelatihan Pengembangan Profesional Kepala Sekolah (PKB) • 7 Jam Efektif (420 Menit)
          </p>
          <p className="mt-1">
            Fasilitator: Muhamad Firman, S.Pd (F2151251088) • Blended Learning Moodle & Google Meet
          </p>
        </div>
      </footer>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      <VirtualScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSelectTopic={(t) => {
          setActiveTopic(t);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        meetConfig={meetConfig}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        profile={profile}
        preScore={scores.preTestScore}
        postScore={scores.postTestScore}
        isEligible={certEligibility.isEligible}
        completedTopicsCount={certEligibility.completedTopicsCount}
        missingTopics={certEligibility.missingTopics}
        isTopic5Approved={certEligibility.isTopic5Approved}
        topic5Review={certEligibility.topic5Review}
        awaitingTopic5Review={certEligibility.awaitingTopic5Review}
        onNavigateTopic={(t) => {
          setActiveTopic(t);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdmin={isAdmin}
      />

      {/* Switch Role / Auth Modal */}
      {isAuthModalOpen && (
        <AuthGateway
          onLogin={handleLogin}
          registeredAdmins={registeredAdmins}
          registeredParticipants={registeredParticipants}
          onRegisterAdmin={handleRegisterAdmin}
          onRegisterParticipant={handleRegisterParticipant}
          isModal={true}
          initialRole={authSession?.role}
          onCloseModal={() => setIsAuthModalOpen(false)}
        />
      )}

    </div>
  );
}
