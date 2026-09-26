import React from 'react';
import { TopicId, TopicUnlockStatus } from '../types';
import { COURSE_TOPICS, TOPIC_TASK_DEFINITIONS } from '../data/courseData';
import { getPreviousTopicId } from '../utils/topicProgression';
import {
  Lock,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Home,
  ShieldAlert,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface LockedTopicNoticeProps {
  topicId: TopicId;
  unlockStatus: TopicUnlockStatus;
  progressMap: Record<string, boolean>;
  onSelectTopic: (topicId: TopicId) => void;
}

export const LockedTopicNotice: React.FC<LockedTopicNoticeProps> = ({
  topicId,
  unlockStatus,
  progressMap,
  onSelectTopic,
}) => {
  const currentTopicMeta = COURSE_TOPICS.find((t) => t.id === topicId);
  const prevTopicId = getPreviousTopicId(topicId);
  const prevTopicMeta = prevTopicId ? COURSE_TOPICS.find((t) => t.id === prevTopicId) : null;
  const prevTasks = prevTopicId ? TOPIC_TASK_DEFINITIONS[prevTopicId] || [] : [];

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-0 space-y-6">
      
      {/* Top Banner Warning */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-white rounded-3xl border-2 border-amber-300/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-3 py-0.5 rounded-full border border-amber-200">
              Akses Topik Masih Terkunci
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {currentTopicMeta ? `Topik ${currentTopicMeta.number}: ${currentTopicMeta.title}` : 'Modul Terkunci'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sesuai aturan kurikulum pelatihan, peserta diwajibkan menyelesaikan setiap tahapan secara berurutan dan memperoleh koreksi/persetujuan Fasilitator pada topik sebelumnya sebelum dapat melanjutkan.
            </p>
          </div>
        </div>

        {/* Condition Branch: Pending Tasks vs Pending Admin Approval */}
        {unlockStatus.lockReason === 'pending_previous_tasks' ? (
          <div className="bg-white rounded-2xl border border-amber-200 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                Syarat Pembuka: Selesaikan Seluruh Tahapan di Topik {prevTopicMeta?.number || 1}
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Anda belum menuntaskan semua tahapan aktivitas pada{' '}
              <strong>Topik {prevTopicMeta?.number}: {prevTopicMeta?.title}</strong>. Berikut adalah daftar ceklis pemenuhan tahapan Anda:
            </p>

            {/* Checklist of previous topic tasks */}
            <div className="space-y-2 pt-1">
              {prevTasks.map((task) => {
                const isDone = Boolean(progressMap[task.id]);
                return (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs transition-colors ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                          •
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold">{task.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          isDone ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isDone ? 'Selesai' : 'Belum Selesai'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{task.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {prevTopicId && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => onSelectTopic(prevTopicId)}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  <span>Buka Topik {prevTopicMeta?.number} & Selesaikan Tahapan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Condition 2: All tasks finished, waiting for admin review & approval */
          <div className="bg-white rounded-2xl border border-indigo-200 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2.5 text-indigo-900 font-bold text-sm">
              <Clock className="w-5 h-5 text-indigo-600 shrink-0 animate-pulse" />
              <span>
                Tahapan Selesai! Menunggu Koreksi & Persetujuan Fasilitator
              </span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Seluruh tahapan di Topik {prevTopicMeta?.number} ({prevTopicMeta?.title}) telah Anda kirimkan dengan lengkap.</span>
              </div>
              <p className="text-emerald-700 pl-6 text-[11px]">
                Fasilitator (Muhamad Firman, S.Pd) sedang memeriksa hasil kerja Anda. Setelah fasilitator memberikan koreksi dan tanda persetujuan pada Dasbor Fasilitator, modul Topik {currentTopicMeta?.number} ini akan otomatis terbuka.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Apa yang dapat dilakukan sembari menunggu?
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                <li>Memeriksa kembali isian dan tanggapan di forum diskusi rekan sejawat</li>
                <li>Membaca materi pengayaan dan bahan ajar yang disiapkan fasilitator</li>
                <li>Menghubungi fasilitator di grup WhatsApp pelatihan bila memerlukan percepatan koreksi</li>
              </ul>
            </div>

            {prevTopicId && (
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectTopic('overview')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Kembali ke Beranda Kursus</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTopic(prevTopicId)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Lihat Riwayat Tugas Topik {prevTopicMeta?.number}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
