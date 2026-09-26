import {
  ParticipantProfile,
  AdminUser,
  ParticipantUser,
  AuthSession,
  ThreePillarsRow,
  MindsetTransformationRow,
  ActionPlanData,
  Reflection321Data,
  Modul1AssignmentData,
  ForumPost,
  PadletNote,
  CourseMaterial,
  GoogleMeetConfig,
  TopicReviewRecord,
  ParticipantTopicReviews,
  TopicId,
  ParticipantFullBundle
} from '../types';

export type { ParticipantFullBundle };
import {
  DEFAULT_THREE_PILLARS,
  DEFAULT_MINDSET_TRANSFORMATIONS,
  DEFAULT_ACTION_PLAN,
  DEFAULT_ASSIGNMENT,
  DEFAULT_REFLECTION_321,
  INITIAL_FORUM_POSTS,
  INITIAL_PADLET_NOTES,
  TOPIC_TASK_DEFINITIONS
} from '../data/courseData';
import {
  syncParticipantToFirestore,
  deleteParticipantFromFirestore,
  syncAdminToFirestore,
  syncParticipantBundleToFirestore,
  syncTopicReviewsToFirestore,
  syncForumPostsToFirestore,
  syncPadletNotesToFirestore,
  syncMaterialsToFirestore,
  syncMeetConfigToFirestore
} from './firestoreService';

const PREFIX = 'lms_kepala_sekolah_';

