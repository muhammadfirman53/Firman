import { TopicId, TopicUnlockStatus, TopicReviewRecord } from '../types';
import { TOPIC_TASK_DEFINITIONS, COURSE_TOPICS } from '../data/courseData';

export const TOPIC_ORDER: TopicId[] = ['topik-1', 'topik-2', 'topik-3', 'topik-4', 'topik-5'];

export function getPreviousTopicId(topicId: TopicId): TopicId | null {
  const index = TOPIC_ORDER.indexOf(topicId);
  if (index <= 0) return null;
  return TOPIC_ORDER[index - 1];
}

export function getTopicTasksCount(topicId: TopicId, progressMap: Record<string, boolean>) {
  const tasks = TOPIC_TASK_DEFINITIONS[topicId] || [];
  const completed = tasks.filter((t) => Boolean(progressMap[t.id])).length;
  return {
    tasks,
    completedCount: completed,
    totalCount: tasks.length,
    isCompleted: tasks.length > 0 && completed >= tasks.length
  };
}

export function getTopicUnlockStatus(
  topicId: TopicId,
  progressMap: Record<string, boolean>,
  reviews: Record<string, TopicReviewRecord> = {},
  isAdmin: boolean = false
): TopicUnlockStatus {
  // Non-topic views
  if (topicId === 'overview' || topicId === 'admin-dashboard') {
    return {
      isUnlocked: true,
      isCompleted: true,
      isApproved: true,
      completedTasks: 0,
      totalTasks: 0,
      lockReason: 'none'
    };
  }

  const { completedCount, totalCount, isCompleted } = getTopicTasksCount(topicId, progressMap);
  const currentReview = reviews[topicId];
  const isApproved = Boolean(currentReview?.isApproved);

  // Topik 1 is always unlocked by default as the entry point
  if (topicId === 'topik-1') {
    return {
      isUnlocked: true,
      isCompleted,
      isApproved,
      completedTasks: completedCount,
      totalTasks: totalCount,
      lockReason: 'none',
      review: currentReview
    };
  }

  // Admin has full bypass to view and review any topic
  if (isAdmin) {
    return {
      isUnlocked: true,
      isCompleted,
      isApproved,
      completedTasks: completedCount,
      totalTasks: totalCount,
      lockReason: 'none',
      review: currentReview
    };
  }

  // For participant: evaluate previous topic
  const prevTopicId = getPreviousTopicId(topicId);
  if (!prevTopicId) {
    return {
      isUnlocked: true,
      isCompleted,
      isApproved,
      completedTasks: completedCount,
      totalTasks: totalCount,
      lockReason: 'none',
      review: currentReview
    };
  }

  const prevMeta = COURSE_TOPICS.find((t) => t.id === prevTopicId);
  const prevStats = getTopicTasksCount(prevTopicId, progressMap);
  const prevReview = reviews[prevTopicId];
  const hasValidScore = typeof prevReview?.score === 'number' && !isNaN(prevReview.score) && prevReview.score >= 0;
  const isPrevApproved = Boolean(prevReview?.isApproved && hasValidScore);

  if (!prevStats.isCompleted) {
    return {
      isUnlocked: false,
      isCompleted,
      isApproved,
      completedTasks: completedCount,
      totalTasks: totalCount,
      lockReason: 'pending_previous_tasks',
      previousTopicNumber: prevMeta?.number || 1,
      previousTopicTitle: prevMeta?.title || 'Topik Sebelumnya',
      review: currentReview
    };
  }

  if (!isPrevApproved) {
    return {
      isUnlocked: false,
      isCompleted,
      isApproved,
      completedTasks: completedCount,
      totalTasks: totalCount,
      lockReason: 'pending_previous_approval',
      previousTopicNumber: prevMeta?.number || 1,
      previousTopicTitle: prevMeta?.title || 'Topik Sebelumnya',
      review: currentReview
    };
  }

  // Both completed and approved by admin
  return {
    isUnlocked: true,
    isCompleted,
    isApproved,
    completedTasks: completedCount,
    totalTasks: totalCount,
    lockReason: 'none',
    review: currentReview
  };
}

export function getAllTopicsUnlockStatus(
  progressMap: Record<string, boolean>,
  reviews: Record<string, TopicReviewRecord> = {},
  isAdmin: boolean = false
): Record<TopicId, TopicUnlockStatus> {
  const result = {} as Record<TopicId, TopicUnlockStatus>;
  const allIds: TopicId[] = ['overview', 'topik-1', 'topik-2', 'topik-3', 'topik-4', 'topik-5', 'admin-dashboard'];
  
  allIds.forEach((id) => {
    result[id] = getTopicUnlockStatus(id, progressMap, reviews, isAdmin);
  });

  return result;
}

export interface TopicCompletionItem {
  id: TopicId;
  number: number;
  title: string;
  isCompleted: boolean;
  isApproved?: boolean;
  completedTasks: number;
  totalTasks: number;
}

export interface CertificateEligibilityResult {
  isEligible: boolean;
  allTopicsCompleted: boolean;
  completedTopicsCount: number;
  totalTopicsCount: number;
  topicStatuses: TopicCompletionItem[];
  missingTopics: TopicCompletionItem[];
  isTopic5Approved: boolean;
  topic5Review?: TopicReviewRecord;
  awaitingTopic5Review: boolean;
  lockReason: 'none' | 'missing_topics' | 'awaiting_topic5_approval';
}

export function checkCertificateEligibility(
  progressMap: Record<string, boolean>,
  reviews?: Record<string, TopicReviewRecord>
): CertificateEligibilityResult {
  const topicStatuses: TopicCompletionItem[] = COURSE_TOPICS.map((topic) => {
    const stats = getTopicTasksCount(topic.id, progressMap);
    const review = reviews ? reviews[topic.id] : undefined;
    return {
      id: topic.id,
      number: topic.number,
      title: topic.title,
      isCompleted: stats.isCompleted,
      isApproved: review?.isApproved ?? false,
      completedTasks: stats.completedCount,
      totalTasks: stats.totalCount
    };
  });

  const missingTopics = topicStatuses.filter((s) => !s.isCompleted);
  const completedTopicsCount = topicStatuses.filter((s) => s.isCompleted).length;
  const allTopicsCompleted = completedTopicsCount === COURSE_TOPICS.length;

  const topic5Review = reviews ? reviews['topik-5'] : undefined;
  const isTopic5Approved = Boolean(topic5Review?.isApproved);

  // Requirement: E-Sertifikat KELUAR SETELAH ADMIN SELESAI MENGOREKSI TUGAS AKHIR PADA TOPIK 5
  // Peserta harus menuntaskan seluruh 5 topik DAN admin/fasilitator telah menyetujui & mengoreksi tugas akhir topik 5.
  const isEligible = allTopicsCompleted && isTopic5Approved;
  const awaitingTopic5Review = allTopicsCompleted && !isTopic5Approved;

  let lockReason: 'none' | 'missing_topics' | 'awaiting_topic5_approval' = 'none';
  if (!allTopicsCompleted) {
    lockReason = 'missing_topics';
  } else if (!isTopic5Approved) {
    lockReason = 'awaiting_topic5_approval';
  }

  return {
    isEligible,
    allTopicsCompleted,
    completedTopicsCount,
    totalTopicsCount: COURSE_TOPICS.length,
    topicStatuses,
    missingTopics,
    isTopic5Approved,
    topic5Review,
    awaitingTopic5Review,
    lockReason
  };
}
