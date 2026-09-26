import React from 'react';
import { TRAINING_INFO, LEARNING_OBJECTIVES, COURSE_TOPICS } from '../data/courseData';
import { TopicId, ParticipantProfile, GoogleMeetConfig, CourseMaterial, TopicUnlockStatus } from '../types';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  GraduationCap,
  Sparkles,
  Target,
  User,
  Users,
  Video,
  ExternalLink,
  Presentation,
  FileText,
  ClipboardList,
  Link,
  Lock,
  Check,
  AlertCircle
} from 'lucide-react';

interface CourseOverviewProps {
  profile: ParticipantProfile;
  meetConfig?: GoogleMeetConfig;
  materials?: CourseMaterial[];
  onSelectTopic: (topicId: TopicId) => void;
  onOpenSchedule: () => void;
  progressPercent: number;
  completedTasksCount: number;
  totalTasksCount: number;
  unlockStatusMap?: Record<TopicId, TopicUnlockStatus>;
}

export const CourseOverview: React.FC<CourseOverviewProps> = ({
  profile,
  meetConfig,
  materials = [],
  onSelectTopic,
  onOpenSchedule,
  progressPercent,
  completedTasksCount,
  totalTasksCount,
  unlockStatusMap = {} as Record<TopicId, TopicUnlockStatus>,
}) => {
  const publishedMaterials = materials.filter((m) => m.isPublished);
  return (
    <div className="space-y-8">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white p-6 sm:p-10 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              Pelatihan Pengembangan Profesional Kepala Sekolah
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              {TRAINING_INFO.duration}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-serif leading-tight">
            {TRAINING_INFO.theme}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed max-w-3xl">
            Selamat datang, <strong>{profile.name}</strong> ({profile.schoolName}). 
            Aplikasi pembelajaran Moodle Blended Learning ini dirancang untuk mendampingi Anda mentransformasi kepemimpinan sekolah berlandaskan nilai luhur, membangun budaya yang lestari, dan memimpin perubahan dengan pola pikir bertumbuh.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Fasilitator: <strong>{TRAINING_INFO.facilitator}</strong> ({TRAINING_INFO.facilitatorId})</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Model: <strong>Experiential Learning + PBL + Action Planning</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Moda: <strong>{TRAINING_INFO.approach}</strong></span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onSelectTopic('topik-1')}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              Mulai Pembelajaran Topik 1
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSchedule}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-indigo-300" />
              Lihat Rincian Jadwal 7 Jam
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Quick Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Capaian Pelatihan</span>
            <span className="font-bold text-indigo-700 text-sm">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {completedTasksCount} dari {totalTasksCount} aktivitas dan penugasan telah diselesaikan
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-indigo-700 block">Sesi Sinkronus</span>
            <h4 className="text-sm font-bold text-slate-800">Google Meet Interaktif</h4>
            <p className="text-[11px] text-slate-500">Relate, Studi Kasus PBL, dan Diskusi Pleno</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-emerald-700 block">Sesi Asinkronus</span>
            <h4 className="text-sm font-bold text-slate-800">Moodle LMS Mandiri</h4>
            <p className="text-[11px] text-slate-500">Pre/Post-test, Forum, Canvas, dan Refleksi 3-2-1</p>
          </div>
        </div>
      </div>

      {/* Live Google Meet Banner if Active */}
      {meetConfig?.meetUrl && meetConfig?.isActive && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-7 text-white border border-indigo-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                Ruang Tatap Maya Sinkronus Aktif
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {meetConfig.sessionTitle || 'Sesi Tatap Maya Google Meet Pelatihan Kepala Sekolah'}
            </h3>
            <p className="text-xs text-slate-300">
              Jadwal: <strong className="text-amber-300">{meetConfig.scheduleTime || '08.00 - 15.30 WIB'}</strong> • Kode Rapat: <code className="text-indigo-200">{meetConfig.meetCode || 'meet'}</code>
            </p>
            {meetConfig.instructions && (
              <p className="text-[11px] text-slate-300 max-w-xl leading-relaxed mt-1">
                {meetConfig.instructions}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={meetConfig.meetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all hover:scale-102"
            >
              <Video className="w-4 h-4" />
              <span>Gabung Google Meet Sekarang</span>
            </a>
            <button
              onClick={onOpenSchedule}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-colors"
            >
              Jadwal Sesi
            </button>
          </div>
        </div>
      )}

      {/* 9 Learning Objectives Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">A. Tujuan Pelatihan Kepala Sekolah</h3>
            <p className="text-xs text-slate-500">9 Kompetensi Inti yang Dicapai Setelah Mengikuti Program Ini</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
          {LEARNING_OBJECTIVES.map((obj, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="leading-snug">{obj}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Course Topics (Moodle Structure) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              C. Struktur Kursus Moodle (5 Topik Utama)
            </h3>
            <p className="text-xs text-slate-500">
              Pilih modul pembelajaran di bawah ini untuk memulai atau melanjutkan proses belajar:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COURSE_TOPICS.map((topic) => {
            const status = unlockStatusMap[topic.id];
            const isLocked = Boolean(status && !status.isUnlocked);
            const isApproved = Boolean(status?.isApproved);
            const isCompleted = Boolean(status?.isCompleted);

            return (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isLocked
                    ? 'bg-slate-50/80 border-slate-200 hover:border-amber-300 hover:bg-white'
                    : isApproved
                    ? 'bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-md'
                    : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center border ${
                      isLocked
                        ? 'bg-slate-100 text-slate-500 border-slate-200'
                        : isApproved
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }`}>
                      {isLocked ? <Lock className="w-3.5 h-3.5" /> : `T${topic.number}`}
                    </span>

                    {isLocked ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Terkunci
                      </span>
                    ) : isApproved ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Disetujui Admin {status?.review?.score !== undefined ? `(${status.review.score})` : ''}
                      </span>
                    ) : isCompleted ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Menunggu Koreksi
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {status ? `${status.completedTasks}/${status.totalTasks} Tahap` : topic.duration}
                      </span>
                    )}
                  </div>

                  <h4 className={`font-bold text-sm transition-colors ${
                    isLocked ? 'text-slate-700' : 'text-slate-900 group-hover:text-indigo-600'
                  }`}>
                    {topic.title}
                  </h4>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {topic.subtitle}
                  </p>

                  {/* Feedback preview if available */}
                  {status?.review?.feedback && (
                    <div className="bg-emerald-50/60 rounded-xl p-2 border border-emerald-100 text-[11px] text-emerald-900 line-clamp-2">
                      <span className="font-bold block">Ulasan Fasilitator:</span>
                      "{status.review.feedback}"
                    </div>
                  )}

                  {/* Lock Notice or Steps */}
                  {isLocked ? (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-900 leading-tight">
                        <span className="font-semibold block">Syarat Terbuka:</span>
                        {status.lockReason === 'pending_previous_tasks'
                          ? `Tuntaskan semua tahapan di Topik ${status.previousTopicNumber || 1} dahulu.`
                          : `Menunggu koreksi & persetujuan Fasilitator untuk Topik ${status.previousTopicNumber || 1}.`}
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      {topic.steps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                          <span className="truncate">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold group-hover:translate-x-1 transition-transform ${
                  isLocked ? 'text-amber-700' : isApproved ? 'text-emerald-700' : 'text-indigo-600'
                }`}>
                  <span>
                    {isLocked
                      ? 'Lihat Syarat Pembuka'
                      : isApproved
                      ? 'Buka Kembali Modul'
                      : isCompleted
                      ? 'Buka Modul (Menunggu Koreksi)'
                      : 'Buka Modul'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Section C: Bahan Ajar & Materi Pembelajaran Terbitan Fasilitator */}
      {publishedMaterials.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">C. Bahan Bacaan & Materi Terbitan Fasilitator</h3>
                <p className="text-xs text-slate-500">Materi pengayaan, slide presentasi, dokumen kasus, dan video panduan yang disiapkan fasilitator</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              {publishedMaterials.length} Materi Tersedia
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {publishedMaterials.map((mat) => (
              <div
                key={mat.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      {mat.category}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {mat.duration}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs leading-snug">
                    {mat.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectTopic(mat.topicId)}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Buka Modul</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  {mat.contentUrl && (
                    <a
                      href={mat.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Akses</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
