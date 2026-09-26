import React, { useState, useEffect } from 'react';
import { ParticipantProfile, ActionPlanData } from '../types';
import { TRAINING_INFO } from '../data/courseData';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  Printer,
  Save,
  Sparkles,
  Target,
  Users
} from 'lucide-react';

interface TopicActionPlanningProps {
  profile: ParticipantProfile;
  actionPlan: ActionPlanData;
  onSaveActionPlan: (data: ActionPlanData) => void;
  onMarkTaskComplete: (taskId: string) => void;
}

export const TopicActionPlanning: React.FC<TopicActionPlanningProps> = ({
  profile,
  actionPlan,
  onSaveActionPlan,
  onMarkTaskComplete,
}) => {
  const [formData, setFormData] = useState<ActionPlanData>(actionPlan);
  const [isSaved, setIsSaved] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    setFormData(actionPlan);
  }, [actionPlan]);

  const updateField = (field: keyof ActionPlanData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onSaveActionPlan(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveActionPlan(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    onMarkTaskComplete('action-plan');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Topik 4: Asinkronus Moodle (70 Menit)
          </span>
          <span className="bg-white/10 text-slate-200 text-xs px-2.5 py-0.5 rounded-full">
            Action Planning Canvas
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          Rencana Perubahan Sekolah (Action Plan Canvas)
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
          Mengintegrasikan materi Warisan Kepemimpinan dan Growth Mindset menjadi peta jalan perubahan nyata di satuan pendidikan Anda.
        </p>
      </div>

      {/* Core Principle Callout */}
      <div className="p-4 bg-amber-50 border-2 border-amber-300/80 rounded-xl flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-amber-800" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
            Prinsip Utama Action Plan:
          </h4>
          <p className="text-xs sm:text-sm font-semibold text-amber-900 mt-0.5 leading-snug">
            “Peserta tidak diminta membuat program besar. Fokusnya: <span className="underline decoration-amber-500 underline-offset-2">'Apa satu perubahan kecil tetapi bermakna yang bisa saya mulai minggu ini?'</span>”
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              viewMode === 'editor'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            1. Formulir Isian Canvas (10 Komponen)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              viewMode === 'preview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            2. Pratinjau Dokumen Resmi & Cetak PDF
          </button>
        </div>

        {isSaved && (
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Action Plan berhasil disimpan!
          </span>
        )}
      </div>

      {/* EDITOR VIEW */}
      {viewMode === 'editor' && (
        <form onSubmit={handleSave} className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Masalah Prioritas */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                1. Masalah Prioritas
              </label>
              <span className="text-[11px] text-slate-500 block mb-1">
                Masalah kepemimpinan apa yang ingin saya ubah?
              </span>
              <textarea
                rows={3}
                value={formData.masalahPrioritas}
                onChange={(e) => updateField('masalahPrioritas', e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* 2. Warisan Kepemimpinan */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                2. Warisan Kepemimpinan
              </label>
              <span className="text-[11px] text-slate-500 block mb-1">
                Perubahan apa yang ingin saya tinggalkan?
              </span>
              <textarea
                rows={3}
                value={formData.warisanKepemimpinan}
                onChange={(e) => updateField('warisanKepemimpinan', e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* 3. Nilai Pribadi */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                3. Nilai Pribadi
              </label>
              <span className="text-[11px] text-slate-500 block mb-1">
                Nilai apa yang menjadi landasan?
              </span>
              <textarea
                rows={2}
                value={formData.nilaiPribadi}
                onChange={(e) => updateField('nilaiPribadi', e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* 4. Budaya */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                4. Budaya Sekolah
              </label>
              <span className="text-[11px] text-slate-500 block mb-1">
                Kebiasaan apa yang perlu dibangun?
              </span>
              <textarea
                rows={2}
                value={formData.budaya}
                onChange={(e) => updateField('budaya', e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* 5. Pemberdayaan */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                5. Pemberdayaan
              </label>
              <span className="text-[11px] text-slate-500 block mb-1">
                Siapa yang perlu diberdayakan?
              </span>
              <textarea
                rows={2}
                value={formData.pemberdayaan}
                onChange={(e) => updateField('pemberdayaan', e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* 6. Fixed Mindset */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-1">
              <label className="block text-xs font-bold text-rose-900">
                6. Fixed Mindset (Pikiran Penghambat)
              </label>
              <span className="text-[11px] text-rose-700 block mb-1">
                Pikiran penghambat apa yang muncul?
              </span>
              <textarea
                rows={2}
                value={formData.fixedMindset}
                onChange={(e) => updateField('fixedMindset', e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-rose-300 rounded-lg focus:ring-1 focus:ring-rose-500"
              />
            </div>

            {/* 7. Growth Mindset */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-1">
              <label className="block text-xs font-bold text-emerald-900">
                7. Growth Mindset (Pembingkaian Ulang)
              </label>
              <span className="text-[11px] text-emerald-700 block mb-1">
                Bagaimana saya mengubahnya?
              </span>
              <textarea
                rows={2}
                value={formData.growthMindset}
                onChange={(e) => updateField('growthMindset', e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-emerald-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* 8. Aksi Pertama */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-1">
              <label className="block text-xs font-bold text-indigo-900">
                8. Aksi (Tindakan Pertama)
              </label>
              <span className="text-[11px] text-indigo-700 block mb-1">
                Apa tindakan pertama yang kecil dan bermakna?
              </span>
              <textarea
                rows={2}
                value={formData.aksi}
                onChange={(e) => updateField('aksi', e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-indigo-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* 9. Indikator */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                9. Indikator Keberhasilan
              </label>
              <span className="text-[11px] text-slate-500 block mb-1">
                Apa bukti bahwa terjadi perubahan?
              </span>
              <textarea
                rows={2}
                value={formData.indikator}
                onChange={(e) => updateField('indikator', e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* 10. Waktu & 11. Dukungan */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  10. Waktu Pelaksanaan
                </label>
                <span className="text-[11px] text-slate-500 block mb-1">Kapan dimulai?</span>
                <input
                  type="text"
                  value={formData.waktu}
                  onChange={(e) => updateField('waktu', e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800">
                  11. Dukungan yang Dibutuhkan
                </label>
                <span className="text-[11px] text-slate-500 block mb-1">Siapa yang membantu?</span>
                <input
                  type="text"
                  value={formData.dukungan}
                  onChange={(e) => updateField('dukungan', e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Dokumen siap diunduh dalam bentuk PDF resmi pada tab pratinjau.
            </span>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                Simpan Action Plan
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
              >
                Lihat Pratinjau Resmi →
              </button>
            </div>
          </div>
        </form>
      )}

      {/* PREVIEW & PRINT VIEW */}
      {viewMode === 'preview' && (
        <div className="space-y-4">
          
          {/* Action Button Bar */}
          <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700">
              Pratinjau Lembar Kerja Rencana Aksi (Action Plan) Kepala Sekolah
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                Cetak / Ekspor PDF
              </button>
            </div>
          </div>

          {/* Official Printable Sheet */}
          <div className="bg-white p-8 sm:p-10 border border-slate-300 rounded-xl shadow-xs text-slate-900 space-y-6">
            
            {/* Header / Kop Pelatihan */}
            <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
              <h3 className="text-sm font-bold tracking-wider uppercase text-slate-700">
                {TRAINING_INFO.organization}
              </h3>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                LEMBAR RENCANA PERUBAHAN SEKOLAH (ACTION PLAN CANVAS)
              </h2>
              <p className="text-xs text-slate-600">
                Tema: {TRAINING_INFO.theme}
              </p>
            </div>

            {/* Identitas Peserta */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <p><strong>Nama Kepala Sekolah:</strong> {profile.name}</p>
                <p><strong>NIP:</strong> {profile.nip || '-'}</p>
              </div>
              <div>
                <p><strong>Unit Kerja / Sekolah:</strong> {profile.schoolName}</p>
                <p><strong>Kabupaten / Kota:</strong> {profile.district}</p>
              </div>
            </div>

            {/* 10-Component Official Table */}
            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2.5 w-1/4 border-r border-slate-300">Komponen</th>
                  <th className="p-2.5 w-1/3 border-r border-slate-300">Pertanyaan Panduan</th>
                  <th className="p-2.5">Rencana Tindakan Kepala Sekolah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                <tr>
                  <td className="p-2.5 font-bold border-r border-slate-300 bg-slate-50/50">Masalah Prioritas</td>
                  <td className="p-2.5 border-r border-slate-300 text-slate-600 italic">Masalah kepemimpinan apa yang ingin saya ubah?</td>
                  <td className="p-2.5 font-medium">{formData.masalahPrioritas}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border-r border-slate-300 bg-slate-50/50">Warisan Kepemimpinan</td>
                  <td className="p-2.5 border-r border-slate-300 text-slate-600 italic">Perubahan apa yang ingin saya tinggalkan?</td>
                  <td className="p-2.5 font-medium">{formData.warisanKepemimpinan}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border-r border-slate-300 bg-slate-50/50">Nilai Pribadi</td>
                  <td className="p-2.5 border-r border-slate-300 text-slate-600 italic">Nilai apa yang menjadi landasan?</td>
                  <td className="p-2.5 font-medium">{formData.nilaiPribadi}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border-r border-slate-300 bg-slate-50/50">Budaya</td>
                  <td className="p-2.5 border-r border-slate-300 text-slate-600 italic">Kebiasaan apa yang perlu dibangun?</td>
                  <td className="p-2.5 font-medium">{formData.budaya}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border-r border-slate-300 bg-slate-50/50">Pemberdayaan</td>
                  <td className="p-2.5 border-r border-slate-300 text-slate-600 italic">Siapa yang perlu diberdayakan?</td>
                  <td className="p-2.5 font-medium">{formData.pemberdayaan}</td>
                </tr>
                <tr className="bg-rose-50/30">
                  <td className="p-2.5 font-bold border-r border-slate-300 text-rose-900">Fixed Mindset</td>
                  <td className="p-2.5 border-r border-slate-300 text-rose-700 italic">Pikiran penghambat apa yang muncul?</td>
                  <td className="p-2.5 font-medium text-rose-950">{formData.fixedMindset}</td>
                </tr>
                <tr className="bg-emerald-50/30">
                  <td className="p-2.5 font-bold border-r border-slate-300 text-emerald-900">Growth Mindset</td>
                  <td className="p-2.5 border-r border-slate-300 text-emerald-700 italic">Bagaimana saya mengubahnya?</td>
                  <td className="p-2.5 font-medium text-emerald-950">{formData.growthMindset}</td>
                </tr>
                <tr className="bg-indigo-50/30">
                  <td className="p-2.5 font-bold border-r border-slate-300 text-indigo-900">Aksi</td>
                  <td className="p-2.5 border-r border-slate-300 text-indigo-700 italic">Apa tindakan pertama?</td>
                  <td className="p-2.5 font-bold text-indigo-950">{formData.aksi}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border-r border-slate-300 bg-slate-50/50">Indikator</td>
                  <td className="p-2.5 border-r border-slate-300 text-slate-600 italic">Apa bukti bahwa terjadi perubahan?</td>
                  <td className="p-2.5 font-medium">{formData.indikator}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border-r border-slate-300 bg-slate-50/50">Waktu</td>
                  <td className="p-2.5 border-r border-slate-300 text-slate-600 italic">Kapan dimulai?</td>
                  <td className="p-2.5 font-medium">{formData.waktu}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border-r border-slate-300 bg-slate-50/50">Dukungan</td>
                  <td className="p-2.5 border-r border-slate-300 text-slate-600 italic">Siapa yang membantu?</td>
                  <td className="p-2.5 font-medium">{formData.dukungan}</td>
                </tr>
              </tbody>
            </table>

            {/* Signature Block */}
            <div className="grid grid-cols-2 gap-8 pt-8 text-xs">
              <div className="text-center">
                <p>Disusun oleh Kepala Sekolah,</p>
                <div className="h-16 flex items-center justify-center font-serif text-sm font-bold text-slate-800 italic">
                  {profile.name}
                </div>
                <p className="font-bold border-t border-slate-400 inline-block px-4 pt-1">
                  {profile.name}
                </p>
                <p className="text-[10px] text-slate-500">NIP: {profile.nip || '-'}</p>
              </div>

              <div className="text-center">
                <p>Mengetahui Fasilitator Pelatihan,</p>
                <div className="h-16 flex items-center justify-center font-serif text-sm font-bold text-slate-800 italic">
                  Muhamad Firman
                </div>
                <p className="font-bold border-t border-slate-400 inline-block px-4 pt-1">
                  {TRAINING_INFO.facilitator}
                </p>
                <p className="text-[10px] text-slate-500">ID Fasilitator: {TRAINING_INFO.facilitatorId}</p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
