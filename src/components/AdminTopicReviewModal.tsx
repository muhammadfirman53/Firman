import React, { useState, useEffect } from 'react';
import {
  ParticipantUser,
  TopicId,
  TopicReviewRecord,
  Modul1AssignmentData,
  ThreePillarsRow,
  MindsetTransformationRow,
  ActionPlanData,
  Reflection321Data
} from '../types';
import { COURSE_TOPICS, TOPIC_TASK_DEFINITIONS } from '../data/courseData';
import { getTopicTasksCount } from '../utils/topicProgression';
import {
  loadParticipantFullBundle,
  saveParticipantFullBundle,
  toggleParticipantTask,
  completeAllTopicTasks,
  ParticipantFullBundle
} from '../utils/storage';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  BookOpen,
  Send,
  Sparkles,
  ShieldCheck,
  Check,
  ChevronRight,
  User,
  Unlock,
  Lock,
  Edit3,
  Save,
  Eye,
  RotateCcw,
  Sliders,
  FileText,
  Target,
  BrainCircuit,
  Compass,
  CheckSquare,
  Square
} from 'lucide-react';

interface AdminTopicReviewModalProps {
  participant: ParticipantUser;
  isOpen: boolean;
  onClose: () => void;
  topicReviews: Record<string, TopicReviewRecord>;
  progressMap?: Record<string, boolean>;
  onSaveReview: (participantId: string, topicId: string, review: TopicReviewRecord) => void;
  onBatchApproveAll: (participantId: string) => void;
  onToggleTask?: (participantId: string, taskId: string, isCompleted: boolean) => void;
  onCompleteAllTopicTasks?: (participantId: string, topicId: TopicId) => void;
  onOpenParticipantDirectView?: (participant: ParticipantUser, topicId: TopicId) => void;
  onRefreshParent?: () => void;
}

