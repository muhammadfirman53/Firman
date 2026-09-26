import React, { useState, useMemo } from 'react';
import { ParticipantProfile, MindsetTransformationRow } from '../types';
import { REFRAMING_CASES } from '../data/courseData';
import {
  Brain,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileCheck,
  Heart,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Plus,
  RotateCcw,
  Save,
  Send,
  Sparkles,
  Target,
  Trash2,
  Users
} from 'lucide-react';

interface TopicModul2Props {
  profile: ParticipantProfile;
  transformations: MindsetTransformationRow[];
  onSaveTransformations: (data: MindsetTransformationRow[]) => void;
  onMarkTaskComplete: (taskId: string) => void;
}

export const TopicModul2: React.FC<TopicModul2Props> = ({
  profile,
  transformations,
  onSaveTransformations,
  onMarkTaskComplete,
}) => {
  const [activeStage, setActiveStage] = useState<'relate' | 'explore' | 'apply' | 'learnagain' | 'closing' | 'forum'>('relate');

  // Relate Stage Inputs
  const [failureStory, setFailureStory] = useState('');
  const [whatThought, setWhatThought] = useState('');
  const [whatDidAfter, setWhatDidAfter] = useState('');

  // Explore Stage - Canvas rows
  const [canvasRows, setCanvasRows] = useState<MindsetTransformationRow[]>(transformations);
  const [newFixed, setNewFixed] = useState('');
  const [newGrowth, setNewGrowth] = useState('');
  const [newAction, setNewAction] = useState('');
  const [isCanvasSaved, setIsCanvasSaved] = useState(false);

  // Apply Stage - Reframing Practice
  const [userReframingAnswers, setUserReframingAnswers] = useState<Record<string, string>>({});

  // Learn Again Padlet
  const [padletNotes, setPadletNotes] = useState<{ id: string; author: string; text: string; likes: number }[]>([]);
  const [padletInput, setPadletInput] = useState('');

  // Closing Commitment
  const [hasDeclaredCommitment, setHasDeclaredCommitment] = useState(false);

  // Forum Reflektif Modul 2
  const [forumAnswers, setForumAnswers] = useState({
    fixedAppears: '',
    growthShouldUse: '',
    realAction: ''
  });
  const [peerResponses, setPeerResponses] = useState<string[]>([]);
  const [newPeerComment, setNewPeerComment] = useState('');
  const [isForumSaved, setIsForumSaved] = useState(false);

  const handleAddCanvasRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFixed.trim() || !newGrowth.trim()) return;

    const newRow: MindsetTransformationRow = {
      id: 'mt-' + Date.now(),
      pikiranTetap: newFixed.trim(),
      sayaUbahMenjadi: newGrowth.trim(),
      aksiNyata: newAction.trim() || 'Mencoba langkah kecil perbaikan minggu ini'
    };

    const updated = [...canvasRows, newRow];
    setCanvasRows(updated);
    onSaveTransformations(updated);
    setNewFixed('');
    setNewGrowth('');
    setNewAction('');
    setIsCanvasSaved(true);
    setTimeout(() => setIsCanvasSaved(false), 3000);
    onMarkTaskComplete('explore-mindset');
  };

  const handleDeleteCanvasRow = (id: string) => {
    const updated = canvasRows.filter((r) => r.id !== id);
    setCanvasRows(updated);
    onSaveTransformations(updated);
  };

  const handleSaveAllCanvas = () => {
    onSaveTransformations(canvasRows);
    setIsCanvasSaved(true);
    setTimeout(() => setIsCanvasSaved(false), 3000);
    onMarkTaskComplete('explore-mindset');
  };

  const handleAddPadletModul2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!padletInput.trim()) return;

    setPadletNotes([
      ...padletNotes,
      {
        id: 'p2-' + Date.now(),
        author: profile.name,
        text: 'Ternyata pola pikir bertumbuh itu ' + padletInput.trim(),
        likes: 0
      }
    ]);
    setPadletInput('');
    onMarkTaskComplete('learnagain-padlet2');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Topik 3 (Modul 2)
          </span>
          <span className="bg-white/10 text-slate-200 text-xs px-2.5 py-0.5 rounded-full">
            150 Menit Sinkronus + 30 Menit Asinkronus
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          Modul 2: Pemimpin Perubahan dengan Pola Pikir Bertumbuh
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
          Mengubah pola pikir tetap (fixed mindset) menjadi pola pikir bertumbuh (growth mindset) dalam memimpin sekolah, menghadapi tantangan, dan menumbuhkan komitmen perubahan.
        </p>
      </div>

      {/* Stage Flow Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'relate', label: '1. RELATE (10m)', sub: 'Cerita Kegagalan' },
          { id: 'explore', label: '2. EXPLORE (50m)', sub: 'Transformation Canvas' },
          { id: 'apply', label: '3. APPLY (20m)', sub: 'Latihan 3 Studi Kasus' },
          { id: 'learnagain', label: '4. LEARN AGAIN (10m)', sub: 'Padlet Refleksi' },
          { id: 'closing', label: '5. PENUTUP (20m)', sub: 'Komitmen Bersama' },
          { id: 'forum', label: '6. FORUM ASYN (30m)', sub: 'Forum Reflektif' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStage(tab.id as any)}
            className={`p-2 rounded-xl text-left border transition-all ${
              activeStage === tab.id
                ? 'bg-purple-50 border-purple-500 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="block font-bold text-slate-800 text-xs">{tab.label}</span>
            <span className="text-[10px] text-slate-500 truncate block">{tab.sub}</span>
          </button>
        ))}
      </div>

      {/* STAGE 1: RELATE (Cerita Kegagalan) */}
      {activeStage === 'relate' && (
        <div className="space-y-6">
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
              <Brain className="w-5 h-5" />
              <span>Tahap 1 — RELATE: Refleksi Cerita Kegagalan & Tantangan (10 Menit)</span>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Fasilitator memantik dialog: <em>"Ceritakan satu kegagalan atau tantangan dalam memimpin sekolah. Apa yang Anda pikirkan saat itu dan apa yang Anda lakukan setelah mengalaminya?"</em>
            </p>

            {/* Reflection Questions Form */}
            <div className="space-y-3 bg-purple-50/40 p-4 rounded-xl border border-purple-100">
              <div>
                <label className="block text-xs font-bold text-purple-950 mb-1">
                  1. Cerita tantangan / kegagalan memimpin sekolah yang pernah Anda hadapi:
                </label>
                <textarea
                  rows={2}
                  value={failureStory}
                  onChange={(e) => setFailureStory(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-purple-200 rounded-lg focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-950 mb-1">
                  2. Apa yang Anda pikirkan saat mengalami situasi tersebut? (Pola Pikir Awal)
                </label>
                <textarea
                  rows={2}
                  value={whatThought}
                  onChange={(e) => setWhatThought(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-purple-200 rounded-lg focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-950 mb-1">
                  3. Apa yang Anda lakukan setelah mengalaminya? (Respons Aksi)
                </label>
                <textarea
                  rows={2}
                  value={whatDidAfter}
                  onChange={(e) => setWhatDidAfter(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-purple-200 rounded-lg focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Theory Card: Fixed vs Growth Mindset */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-purple-950 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-purple-700" />
                Konsep Dasar: Pola Pikir Tetap vs Pola Pikir Bertumbuh (Carol Dweck)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-rose-200">
                  <span className="font-bold text-rose-700 block mb-1">Pola Pikir Tetap (Fixed Mindset)</span>
                  <p className="text-[11px] text-slate-600">
                    Meyakini kemampuan guru/murid bersifat bawaan dan tidak bisa diubah. Cenderung menghindari tantangan, menyalahkan keadaan, dan takut gagal.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-700 block mb-1">Pola Pikir Bertumbuh (Growth Mindset)</span>
                  <p className="text-[11px] text-slate-600">
                    Meyakini kemampuan dapat diasah melalui komitmen, strategi baru, dan usaha konsisten. Melihat kegagalan sebagai data untuk bertumbuh.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  onMarkTaskComplete('relate-kegagalan');
                  setActiveStage('explore');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs"
              >
                Lanjut ke Tahap 2: EXPLORE (Transformation Canvas) →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STAGE 2: EXPLORE (Growth Mindset Transformation Canvas) */}
      {activeStage === 'explore' && (
        <div className="space-y-6">
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Tahap 2 — EXPLORE: Growth Mindset Transformation Canvas (50 Menit)
                </h3>
                <p className="text-xs text-slate-500">
                  Identifikasi pola pikir tetap yang kerap muncul di lingkungan sekolah, lalu lakukan pembingkaian ulang (reframing) menjadi pola pikir bertumbuh dan aksi nyata.
                </p>
              </div>

              {isCanvasSaved && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Canvas berhasil disimpan!
                </span>
              )}
            </div>

            {/* Table of Transformations */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                    <th className="p-3 w-1/3 text-rose-800 bg-rose-50/50">Pikiran Tetap Saya (Fixed)</th>
                    <th className="p-3 w-1/3 text-emerald-800 bg-emerald-50/50">Saya Ubah Menjadi (Growth)</th>
                    <th className="p-3 w-1/4 text-indigo-800 bg-indigo-50/50">Aksi Nyata</th>
                    <th className="p-3 w-12 text-center">Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {canvasRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60">
                      <td className="p-3 text-slate-700 bg-rose-50/20 leading-relaxed font-medium">
                        "{row.pikiranTetap}"
                      </td>
                      <td className="p-3 text-slate-700 bg-emerald-50/20 leading-relaxed font-medium">
                        "{row.sayaUbahMenjadi}"
                      </td>
                      <td className="p-3 text-slate-700 bg-indigo-50/20 leading-relaxed font-medium">
                        {row.aksiNyata}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteCanvasRow(row.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Hapus baris"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Row Form */}
            <form onSubmit={handleAddCanvasRow} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-purple-600" />
                Tambah Baris Transformasi Pikiran Baru:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Pikiran Tetap Saya (Fixed)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newFixed}
                    onChange={(e) => setNewFixed(e.target.value)}
                    placeholder="Contoh: Guru-guru malas menggunakan perangkat lunak baru..."
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Saya Ubah Menjadi (Growth)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newGrowth}
                    onChange={(e) => setNewGrowth(e.target.value)}
                    placeholder="Contoh: Mereka membutuhkan pendampingan bertahap dari rekan sebaya..."
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Aksi Nyata
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    placeholder="Contoh: Menjadwalkan rekan sebaya untuk coaching 15 menit..."
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs"
                >
                  Tambahkan ke Canvas
                </button>
              </div>
            </form>

            {/* Concept Keynote */}
            <div className="p-4 bg-purple-900 text-white rounded-xl shadow-xs">
              <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Penegasan Konsep Fasilitator Muhamad Firman, S.Pd
              </h5>
              <p className="text-xs leading-relaxed font-serif italic text-purple-100">
                “Pola pikir bertumbuh adalah keyakinan mendalam bahwa kemampuan diri sendiri ataupun orang lain dapat senantiasa bertumbuh dan bertransformasi melalui ikhtiar nyata, kemauan berefleksi, dan komitmen pantang menyerah.”
              </p>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={handleSaveAllCanvas}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Simpan Seluruh Canvas
              </button>

              <button
                type="button"
                onClick={() => {
                  handleSaveAllCanvas();
                  setActiveStage('apply');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs"
              >
                Lanjut ke Tahap 3: APPLY (3 Kasus Reframing) →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STAGE 3: APPLY (3 Studi Kasus Mengubah Pola Pikir) */}
      {activeStage === 'apply' && (
        <div className="space-y-6">
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-700" />
                Tahap 3 — APPLY: Latihan Mengubah Pola Pikir (20 Menit)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Praktikkan bagaimana membingkai ulang 3 pernyataan berpola pikir tetap di bawah ini menjadi pola pikir bertumbuh yang solutif.
              </p>
            </div>

            <div className="space-y-6">
              {REFRAMING_CASES.map((rc, idx) => (
                <div key={rc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  
                  {/* Fixed Case Header */}
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700 uppercase">
                      Studi Kasus {idx + 1}
                    </span>
                  </div>

                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-rose-700 block">Pernyataan Pola Pikir Tetap (Fixed Mindset):</span>
                    <p className="font-serif italic font-bold text-xs sm:text-sm text-rose-950 mt-0.5">
                      "{rc.fixedStatement}"
                    </p>
                  </div>

                  {/* Participant Reframing Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Bagaimana Anda mengubahnya menjadi Pola Pikir Bertumbuh & Rencana Tindakan?
                    </label>
                    <textarea
                      rows={2}
                      value={userReframingAnswers[rc.id] || ''}
                      onChange={(e) =>
                        setUserReframingAnswers({ ...userReframingAnswers, [rc.id]: e.target.value })
                      }
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  {/* Expert Insight Comparison */}
                  <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-950 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-[11px] text-emerald-800">
                      <Sparkles className="w-3.5 h-3.5" /> Teladan Reframing dari Fasilitator:
                    </span>
                    <p className="italic font-medium">{rc.growthPerspective}</p>
                    <p className="text-[11px] text-slate-600 pt-1">
                      <strong>Contoh Aksi Nyata:</strong> {rc.exampleAction}
                    </p>
                  </div>

                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  onMarkTaskComplete('apply-reframing');
                  setActiveStage('learnagain');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs"
              >
                Lanjut ke Tahap 4: LEARN AGAIN (Padlet) →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STAGE 4: LEARN AGAIN (Padlet Modul 2) */}
      {activeStage === 'learnagain' && (
        <div className="space-y-6">
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Tahap 4 — LEARN AGAIN: Refleksi Padlet (10 Menit)
            </h3>
            <p className="text-xs text-slate-600">
              Lengkapi kalimat pada papan refleksi: <em>"Ternyata pola pikir bertumbuh itu...."</em>
            </p>

            {/* Input Note */}
            <form onSubmit={handleAddPadletModul2} className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  required
                  value={padletInput}
                  onChange={(e) => setPadletInput(e.target.value)}
                  placeholder="Ternyata pola pikir bertumbuh itu bukan sekadar..."
                  className="w-full text-xs p-2.5 bg-white border border-purple-200 rounded-lg focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs"
              >
                Kirim Refleksi
              </button>
            </form>

            {/* Padlet Feed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {padletNotes.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2">
                  <div className="flex items-center justify-between text-xs border-b border-purple-100 pb-1.5">
                    <span className="font-bold text-purple-950">{p.author}</span>
                    <button
                      onClick={() => {
                        setPadletNotes(
                          padletNotes.map((item) => (item.id === p.id ? { ...item, likes: item.likes + 1 } : item))
                        );
                      }}
                      className="flex items-center gap-1 text-purple-700 hover:text-purple-900"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                      <span className="text-[11px] font-bold">{p.likes}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{p.text}"
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveStage('closing')}
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs"
              >
                Lanjut ke Penutup & Komitmen →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STAGE 5: CLOSING (Komitmen Bersama) */}
      {activeStage === 'closing' && (
        <div className="space-y-6">
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-purple-700" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Penutupan Sesi Sinkronus & Deklarasi Komitmen (20 Menit)
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Fasilitator Muhamad Firman, S.Pd menghubungkan <strong>Tiga Pilar Kepemimpinan</strong> dengan <strong>Growth Mindset</strong>. Perubahan sejati di satuan pendidikan tidak pernah bermula dari instruksi administratif belaka, melainkan dimulai dari keberanian transformasi diri sang pemimpin.
            </p>

            {/* Official Closing Commitment Motto */}
            <div className="p-5 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl shadow-sm border border-purple-800">
              <p className="text-xs uppercase font-bold tracking-widest text-amber-300 mb-2">
                Ikrar Komitmen Kepemimpinan
              </p>
              <p className="font-serif italic text-base sm:text-lg text-white font-medium">
                “Saya akan mulai dari satu tindakan kecil untuk membangun warisan kepemimpinan saya.”
              </p>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  setHasDeclaredCommitment(true);
                  setActiveStage('forum');
                }}
                className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-md transition-all flex items-center gap-2 mx-auto"
              >
                <CheckCircle2 className="w-4 h-4" />
                Saya Berikrar & Lanjut ke Forum Reflektif
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STAGE 6: FORUM ASYNCHRONOUS MODUL 2 */}
      {activeStage === 'forum' && (
        <div className="space-y-6">
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-700" />
                  Forum Reflektif Pendalaman Asinkronus Modul 2 (30 Menit)
                </h3>
                <p className="text-xs text-slate-500">
                  Jawab 3 pertanyaan refleksi di bawah ini dan berikan 1 tanggapan konstruktif terhadap kiriman rekan sejawat.
                </p>
              </div>
            </div>

            {/* 3 Guided Questions Form */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  1. Pola pikir tetap apa yang paling sering muncul dalam kepemimpinan saya?
                </label>
                <textarea
                  rows={2}
                  value={forumAnswers.fixedAppears}
                  onChange={(e) => setForumAnswers({ ...forumAnswers, fixedAppears: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  2. Apa pola pikir bertumbuh yang seharusnya saya gunakan?
                </label>
                <textarea
                  rows={2}
                  value={forumAnswers.growthShouldUse}
                  onChange={(e) => setForumAnswers({ ...forumAnswers, growthShouldUse: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  3. Apa tindakan nyata yang akan saya lakukan?
                </label>
                <textarea
                  rows={2}
                  value={forumAnswers.realAction}
                  onChange={(e) => setForumAnswers({ ...forumAnswers, realAction: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Peer Responses */}
            <div className="space-y-3 pt-2">
              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Tanggapan Konstruktif Rekan Kepala Sekolah:
              </h5>

              {/* Tanggapan awal dari Rekan Kepala Sekolah (Dipastikan Berbeda dengan Nama Peserta) */}
              {(() => {
                const pName = (profile?.name || '').trim().toLowerCase();
                const peerCandidates = [
                  { name: 'Dra. Hj. Siti Nurjanah, M.Pd', school: 'SMP Negeri 1 Cemerlang', time: '10:15 WIB' },
                  { name: 'Drs. H. Ahmad Fauzi, M.M', school: 'SMP Bintang Bangsa', time: '10:20 WIB' },
                  { name: 'Dr. Raden Sukmawati, M.Pd', school: 'SDN Harapan Utama 02', time: '10:25 WIB' },
                  { name: 'H. Bambang Irawan, S.Pd., M.M', school: 'SMA Negeri 3 Merdeka', time: '10:30 WIB' }
                ];
                // Pilih rekan yang namanya tidak mengandung nama peserta dan sebaliknya
                const peer = peerCandidates.find(
                  (c) => !pName.includes(c.name.toLowerCase().split(' ')[1] || '---') && !c.name.toLowerCase().includes(pName || '---')
                ) || peerCandidates[0];

                return (
                  <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-950">
                        {peer.name} <span className="font-normal text-purple-700">({peer.school})</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{peer.time}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      "Refleksi yang sangat mendalam dari Bapak/Ibu Kepala Sekolah. Pergeseran dari menyalahkan keadaan menjadi fokus pada apa yang dapat kita kendalikan melalui keteladanan dan coaching guru adalah inti dari kepemimpinan bertumbuh. Mari saling menguatkan komitmen perubahan ini!"
                    </p>
                  </div>
                );
              })()}

              {/* Tanggapan yang ditambahkan oleh peserta */}
              {peerResponses.map((res, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-indigo-200 text-xs space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950">
                      {profile.name || 'Kepala Sekolah (Anda)'} <span className="font-normal text-indigo-600">({profile.schoolName || 'Satuan Pendidikan Anda'})</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Tanggapan Anda</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{res}</p>
                </div>
              ))}

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newPeerComment}
                  onChange={(e) => setNewPeerComment(e.target.value)}
                  placeholder="Tuliskan tanggapan konstruktif tambahan..."
                  className="flex-1 text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newPeerComment.trim()) {
                      setPeerResponses([...peerResponses, newPeerComment.trim()]);
                      setNewPeerComment('');
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs"
                >
                  Kirim Tanggapan
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              {isForumSaved && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Forum reflektif berhasil disimpan & Modul 2 selesai!
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  onMarkTaskComplete('modul2-forum');
                  setIsForumSaved(true);
                  setTimeout(() => setIsForumSaved(false), 4000);
                }}
                className="ml-auto px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs"
              >
                Simpan & Tandai Selesai Modul 2
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
