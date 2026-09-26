import React, { useState } from 'react';
import { ParticipantProfile, ThreePillarsRow, PadletNote, Modul1AssignmentData, MentimeterVote } from '../types';
import { INITIAL_MENTIMETER_VALUES } from '../data/courseData';
import {
  Award,
  BarChart2,
  CheckCircle2,
  Compass,
  FileEdit,
  Heart,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Plus,
  Save,
  Send,
  Sparkles,
  Target,
  ThumbsUp,
  Users,
  Video
} from 'lucide-react';

interface TopicModul1Props {
  profile: ParticipantProfile;
  threePillars: ThreePillarsRow[];
  onSaveThreePillars: (data: ThreePillarsRow[]) => void;
  padletNotes: PadletNote[];
  onAddPadletNote: (note: PadletNote) => void;
  onLikePadletNote: (id: string) => void;
  assignment: Modul1AssignmentData;
  onSaveAssignment: (data: Modul1AssignmentData) => void;
  onMarkTaskComplete: (taskId: string) => void;
}

export const TopicModul1: React.FC<TopicModul1Props> = ({
  profile,
  threePillars,
  onSaveThreePillars,
  padletNotes,
  onAddPadletNote,
  onLikePadletNote,
  assignment,
  onSaveAssignment,
  onMarkTaskComplete,
}) => {
  const [activeStage, setActiveStage] = useState<'relate' | 'explore' | 'apply' | 'learnagain' | 'assignment'>('relate');

  // Mentimeter poll state
  const [mentiVotes, setMentiVotes] = useState<MentimeterVote[]>(INITIAL_MENTIMETER_VALUES);
  const [hasVotedMenti, setHasVotedMenti] = useState<boolean>(false);
  const [customValueInput, setCustomValueInput] = useState<string>('');
  const [userPersonalValueNote, setUserPersonalValueNote] = useState<string>('');

  // Pak Pandi Case Study Answers (PBL) - Dikosongkan agar peserta mengisi mandiri
  const [pandiAnswers, setPandiAnswers] = useState({
    benefitedAndLeftBehind: '',
    leadershipAction: '',
    cultureToBuild: '',
    teacherEmpowerment: ''
  });
  const [isPandiSaved, setIsPandiSaved] = useState(false);

  // Three Pillars Table State
  const [pillarsData, setPillarsData] = useState<ThreePillarsRow[]>(threePillars);
  const [isPillarsSaved, setIsPillarsSaved] = useState(false);

  // Padlet inputs
  const [padletVision, setPadletVision] = useState('');
  const [padletAction, setPadletAction] = useState('');
  const [padletColor, setPadletColor] = useState('amber');

  // Assignment Form State
  const [assignmentData, setAssignmentData] = useState<Modul1AssignmentData>(assignment);
  const [isAssignmentSaved, setIsAssignmentSaved] = useState(false);

  // Peer review modal / tab state
  const [peerComment, setPeerComment] = useState('');
  const [peerInclusiveCheck, setPeerInclusiveCheck] = useState(true);

  const handleVoteMenti = (id: string) => {
    if (hasVotedMenti) return;
    setMentiVotes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, votes: item.votes + 1 } : item))
    );
    setHasVotedMenti(true);
    onMarkTaskComplete('relate-menti');
  };

  const handleSavePillars = () => {
    onSaveThreePillars(pillarsData);
    setIsPillarsSaved(true);
    setTimeout(() => setIsPillarsSaved(false), 3000);
    onMarkTaskComplete('apply-pillars');
  };

  const handleAddPadlet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!padletVision.trim() && !padletAction.trim()) return;

    const newNote: PadletNote = {
      id: 'pn-' + Date.now(),
      authorName: profile.name,
      schoolName: profile.schoolName,
      color: padletColor,
      content: padletVision || 'Harapan Warisan Sekolah:',
      subContent: padletAction || 'Tindakan Nyata Terdekat:',
      likes: 0,
      timestamp: 'Baru saja'
    };

    onAddPadletNote(newNote);
    setPadletVision('');
    setPadletAction('');
    onMarkTaskComplete('learnagain-padlet1');
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Modul1AssignmentData = {
      ...assignmentData,
      submittedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };
    setAssignmentData(updated);
    onSaveAssignment(updated);
    setIsAssignmentSaved(true);
    setTimeout(() => setIsAssignmentSaved(false), 3000);
    onMarkTaskComplete('modul1-assignment');
  };

  const handleAddPeerFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!peerComment.trim()) return;

    const newFeedback = {
      reviewerName: profile.name,
      reviewerSchool: profile.schoolName,
      feedback: peerComment.trim(),
      inclusivityCheck: peerInclusiveCheck
    };

    const updated = {
      ...assignmentData,
      peerFeedback: [...(assignmentData.peerFeedback || []), newFeedback]
    };

    setAssignmentData(updated);
    onSaveAssignment(updated);
    setPeerComment('');
  };

  const totalMentiVotes = mentiVotes.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Topik 2 (Modul 1)
          </span>
          <span className="bg-white/10 text-slate-200 text-xs px-2.5 py-0.5 rounded-full">
            120 Menit Sinkronus + 30 Menit Asinkronus Moodle
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">Modul 1: Kepemimpinan Berkelanjutan</h2>
        <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
          Membangun kepemimpinan sekolah yang berpijak pada nilai pribadi yang kokoh, budaya sekolah yang konsisten, dan pemberdayaan seluruh warga sekolah melalui alur Relate–Explore–Apply–Learn Again.
        </p>
      </div>

      {/* Stage Flow Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'relate', label: '1. RELATE (20m)', sub: 'Mentimeter Nilai Diri' },
          { id: 'explore', label: '2. EXPLORE (15m)', sub: 'Kasus Pak Pandi (PBL)' },
          { id: 'apply', label: '3. APPLY (55m)', sub: 'Matriks 3 Pilar Warisan' },
          { id: 'learnagain', label: '4. LEARN AGAIN (10m)', sub: 'Padlet Refleksi' },
          { id: 'assignment', label: '5. TUGAS ASINKRONUS (20m)', sub: 'Warisan & Peer Review' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStage(tab.id as any)}
            className={`p-2.5 rounded-xl text-left border transition-all ${
              activeStage === tab.id
                ? 'bg-indigo-50 border-indigo-500 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="block font-bold text-slate-800 text-xs">{tab.label}</span>
            <span className="text-[11px] text-slate-500 truncate block">{tab.sub}</span>
          </button>
        ))}
      </div>

      {/* STAGE 1: RELATE */}
      {activeStage === 'relate' && (
        <div className="space-y-6">
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-2.5 mb-3 text-indigo-700">
              <BarChart2 className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">
                Tahap 1 — RELATE: Refleksi Nilai Diri (Mentimeter Digital)
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Fasilitator mengajukan pertanyaan reflektif: <em>"Nilai apa yang paling menggambarkan diri saya sebagai pemimpin sekolah?"</em>
            </p>

            {/* Live Voting Cards */}
            <div className="space-y-3 mb-6">
              {mentiVotes.map((item) => {
                const percent = totalMentiVotes > 0 ? Math.round((item.votes / totalMentiVotes) * 100) : 0;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleVoteMenti(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      hasVotedMenti
                        ? 'border-slate-200 bg-slate-50/50'
                        : 'border-slate-300 hover:border-indigo-400 bg-white'
                    }`}
                  >
                    {/* Background Bar */}
                    <div
                      className="absolute inset-y-0 left-0 bg-indigo-50/70 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">{item.label}</span>
                          {!hasVotedMenti && (
                            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                              Klik untuk memilih
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span className="text-sm font-bold text-indigo-900">{item.votes} Suara</span>
                        <span className="block text-[10px] text-slate-400">{percent}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Individual Reflection Note */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Refleksi Pribadi Anda: Mengapa nilai tersebut paling mencerminkan kepemimpinan Anda di sekolah?
              </label>
              <textarea
                rows={3}
                value={userPersonalValueNote}
                onChange={(e) => setUserPersonalValueNote(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder="Hubungkan dengan pengalaman memimpin rekan guru dan melayani murid..."
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-[11px] text-slate-400">Tersimpan otomatis untuk sesi pleno</span>
                <button
                  onClick={() => {
                    onMarkTaskComplete('relate-menti');
                    setActiveStage('explore');
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Lanjut ke Tahap 2: EXPLORE (Kasus Pak Pandi) →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: EXPLORE (Kasus Pak Pandi) */}
      {activeStage === 'explore' && (
        <div className="space-y-6">
          
          {/* Case Narrative Box */}
          <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
              <Compass className="w-5 h-5 text-amber-700" />
              <span>Tahap 2 — EXPLORE: Studi Kasus Kepemimpinan Pak Pandi (15 Menit)</span>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-amber-200 text-slate-800 my-2">
              <p className="font-serif text-sm sm:text-base italic leading-relaxed text-slate-900">
                “Pak Pandi melihat guru lebih sering melibatkan murid laki-laki yang dianggap pintar, sementara murid perempuan, murid pasif, dan murid dengan hambatan pendengaran jarang dilibatkan.”
              </p>
            </div>
            <p className="text-xs text-amber-900">
              Diskusikan secara berkelompok menggunakan pendekatan <strong>Problem-Based Learning (PBL)</strong> untuk merumuskan respon kepemimpinan yang adil dan berkelanjutan.
            </p>
          </div>

          {/* PBL Questions Worksheet */}
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Lembar Analisis Problem Based Learning (PBL)
            </h4>

            {/* Q1 */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                1. Siapa yang paling diuntungkan dan siapa yang tertinggal dalam situasi tersebut?
              </label>
              <textarea
                rows={2}
                value={pandiAnswers.benefitedAndLeftBehind}
                onChange={(e) => setPandiAnswers({ ...pandiAnswers, benefitedAndLeftBehind: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Q2 */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                2. Apa tindakan kepemimpinan yang harus dilakukan kepala sekolah?
              </label>
              <textarea
                rows={2}
                value={pandiAnswers.leadershipAction}
                onChange={(e) => setPandiAnswers({ ...pandiAnswers, leadershipAction: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Q3 */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                3. Budaya apa yang harus dibangun di satuan pendidikan?
              </label>
              <textarea
                rows={2}
                value={pandiAnswers.cultureToBuild}
                onChange={(e) => setPandiAnswers({ ...pandiAnswers, cultureToBuild: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Q4 */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                4. Bagaimana kepala sekolah dapat memberdayakan guru secara efektif?
              </label>
              <textarea
                rows={2}
                value={pandiAnswers.teacherEmpowerment}
                onChange={(e) => setPandiAnswers({ ...pandiAnswers, teacherEmpowerment: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {isPandiSaved && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Analisis kasus tersimpan!
                </span>
              )}
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPandiSaved(true);
                    onMarkTaskComplete('explore-pandi');
                    setTimeout(() => setIsPandiSaved(false), 3000);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                >
                  Simpan Draf
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onMarkTaskComplete('explore-pandi');
                    setActiveStage('apply');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  Lanjut ke Tahap 3: APPLY (Tiga Pilar) →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: APPLY (Tiga Pilar Warisan Kepemimpinan) */}
      {activeStage === 'apply' && (
        <div className="space-y-6">
          
          {/* Slide Summary of 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-indigo-200 rounded-xl shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mb-2">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Nilai Pribadi</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nilai yang diyakini dan diterapkan secara konsisten dalam setiap tindakan, perkataan, dan keputusan kepemimpinan.
              </p>
            </div>

            <div className="p-4 bg-white border border-blue-200 rounded-xl shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mb-2">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Budaya yang Diterapkan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kebiasaan yang disepakati dan dilakukan warga sekolah serta dicontohkan pimpinan secara konsisten sehari-hari.
              </p>
            </div>

            <div className="p-4 bg-white border border-emerald-200 rounded-xl shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mb-2">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Pemberdayaan Orang Lain</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cara kepala sekolah membantu guru, tendik, dan warga sekolah agar berani, mampu, berwawasan, dan percaya diri memimpin perubahan.
              </p>
            </div>
          </div>

          {/* Interactive Matrix Table */}
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Matriks Tiga Pilar Warisan Kepemimpinan
                </h3>
                <p className="text-xs text-slate-500">
                  Diskusikan bersama kelompok Anda, kemudian rumuskan kondisi saat ini, kondisi yang diinginkan, dan tindakan konkretnya.
                </p>
              </div>
              {isPillarsSaved && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Matriks berhasil disimpan!
                </span>
              )}
            </div>

            <div className="space-y-6">
              {pillarsData.map((row, index) => (
                <div key={row.pilar} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold">
                      Pilar: {row.pilar}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Kondisi Saat Ini (Kelemahan/Tantangan)
                      </label>
                      <textarea
                        rows={3}
                        value={row.kondisiSaatIni}
                        onChange={(e) => {
                          const updated = [...pillarsData];
                          updated[index].kondisiSaatIni = e.target.value;
                          setPillarsData(updated);
                        }}
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                        placeholder="Deskripsikan fakta saat ini..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Kondisi yang Diinginkan (Kondisi Ideal)
                      </label>
                      <textarea
                        rows={3}
                        value={row.kondisiDiinginkan}
                        onChange={(e) => {
                          const updated = [...pillarsData];
                          updated[index].kondisiDiinginkan = e.target.value;
                          setPillarsData(updated);
                        }}
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                        placeholder="Deskripsikan harapan perubahan..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Tindakan Kepemimpinan (Langkah Nyata)
                      </label>
                      <textarea
                        rows={3}
                        value={row.tindakan}
                        onChange={(e) => {
                          const updated = [...pillarsData];
                          updated[index].tindakan = e.target.value;
                          setPillarsData(updated);
                        }}
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                        placeholder="Langkah konkret kepala sekolah..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <span className="text-xs text-slate-500">
                Data akan dipresentasikan saat diskusi pleno Google Meet utama.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSavePillars}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Simpan Matriks 3 Pilar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSavePillars();
                    setActiveStage('learnagain');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                >
                  Lanjut ke LEARN AGAIN (Padlet) →
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* STAGE 4: LEARN AGAIN (Padlet Warisan Kepemimpinan) */}
      {activeStage === 'learnagain' && (
        <div className="space-y-6">
          
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Tahap 4 — LEARN AGAIN: Refleksi Warisan Kepemimpinan (Padlet Digital)
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Lengkapi kalimat refleksi warisan dan tentukan satu tindakan paling kecil serta realistis yang dapat Anda mulai lakukan besok.
            </p>

            {/* Padlet Post Creator */}
            <form onSubmit={handleAddPadlet} className="bg-indigo-50/50 p-4 border border-indigo-100 rounded-xl mb-6 space-y-3">
              <div>
                <label className="block text-xs font-bold text-indigo-950 mb-1">
                  1. "Saat saya pensiun atau bahkan saat saya sudah tiada, saya ingin agar semua anak belajar di lingkungan sekolah yang...."
                </label>
                <textarea
                  rows={2}
                  required
                  value={padletVision}
                  onChange={(e) => setPadletVision(e.target.value)}
                  placeholder="Lanjutkan kalimat ini dengan visi tulus Anda untuk murid..."
                  className="w-full text-xs p-2.5 bg-white border border-indigo-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-950 mb-1">
                  2. "Tindakan paling kecil dan realistis yang dapat saya lakukan besok atau minggu ini adalah...."
                </label>
                <textarea
                  rows={2}
                  required
                  value={padletAction}
                  onChange={(e) => setPadletAction(e.target.value)}
                  placeholder="Contoh: Mengajak bicara empat mata guru yang tampak terbebani..."
                  className="w-full text-xs p-2.5 bg-white border border-indigo-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Warna Catatan:</span>
                  {['amber', 'emerald', 'blue', 'rose'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPadletColor(c)}
                      className={`w-5 h-5 rounded-full border ${
                        c === 'amber' ? 'bg-amber-300' : c === 'emerald' ? 'bg-emerald-300' : c === 'blue' ? 'bg-blue-300' : 'bg-rose-300'
                      } ${padletColor === c ? 'ring-2 ring-indigo-600 scale-110' : ''}`}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Tempel ke Papan Padlet
                </button>
              </div>
            </form>

            {/* Padlet Sticky Notes Board */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {padletNotes.map((note) => {
                let colorClass = "bg-amber-50 border-amber-200 text-amber-950";
                if (note.color === 'emerald') colorClass = "bg-emerald-50 border-emerald-200 text-emerald-950";
                if (note.color === 'blue') colorClass = "bg-blue-50 border-blue-200 text-blue-950";
                if (note.color === 'rose') colorClass = "bg-rose-50 border-rose-200 text-rose-950";

                return (
                  <div key={note.id} className={`p-4 rounded-xl border shadow-xs space-y-2 flex flex-col justify-between ${colorClass}`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-black/10 pb-1.5 text-xs">
                        <span className="font-bold truncate">{note.authorName}</span>
                        <span className="text-[10px] opacity-70">{note.timestamp}</span>
                      </div>
                      <p className="text-xs font-medium leading-relaxed italic">
                        "{note.content}"
                      </p>
                      {note.subContent && (
                        <p className="text-xs leading-relaxed font-semibold pt-1 border-t border-black/10">
                          {note.subContent}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <span className="text-[10px] opacity-70 truncate">{note.schoolName}</span>
                      <button
                        onClick={() => onLikePadletNote(note.id)}
                        className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                        <span className="text-[11px] font-bold">{note.likes}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveStage('assignment')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Lanjut ke Pendalaman Asinkronus (Tugas Moodle) →
              </button>
            </div>

          </div>

        </div>
      )}

      {/* STAGE 5: PENDALAMAN ASINKRONUS (Assignment Moodle & Peer Review) */}
      {activeStage === 'assignment' && (
        <div className="space-y-6">
          
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <FileEdit className="w-5 h-5 text-indigo-600" />
                  Tugas Asinkronus Modul 1: "Warisan Kepemimpinan Saya"
                </h3>
                <p className="text-xs text-slate-500">
                  Durasi: 20 Menit Asinkronus Moodle. Tuliskan 5 komponen warisan kepemimpinan Anda secara mendalam.
                </p>
              </div>
              {assignmentData.submittedAt && (
                <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                  Status: {assignmentData.submittedAt}
                </span>
              )}
            </div>

            {/* 5-Field Assignment Form */}
            <form onSubmit={handleSaveAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  1. Warisan kepemimpinan yang ingin dibangun di sekolah:
                </label>
                <textarea
                  rows={2}
                  required
                  value={assignmentData.warisanInginDibangun}
                  onChange={(e) => setAssignmentData({ ...assignmentData, warisanInginDibangun: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  2. Nilai pribadi yang menjadi pondasinya:
                </label>
                <textarea
                  rows={2}
                  required
                  value={assignmentData.nilaiPribadiPondasi}
                  onChange={(e) => setAssignmentData({ ...assignmentData, nilaiPribadiPondasi: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  3. Budaya sekolah yang ingin dibangun secara konsisten:
                </label>
                <textarea
                  rows={2}
                  required
                  value={assignmentData.budayaSekolah}
                  onChange={(e) => setAssignmentData({ ...assignmentData, budayaSekolah: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  4. Cara memberdayakan guru dan tenaga kependidikan:
                </label>
                <textarea
                  rows={2}
                  required
                  value={assignmentData.caraMemberdayakanGuru}
                  onChange={(e) => setAssignmentData({ ...assignmentData, caraMemberdayakanGuru: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  5. Satu tindakan nyata terdekat yang akan dilakukan:
                </label>
                <textarea
                  rows={2}
                  required
                  value={assignmentData.satuTindakanAwal}
                  onChange={(e) => setAssignmentData({ ...assignmentData, satuTindakanAwal: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {isAssignmentSaved && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Tugas berhasil dikirim ke Moodle!
                  </span>
                )}
                <div className="ml-auto">
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Kirim Tugas Modul 1
                  </button>
                </div>
              </div>
            </form>

            {/* Peer Review Requirement Card */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 mb-4">
                <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mb-1">
                  <Users className="w-4 h-4 text-amber-700" />
                  Kewajiban Umpan Balik Sebaya (Peer Feedback):
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed italic">
                  “Peserta memberikan umpan balik kepada minimal 1 peserta lain, dengan pertanyaan: 
                  <strong>'Apakah rencana tersebut sudah mempertimbangkan kebutuhan murid yang beragam, termasuk gender, kondisi sosial ekonomi dan penyandang disabilitas?'</strong>”
                </p>
              </div>

              {/* Existing Peer Feedbacks */}
              <div className="space-y-3 mb-4">
                {assignmentData.peerFeedback?.map((fb, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{fb.reviewerName}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {fb.inclusivityCheck ? '✓ Inklusivitas Terpenuhi' : 'Perlu Peningkatan Inklusivitas'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">{fb.reviewerSchool}</p>
                    <p className="text-slate-700 pt-1 leading-relaxed">{fb.feedback}</p>
                  </div>
                ))}
              </div>

              {/* Add Peer Feedback Box */}
              <form onSubmit={handleAddPeerFeedback} className="p-4 bg-slate-100/70 rounded-xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-slate-800 text-xs">
                  Berikan Umpan Balik kepada Rekan Kepala Sekolah:
                </h5>
                <textarea
                  rows={2}
                  required
                  value={peerComment}
                  onChange={(e) => setPeerComment(e.target.value)}
                  placeholder="Tuliskan analisis Anda mengenai keberagaman murid, gender, dan disabilitas dalam rencana rekan..."
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={peerInclusiveCheck}
                      onChange={(e) => setPeerInclusiveCheck(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Rencana sudah mempertimbangkan kebutuhan murid rentan</span>
                  </label>

                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-lg shadow-xs"
                  >
                    Kirim Umpan Balik
                  </button>
                </div>
              </form>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
