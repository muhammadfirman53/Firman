import React, { useState, useEffect } from 'react';
import { ParticipantProfile, Reflection321Data } from '../types';
import { POST_TEST_QUESTIONS } from '../data/courseData';
import confetti from 'canvas-confetti';
import {
  Award,
  BarChart3,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  PartyPopper,
  RotateCcw,
  Save,
  Send,
  Sparkles,
  TrendingUp,
  Lock,
  AlertCircle,
  ArrowRight,
  Clock,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';
import { TopicId, TopicReviewRecord } from '../types';
import { TopicCompletionItem } from '../utils/topicProgression';

interface TopicEvaluationProps {
  profile: ParticipantProfile;
  preScore: number | null;
  postScore: number | null;
  onSavePostScore: (score: number) => void;
  reflection321: Reflection321Data;
  onSaveReflection321: (data: Reflection321Data) => void;
  onOpenCertificate: () => void;
  onMarkTaskComplete: (taskId: string) => void;
  isCertificateEligible?: boolean;
  completedTopicsCount?: number;
  missingTopics?: TopicCompletionItem[];
  isTopic5Approved?: boolean;
  topic5Review?: TopicReviewRecord;
  awaitingTopic5Review?: boolean;
  onNavigateTopic?: (topicId: TopicId) => void;
}

export const TopicEvaluation: React.FC<TopicEvaluationProps> = ({
  profile,
  preScore,
  postScore,
  onSavePostScore,
  reflection321,
  onSaveReflection321,
  onOpenCertificate,
  onMarkTaskComplete,
  isCertificateEligible = false,
  completedTopicsCount = 0,
  missingTopics = [],
  isTopic5Approved = false,
  topic5Review,
  awaitingTopic5Review = false,
  onNavigateTopic,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'posttest' | 'reflection' | 'completion'>('posttest');

  // Quiz States
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('lms_kepala_sekolah_post_test_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isSubmitted, setIsSubmitted] = useState(postScore !== null);
  const [currentScore, setCurrentScore] = useState<number | null>(postScore);

  // Reflection 3-2-1 States
  const [reflectionData, setReflectionData] = useState<Reflection321Data>(reflection321);
  const [isReflectionSaved, setIsReflectionSaved] = useState(false);

  useEffect(() => {
    setReflectionData(reflection321);
  }, [reflection321]);

  useEffect(() => {
    if (postScore !== null) {
      setCurrentScore(postScore);
      setIsSubmitted(true);
    } else {
      setCurrentScore(null);
      setIsSubmitted(false);
    }
  }, [postScore]);

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: optionIndex };
      try {
        localStorage.setItem('lms_kepala_sekolah_post_test_answers', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateReflectionImportant = (idx: number, val: string) => {
    const updatedPoints = [...reflectionData.tigaHalPenting] as [string, string, string];
    updatedPoints[idx] = val;
    const updated = { ...reflectionData, tigaHalPenting: updatedPoints };
    setReflectionData(updated);
    onSaveReflection321(updated);
  };

  const updateReflectionQuestions = (idx: number, val: string) => {
    const updatedQuestions = [...reflectionData.duaPertanyaan] as [string, string];
    updatedQuestions[idx] = val;
    const updated = { ...reflectionData, duaPertanyaan: updatedQuestions };
    setReflectionData(updated);
    onSaveReflection321(updated);
  };

  const updateReflectionAction = (val: string) => {
    const updated = { ...reflectionData, satuTindakan: val };
    setReflectionData(updated);
    onSaveReflection321(updated);
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    POST_TEST_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct += 1;
      }
    });

    const score = Math.round((correct / POST_TEST_QUESTIONS.length) * 100);
    setCurrentScore(score);
    setIsSubmitted(true);
    onSavePostScore(score);
    onMarkTaskComplete('post-test');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setIsSubmitted(false);
    setCurrentScore(null);
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveReflection321(reflectionData);
    setIsReflectionSaved(true);
    setTimeout(() => setIsReflectionSaved(false), 3000);
    onMarkTaskComplete('reflection-321');

    try {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 }
      });
    } catch {}

    setActiveSubTab('completion');
  };

  const scoreDiff = currentScore !== null && preScore !== null ? currentScore - preScore : null;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Topik 5: Asinkronus Moodle (30 Menit)
          </span>
          <span className="bg-white/10 text-slate-200 text-xs px-2.5 py-0.5 rounded-full">
            Tahap Akhir Pelatihan
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">Topik 5: Evaluasi & Refleksi 3-2-1</h2>
        <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
          Mengukur peningkatan pemahaman melalui Post-test komprehensif, mengikat makna pembelajaran melalui Refleksi 3–2–1, dan penerbitan E-Sertifikat kelulusan 7 Jam Pelajaran.
        </p>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveSubTab('posttest')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'posttest'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          1. Post-test (Kuis Evaluasi)
          {currentScore !== null && (
            <span className="ml-1 px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded-full font-bold">
              {currentScore} Poin
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('reflection')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'reflection'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          2. Refleksi 3–2–1
        </button>

        <button
          onClick={() => setActiveSubTab('completion')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'completion'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          3. Capaian & E-Sertifikat Kelulusan
        </button>
      </div>

      {/* SUB-TAB 1: POST-TEST */}
      {activeSubTab === 'posttest' && (
        <div className="space-y-6">
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs space-y-6">
            
            {/* Header & Comparison Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Post-test Moodle: Evaluasi Pemahaman Materi
                </h3>
                <p className="text-xs text-slate-500">
                  10 soal pilihan ganda: Pemahaman dua materi, studi kasus, dan penerapan konsep kepemimpinan.
                </p>
              </div>

              {/* Score Comparison Badge */}
              {isSubmitted && currentScore !== null && (
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Pre-test</span>
                    <span className="text-base font-extrabold text-slate-700">{preScore ?? '-'}</span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400" />

                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block">Post-test</span>
                    <span className="text-xl font-extrabold text-indigo-950">{currentScore}</span>
                  </div>

                  {scoreDiff !== null && (
                    <div className="pl-2 border-l border-slate-200 text-xs">
                      <span className="flex items-center gap-1 font-bold text-emerald-600">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +{Math.max(0, scoreDiff)} Poin
                      </span>
                      <span className="text-[10px] text-slate-500">Pertumbuhan</span>
                    </div>
                  )}

                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full ml-1">
                    Selesai (1x Pengerjaan)
                  </span>
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {POST_TEST_QUESTIONS.map((q, idx) => {
                const selected = answers[q.id];
                const isCorrect = selected === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSubmitted
                        ? isCorrect
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-rose-50/40 border-rose-200'
                        : 'bg-slate-50/50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 mb-3">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                        {q.question}
                      </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-2 ml-8">
                      {q.options.map((opt, optIdx) => {
                        let optStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-100/60";

                        if (isSubmitted) {
                          if (optIdx === q.correctAnswer) {
                            optStyle = "bg-emerald-100 border-emerald-400 text-emerald-950 font-medium";
                          } else if (selected === optIdx) {
                            optStyle = "bg-rose-100 border-rose-400 text-rose-950";
                          } else {
                            optStyle = "bg-white/60 border-slate-200 text-slate-400";
                          }
                        } else if (selected === optIdx) {
                          optStyle = "bg-indigo-100 border-indigo-400 text-indigo-950 font-semibold";
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-start gap-2 transition-colors ${optStyle}`}
                          >
                            <span className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {isSubmitted && (
                      <div className="ml-8 mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600">
                        <span className="font-bold text-slate-800 block mb-1">
                          {isCorrect ? '✅ Jawaban Tepat!' : '❌ Penjelasan Kunci:'}
                        </span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            {!isSubmitted ? (
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Terjawab: {Object.keys(answers).length} dari {POST_TEST_QUESTIONS.length} Soal
                </span>
                <button
                  type="button"
                  disabled={Object.keys(answers).length === 0}
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Kirim Jawaban Post-test
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveSubTab('reflection')}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Lanjut ke Refleksi 3–2–1 →
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* SUB-TAB 2: REFLEKSI 3-2-1 */}
      {activeSubTab === 'reflection' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveReflection} className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Refleksi 3–2–1 Pasca Pelatihan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mengadaptasi refleksi pada bahan kedua. Mengikat intisari pembelajaran dan menetapkan komitmen eksekusi tindakan nyata di satuan pendidikan Anda.
              </p>
            </div>

            {/* 3 Hal Penting */}
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-3">
              <h4 className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">3</span>
                Tiga (3) Hal Penting yang Saya Pelajari Hari Ini:
              </h4>

              {[0, 1, 2].map((idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-xs font-bold text-indigo-600 mt-2">{idx + 1}.</span>
                  <textarea
                    rows={2}
                    value={reflectionData.tigaHalPenting[idx] || ''}
                    onChange={(e) => updateReflectionImportant(idx, e.target.value)}
                    placeholder={`Poin penting ke-${idx + 1}...`}
                    className="flex-1 text-xs p-2 bg-white border border-indigo-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>

            {/* 2 Pertanyaan */}
            <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 space-y-3">
              <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">2</span>
                Dua (2) Pertanyaan yang Masih Saya Miliki (Ingin Didalami):
              </h4>

              {[0, 1].map((idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-xs font-bold text-amber-600 mt-2">{idx + 1}.</span>
                  <textarea
                    rows={2}
                    value={reflectionData.duaPertanyaan[idx] || ''}
                    onChange={(e) => updateReflectionQuestions(idx, e.target.value)}
                    placeholder={`Pertanyaan ke-${idx + 1}...`}
                    className="flex-1 text-xs p-2 bg-white border border-amber-200 rounded-lg focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              ))}
            </div>

            {/* 1 Tindakan */}
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-3">
              <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                Satu (1) Tindakan Nyata yang Akan Saya Lakukan Setelah Pelatihan Ini:
              </h4>

              <textarea
                rows={3}
                value={reflectionData.satuTindakan}
                onChange={(e) => updateReflectionAction(e.target.value)}
                placeholder="Tuliskan tindakan pertama Anda yang realistis..."
                className="w-full text-xs p-2.5 bg-white border border-emerald-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {isReflectionSaved && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Refleksi 3-2-1 berhasil disimpan!
                </span>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim Refleksi & Selesaikan Pelatihan
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 3: COMPLETION & CERTIFICATE */}
      {activeSubTab === 'completion' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 border border-slate-200 rounded-2xl shadow-xs text-center space-y-5 max-w-2xl mx-auto">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-md ${
              isCertificateEligible
                ? 'bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950'
                : awaitingTopic5Review
                ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}>
              {isCertificateEligible ? (
                <PartyPopper className="w-8 h-8 text-amber-900" />
              ) : awaitingTopic5Review ? (
                <Clock className="w-8 h-8 text-amber-700 animate-pulse" />
              ) : (
                <Lock className="w-8 h-8 text-slate-600" />
              )}
            </div>

            <div className="space-y-1">
              <span className={`text-xs uppercase font-bold tracking-widest ${
                isCertificateEligible
                  ? 'text-emerald-700'
                  : awaitingTopic5Review
                  ? 'text-amber-700'
                  : 'text-slate-600'
              }`}>
                {isCertificateEligible
                  ? 'Selamat dan Sukses! Kelulusan Disahkan'
                  : awaitingTopic5Review
                  ? 'Tugas Akhir Berhasil Dikirimkan'
                  : 'Tahap Topik 5 Tuntas'}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
                {isCertificateEligible
                  ? 'E-Sertifikat Kelulusan Resmi (7 JP) Telah Terbit'
                  : awaitingTopic5Review
                  ? 'Menunggu Koreksi Tugas Akhir oleh Fasilitator'
                  : 'E-Sertifikat Memerlukan Ketuntasan Seluruh 5 Topik'}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {isCertificateEligible ? (
                  <>
                    Selamat <strong>{profile.name}</strong>, tugas akhir Topik 5 Anda telah selesai dikoreksi dan disahkan oleh Fasilitator Utama dengan nilai <strong>{topic5Review?.score ?? 90}/100</strong>. E-Sertifikat resmi Anda sudah aktif dan siap diunduh.
                  </>
                ) : awaitingTopic5Review ? (
                  <>
                    Seluruh aktivitas Topik 1 s.d. 5, Post-test, dan Lembar Refleksi 3-2-1 telah selesai Anda kerjakan. Sesuai ketentuan, <strong>E-Sertifikat 7 JP resmi akan otomatis terbit begitu Fasilitator/Admin selesai mengoreksi dan memberikan nilai tugas akhir Anda pada Topik 5 ini</strong>.
                  </>
                ) : (
                  <>
                    Anda telah menyelesaikan aktivitas asesmen akhir dan refleksi Topik 5. Namun, E-Sertifikat resmi hanya dapat digunakan apabila <strong>semua topik (Topik 1 - Topik 5)</strong> telah selesai dikerjakan secara tuntas (Saat ini: {completedTopicsCount} dari 5 topik selesai).
                  </>
                )}
              </p>
            </div>

            {/* Score Growth Summary Card */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
              <div>
                <span className="text-[11px] text-slate-500 block">Skor Pre-test Awal:</span>
                <span className="text-base font-bold text-slate-800">{preScore !== null ? `${preScore} Poin` : 'Belum Ada'}</span>
              </div>
              <div>
                <span className="text-[11px] text-indigo-700 block">Skor Post-test Akhir:</span>
                <span className="text-base font-bold text-indigo-900">{currentScore !== null ? `${currentScore} Poin` : 'Selesai'}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-500 block">Koreksi Admin (Topik 5):</span>
                <span className={`text-xs font-bold inline-flex items-center gap-1 mt-0.5 ${
                  isTopic5Approved ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {isTopic5Approved ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Disetujui ({topic5Review?.score ?? 90})
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      Dalam Antrean
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Facilitator Feedback Card if approved */}
            {isTopic5Approved && topic5Review?.feedback && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-left text-xs">
                <span className="font-bold text-emerald-900 block mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Catatan Evaluasi Fasilitator ({topic5Review.reviewedBy || 'Muhamad Firman, S.Pd'}):
                </span>
                <p className="text-emerald-800 italic">"{topic5Review.feedback}"</p>
              </div>
            )}

            {/* If missing topics, show list */}
            {!isCertificateEligible && !awaitingTopic5Review && missingTopics.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-left space-y-2">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Topik yang Belum Dituntaskan ({missingTopics.length}):
                </span>
                <div className="space-y-1.5">
                  {missingTopics.map((mt) => (
                    <div
                      key={mt.id}
                      className="p-2.5 rounded-lg bg-white border border-amber-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-800 block">
                          Topik {mt.number}: {mt.title}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {mt.completedTasks} dari {mt.totalTasks} aktivitas terselesaikan
                        </span>
                      </div>
                      {onNavigateTopic && (
                        <button
                          type="button"
                          onClick={() => onNavigateTopic(mt.id)}
                          className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <span>Selesaikan</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* E-Certificate Action */}
            <div className="pt-2">
              <button
                onClick={onOpenCertificate}
                className={`w-full sm:w-auto px-8 py-3 text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2 mx-auto transition-transform active:scale-95 ${
                  isCertificateEligible
                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                    : awaitingTopic5Review
                    ? 'text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {isCertificateEligible ? (
                  <Award className="w-5 h-5" />
                ) : awaitingTopic5Review ? (
                  <Clock className="w-4 h-4 text-amber-700 animate-pulse" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500" />
                )}
                <span>
                  {isCertificateEligible
                    ? 'Buka E-Sertifikat Kelulusan Resmi (7 JP)'
                    : awaitingTopic5Review
                    ? 'Lihat Status E-Sertifikat (Menunggu Koreksi Fasilitator)'
                    : `Lihat Syarat Sertifikat (${completedTopicsCount}/5 Topik)`}
                </span>
              </button>
              <p className="text-[11px] text-slate-400 mt-2">
                {isCertificateEligible
                  ? 'Dapat langsung dicetak atau diunduh ke format PDF beresolusi tinggi.'
                  : awaitingTopic5Review
                  ? 'E-Sertifikat resmi terbit otomatis begitu Admin/Fasilitator selesai mengoreksi tugas akhir Topik 5.'
                  : 'Sertifikat resmi terbit otomatis begitu seluruh 5 topik diselesaikan dan disahkan.'}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
