import React, { useState, useEffect } from 'react';
import { ParticipantProfile, ForumPost } from '../types';
import { PRE_TEST_QUESTIONS } from '../data/courseData';
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  PlayCircle,
  Send,
  Sparkles,
  ThumbsUp,
  Video,
  Award,
  AlertCircle,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

interface TopicOrientationProps {
  profile: ParticipantProfile;
  forumPosts: ForumPost[];
  onAddForumPost: (post: ForumPost) => void;
  onLikeForumPost: (postId: string) => void;
  onReplyForumPost: (postId: string, replyText: string) => void;
  preScore: number | null;
  onSavePreScore: (score: number | null) => void;
  onMarkTaskComplete: (taskId: string) => void;
}

export const TopicOrientation: React.FC<TopicOrientationProps> = ({
  profile,
  forumPosts,
  onAddForumPost,
  onLikeForumPost,
  onReplyForumPost,
  preScore,
  onSavePreScore,
  onMarkTaskComplete,
}) => {
  // Tabs within Topic 1
  const [activeSubTab, setActiveSubTab] = useState<'video' | 'pretest' | 'forum'>('video');

  // Video guide step tab
  const [selectedGuideStep, setSelectedGuideStep] = useState<number>(0);

  // Pre-test quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(preScore !== null);
  const [currentScore, setCurrentScore] = useState<number | null>(preScore);

  useEffect(() => {
    setCurrentScore(preScore);
    setIsQuizSubmitted(preScore !== null);
    if (preScore === null) {
      setQuizAnswers({});
    }
  }, [preScore]);

  // Forum input
  const [introText, setIntroText] = useState('');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const guideSteps = [
    {
      title: "1. Cara Mengakses Materi",
      icon: "📚",
      desc: "Gunakan navigasi topik di bilah samping atau kartu pembelajaran. Setiap modul dilengkapi bahan bacaan, slide refleksi, dan tautan pertemuan Google Meet.",
      tip: "Perhatikan label 'Sinkronus' (Google Meet bersama fasilitator) dan 'Asinkronus' (mandiri di LMS)."
    },
    {
      title: "2. Cara Mengirim Tugas",
      icon: "📤",
      desc: "Pada penugasan modul, isi formulir terstruktur (misal: Rencana Warisan Kepemimpinan & Action Plan Canvas). Sistem secara otomatis menyimpan isian Anda di browser dan menyediakan opsi unduh dokumen.",
      tip: "Pastikan Anda mengisi seluruh komponen panduan sebelum menyelesaikan tugas."
    },
    {
      title: "3. Cara Mengikuti Forum",
      icon: "💬",
      desc: "Forum digunakan untuk perkenalan awal, refleksi warisan kepemimpinan, dan umpan balik sebaya. Tuliskan tanggapan Anda dan berikan apresiasi pada ide kepala sekolah lain.",
      tip: "Tuliskan minimal 3-5 kalimat reflektif yang merefleksikan nilai kepemimpinan di sekolah Anda."
    },
    {
      title: "4. Cara Mengerjakan Kuis",
      icon: "📝",
      desc: "Terdapat Pre-test di awal dan Post-test di akhir pelatihan. Kuis berisi 10-15 soal pilihan ganda studi kasus dengan analisis mendalam.",
      tip: "Pre-test bertujuan memetakan titik awal pemahaman, sehingga tidak perlu cemas dengan perolehan nilai awal."
    },
    {
      title: "5. Melihat Progres Pembelajaran",
      icon: "📊",
      desc: "Bilah progres di bagian atas memantau aktivitas yang telah Anda selesaikan. Setelah menuntaskan seluruh 5 topik dan Post-test, E-Sertifikat 7 Jam resmi akan aktif.",
      tip: "Sertifikat resmi mencantumkan data diri Kepala Sekolah dan Fasilitator Muhamad Firman, S.Pd."
    }
  ];

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    if (isQuizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleScoreQuiz = () => {
    let correctCount = 0;
    PRE_TEST_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });
    const finalScore = Math.round((correctCount / PRE_TEST_QUESTIONS.length) * 100);
    setCurrentScore(finalScore);
    setIsQuizSubmitted(true);
    onSavePreScore(finalScore);
    onMarkTaskComplete('pre-test');
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setIsQuizSubmitted(false);
    setCurrentScore(null);
    onSavePreScore(null);
  };

  const handlePostForum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!introText.trim()) return;

    const newPost: ForumPost = {
      id: 'fp-' + Date.now(),
      authorName: profile.name,
      schoolName: profile.schoolName,
      role: 'Kepala Sekolah',
      content: introText.trim(),
      timestamp: 'Baru saja',
      likes: 0,
      replies: []
    };

    onAddForumPost(newPost);
    setIntroText('');
    onMarkTaskComplete('forum-perkenalan');
  };

  const handleSendReply = (postId: string) => {
    const text = replyTextMap[postId];
    if (!text || !text.trim()) return;

    onReplyForumPost(postId, text.trim());
    setReplyTextMap((prev) => ({ ...prev, [postId]: '' }));
    setActiveReplyId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Topic Header Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Tahap 1: Asinkronus (20 Menit)
            </span>
            <span className="bg-white/10 text-slate-200 text-xs px-2.5 py-0.5 rounded-full">
              LMS Moodle Course
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Topik 1: Orientasi & Diagnostik</h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            Mempersiapkan diri mengikuti blended learning kepemimpinan, mengukur pemahaman awal melalui asesmen diagnostik, serta memulai jalinan komunitas belajar antar kepala sekolah.
          </p>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveSubTab('video')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'video'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <PlayCircle className="w-4 h-4" />
          1. Panduan Orientasi Moodle
        </button>

        <button
          onClick={() => setActiveSubTab('pretest')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'pretest'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          2. Pre-test (Quiz Diagnostik)
          {currentScore !== null && (
            <span className="ml-1 px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded-full font-bold">
              {currentScore} Poin
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('forum')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'forum'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          3. Forum Perkenalan & Warisan
          <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px]">
            {forumPosts.length}
          </span>
        </button>
      </div>

      {/* Sub-tab 1: Video / Orientation Guide */}
      {activeSubTab === 'video' && (
        <div className="space-y-6">
          {/* Video Player Card */}
          <div className="bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-md">
            <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Video className="w-4 h-4 text-red-500" />
                <span>Video Panduan Penggunaan LMS Moodle</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://youtu.be/OCv8MuMwX5Q?si=odGALHgEArYAtYtO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-700/80 hover:bg-slate-700 px-3 py-1 rounded-lg transition-colors border border-slate-600"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                  Buka di YouTube
                </a>
              </div>
            </div>
            
            {/* Embedded YouTube Video */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/OCv8MuMwX5Q?rel=0"
                title="Panduan Penggunaan LMS Moodle Pelatihan Kepala Sekolah"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video description footer */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
              <div>
                <p className="font-semibold text-white">Panduan Navigasi & Pelaksanaan Blended Learning</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Simak video panduan di atas untuk memahami alur belajar di LMS Moodle, cara mengakses materi, mengirim tugas, berdiskusi di forum, dan mengerjakan kuis.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onMarkTaskComplete('orientasi-video')}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors shadow-xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Tandai Selesai Menonton
              </button>
            </div>
          </div>

          {/* 5 Guide Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {guideSteps.map((step, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedGuideStep(idx)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedGuideStep === idx
                    ? 'bg-indigo-50 border-indigo-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-2xl mb-2">{step.icon}</div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">{step.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Selected Step Deep Dive */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm">
              <span>{guideSteps[selectedGuideStep].icon}</span>
              <span>{guideSteps[selectedGuideStep].title}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-3">
              {guideSteps[selectedGuideStep].desc}
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Tips Fasilitator:</strong> {guideSteps[selectedGuideStep].tip}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                onMarkTaskComplete('orientasi-video');
                setActiveSubTab('pretest');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              Lanjut ke Pre-test Kuis →
            </button>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Pre-test Quiz */}
      {activeSubTab === 'pretest' && (
        <div className="space-y-6">
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                  Kuis Diagnostik Awal (Pre-test)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  10 butir soal pilihan ganda: Menguji pemahaman awal tentang Kepemimpinan Berkelanjutan dan Pola Pikir Tetap vs Bertumbuh.
                </p>
              </div>

              {isQuizSubmitted && currentScore !== null && (
                <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 px-4 py-2.5 rounded-xl">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-700 block">Skor Pre-test</span>
                    <span className="text-xl font-extrabold text-indigo-950">{currentScore} / 100</span>
                  </div>
                  <div className="pl-3 border-l border-indigo-200 text-[11px] text-indigo-700">
                    <span className="font-semibold block">Asesmen Awal Selesai</span>
                    <span>Pre-test hanya dapat dikerjakan 1 kali tanpa pengulangan.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Question List */}
            <div className="space-y-6">
              {PRE_TEST_QUESTIONS.map((q, idx) => {
                const selected = quizAnswers[q.id];

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border transition-all bg-slate-50/60 border-slate-200"
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

                        if (isQuizSubmitted) {
                          if (selected === optIdx) {
                            optStyle = "bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold";
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
                            disabled={isQuizSubmitted}
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
                  </div>
                );
              })}
            </div>

            {/* Submit / Reset Quiz Buttons */}
            {!isQuizSubmitted ? (
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">
                    Terjawab: {Object.keys(quizAnswers).length} dari {PRE_TEST_QUESTIONS.length} Soal
                  </span>
                  {Object.keys(quizAnswers).length > 0 && (
                    <button
                      type="button"
                      onClick={() => setQuizAnswers({})}
                      className="text-xs text-rose-600 hover:text-rose-700 hover:underline font-medium flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Kosongkan Pilihan
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  disabled={Object.keys(quizAnswers).length === 0}
                  onClick={handleScoreQuiz}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Kirim Jawaban Pre-test
                </button>
              </div>
            ) : (
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500 italic">
                  Jawaban Pre-test telah tersimpan di sistem dan tidak dapat diubah kembali. Kunci jawaban tidak ditampilkan pada asesmen awal.
                </span>
                <button
                  onClick={() => setActiveSubTab('forum')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  Lanjut ke Forum Perkenalan →
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Sub-tab 3: Forum Perkenalan */}
      {activeSubTab === 'forum' && (
        <div className="space-y-6">
          
          {/* Prompt Banner */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Pertanyaan Pemantik Forum Perkenalan:
                </h3>
                <blockquote className="text-xs sm:text-sm font-serif italic text-blue-950 mt-1 pl-3 border-l-2 border-blue-400">
                  "Perkenalkan diri anda, kemudian sebagai kepala sekolah, perubahan apa yang paling ingin saya tinggalkan sebagai warisan bagi sekolah saya?"
                </blockquote>
                <p className="text-[11px] text-blue-800 mt-2">
                  *Peserta diharapkan menuliskan 3–5 kalimat reflektif pada forum ini untuk memetakan pemahaman dan harapan awal.
                </p>
              </div>
            </div>
          </div>

          {/* New Post Form */}
          <form onSubmit={handlePostForum} className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                {profile.name.charAt(0) || 'K'}
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-800">{profile.name}</span>
                <span className="text-slate-500"> ({profile.schoolName})</span>
              </div>
            </div>

            <textarea
              rows={4}
              required
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              placeholder="Tuliskan 3–5 kalimat perkenalan dan warisan perubahan yang ingin Anda bangun di sekolah..."
              className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-slate-400">
                {introText.split(/\s+/).filter(Boolean).length} kata diketik
              </span>
              <button
                type="submit"
                disabled={!introText.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim Kiriman Forum
              </button>
            </div>
          </form>

          {/* Forum Thread Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kiriman Forum Rekan Kepala Sekolah ({forumPosts.length})
              </h4>
              {forumPosts.length === 0 && (
                <span className="text-[11px] text-slate-400 italic">Kolom perkenalan bersih / belum ada kiriman</span>
              )}
            </div>

            {forumPosts.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h5 className="text-xs font-bold text-slate-800">Kolom Perkenalan Masih Kosong</h5>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
                  Belum ada kiriman perkenalan dari rekan kepala sekolah. Silakan tuliskan 3–5 kalimat perkenalan dan warisan perubahan yang ingin Anda bangun pada formulir di atas untuk memulai diskusi!
                </p>
              </div>
            ) : (
              forumPosts.map((post) => (
                <div key={post.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                  
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                        {post.authorName.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{post.authorName}</h5>
                        <p className="text-[10px] text-slate-500">{post.schoolName} • {post.timestamp}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {post.role}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-10 border-l-2 border-slate-100">
                    {post.content}
                  </p>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 pt-1 pl-10 text-xs text-slate-500">
                    <button
                      onClick={() => onLikeForumPost(post.id)}
                      className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.likes} Suka</span>
                    </button>

                    <button
                      onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)}
                      className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Balas ({post.replies.length})</span>
                    </button>
                  </div>

                  {/* Reply Form if active */}
                  {activeReplyId === post.id && (
                    <div className="ml-10 pt-2 flex gap-2">
                      <input
                        type="text"
                        value={replyTextMap[post.id] || ''}
                        onChange={(e) => setReplyTextMap({ ...replyTextMap, [post.id]: e.target.value })}
                        placeholder="Tuliskan tanggapan apresiatif..."
                        className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleSendReply(post.id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Kirim
                      </button>
                    </div>
                  )}

                  {/* Replies Thread */}
                  {post.replies.length > 0 && (
                    <div className="ml-10 space-y-2 pt-2">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800 text-[11px]">{reply.authorName}</span>
                            <span className="text-[10px] text-slate-400">{reply.timestamp}</span>
                          </div>
                          <p className="text-slate-600 text-xs">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
};
