export interface ParticipantProfile {
  id: string;
  name: string;
  nip: string;
  schoolName: string;
  district: string;
  photoUrl?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'kepemimpinan' | 'mindset';
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  selectedAnswers: Record<number, number>;
  completedAt?: string;
}

export interface ForumPost {
  id: string;
  authorName: string;
  schoolName: string;
  role: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: {
    id: string;
    authorName: string;
    schoolName: string;
    content: string;
    timestamp: string;
  }[];
}

export interface MentimeterVote {
  id: string;
  label: string;
  votes: number;
  description: string;
}

export interface PadletNote {
  id: string;
  authorName: string;
  schoolName: string;
  color: string;
  content: string;
  subContent?: string;
  likes: number;
  timestamp: string;
}

export interface ThreePillarsRow {
  pilar: 'Nilai Pribadi' | 'Budaya Sekolah' | 'Pemberdayaan';
  kondisiSaatIni: string;
  kondisiDiinginkan: string;
  tindakan: string;
}

export interface MindsetTransformationRow {
  id: string;
  pikiranTetap: string;
  sayaUbahMenjadi: string;
  aksiNyata: string;
}

export interface ActionPlanData {
  masalahPrioritas: string;
  warisanKepemimpinan: string;
  nilaiPribadi: string;
  budaya: string;
  pemberdayaan: string;
  fixedMindset: string;
  growthMindset: string;
  aksi: string;
  indikator: string;
  waktu: string;
  dukungan: string;
}

export interface Reflection321Data {
  tigaHalPenting: [string, string, string];
  duaPertanyaan: [string, string];
  satuTindakan: string;
}

export interface Modul1AssignmentData {
  warisanInginDibangun: string;
  nilaiPribadiPondasi: string;
  budayaSekolah: string;
  caraMemberdayakanGuru: string;
  satuTindakanAwal: string;
  submittedAt?: string;
  peerFeedback?: {
    reviewerName: string;
    reviewerSchool: string;
    feedback: string;
    inclusivityCheck: boolean;
  }[];
}

export type UserRole = 'peserta' | 'admin';

export interface AdminUser {
  id: string;
  name: string;
  facilitatorId: string;
  email: string;
  institution?: string;
  role: 'admin';
  registeredAt: string;
  password?: string;
}

export interface ParticipantUser extends ParticipantProfile {
  role: 'peserta';
  email?: string;
  registeredAt: string;
}

export interface AuthSession {
  role: UserRole;
  user: AdminUser | ParticipantUser;
}

export type TopicId = 'overview' | 'topik-1' | 'topik-2' | 'topik-3' | 'topik-4' | 'topik-5' | 'admin-dashboard';

export interface CourseTopicMeta {
  id: TopicId;
  number: number;
  title: string;
  subtitle: string;
  duration: string;
  mode: 'Sinkronus' | 'Asinkronus' | 'Blended';
  steps: string[];
}

export type MaterialCategory = 'video' | 'slide' | 'pdf' | 'artikel' | 'tugas' | 'link';

export interface CourseMaterial {
  id: string;
  topicId: TopicId;
  title: string;
  category: MaterialCategory;
  mode: 'Sinkronus' | 'Asinkronus' | 'Blended';
  duration: string;
  description: string;
  contentUrl?: string;
  textNotes?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface GoogleMeetConfig {
  meetUrl: string;
  sessionTitle: string;
  scheduleTime: string;
  meetCode?: string;
  passcode?: string;
  instructions: string;
  isActive: boolean;
  updatedAt?: string;
}

export interface TopicReviewRecord {
  isApproved: boolean;
  score?: number;
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type ParticipantTopicReviews = Record<string, Record<string, TopicReviewRecord>>;

export interface TopicUnlockStatus {
  isUnlocked: boolean;
  isCompleted: boolean;
  isApproved: boolean;
  completedTasks: number;
  totalTasks: number;
  lockReason?: 'pending_previous_tasks' | 'pending_previous_approval' | 'none';
  previousTopicNumber?: number;
  previousTopicTitle?: string;
  review?: TopicReviewRecord;
}

export interface ParticipantFullBundle {
  participantId: string;
  progress: Record<string, boolean>;
  scores: { preTestScore: number | null; postTestScore: number | null };
  threePillars: ThreePillarsRow[];
  mindset: MindsetTransformationRow[];
  actionPlan: ActionPlanData;
  assignment: Modul1AssignmentData;
  reflection321: Reflection321Data;
  reviews: Record<string, TopicReviewRecord>;
}

