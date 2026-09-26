import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  ParticipantUser,
  AdminUser,
  ParticipantFullBundle,
  ForumPost,
  PadletNote,
  CourseMaterial,
  GoogleMeetConfig,
  ParticipantTopicReviews
} from '../types';

const PREFIX = 'lms_kepala_sekolah_';

// Remove undefined values to comply with Firestore requirements
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_, value) => (value === undefined ? null : value)));
}

let isInitialized = false;

/**
 * Sync a participant profile to Firestore
 */
export async function syncParticipantToFirestore(participant: ParticipantUser): Promise<void> {
  if (!participant?.id) return;
  const path = `participants/${participant.id}`;
  try {
    const cleanData = sanitizeForFirestore({
      ...participant,
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'participants', participant.id), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete a participant from Firestore
 */
export async function deleteParticipantFromFirestore(participantId: string): Promise<void> {
  if (!participantId) return;
  const path = `participants/${participantId}`;
  try {
    await deleteDoc(doc(db, 'participants', participantId));
    await deleteDoc(doc(db, 'participant_bundles', participantId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Sync an admin profile to Firestore
 */
export async function syncAdminToFirestore(admin: AdminUser): Promise<void> {
  if (!admin?.id) return;
  const path = `admins/${admin.id}`;
  try {
    const cleanData = sanitizeForFirestore({
      ...admin,
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'admins', admin.id), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Sync participant full bundle (progress, scores, tasks, action plan, reflection, reviews)
 */
export async function syncParticipantBundleToFirestore(
  participantId: string,
  bundleUpdate: Partial<ParticipantFullBundle>
): Promise<void> {
  if (!participantId) return;
  const path = `participant_bundles/${participantId}`;
  try {
    const cleanData = sanitizeForFirestore({
      participantId,
      ...bundleUpdate,
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'participant_bundles', participantId), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Sync all topic reviews to Firestore
 */
export async function syncTopicReviewsToFirestore(reviews: ParticipantTopicReviews): Promise<void> {
  const path = 'system_settings/topic_reviews';
  try {
    await setDoc(doc(db, 'system_settings', 'topic_reviews'), {
      data: sanitizeForFirestore(reviews),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Sync forum posts to Firestore
 */
export async function syncForumPostsToFirestore(posts: ForumPost[]): Promise<void> {
  const path = 'system_settings/forum_posts';
  try {
    await setDoc(doc(db, 'system_settings', 'forum_posts'), {
      items: sanitizeForFirestore(posts),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Sync padlet notes to Firestore
 */
export async function syncPadletNotesToFirestore(notes: PadletNote[]): Promise<void> {
  const path = 'system_settings/padlet_notes';
  try {
    await setDoc(doc(db, 'system_settings', 'padlet_notes'), {
      items: sanitizeForFirestore(notes),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Sync course materials to Firestore
 */
export async function syncMaterialsToFirestore(materials: CourseMaterial[]): Promise<void> {
  const path = 'system_settings/materials';
  try {
    await setDoc(doc(db, 'system_settings', 'materials'), {
      items: sanitizeForFirestore(materials),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Sync Google Meet config to Firestore
 */
export async function syncMeetConfigToFirestore(config: GoogleMeetConfig): Promise<void> {
  const path = 'system_settings/meet_config';
  try {
    await setDoc(doc(db, 'system_settings', 'meet_config'), {
      data: sanitizeForFirestore(config),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Initialize real-time synchronization listeners across participants, bundles, and admin reviews
 */
export function initFirestoreSync(onDataChange?: () => void): () => void {
  if (isInitialized) {
    return () => {};
  }
  isInitialized = true;

  const unsubscribers: (() => void)[] = [];

  try {
    // 1. Listen to Participants in real time
    const unsubParticipants = onSnapshot(
      collection(db, 'participants'),
      (snapshot) => {
        const firestoreParticipants: ParticipantUser[] = [];
        snapshot.forEach((docSnap) => {
          firestoreParticipants.push(docSnap.data() as ParticipantUser);
        });

        if (firestoreParticipants.length > 0) {
          try {
            const localRaw = localStorage.getItem(PREFIX + 'participants');
            const localList: ParticipantUser[] = localRaw ? JSON.parse(localRaw) : [];
            const mergedMap = new Map<string, ParticipantUser>();
            localList.forEach((p) => mergedMap.set(p.id, p));
            firestoreParticipants.forEach((p) => mergedMap.set(p.id, p));
            const merged = Array.from(mergedMap.values());
            localStorage.setItem(PREFIX + 'participants', JSON.stringify(merged));
            window.dispatchEvent(new CustomEvent('participants-synced', { detail: merged }));
            window.dispatchEvent(new Event('storage'));
            onDataChange?.();
          } catch {}
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'participants');
      }
    );
    unsubscribers.push(unsubParticipants);

    // 2. Listen to Participant Bundles in real time
    const unsubBundles = onSnapshot(
      collection(db, 'participant_bundles'),
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          const pId = docSnap.id;
          const bundle = docSnap.data() as Partial<ParticipantFullBundle>;

          try {
            if (bundle.progress) {
              localStorage.setItem(`${PREFIX}p_${pId}_progress`, JSON.stringify(bundle.progress));
            }
            if (bundle.scores) {
              if (bundle.scores.preTestScore !== null && bundle.scores.preTestScore !== undefined) {
                localStorage.setItem(`${PREFIX}p_${pId}_pre_test_score`, String(bundle.scores.preTestScore));
              }
              if (bundle.scores.postTestScore !== null && bundle.scores.postTestScore !== undefined) {
                localStorage.setItem(`${PREFIX}p_${pId}_post_test_score`, String(bundle.scores.postTestScore));
              }
            }
            if (bundle.threePillars) {
              localStorage.setItem(`${PREFIX}p_${pId}_three_pillars`, JSON.stringify(bundle.threePillars));
            }
            if (bundle.mindset) {
              localStorage.setItem(`${PREFIX}p_${pId}_mindset_trans`, JSON.stringify(bundle.mindset));
            }
            if (bundle.actionPlan) {
              localStorage.setItem(`${PREFIX}p_${pId}_action_plan`, JSON.stringify(bundle.actionPlan));
            }
            if (bundle.assignment) {
              localStorage.setItem(`${PREFIX}p_${pId}_assignment_m1`, JSON.stringify(bundle.assignment));
            }
            if (bundle.reflection321) {
              localStorage.setItem(`${PREFIX}p_${pId}_reflection_321`, JSON.stringify(bundle.reflection321));
            }
            if (bundle.reviews) {
              const currentReviewsRaw = localStorage.getItem(PREFIX + 'topic_reviews');
              const allReviews: ParticipantTopicReviews = currentReviewsRaw ? JSON.parse(currentReviewsRaw) : {};
              allReviews[pId] = bundle.reviews;
              localStorage.setItem(PREFIX + 'topic_reviews', JSON.stringify(allReviews));
            }
          } catch {}
        });

        window.dispatchEvent(new CustomEvent('bundle-synced'));
        window.dispatchEvent(new Event('storage'));
        onDataChange?.();
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'participant_bundles');
      }
    );
    unsubscribers.push(unsubBundles);

    // 3. Listen to System Settings (Materials, Meet, Forum, Padlet)
    const unsubSettings = onSnapshot(
      collection(db, 'system_settings'),
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          const settingId = docSnap.id;
          const data = docSnap.data();

          try {
            if (settingId === 'forum_posts' && Array.isArray(data.items)) {
              localStorage.setItem(PREFIX + 'forum_posts', JSON.stringify(data.items));
            } else if (settingId === 'padlet_notes' && Array.isArray(data.items)) {
              localStorage.setItem(PREFIX + 'padlet_notes', JSON.stringify(data.items));
            } else if (settingId === 'materials' && Array.isArray(data.items)) {
              localStorage.setItem(PREFIX + 'materials', JSON.stringify(data.items));
            } else if (settingId === 'meet_config' && data.data) {
              localStorage.setItem(PREFIX + 'meet_config', JSON.stringify(data.data));
            } else if (settingId === 'topic_reviews' && data.data) {
              localStorage.setItem(PREFIX + 'topic_reviews', JSON.stringify(data.data));
            }
          } catch {}
        });

        window.dispatchEvent(new CustomEvent('settings-synced'));
        window.dispatchEvent(new Event('storage'));
        onDataChange?.();
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'system_settings');
      }
    );
    unsubscribers.push(unsubSettings);

  } catch (error) {
    console.warn('[Firestore] Realtime subscription init notice:', error);
  }

  // Initial Sync from LocalStorage to Firestore for existing data
  initialUploadLocalToFirestore();

  return () => {
    unsubscribers.forEach((unsub) => unsub());
    isInitialized = false;
  };
}

/**
 * Push local participants and bundles to Firestore on first run
 */
async function initialUploadLocalToFirestore() {
  try {
    const localParticipantsRaw = localStorage.getItem(PREFIX + 'participants');
    if (localParticipantsRaw) {
      const participants: ParticipantUser[] = JSON.parse(localParticipantsRaw);
      for (const p of participants) {
        if (p?.id) {
          syncParticipantToFirestore(p);
        }
      }
    }

    const reviewsRaw = localStorage.getItem(PREFIX + 'topic_reviews');
    if (reviewsRaw) {
      const reviews: ParticipantTopicReviews = JSON.parse(reviewsRaw);
      if (Object.keys(reviews).length > 0) {
        syncTopicReviewsToFirestore(reviews);
      }
    }
  } catch {}
}