// Automatic one-time cleanup of legacy mock participants so app starts completely fresh
if (typeof window !== 'undefined') {
  try {
    const isCleaned = localStorage.getItem(PREFIX + 'v3_fresh_reset');
    if (!isCleaned) {
      localStorage.removeItem(PREFIX + 'participants');
      localStorage.removeItem(PREFIX + 'profile');
      localStorage.removeItem(PREFIX + 'progress');
      localStorage.removeItem(PREFIX + 'pre_test_score');
      localStorage.removeItem(PREFIX + 'post_test_score');
      localStorage.removeItem(PREFIX + 'auth_session');
      localStorage.setItem(PREFIX + 'v3_fresh_reset', 'true');
    }

    // Automatic cleanup of Mentimeter Topik 2 and all inputs in Topik 3, 4, 5
    const isTopicsCleared = localStorage.getItem(PREFIX + 'v4_clear_topics_reset');
    if (!isTopicsCleared) {
      localStorage.removeItem(PREFIX + 'action_plan');
      localStorage.removeItem(PREFIX + 'mindset_trans');
      localStorage.removeItem(PREFIX + 'reflection_321');
      localStorage.removeItem(PREFIX + 'menti_votes');
      
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (
          k &&
          (k.includes('action_plan') ||
            k.includes('mindset_trans') ||
            k.includes('reflection_321') ||
            k.includes('menti'))
        ) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem(PREFIX + 'v4_clear_topics_reset', 'true');
    }

    // Automatic cleanup of Pre-test scores, answers and Forum Perkenalan
    const isPretestAndForumCleared = localStorage.getItem(PREFIX + 'v5_clear_pretest_forum_reset');
    if (!isPretestAndForumCleared) {
      localStorage.removeItem(PREFIX + 'pre_test_score');
      localStorage.removeItem(PREFIX + 'forum_posts');
      localStorage.removeItem(PREFIX + 'quiz_answers');

      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (
          k &&
          (k.includes('pre_test_score') ||
            k.includes('forum_posts') ||
            k.includes('quiz_answers'))
        ) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      // Also reset pre-test and forum-perkenalan task progress
      const pProgress = localStorage.getItem(PREFIX + 'progress');
      if (pProgress) {
        try {
          const prog = JSON.parse(pProgress);
          delete prog['pre-test'];
          delete prog['forum-perkenalan'];
          localStorage.setItem(PREFIX + 'progress', JSON.stringify(prog));
        } catch {}
      }

      localStorage.setItem(PREFIX + 'v5_clear_pretest_forum_reset', 'true');
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

export const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: 'admin-mf-1',
    name: 'Muhamad Firman, S.Pd',
    facilitatorId: 'F2151251088',
    email: 'muhammadfirman53@gmail.com',
    institution: 'Balai Guru Penggerak / Tim Fasilitator PKB',
    role: 'admin',
    registeredAt: '2026-09-01',
    password: 'admin123'
  }
];

// Kosongkan seluruh peserta default agar aplikasi benar-benar baru
export const DEFAULT_PARTICIPANTS: ParticipantUser[] = [];

export const DEFAULT_PROFILE: ParticipantProfile = {
  id: '',
  name: '',
  nip: '',
  schoolName: '',
  district: ''
};

export function loadRegisteredAdmins(): AdminUser[] {
  try {
    const data = localStorage.getItem(PREFIX + 'admins');
    if (!data) return DEFAULT_ADMINS;
    const parsed: AdminUser[] = JSON.parse(data);
    const hasDefault = parsed.some(
      (a) => a.email.toLowerCase() === DEFAULT_ADMINS[0].email.toLowerCase()
    );
    if (!hasDefault) {
      return [...DEFAULT_ADMINS, ...parsed];
    }
    return parsed.map((a) => {
      if (a.email.toLowerCase() === DEFAULT_ADMINS[0].email.toLowerCase() && !a.password) {
        return { ...a, password: 'admin123' };
      }
      return a;
    });
  } catch {
    return DEFAULT_ADMINS;
  }
}

export function saveRegisteredAdmin(admin: AdminUser) {
  const current = loadRegisteredAdmins();
  const exists = current.some((a) => a.id === admin.id || a.email.toLowerCase() === admin.email.toLowerCase());
  const updated = exists
    ? current.map((a) => (a.id === admin.id || a.email.toLowerCase() === admin.email.toLowerCase() ? admin : a))
    : [...current, admin];
  localStorage.setItem(PREFIX + 'admins', JSON.stringify(updated));
  syncAdminToFirestore(admin);
}

export function loadRegisteredParticipants(): ParticipantUser[] {
  try {
    const data = localStorage.getItem(PREFIX + 'participants');
    if (!data) return [];
    const parsed: ParticipantUser[] = JSON.parse(data);
    const mockIds = ['user-ks-1', 'user-ks-2', 'user-ks-3', 'user-ks-4'];
    const filtered = parsed.filter((p) => p && p.id && !mockIds.includes(p.id));
    return filtered;
  } catch {
    return [];
  }
}

export function saveRegisteredParticipant(participant: ParticipantUser) {
  const current = loadRegisteredParticipants();
  const validNip = participant.nip && participant.nip.trim() !== '' && participant.nip !== '-';
  const exists = current.some((p) => p.id === participant.id || (validNip && p.nip === participant.nip));
  const updated = exists
    ? current.map((p) => (p.id === participant.id || (validNip && p.nip === participant.nip) ? { ...p, ...participant } : p))
    : [participant, ...current];
  localStorage.setItem(PREFIX + 'participants', JSON.stringify(updated));
  saveProfile(participant, participant.id);
  syncParticipantToFirestore(participant);
  try {
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

export function saveRegisteredParticipants(participants: ParticipantUser[]) {
  localStorage.setItem(PREFIX + 'participants', JSON.stringify(participants));
  participants.forEach((p) => syncParticipantToFirestore(p));
  try {
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

export function deleteParticipant(participantId: string): ParticipantUser[] {
  const current = loadRegisteredParticipants();
  const updated = current.filter((p) => p.id !== participantId);
  saveRegisteredParticipants(updated);
  deleteParticipantFromFirestore(participantId);
  try {
    localStorage.removeItem(`${PREFIX}p_${participantId}_profile`);
    localStorage.removeItem(`${PREFIX}p_${participantId}_progress`);
    localStorage.removeItem(`${PREFIX}p_${participantId}_pre_test_score`);
    localStorage.removeItem(`${PREFIX}p_${participantId}_post_test_score`);
    localStorage.removeItem(`${PREFIX}p_${participantId}_three_pillars`);
    localStorage.removeItem(`${PREFIX}p_${participantId}_mindset_trans`);
    localStorage.removeItem(`${PREFIX}p_${participantId}_action_plan`);
    localStorage.removeItem(`${PREFIX}p_${participantId}_assignment_m1`);
    localStorage.removeItem(`${PREFIX}p_${participantId}_reflection_321`);
    window.dispatchEvent(new Event('storage'));
  } catch {}
  return updated;
}

export function clearAllRegisteredParticipants() {
  localStorage.removeItem(PREFIX + 'participants');
  localStorage.removeItem(PREFIX + 'profile');
  localStorage.removeItem(PREFIX + 'progress');
  localStorage.removeItem(PREFIX + 'pre_test_score');
  localStorage.removeItem(PREFIX + 'post_test_score');
  localStorage.removeItem(PREFIX + 'auth_session');
  localStorage.removeItem(PREFIX + 'topic_reviews');
}


export function loadAuthSession(): AuthSession | null {
  try {
    const data = localStorage.getItem(PREFIX + 'auth_session');
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(PREFIX + 'auth_session', JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(PREFIX + 'auth_session');
}

export function loadProfile(participantId?: string): ParticipantProfile {
  try {
    const key = participantId ? `${PREFIX}p_${participantId}_profile` : `${PREFIX}profile`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
    if (participantId) {
      const general = localStorage.getItem(PREFIX + 'profile');
      if (general) return JSON.parse(general);
    }
    return DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: ParticipantProfile, participantId?: string) {
  const key = participantId ? `${PREFIX}p_${participantId}_profile` : `${PREFIX}profile`;
  localStorage.setItem(key, JSON.stringify(profile));
  if (!participantId) {
    localStorage.setItem(PREFIX + 'profile', JSON.stringify(profile));
  }
}

export function getActiveParticipantIdFallback(): string | null {
  try {
    const sessionStr = localStorage.getItem(PREFIX + 'auth_session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session?.role === 'peserta' && session?.user?.id) {
        return session.user.id;
      }
    }
    const lastId = localStorage.getItem('pkb_last_participant_id');
    if (lastId) return lastId;
    const regList = loadRegisteredParticipants();
    if (regList.length > 0) return regList[0].id;
  } catch {}
  return null;
}

export function loadProgress(participantId?: string): Record<string, boolean> {
  try {
    const pKey = participantId ? `${PREFIX}p_${participantId}_progress` : null;
    let specific: Record<string, boolean> = {};
    if (pKey) {
      const data = localStorage.getItem(pKey);
      if (data) specific = JSON.parse(data);
    }
    const general = localStorage.getItem(PREFIX + 'progress');
    const generalParsed = general ? JSON.parse(general) : {};

    const merged = { ...generalParsed, ...specific };
    if (pKey && Object.keys(merged).length > 0 && Object.keys(specific).length === 0) {
      localStorage.setItem(pKey, JSON.stringify(merged));
    }
    return merged;
  } catch {
    return {};
  }
}

export function saveProgress(progress: Record<string, boolean>, participantId?: string) {
  try {
    const targetId = participantId || getActiveParticipantIdFallback();
    localStorage.setItem(PREFIX + 'progress', JSON.stringify(progress));
    if (targetId) {
      localStorage.setItem(`${PREFIX}p_${targetId}_progress`, JSON.stringify(progress));
      syncParticipantBundleToFirestore(targetId, { progress });
    }
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

export function loadThreePillars(participantId?: string): ThreePillarsRow[] {
  try {
    const pKey = participantId ? `${PREFIX}p_${participantId}_three_pillars` : null;
    if (pKey) {
      const pRaw = localStorage.getItem(pKey);
      if (pRaw) {
        const parsed = JSON.parse(pRaw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    }
    const generalRaw = localStorage.getItem(PREFIX + 'three_pillars');
    if (generalRaw) {
      const parsed = JSON.parse(generalRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (pKey) localStorage.setItem(pKey, generalRaw);
        return parsed;
      }
    }
    return DEFAULT_THREE_PILLARS;
  } catch {
    return DEFAULT_THREE_PILLARS;
  }
}

export function saveThreePillars(data: ThreePillarsRow[], participantId?: string) {
  try {
    const targetId = participantId || getActiveParticipantIdFallback();
    localStorage.setItem(PREFIX + 'three_pillars', JSON.stringify(data));
    if (targetId) {
      localStorage.setItem(`${PREFIX}p_${targetId}_three_pillars`, JSON.stringify(data));
      syncParticipantBundleToFirestore(targetId, { threePillars: data });
    }
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

export function loadMindsetTransformations(participantId?: string): MindsetTransformationRow[] {
  try {
    const pKey = participantId ? `${PREFIX}p_${participantId}_mindset_trans` : null;
    if (pKey) {
      const pRaw = localStorage.getItem(pKey);
      if (pRaw) return JSON.parse(pRaw);
    }
    const generalRaw = localStorage.getItem(PREFIX + 'mindset_trans');
    if (generalRaw) {
      const parsed = JSON.parse(generalRaw);
      if (pKey) localStorage.setItem(pKey, generalRaw);
      return parsed;
    }
    return DEFAULT_MINDSET_TRANSFORMATIONS;
  } catch {
    return DEFAULT_MINDSET_TRANSFORMATIONS;
  }
}

export function saveMindsetTransformations(data: MindsetTransformationRow[], participantId?: string) {
  try {
    const targetId = participantId || getActiveParticipantIdFallback();
    localStorage.setItem(PREFIX + 'mindset_trans', JSON.stringify(data));
    if (targetId) {
      localStorage.setItem(`${PREFIX}p_${targetId}_mindset_trans`, JSON.stringify(data));
      syncParticipantBundleToFirestore(targetId, { mindset: data });
    }
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

export function loadActionPlan(participantId?: string): ActionPlanData {
  try {
    const pKey = participantId ? `${PREFIX}p_${participantId}_action_plan` : null;
    let specificData: ActionPlanData | null = null;
    if (pKey) {
      const pRaw = localStorage.getItem(pKey);
      if (pRaw) specificData = JSON.parse(pRaw);
    }

    const hasSpecificContent = specificData && Boolean(
      specificData.masalahPrioritas?.trim() ||
      specificData.warisanKepemimpinan?.trim() ||
      specificData.nilaiPribadi?.trim() ||
      specificData.budaya?.trim() ||
      specificData.pemberdayaan?.trim() ||
      specificData.fixedMindset?.trim() ||
      specificData.growthMindset?.trim() ||
      specificData.aksi?.trim() ||
      specificData.indikator?.trim() ||
      specificData.waktu?.trim() ||
      specificData.dukungan?.trim()
    );

    if (hasSpecificContent && specificData) {
      return specificData;
    }

    // Fallback ke general key jika specific key kosong / belum di-link
    const generalRaw = localStorage.getItem(PREFIX + 'action_plan');
    if (generalRaw) {
      const generalData: ActionPlanData = JSON.parse(generalRaw);
      const hasGeneralContent = Boolean(
        generalData.masalahPrioritas?.trim() ||
        generalData.warisanKepemimpinan?.trim() ||
        generalData.nilaiPribadi?.trim() ||
        generalData.budaya?.trim() ||
        generalData.pemberdayaan?.trim() ||
        generalData.fixedMindset?.trim() ||
        generalData.growthMindset?.trim() ||
        generalData.aksi?.trim() ||
        generalData.indikator?.trim() ||
        generalData.waktu?.trim() ||
        generalData.dukungan?.trim()
      );

      if (hasGeneralContent) {
        if (pKey) {
          localStorage.setItem(pKey, JSON.stringify(generalData));
        }
        return generalData;
      }
    }

    // Secondary scan across any participant keys in localStorage if still empty
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX + 'p_') && k.endsWith('_action_plan')) {
        try {
          const candidateRaw = localStorage.getItem(k);
          if (candidateRaw) {
            const candidate: ActionPlanData = JSON.parse(candidateRaw);
            if (candidate.masalahPrioritas?.trim() || candidate.warisanKepemimpinan?.trim() || candidate.aksi?.trim()) {
              if (pKey) localStorage.setItem(pKey, candidateRaw);
              return candidate;
            }
          }
        } catch {}
      }
    }

    return specificData || DEFAULT_ACTION_PLAN;
  } catch {
    return DEFAULT_ACTION_PLAN;
  }
}

export function saveActionPlan(data: ActionPlanData, participantId?: string) {
  try {
    const targetId = participantId || getActiveParticipantIdFallback();
    localStorage.setItem(PREFIX + 'action_plan', JSON.stringify(data));
    if (targetId) {
      localStorage.setItem(`${PREFIX}p_${targetId}_action_plan`, JSON.stringify(data));
      syncParticipantBundleToFirestore(targetId, { actionPlan: data });
    }
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

export function loadAssignmentModul1(participantId?: string): Modul1AssignmentData {
  try {
    const pKey = participantId ? `${PREFIX}p_${participantId}_assignment_m1` : null;
    if (pKey) {
      const pRaw = localStorage.getItem(pKey);
      if (pRaw) return JSON.parse(pRaw);
    }
    const generalRaw = localStorage.getItem(PREFIX + 'assignment_m1');
    if (generalRaw) {
      const parsed = JSON.parse(generalRaw);
      if (pKey) localStorage.setItem(pKey, generalRaw);
      return parsed;
    }
    return DEFAULT_ASSIGNMENT;
  } catch {
    return DEFAULT_ASSIGNMENT;
  }
}

export function saveAssignmentModul1(data: Modul1AssignmentData, participantId?: string) {
  try {
    const targetId = participantId || getActiveParticipantIdFallback();
    localStorage.setItem(PREFIX + 'assignment_m1', JSON.stringify(data));
    if (targetId) {
      localStorage.setItem(`${PREFIX}p_${targetId}_assignment_m1`, JSON.stringify(data));
      syncParticipantBundleToFirestore(targetId, { assignment: data });
    }
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

export function loadReflection321(participantId?: string): Reflection321Data {
  try {
    const pKey = participantId ? `${PREFIX}p_${participantId}_reflection_321` : null;
    let specificData: Reflection321Data | null = null;
    if (pKey) {
      const pRaw = localStorage.getItem(pKey);
      if (pRaw) specificData = JSON.parse(pRaw);
    }

    const hasSpecificContent = specificData && Boolean(
      specificData.satuTindakan?.trim() ||
      specificData.tigaHalPenting?.some((t) => t?.trim()) ||
      specificData.duaPertanyaan?.some((q) => q?.trim())
    );

    if (hasSpecificContent && specificData) {
      return specificData;
    }

    // Fallback ke general key
    const generalRaw = localStorage.getItem(PREFIX + 'reflection_321');
    if (generalRaw) {
      const generalData: Reflection321Data = JSON.parse(generalRaw);
      const hasGeneralContent = Boolean(
        generalData.satuTindakan?.trim() ||
        generalData.tigaHalPenting?.some((t) => t?.trim()) ||
        generalData.duaPertanyaan?.some((q) => q?.trim())
      );

      if (hasGeneralContent) {
        if (pKey) localStorage.setItem(pKey, JSON.stringify(generalData));
        return generalData;
      }
    }

    // Secondary scan across any participant keys in localStorage if still empty
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX + 'p_') && k.endsWith('_reflection_321')) {
        try {
          const candidateRaw = localStorage.getItem(k);
          if (candidateRaw) {
            const candidate: Reflection321Data = JSON.parse(candidateRaw);
            if (candidate.satuTindakan?.trim() || candidate.tigaHalPenting?.some((t) => t?.trim())) {
              if (pKey) localStorage.setItem(pKey, candidateRaw);
              return candidate;
            }
          }
        } catch {}
      }
    }

    return specificData || DEFAULT_REFLECTION_321;
  } catch {
    return DEFAULT_REFLECTION_321;
  }
}

export function saveReflection321(data: Reflection321Data, participantId?: string) {
  try {
    const targetId = participantId || getActiveParticipantIdFallback();
    localStorage.setItem(PREFIX + 'reflection_321', JSON.stringify(data));
    if (targetId) {
      localStorage.setItem(`${PREFIX}p_${targetId}_reflection_321`, JSON.stringify(data));
      syncParticipantBundleToFirestore(targetId, { reflection321: data });
    }
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

export function loadForumPosts(): ForumPost[] {
  try {
    const data = localStorage.getItem(PREFIX + 'forum_posts');
    return data ? JSON.parse(data) : INITIAL_FORUM_POSTS;
  } catch {
    return INITIAL_FORUM_POSTS;
  }
}

export function saveForumPosts(posts: ForumPost[]) {
  localStorage.setItem(PREFIX + 'forum_posts', JSON.stringify(posts));
  syncForumPostsToFirestore(posts);
  try {
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

export function loadPadletNotes(): PadletNote[] {
  try {
    const data = localStorage.getItem(PREFIX + 'padlet_notes');
    return data ? JSON.parse(data) : INITIAL_PADLET_NOTES;
  } catch {
    return INITIAL_PADLET_NOTES;
  }
}

export function savePadletNotes(notes: PadletNote[]) {
  localStorage.setItem(PREFIX + 'padlet_notes', JSON.stringify(notes));
  syncPadletNotesToFirestore(notes);
  try {
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

export function loadScores(participantId?: string): { preTestScore: number | null; postTestScore: number | null } {
  try {
    const preKey = participantId ? `${PREFIX}p_${participantId}_pre_test_score` : null;
    const postKey = participantId ? `${PREFIX}p_${participantId}_post_test_score` : null;
    
    let pre = preKey ? localStorage.getItem(preKey) : null;
    let post = postKey ? localStorage.getItem(postKey) : null;

    if (pre === null) {
      const genPre = localStorage.getItem(PREFIX + 'pre_test_score');
      if (genPre !== null) {
        pre = genPre;
        if (preKey) localStorage.setItem(preKey, genPre);
      }
    }

    if (post === null) {
      const genPost = localStorage.getItem(PREFIX + 'post_test_score');
      if (genPost !== null) {
        post = genPost;
        if (postKey) localStorage.setItem(postKey, genPost);
      } else {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(PREFIX + 'p_') && k.endsWith('_post_test_score')) {
            const candidate = localStorage.getItem(k);
            if (candidate !== null && candidate !== '') {
              post = candidate;
              if (postKey) localStorage.setItem(postKey, candidate);
              break;
            }
          }
        }
      }
    }

    return {
      preTestScore: pre !== null ? Number(pre) : null,
      postTestScore: post !== null ? Number(post) : null,
    };
  } catch {
    return { preTestScore: null, postTestScore: null };
  }
}

export function savePreTestScore(score: number | null, participantId?: string) {
  try {
    const targetId = participantId || getActiveParticipantIdFallback();
    if (score === null || score === undefined) {
      localStorage.removeItem(PREFIX + 'pre_test_score');
      if (targetId) {
        localStorage.removeItem(`${PREFIX}p_${targetId}_pre_test_score`);
      }
    } else {
      localStorage.setItem(PREFIX + 'pre_test_score', String(score));
      if (targetId) {
        localStorage.setItem(`${PREFIX}p_${targetId}_pre_test_score`, String(score));
      }
    }
    if (targetId) {
      const currentScores = loadScores(targetId);
      syncParticipantBundleToFirestore(targetId, {
        scores: { preTestScore: score, postTestScore: currentScores.postTestScore }
      });
    }
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

export function savePostTestScore(score: number | null, participantId?: string) {
  try {
    const targetId = participantId || getActiveParticipantIdFallback();
    if (score === null || score === undefined) {
      localStorage.removeItem(PREFIX + 'post_test_score');
      if (targetId) {
        localStorage.removeItem(`${PREFIX}p_${targetId}_post_test_score`);
      }
    } else {
      localStorage.setItem(PREFIX + 'post_test_score', String(score));
      if (targetId) {
        localStorage.setItem(`${PREFIX}p_${targetId}_post_test_score`, String(score));
      }
    }
    if (targetId) {
      const currentScores = loadScores(targetId);
      syncParticipantBundleToFirestore(targetId, {
        scores: { preTestScore: currentScores.preTestScore, postTestScore: score }
      });
    }
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

export function updateParticipantInList(updatedParticipant: ParticipantUser): ParticipantUser[] {
  const current = loadRegisteredParticipants();
  const updated = current.map((p) => (p.id === updatedParticipant.id ? updatedParticipant : p));
  saveRegisteredParticipants(updated);
  return updated;
}

export function loadParticipantFullBundle(participantId: string): ParticipantFullBundle {
  return {
    participantId,
    progress: loadProgress(participantId),
    scores: loadScores(participantId),
    threePillars: loadThreePillars(participantId),
    mindset: loadMindsetTransformations(participantId),
    actionPlan: loadActionPlan(participantId),
    assignment: loadAssignmentModul1(participantId),
    reflection321: loadReflection321(participantId),
    reviews: getParticipantTopicReviews(participantId)
  };
}

export function toggleParticipantTask(participantId: string, taskId: string, isCompleted: boolean): Record<string, boolean> {
  const currentProgress = loadProgress(participantId);
  const updatedProgress = { ...currentProgress, [taskId]: isCompleted };
  saveProgress(updatedProgress, participantId);
  return updatedProgress;
}

export function completeAllTopicTasks(participantId: string, topicId: TopicId): Record<string, boolean> {
  const currentProgress = loadProgress(participantId);
  const tasks = TOPIC_TASK_DEFINITIONS[topicId] || [];
  const updatedProgress = { ...currentProgress };
  for (const task of tasks) {
    updatedProgress[task.id] = true;
  }
  saveProgress(updatedProgress, participantId);
  return updatedProgress;
}

export function saveParticipantFullBundle(participantId: string, bundle: Partial<ParticipantFullBundle>) {
  if (bundle.progress) {
    saveProgress(bundle.progress, participantId);
  }
  if (bundle.scores) {
    if (bundle.scores.preTestScore !== undefined && bundle.scores.preTestScore !== null) {
      savePreTestScore(bundle.scores.preTestScore, participantId);
    }
    if (bundle.scores.postTestScore !== undefined && bundle.scores.postTestScore !== null) {
      savePostTestScore(bundle.scores.postTestScore, participantId);
    }
  }
  if (bundle.threePillars) {
    saveThreePillars(bundle.threePillars, participantId);
  }
  if (bundle.mindset) {
    saveMindsetTransformations(bundle.mindset, participantId);
  }
  if (bundle.actionPlan) {
    saveActionPlan(bundle.actionPlan, participantId);
  }
  if (bundle.assignment) {
    saveAssignmentModul1(bundle.assignment, participantId);
  }
  if (bundle.reflection321) {
    saveReflection321(bundle.reflection321, participantId);
  }
}

export const DEFAULT_MEET_CONFIG: GoogleMeetConfig = {
  meetUrl: 'https://meet.google.com/ocv-mwmu-ksg',
  sessionTitle: 'Sesi Sinkronus Pleno & Diskusi Kelompok Kepala Sekolah',
  scheduleTime: '08.00 - 15.30 WIB',
  meetCode: 'ocv-mwmu-ksg',
  passcode: '',
  instructions: 'Silakan bergabung ke ruang rapat Google Meet 10 menit sebelum sesi dimulai. Gunakan mikrofon kondusif dan aktifkan kamera demi kelancaran interaksi tatap maya bersama fasilitator.',
  isActive: true,
  updatedAt: '2026-09-01'
};

export const DEFAULT_MATERIALS: CourseMaterial[] = [
  {
    id: 'mat-1',
    topicId: 'topik-1',
    title: 'Video Panduan Orientasi LMS Moodle untuk Kepala Sekolah',
    category: 'video',
    mode: 'Asinkronus',
    duration: '15 Menit',
    description: 'Video tutorial pengenalan platform Moodle, alur navigasi aktivitas, pengerjaan pre-test, dan interaksi forum warisan.',
    contentUrl: 'https://youtu.be/OCv8MuMwX5Q?si=odGALHgEArYAtYtO',
    textNotes: 'Tonton video panduan ini untuk memahami teknis pengoperasian LMS sebelum memulai pengerjaan asesmen diagnostik dan modul lanjutan.',
    isPublished: true,
    createdAt: '2026-09-01'
  },
  {
    id: 'mat-2',
    topicId: 'topik-2',
    title: 'Slide Presentasi: Tiga Pilar Kepemimpinan Berkelanjutan',
    category: 'slide',
    mode: 'Sinkronus',
    duration: '45 Menit',
    description: 'Bahan tayang paparan fasilitator mengenai Pilar Nilai Pribadi, Pilar Budaya Sekolah, dan Pilar Pemberdayaan Rekan Sejawat.',
    contentUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vTigaPilarKepemimpinan/pub',
    textNotes: 'Disampaikan dalam sesi tatap maya pleno sinkronus via Google Meet.',
    isPublished: true,
    createdAt: '2026-09-01'
  },
  {
    id: 'mat-3',
    topicId: 'topik-2',
    title: 'Lembar Studi Kasus: Dilema Kepemimpinan Pak Pandi',
    category: 'pdf',
    mode: 'Blended',
    duration: '30 Menit',
    description: 'Dokumen narasi studi kasus kompleks tentang tantangan resistensi perubahan guru senior dan strategi resolusi berbasis nilai.',
    contentUrl: 'https://drive.google.com/file/d/studi-kasus-pak-pandi/view',
    textNotes: 'Bahan bacaan untuk diskusi breakout room Google Meet dan analisis lembar kerja Tiga Pilar.',
    isPublished: true,
    createdAt: '2026-09-01'
  },
  {
    id: 'mat-4',
    topicId: 'topik-3',
    title: 'Modul Transformasi Pola Pikir: Dari Fixed ke Growth Mindset',
    category: 'artikel',
    mode: 'Sinkronus',
    duration: '60 Menit',
    description: 'Panduan mendalam reframing narasi batin kepala sekolah dalam merespon kegagalan, kritik, dan tantangan inovasi sekolah.',
    contentUrl: 'https://repositori.kemdikbud.go.id/growth-mindset-kepala-sekolah',
    textNotes: 'Gunakan panduan ini untuk mengisi matriks transformasi mindset dan komitmen perubahan.',
    isPublished: true,
    createdAt: '2026-09-01'
  },
  {
    id: 'mat-5',
    topicId: 'topik-4',
    title: 'Template & Panduan Action Plan Canvas Kepemimpinan',
    category: 'tugas',
    mode: 'Asinkronus',
    duration: '70 Menit',
    description: 'Format kanvas 10 komponen perencanaan aksi kepemimpinan sekolah yang terukur dan berorientasi pada warisan berkelanjutan.',
    contentUrl: 'https://drive.google.com/templates/action-plan-canvas-ks.docx',
    textNotes: 'Wajib diisi dan diunduh dalam format PDF sebagai bukti karya tugas akhir pelatihan.',
    isPublished: true,
    createdAt: '2026-09-01'
  }
];

export function loadMeetConfig(): GoogleMeetConfig {
  try {
    const data = localStorage.getItem(PREFIX + 'meet_config');
    return data ? JSON.parse(data) : DEFAULT_MEET_CONFIG;
  } catch {
    return DEFAULT_MEET_CONFIG;
  }
}

export function saveMeetConfig(config: GoogleMeetConfig) {
  localStorage.setItem(PREFIX + 'meet_config', JSON.stringify(config));
  syncMeetConfigToFirestore(config);
}

export function loadCourseMaterials(): CourseMaterial[] {
  try {
    const data = localStorage.getItem(PREFIX + 'materials');
    return data ? JSON.parse(data) : DEFAULT_MATERIALS;
  } catch {
    return DEFAULT_MATERIALS;
  }
}

export function saveCourseMaterials(materials: CourseMaterial[]) {
  localStorage.setItem(PREFIX + 'materials', JSON.stringify(materials));
  syncMaterialsToFirestore(materials);
}

export function saveSingleMaterial(material: CourseMaterial): CourseMaterial[] {
  const current = loadCourseMaterials();
  const exists = current.some((m) => m.id === material.id);
  const updated = exists
    ? current.map((m) => (m.id === material.id ? { ...material, updatedAt: new Date().toISOString() } : m))
    : [{ ...material, createdAt: new Date().toISOString() }, ...current];
  saveCourseMaterials(updated);
  return updated;
}

export function deleteSingleMaterial(materialId: string): CourseMaterial[] {
  const current = loadCourseMaterials();
  const updated = current.filter((m) => m.id !== materialId);
  saveCourseMaterials(updated);
  return updated;
}

export function loadTopicReviews(): ParticipantTopicReviews {
  try {
    const data = localStorage.getItem(PREFIX + 'topic_reviews');
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveTopicReviews(reviews: ParticipantTopicReviews) {
  localStorage.setItem(PREFIX + 'topic_reviews', JSON.stringify(reviews));
  syncTopicReviewsToFirestore(reviews);
}

export function saveSingleTopicReview(
  participantId: string,
  topicId: string,
  review: TopicReviewRecord
): ParticipantTopicReviews {
  const current = loadTopicReviews();
  const participantReviews = current[participantId] || {};
  const updatedParticipantReviews = {
    ...participantReviews,
    [topicId]: {
      ...review,
      reviewedAt: review.reviewedAt || new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    }
  };
  const updated: ParticipantTopicReviews = {
    ...current,
    [participantId]: updatedParticipantReviews
  };
  saveTopicReviews(updated);
  syncParticipantBundleToFirestore(participantId, { reviews: updatedParticipantReviews });
  return updated;
}

export function getParticipantTopicReviews(
  participantId: string
): Record<string, TopicReviewRecord> {
  const all = loadTopicReviews();
  return all[participantId] || all['default'] || {};
}