export const AdminTopicReviewModal: React.FC<AdminTopicReviewModalProps> = ({
  participant,
  isOpen,
  onClose,
  topicReviews,
  progressMap: initialProgressMap,
  onSaveReview,
  onBatchApproveAll,
  onToggleTask,
  onCompleteAllTopicTasks,
  onOpenParticipantDirectView,
  onRefreshParent,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId>('topik-1');
  const [scoreInput, setScoreInput] = useState<string>('');
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Participant full data bundle (live state for viewing & editing)
  const [bundle, setBundle] = useState<ParticipantFullBundle>(() =>
    loadParticipantFullBundle(participant.id)
  );

  // Edit Mode state for participant task submissions
  const [isEditingSubmission, setIsEditingSubmission] = useState<boolean>(false);
  const [editableAssignment, setEditableAssignment] = useState<Modul1AssignmentData>(bundle.assignment);
  const [editableThreePillars, setEditableThreePillars] = useState<ThreePillarsRow[]>(bundle.threePillars);
  const [editableMindset, setEditableMindset] = useState<MindsetTransformationRow[]>(bundle.mindset);
  const [editableActionPlan, setEditableActionPlan] = useState<ActionPlanData>(bundle.actionPlan);
  const [editableReflection, setEditableReflection] = useState<Reflection321Data>(bundle.reflection321);
  const [preScoreDraft, setPreScoreDraft] = useState<string>(
    bundle.scores.preTestScore !== null ? String(bundle.scores.preTestScore) : ''
  );
  const [postScoreDraft, setPostScoreDraft] = useState<string>(
    bundle.scores.postTestScore !== null ? String(bundle.scores.postTestScore) : ''
  );

  // Reload bundle when participant changes or modal opens
  useEffect(() => {
    if (isOpen) {
      const refreshBundle = () => {
        const fresh = loadParticipantFullBundle(participant.id);
        setBundle(fresh);
        setEditableAssignment(fresh.assignment);
        setEditableThreePillars(fresh.threePillars);
        setEditableMindset(fresh.mindset);
        setEditableActionPlan(fresh.actionPlan);
        setEditableReflection(fresh.reflection321);
        setPreScoreDraft(fresh.scores.preTestScore !== null ? String(fresh.scores.preTestScore) : '');
        setPostScoreDraft(fresh.scores.postTestScore !== null ? String(fresh.scores.postTestScore) : '');

        const currentRev = topicReviews[selectedTopicId] || fresh.reviews[selectedTopicId];
        setScoreInput(currentRev?.score !== undefined ? String(currentRev.score) : '');
        setFeedbackInput(currentRev?.feedback || '');
      };

      refreshBundle();

      window.addEventListener('storage', refreshBundle);
      window.addEventListener('bundle-synced', refreshBundle);
      return () => {
        window.removeEventListener('storage', refreshBundle);
        window.removeEventListener('bundle-synced', refreshBundle);
      };
    }
  }, [participant.id, isOpen, selectedTopicId]);

  // Handle topic tab switches
  const handleSelectTopic = (tid: TopicId) => {
    setSelectedTopicId(tid);
    const fresh = loadParticipantFullBundle(participant.id);
    setBundle(fresh);
    const rev = topicReviews[tid] || fresh.reviews[tid];
    setScoreInput(rev?.score !== undefined ? String(rev.score) : '');
    setFeedbackInput(rev?.feedback || '');
    setIsEditingSubmission(false);
  };

  if (!isOpen) return null;

  const currentTopicMeta = COURSE_TOPICS.find((t) => t.id === selectedTopicId);
  const currentProgress = bundle.progress;
  const tasksInfo = getTopicTasksCount(selectedTopicId, currentProgress);
  const existingReview = topicReviews[selectedTopicId] || bundle.reviews[selectedTopicId];

  // Quick feedback presets
  const FEEDBACK_PRESETS = [
    'Refleksi sangat tajam, relevan dengan konteks sekolah, dan komitmen aksi nyata terukur.',
    'Pengerjaan modul sangat baik, lanjutkan penyusunan rencana aksi di modul berikutnya.',
    'Telah memenuhi kriteria kelulusan topik dengan catatan perlu memperkuat keterlibatan rekan guru.',
    'Analisis studi kasus sudah komprehensif, implementasikan indikator capaian secara bertahap.'
  ];

  // Toggle individual task
  const handleToggleSingleTask = (taskId: string, currentStatus: boolean) => {
    const updated = toggleParticipantTask(participant.id, taskId, !currentStatus);
    setBundle((prev) => ({ ...prev, progress: updated }));
    if (onToggleTask) {
      onToggleTask(participant.id, taskId, !currentStatus);
    }
    if (onRefreshParent) {
      onRefreshParent();
    }
  };

  // Complete all tasks in this topic
  const handleCompleteAllInTopic = () => {
    const updated = completeAllTopicTasks(participant.id, selectedTopicId);
    setBundle((prev) => ({ ...prev, progress: updated }));
    if (onCompleteAllTopicTasks) {
      onCompleteAllTopicTasks(participant.id, selectedTopicId);
    }
    if (onRefreshParent) {
      onRefreshParent();
    }
    setSaveMessage(`Semua tugas ${currentTopicMeta?.title} berhasil dituntaskan!`);
    setTimeout(() => setSaveMessage(''), 2500);
  };

  // Save Review (Grade and Approve/Unlock)
  const handleSaveCurrentReview = (approved: boolean) => {
    if (approved) {
      if (scoreInput.trim() === '' || isNaN(Number(scoreInput)) || Number(scoreInput) < 0 || Number(scoreInput) > 100) {
        setSaveMessage('⚠️ Harap masukkan Nilai Topik (0 - 100) sebelum menyetujui agar modul berikutnya dapat dibuka!');
        setTimeout(() => setSaveMessage(''), 4000);
        return;
      }
    }

    const numScore = scoreInput.trim() !== '' ? Number(scoreInput) : undefined;
    const rev: TopicReviewRecord = {
      isApproved: approved,
      score: numScore,
      feedback: feedbackInput.trim() || (approved ? 'Tugas dan tahapan telah diperiksa dengan hasil memuaskan.' : ''),
      reviewedBy: 'Muhamad Firman, S.Pd (Fasilitator)',
      reviewedAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    };

    onSaveReview(participant.id, selectedTopicId, rev);
    setBundle((prev) => ({
      ...prev,
      reviews: { ...prev.reviews, [selectedTopicId]: rev }
    }));
    setJustSaved(true);
    const isTopic5 = selectedTopicId === 'topik-5';
    const msg = approved
      ? (isTopic5
          ? `Tugas akhir Topik 5 berhasil dikoreksi dan dinilai (${numScore}). E-Sertifikat resmi peserta telah berhasil diterbitkan!`
          : `Topik berhasil dikoreksi, diberi nilai (${numScore}), dan modul berikutnya terbuka!`)
      : (isTopic5
          ? 'Persetujuan tugas akhir dibatalkan. E-Sertifikat peserta dikunci kembali.'
          : 'Status persetujuan diperbarui.');
    setSaveMessage(msg);
    setTimeout(() => {
      setJustSaved(false);
      setSaveMessage('');
    }, 3500);
    if (onRefreshParent) {
      onRefreshParent();
    }
  };

  // Save Participant Submissions Edits
  const handleSaveParticipantSubmissions = () => {
    const preNum = preScoreDraft.trim() !== '' ? Number(preScoreDraft) : null;
    const postNum = postScoreDraft.trim() !== '' ? Number(postScoreDraft) : null;

    saveParticipantFullBundle(participant.id, {
      assignment: editableAssignment,
      threePillars: editableThreePillars,
      mindset: editableMindset,
      actionPlan: editableActionPlan,
      reflection321: editableReflection,
      scores: {
        preTestScore: preNum,
        postTestScore: postNum
      }
    });

    setBundle((prev) => ({
      ...prev,
      assignment: editableAssignment,
      threePillars: editableThreePillars,
      mindset: editableMindset,
      actionPlan: editableActionPlan,
      reflection321: editableReflection,
      scores: {
        preTestScore: preNum,
        postTestScore: postNum
      }
    }));

    setIsEditingSubmission(false);
    setSaveMessage('Koreksi tugas peserta berhasil disimpan ke akun peserta!');
    setTimeout(() => setSaveMessage(''), 3000);
    if (onRefreshParent) {
      onRefreshParent();
    }
  };

  // Direct participant mode impersonation
  const handleLaunchParticipantView = () => {
    onClose();
    if (onOpenParticipantDirectView) {
      onOpenParticipantDirectView(participant, selectedTopicId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Pusat Koreksi, Nilai & Pembukaan Topik Peserta
                </h3>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  Fasilitator
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Akun: <strong className="text-white">{participant.name}</strong> • {participant.schoolName} ({participant.district})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Participant Impersonation Button */}
            {onOpenParticipantDirectView && (
              <button
                type="button"
                onClick={handleLaunchParticipantView}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                title="Buka dan kelola akun peserta ini di tampilan antarmuka peserta secara langsung"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-200" />
                <span className="hidden sm:inline">Kelola di Tampilan Peserta</span>
                <span className="sm:hidden">Mode Peserta</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Notification banner */}
        {saveMessage && (
          <div className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 flex items-center justify-between animate-in fade-in duration-150">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              {saveMessage}
            </span>
          </div>
        )}

        {/* Modal Body with 2-Column Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          
          {/* Left Column: Topic List Selector (4 cols) */}
          <div className="md:col-span-4 p-4 bg-slate-50/70 space-y-2.5 overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                5 Topik Pembelajaran
              </span>
              <button
                type="button"
                onClick={() => {
                  onBatchApproveAll(participant.id);
                  setSaveMessage('Seluruh 5 Topik berhasil disetujui & dibuka untuk peserta ini!');
                  setTimeout(() => setSaveMessage(''), 3000);
                  if (onRefreshParent) onRefreshParent();
                }}
                className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-lg border border-indigo-200 transition-colors"
                title="Buka akses semua topik secara instan untuk peserta ini"
              >
                ⚡ Buka Semua Topik
              </button>
            </div>

            {COURSE_TOPICS.map((topic) => {
              const isSelected = selectedTopicId === topic.id;
              const stats = getTopicTasksCount(topic.id, bundle.progress);
              const rev = topicReviews[topic.id] || bundle.reviews[topic.id];
              const isAppr = Boolean(rev?.isApproved);

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleSelectTopic(topic.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-xs ring-2 ring-indigo-500/20'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isAppr ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : stats.isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                        <Clock className="w-3 h-3" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs">
                        {topic.number}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 text-xs truncate">
                        Topik {topic.number}
                      </span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                        isAppr
                          ? 'bg-emerald-100 text-emerald-800'
                          : stats.isCompleted
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isAppr ? 'Disetujui' : stats.isCompleted ? 'Siap Koreksi' : `${stats.completedCount}/${stats.totalCount}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">{topic.title}</p>
                    {rev?.score !== undefined && (
                      <span className="text-[10px] font-bold text-indigo-700 mt-1 block">
                        Nilai Topik: {rev.score}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Impersonation quick guide */}
            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
              <span className="font-bold block flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" /> Kontrol Penuh Fasilitator:
              </span>
              <p className="text-slate-600 leading-relaxed text-[10px]">
                Anda dapat mencentang aktivitas, mengoreksi isian formulir tugas peserta, memberikan nilai topik, membuka topik baru, ataupun mengelola langsung akun peserta ini.
              </p>
            </div>
          </div>

          {/* Right Column: Review, Task Correction & Grading Detail (8 cols) */}
          <div className="md:col-span-8 p-4 sm:p-6 space-y-5 overflow-y-auto">
            {currentTopicMeta && (
              <>
                {/* Topic Header & Status */}
                <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      Evaluasi & Koreksi Penugasan Peserta
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      Topik {currentTopicMeta.number}: {currentTopicMeta.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Mode: {currentTopicMeta.mode} • Durasi: {currentTopicMeta.duration}
                    </p>
                  </div>
                  
                  {existingReview?.isApproved ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Telah Disetujui (Akses Terbuka)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Belum Disetujui
                    </span>
                  )}
                </div>

                {/* SECTION 1: TASK CHECKLIST & UNLOCK CONTROLS */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">
                        Daftar Tahapan Tugas Topik {currentTopicMeta.number} ({tasksInfo.completedCount}/{tasksInfo.totalCount} Tuntas)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Klik tombol di kanan setiap tugas untuk mencentang selesai atas nama peserta.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCompleteAllInTopic}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Tuntaskan Semua Tugas Topik Ini</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {tasksInfo.tasks.map((task) => {
                      const isDone = Boolean(bundle.progress[task.id]);
                      return (
                        <div
                          key={task.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                            isDone
                              ? 'bg-white border-emerald-200 text-slate-800'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            <div>
                              <span className="font-bold block text-slate-800">{task.name}</span>
                              <span className="text-[10px] text-slate-500">{task.stageName}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleSingleTask(task.id, isDone)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                              isDone
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                            }`}
                          >
                            {isDone ? (
                              <>
                                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Selesai (Klik Batalkan)</span>
                              </>
                            ) : (
                              <>
                                <Square className="w-3.5 h-3.5 text-slate-400" />
                                <span>Tandai Selesai</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 2: LIVE SUBMISSION CORRECTION (Koreksi Tugas Peserta) */}
                <div className="bg-white rounded-2xl border-2 border-indigo-100 p-4 sm:p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <div>
                        <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                          Lembar Hasil Pengerjaan Tugas Peserta
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          Periksa isian penugasan peserta dan edit langsung jika diperlukan koreksi.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isEditingSubmission ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setIsEditingSubmission(false)}
                            className="px-3 py-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium"
                          >
                            Batal Edit
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveParticipantSubmissions}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                          >
                            <Save className="w-3.5 h-3.5" />
                            Simpan Koreksi Tugas
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditingSubmission(true)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Koreksi / Edit Lembar Tugas
                        </button>
                      )}
                    </div>
                  </div>

                  {/* TOPIC 1 SUBMISSIONS */}
                  {selectedTopicId === 'topik-1' && (
                    <div className="space-y-4 text-xs">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className="font-bold text-slate-800 block">Skor Pre-Test Peserta:</span>
                          <span className="text-[11px] text-slate-500">
                            Asesmen diagnostik pemahaman awal pilar kepemimpinan (0-100 poin).
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isEditingSubmission ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={preScoreDraft}
                              onChange={(e) => setPreScoreDraft(e.target.value)}
                              className="w-20 px-2.5 py-1 text-xs font-bold bg-white border border-slate-300 rounded-lg text-center"
                            />
                          ) : (
                            <span className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900 font-extrabold text-sm">
                              {bundle.scores.preTestScore !== null ? `${bundle.scores.preTestScore} Poin` : 'Belum Mengerjakan'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                        <span className="font-bold text-slate-800 block">Status Forum Perkenalan & Warisan:</span>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          Peserta telah mengakses forum perkenalan dan menyimak materi orientasi sinkronus/asinkronus Moodle.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TOPIC 2 SUBMISSIONS */}
                  {selectedTopicId === 'topik-2' && (
                    <div className="space-y-4 text-xs">
                      <div className="space-y-3">
                        <span className="font-bold text-indigo-950 uppercase tracking-wider text-[11px] block">
                          Lembar Kerja Modul 1: Visi Kepemimpinan & Inklusifitas
                        </span>

                        <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <div>
                            <label className="font-bold text-slate-700 block mb-0.5">1. Warisan yang Ingin Dibangun:</label>
                            {isEditingSubmission ? (
                              <textarea
                                rows={2}
                                value={editableAssignment.warisanInginDibangun}
                                onChange={(e) => setEditableAssignment({ ...editableAssignment, warisanInginDibangun: e.target.value })}
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            ) : (
                              <p className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                                {bundle.assignment.warisanInginDibangun || '(Belum diisi)'}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 block mb-0.5">2. Nilai Pribadi Pondasi:</label>
                            {isEditingSubmission ? (
                              <textarea
                                rows={2}
                                value={editableAssignment.nilaiPribadiPondasi}
                                onChange={(e) => setEditableAssignment({ ...editableAssignment, nilaiPribadiPondasi: e.target.value })}
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            ) : (
                              <p className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                                {bundle.assignment.nilaiPribadiPondasi || '(Belum diisi)'}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 block mb-0.5">3. Budaya Sekolah Inklusif:</label>
                            {isEditingSubmission ? (
                              <textarea
                                rows={2}
                                value={editableAssignment.budayaSekolah}
                                onChange={(e) => setEditableAssignment({ ...editableAssignment, budayaSekolah: e.target.value })}
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            ) : (
                              <p className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                                {bundle.assignment.budayaSekolah || '(Belum diisi)'}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 block mb-0.5">4. Pemberdayaan Rekan Guru:</label>
                            {isEditingSubmission ? (
                              <textarea
                                rows={2}
                                value={editableAssignment.caraMemberdayakanGuru}
                                onChange={(e) => setEditableAssignment({ ...editableAssignment, caraMemberdayakanGuru: e.target.value })}
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            ) : (
                              <p className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                                {bundle.assignment.caraMemberdayakanGuru || '(Belum diisi)'}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 block mb-0.5">5. Tindakan Awal 30 Hari:</label>
                            {isEditingSubmission ? (
                              <textarea
                                rows={2}
                                value={editableAssignment.satuTindakanAwal}
                                onChange={(e) => setEditableAssignment({ ...editableAssignment, satuTindakanAwal: e.target.value })}
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            ) : (
                              <p className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                                {bundle.assignment.satuTindakanAwal || '(Belum diisi)'}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Matriks 3 Pilar */}
                        <div className="space-y-2 pt-2">
                          <span className="font-bold text-indigo-950 uppercase tracking-wider text-[11px] block">
                            Matriks Evaluasi Diri 3 Pilar
                          </span>
                          <div className="space-y-2">
                            {editableThreePillars.map((row, idx) => (
                              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                                <span className="font-bold text-slate-900 block text-[11px]">
                                  Pilar {idx + 1}: {row.pilar}
                                </span>
                                {isEditingSubmission ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div>
                                      <span className="text-[10px] text-slate-500 block">Kondisi Saat Ini:</span>
                                      <textarea
                                        rows={2}
                                        value={row.kondisiSaatIni}
                                        onChange={(e) => {
                                          const copy = [...editableThreePillars];
                                          copy[idx].kondisiSaatIni = e.target.value;
                                          setEditableThreePillars(copy);
                                        }}
                                        className="w-full p-1.5 bg-white border border-slate-300 rounded text-[11px]"
                                      />
                                    </div>
                                    <div>
                                      <span className="text-[10px] text-slate-500 block">Kondisi Diharapkan:</span>
                                      <textarea
                                        rows={2}
                                        value={row.kondisiDiinginkan}
                                        onChange={(e) => {
                                          const copy = [...editableThreePillars];
                                          copy[idx].kondisiDiinginkan = e.target.value;
                                          setEditableThreePillars(copy);
                                        }}
                                        className="w-full p-1.5 bg-white border border-slate-300 rounded text-[11px]"
                                      />
                                    </div>
                                    <div>
                                      <span className="text-[10px] text-slate-500 block">Tindakan Nyata:</span>
                                      <textarea
                                        rows={2}
                                        value={row.tindakan}
                                        onChange={(e) => {
                                          const copy = [...editableThreePillars];
                                          copy[idx].tindakan = e.target.value;
                                          setEditableThreePillars(copy);
                                        }}
                                        className="w-full p-1.5 bg-white border border-slate-300 rounded text-[11px]"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                                    <div className="bg-white p-2 rounded border border-slate-200">
                                      <span className="text-[10px] text-slate-400 block">Saat Ini:</span>
                                      {row.kondisiSaatIni}
                                    </div>
                                    <div className="bg-white p-2 rounded border border-slate-200">
                                      <span className="text-[10px] text-slate-400 block">Harapan:</span>
                                      {row.kondisiDiinginkan}
                                    </div>
                                    <div className="bg-white p-2 rounded border border-slate-200">
                                      <span className="text-[10px] text-slate-400 block">Tindakan:</span>
                                      {row.tindakan}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* TOPIC 3 SUBMISSIONS */}
                  {selectedTopicId === 'topik-3' && (
                    <div className="space-y-4 text-xs">
                      <span className="font-bold text-indigo-950 uppercase tracking-wider text-[11px] block">
                        Transformasi Pola Pikir: Fixed Mindset ke Growth Mindset
                      </span>

                      <div className="space-y-2">
                        {editableMindset.map((row, idx) => (
                          <div key={row.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                            <span className="font-bold text-slate-900 block text-[11px]">
                              Skenario Tantangan {idx + 1}
                            </span>
                            {isEditingSubmission ? (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div>
                                  <span className="text-[10px] text-rose-600 font-semibold block">Fixed Mindset (Pola Pikir Tetap):</span>
                                  <textarea
                                    rows={2}
                                    value={row.pikiranTetap}
                                    onChange={(e) => {
                                      const copy = [...editableMindset];
                                      copy[idx].pikiranTetap = e.target.value;
                                      setEditableMindset(copy);
                                    }}
                                    className="w-full p-1.5 bg-white border border-slate-300 rounded text-[11px]"
                                  />
                                </div>
                                <div>
                                  <span className="text-[10px] text-emerald-600 font-semibold block">Growth Mindset (Saya Ubah Menjadi):</span>
                                  <textarea
                                    rows={2}
                                    value={row.sayaUbahMenjadi}
                                    onChange={(e) => {
                                      const copy = [...editableMindset];
                                      copy[idx].sayaUbahMenjadi = e.target.value;
                                      setEditableMindset(copy);
                                    }}
                                    className="w-full p-1.5 bg-white border border-slate-300 rounded text-[11px]"
                                  />
                                </div>
                                <div>
                                  <span className="text-[10px] text-indigo-600 font-semibold block">Aksi Konkret:</span>
                                  <textarea
                                    rows={2}
                                    value={row.aksiNyata}
                                    onChange={(e) => {
                                      const copy = [...editableMindset];
                                      copy[idx].aksiNyata = e.target.value;
                                      setEditableMindset(copy);
                                    }}
                                    className="w-full p-1.5 bg-white border border-slate-300 rounded text-[11px]"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                                <div className="bg-white p-2 rounded border border-rose-200 text-rose-950">
                                  <span className="text-[10px] text-rose-500 font-semibold block">Fixed:</span>
                                  {row.pikiranTetap}
                                </div>
                                <div className="bg-white p-2 rounded border border-emerald-200 text-emerald-950">
                                  <span className="text-[10px] text-emerald-500 font-semibold block">Growth:</span>
                                  {row.sayaUbahMenjadi}
                                </div>
                                <div className="bg-white p-2 rounded border border-indigo-200 text-indigo-950">
                                  <span className="text-[10px] text-indigo-500 font-semibold block">Aksi:</span>
                                  {row.aksiNyata}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TOPIC 4 SUBMISSIONS */}
                  {selectedTopicId === 'topik-4' && (
                    <div className="space-y-4 text-xs">
                      <span className="font-bold text-indigo-950 uppercase tracking-wider text-[11px] block">
                        Action Plan Canvas (10 Komponen Terstruktur)
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <div>
                          <label className="font-bold text-slate-800 block mb-1 text-[11px]">1. Masalah Utama / Prioritas:</label>
                          {isEditingSubmission ? (
                            <textarea
                              rows={2}
                              value={editableActionPlan.masalahPrioritas}
                              onChange={(e) => setEditableActionPlan({ ...editableActionPlan, masalahPrioritas: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          ) : (
                            <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                              {bundle.actionPlan.masalahPrioritas || '-'}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block mb-1 text-[11px]">2. Warisan Kepemimpinan:</label>
                          {isEditingSubmission ? (
                            <textarea
                              rows={2}
                              value={editableActionPlan.warisanKepemimpinan}
                              onChange={(e) => setEditableActionPlan({ ...editableActionPlan, warisanKepemimpinan: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          ) : (
                            <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                              {bundle.actionPlan.warisanKepemimpinan || '-'}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block mb-1 text-[11px]">3. Nilai Pribadi Pondasi:</label>
                          {isEditingSubmission ? (
                            <textarea
                              rows={2}
                              value={editableActionPlan.nilaiPribadi}
                              onChange={(e) => setEditableActionPlan({ ...editableActionPlan, nilaiPribadi: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          ) : (
                            <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                              {bundle.actionPlan.nilaiPribadi || '-'}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block mb-1 text-[11px]">4. Budaya Sekolah Inklusif:</label>
                          {isEditingSubmission ? (
                            <textarea
                              rows={2}
                              value={editableActionPlan.budaya}
                              onChange={(e) => setEditableActionPlan({ ...editableActionPlan, budaya: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          ) : (
                            <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                              {bundle.actionPlan.budaya || '-'}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block mb-1 text-[11px]">5. Pemberdayaan Rekan Guru:</label>
                          {isEditingSubmission ? (
                            <textarea
                              rows={2}
                              value={editableActionPlan.pemberdayaan}
                              onChange={(e) => setEditableActionPlan({ ...editableActionPlan, pemberdayaan: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          ) : (
                            <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                              {bundle.actionPlan.pemberdayaan || '-'}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block mb-1 text-[11px]">6. Growth Mindset Baru:</label>
                          {isEditingSubmission ? (
                            <textarea
                              rows={2}
                              value={editableActionPlan.growthMindset}
                              onChange={(e) => setEditableActionPlan({ ...editableActionPlan, growthMindset: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          ) : (
                            <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                              {bundle.actionPlan.growthMindset || '-'}
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-800 block mb-1 text-[11px]">7. Rencana Aksi Nyata (30-60-90 Hari):</label>
                          {isEditingSubmission ? (
                            <textarea
                              rows={3}
                              value={editableActionPlan.aksi}
                              onChange={(e) => setEditableActionPlan({ ...editableActionPlan, aksi: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          ) : (
                            <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                              {bundle.actionPlan.aksi || '-'}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block mb-1 text-[11px]">8. Indikator Keberhasilan:</label>
                          {isEditingSubmission ? (
                            <textarea
                              rows={2}
                              value={editableActionPlan.indikator}
                              onChange={(e) => setEditableActionPlan({ ...editableActionPlan, indikator: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          ) : (
                            <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                              {bundle.actionPlan.indikator || '-'}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block mb-1 text-[11px]">9. Linimasa Waktu & Dukungan:</label>
                          {isEditingSubmission ? (
                            <div className="space-y-1.5">
                              <input
                                type="text"
                                placeholder="Linimasa Waktu"
                                value={editableActionPlan.waktu}
                                onChange={(e) => setEditableActionPlan({ ...editableActionPlan, waktu: e.target.value })}
                                className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                              <input
                                type="text"
                                placeholder="Dukungan / Pihak Terkait"
                                value={editableActionPlan.dukungan}
                                onChange={(e) => setEditableActionPlan({ ...editableActionPlan, dukungan: e.target.value })}
                                className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            </div>
                          ) : (
                            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700 space-y-1">
                              <p><span className="font-semibold text-slate-500">Waktu:</span> {bundle.actionPlan.waktu || '-'}</p>
                              <p><span className="font-semibold text-slate-500">Dukungan:</span> {bundle.actionPlan.dukungan || '-'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TOPIC 5 SUBMISSIONS */}
                  {selectedTopicId === 'topik-5' && (
                    <div className="space-y-4 text-xs">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className="font-bold text-slate-800 block">Skor Post-Test Peserta:</span>
                          <span className="text-[11px] text-slate-500">
                            Evaluasi akhir penguasaan konsep 7 JP (0-100 poin).
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isEditingSubmission ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={postScoreDraft}
                              onChange={(e) => setPostScoreDraft(e.target.value)}
                              className="w-20 px-2.5 py-1 text-xs font-bold bg-white border border-slate-300 rounded-lg text-center"
                            />
                          ) : (
                            <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-extrabold text-sm">
                              {bundle.scores.postTestScore !== null ? `${bundle.scores.postTestScore} Poin` : 'Belum Mengerjakan'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                        <span className="font-bold text-indigo-950 uppercase tracking-wider text-[11px] block">
                          Lembar Refleksi 3-2-1
                        </span>

                        <div>
                          <label className="font-bold text-slate-800 block mb-1 text-[11px]">
                            3 Hal Penting yang Dipelajari:
                          </label>
                          {isEditingSubmission ? (
                            <div className="space-y-1.5">
                              {[0, 1, 2].map((i) => (
                                <input
                                  key={i}
                                  type="text"
                                  placeholder={`Poin ${i + 1}`}
                                  value={editableReflection.tigaHalPenting?.[i] || ''}
                                  onChange={(e) => {
                                    const copy = [...editableReflection.tigaHalPenting] as [string, string, string];
                                    copy[i] = e.target.value;
                                    setEditableReflection({ ...editableReflection, tigaHalPenting: copy });
                                  }}
                                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                                />
                              ))}
                            </div>
                          ) : (
                            <ul className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 list-disc list-inside space-y-0.5">
                              {(bundle.reflection321.tigaHalPenting || []).map((pt, i) => (
                                <li key={i}>{pt || '-'}</li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block mb-1 text-[11px]">
                            2 Pertanyaan yang Masih Mengganjal:
                          </label>
                          {isEditingSubmission ? (
                            <div className="space-y-1.5">
                              {[0, 1].map((i) => (
                                <input
                                  key={i}
                                  type="text"
                                  placeholder={`Pertanyaan ${i + 1}`}
                                  value={editableReflection.duaPertanyaan?.[i] || ''}
                                  onChange={(e) => {
                                    const copy = [...editableReflection.duaPertanyaan] as [string, string];
                                    copy[i] = e.target.value;
                                    setEditableReflection({ ...editableReflection, duaPertanyaan: copy });
                                  }}
                                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                                />
                              ))}
                            </div>
                          ) : (
                            <ul className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 list-disc list-inside space-y-0.5">
                              {(bundle.reflection321.duaPertanyaan || []).map((pt, i) => (
                                <li key={i}>{pt || '-'}</li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block mb-0.5 text-[11px]">
                            1 Rencana Aksi Nyata yang Segera Diterapkan:
                          </label>
                          {isEditingSubmission ? (
                            <textarea
                              rows={2}
                              value={editableReflection.satuTindakan}
                              onChange={(e) => setEditableReflection({ ...editableReflection, satuTindakan: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          ) : (
                            <p className="bg-white p-2 rounded-lg border border-slate-200 text-slate-700">
                              {bundle.reflection321.satuTindakan || '-'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 3: GRADING & UNLOCK APPROVAL FORM */}
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl border border-indigo-200/80 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      Pemberian Nilai Topik & Pembukaan Akses Topik Baru
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Score Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nilai Topik (0-100)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scoreInput}
                        onChange={(e) => setScoreInput(e.target.value)}
                        placeholder="Contoh: 90"
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />

                      {/* Quick Score Chips */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {[75, 80, 85, 90, 95, 100].map((sc) => (
                          <button
                            key={sc}
                            type="button"
                            onClick={() => setScoreInput(String(sc))}
                            className="px-1.5 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700"
                          >
                            {sc}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Feedback Input */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Catatan / Umpan Balik Fasilitator
                      </label>
                      <input
                        type="text"
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                        placeholder="Contoh: Sangat baik dalam refleksi pilar, lanjutkan ke modul berikutnya"
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />

                      {/* Preset Feedback Pills */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {FEEDBACK_PRESETS.map((preset, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setFeedbackInput(preset)}
                            className="text-[10px] bg-white hover:bg-indigo-50 border border-slate-200 text-slate-600 hover:text-indigo-700 px-2 py-0.5 rounded-full truncate max-w-[240px] text-left transition-colors"
                            title={preset}
                          >
                            💡 {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {existingReview?.reviewedAt && (
                    <p className="text-[10px] text-slate-400 italic">
                      Terakhir dinilai: {existingReview.reviewedAt} oleh {existingReview.reviewedBy || 'Fasilitator'}
                    </p>
                  )}

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                    <div>
                      {existingReview?.isApproved ? (
                        <button
                          type="button"
                          onClick={() => handleSaveCurrentReview(false)}
                          className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>
                            {currentTopicMeta.number === 5
                              ? 'Kunci Kembali (Batalkan Kelulusan & Sertifikat)'
                              : 'Kunci Kembali (Batalkan Persetujuan)'}
                          </span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          {currentTopicMeta.number === 5
                            ? 'Koreksi tugas akhir ini untuk mengesahkan kelulusan dan menerbitkan E-Sertifikat 7 JP resmi bagi peserta.'
                            : 'Klik tombol setujui untuk menyimpan nilai dan membuka topik berikutnya bagi peserta.'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveCurrentReview(true)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                      >
                        <Unlock className="w-4 h-4 text-emerald-200" />
                        <span>
                          {currentTopicMeta.number < 5
                            ? `✓ Setujui & Buka Topik ${currentTopicMeta.number + 1}`
                            : '✓ Setujui Tugas Akhir & Terbitkan E-Sertifikat'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span className="text-[11px]">
            Sistem Pembukaan Topik: Peserta dapat membuka topik berikutnya setelah tahapan tuntas & disahkan oleh fasilitator.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold transition-colors"
          >
            Tutup Pusat Koreksi
          </button>
        </div>

      </div>
    </div>
  );
};
