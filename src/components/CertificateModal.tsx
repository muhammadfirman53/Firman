import React, { useState } from 'react';
import { ParticipantProfile, TopicId, TopicReviewRecord } from '../types';
import { TRAINING_INFO, LEARNING_OBJECTIVES, COURSE_TOPICS } from '../data/courseData';
import { TopicCompletionItem } from '../utils/topicProgression';
import {
  Award,
  CheckCircle2,
  Download,
  Printer,
  ShieldCheck,
  X,
  Lock,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Clock,
  FileCheck2
} from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParticipantProfile;
  preScore: number | null;
  postScore: number | null;
  isEligible?: boolean;
  completedTopicsCount?: number;
  missingTopics?: TopicCompletionItem[];
  isTopic5Approved?: boolean;
  topic5Review?: TopicReviewRecord;
  awaitingTopic5Review?: boolean;
  onNavigateTopic?: (topicId: TopicId) => void;
  isAdmin?: boolean;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  profile,
  preScore,
  postScore,
  isEligible = false,
  completedTopicsCount = 0,
  missingTopics = [],
  isTopic5Approved = false,
  topic5Review,
  awaitingTopic5Review = false,
  onNavigateTopic,
  isAdmin = false,
}) => {
  const [adminBypass, setAdminBypass] = useState<boolean>(false);

  if (!isOpen) return null;

  const canShowCertificate = isEligible || (isAdmin && adminBypass);

  const handlePrint = () => {
    window.print();
  };

  const handleGoToTopic = (tid: TopicId) => {
    onClose();
    if (onNavigateTopic) {
      onNavigateTopic(tid);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              E-Sertifikat Kelulusan Resmi Pelatihan (7 JP)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {canShowCertificate && (
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                Cetak / Simpan PDF
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOCKED SCREEN IF NOT ELIGIBLE */}
        {!canShowCertificate ? (
          <div className="p-6 sm:p-10 space-y-6">
            {awaitingTopic5Review ? (
              /* SPECIFIC SCREEN: ALL TOPICS COMPLETED, WAITING FOR ADMIN REVIEW ON TOPIC 5 */
              <div className="max-w-xl mx-auto text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 border-2 border-amber-300 flex items-center justify-center mx-auto shadow-sm animate-pulse">
                  <Clock className="w-8 h-8 text-amber-700" />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Status: Menunggu Koreksi Tugas Akhir Topik 5</span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                    Tugas Akhir Berhasil Dikirimkan
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                    Seluruh materi Topik 1 s.d. 5, pelaksanaan Post-Test, serta Lembar Refleksi 3-2-1 telah selesai Anda kerjakan. <strong>E-Sertifikat resmi kelulusan 7 JP akan otomatis keluar dan dapat diunduh setelah Admin / Fasilitator (Muhamad Firman, S.Pd) selesai mengoreksi tugas akhir Anda pada Topik 5.</strong>
                  </p>
                </div>

                {/* Status Box */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left space-y-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Informasi Penugasan & Antrean Koreksi:
                  </span>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-600">Ketuntasan Topik (1 - 5)</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        5 dari 5 Topik Tuntas (100%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-600">Post-Test Topik 5</span>
                      <span className="font-bold text-slate-800">
                        {postScore !== null ? `${postScore} Poin (Tuntas)` : 'Tuntas Tersimpan'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-600">Lembar Refleksi 3-2-1</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <FileCheck2 className="w-4 h-4 text-emerald-600" />
                        Tersimpan di Sistem
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-amber-50/80 rounded-xl border border-amber-200">
                      <span className="text-amber-900 font-medium">Status Koreksi Fasilitator</span>
                      <span className="font-bold text-amber-800 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                        Sedang Dalam Antrean Penilaian
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-600">Fasilitator Penguji</span>
                      <span className="font-bold text-slate-800">
                        {TRAINING_INFO.facilitator} ({TRAINING_INFO.facilitatorId})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* SCREEN: MISSING TOPICS */
              <div className="max-w-xl mx-auto text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 border-2 border-amber-300 flex items-center justify-center mx-auto shadow-sm">
                  <Lock className="w-8 h-8 text-amber-700" />
                </div>

                <h4 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                  Akses E-Sertifikat Masih Terkunci
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Sesuai dengan ketentuan program, link dan akses E-Sertifikat resmi hanya dapat digunakan apabila <strong>semua 5 topik pelatihan</strong> sudah selesai dikerjakan secara tuntas dan disahkan oleh fasilitator.
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                  <span>Status Capaian: {completedTopicsCount} dari 5 Topik Selesai</span>
                </div>
              </div>
            )}

            {/* Checklist of all 5 topics */}
            {!awaitingTopic5Review && (
              <div className="max-w-xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Status Ketuntasan Topik Pelatihan:
                </span>

                <div className="space-y-2">
                  {COURSE_TOPICS.map((topic) => {
                    const isMissing = missingTopics.some((m) => m.id === topic.id);
                    const isDone = !isMissing;

                    return (
                      <div
                        key={topic.id}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                          isDone
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                            : 'bg-white border-amber-200 text-slate-700 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <span className="font-bold block truncate">
                              Topik {topic.number}: {topic.title}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {topic.mode} • {topic.duration}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 ml-2">
                          {isDone ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                              ✓ Tuntas
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleGoToTopic(topic.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                            >
                              <span>Kerjakan</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Admin Override Banner */}
            {isAdmin && (
              <div className="max-w-xl mx-auto p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-indigo-900">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Hak Akses Fasilitator / Admin</span>
                    <span className="text-slate-600 text-[11px]">
                      {awaitingTopic5Review
                        ? 'Anda dapat membuka pratinjau sertifikat secara langsung atau melakukan koreksi Topik 5 melalui Dashboard Admin.'
                        : 'Anda dapat membuka pratinjau sertifikat untuk keperluan verifikasi atau pencetakan.'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAdminBypass(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shrink-0 transition-colors"
                >
                  Buka Sertifikat (Override)
                </button>
              </div>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Kembali ke Kursus
              </button>
            </div>
          </div>
        ) : (
          /* Printable Certificate Canvas */
          <div className="p-6 sm:p-10 bg-gradient-to-b from-amber-50/20 via-white to-amber-50/10 print:p-8">
            <div className="border-4 border-double border-indigo-900/40 p-6 sm:p-8 rounded-xl relative bg-white shadow-xs">
              
              {/* Watermark Emblem */}
              <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
                <Award className="w-96 h-96 text-indigo-950" />
              </div>

              {/* Certificate Header */}
              <div className="text-center space-y-1 relative z-10 border-b border-slate-200 pb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-bold tracking-widest uppercase mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Sertifikat Pengembangan Keprofesian Berkelanjutan
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-serif">
                  SERTIFIKAT KELULUSAN
                </h2>
                <p className="text-xs text-slate-500 font-mono tracking-wider">
                  NOMOR: 421.2/PKB-KS/2026/088-F
                </p>
              </div>

              {/* Recipient Statement */}
              <div className="text-center my-6 space-y-3 relative z-10">
                <p className="text-xs text-slate-600 italic">Diberikan dengan hormat dan apresiasi setinggi-tingginya kepada:</p>
                
                <div className="py-2 border-y border-dashed border-indigo-200/80 max-w-xl mx-auto">
                  <h3 className="text-xl sm:text-2xl font-bold text-indigo-950 font-serif">
                    {profile.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    NIP: {profile.nip || '-'} • Unit Kerja: {profile.schoolName}
                  </p>
                  <p className="text-[11px] text-slate-500">{profile.district}</p>
                </div>

                <p className="text-xs text-slate-700 max-w-2xl mx-auto leading-relaxed pt-2">
                  Telah berhasil menyelesaikan seluruh rangkaian program <strong>Pelatihan Pengembangan Profesional Kepala Sekolah</strong> dengan tema:
                </p>

                <div className="bg-indigo-50/70 border border-indigo-100/90 rounded-xl p-3 max-w-xl mx-auto">
                  <p className="text-sm font-bold text-indigo-900">
                    "{TRAINING_INFO.theme}"
                  </p>
                  <p className="text-xs text-indigo-700 mt-1">
                    Metode: Blended Learning (Sinkronus + Asinkronus) • Durasi: 7 Jam Pelajaran Efektif (420 Menit)
                  </p>
                </div>
              </div>

              {/* Learning Outcomes Summary */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs text-slate-700 mb-6 relative z-10">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Capaian Kompetensi & Rencana Aksi Nyata:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-600">
                  <li>• Memahami 3 Pilar Warisan Kepemimpinan</li>
                  <li>• Mengidentifikasi Nilai Diri & Keteladanan</li>
                  <li>• Analisis Kasus Inklusifitas Sekolah (PBL)</li>
                  <li>• Transformasi Pola Pikir Tetap ke Bertumbuh</li>
                  <li>• Praktik Reframing Kasus Defisit di Sekolah</li>
                  <li>• Menyusun Action Plan Perubahan Sekolah Realistis</li>
                </ul>
              </div>

              {/* Facilitator Review & Verification Notice */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3.5 text-xs mb-6 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-bold text-emerald-950">
                      Pengesahan Tugas Akhir Topik 5 & Kelulusan Resmi
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md font-semibold">
                    Nilai Tugas Akhir: {topic5Review?.score ?? (postScore ?? 90)} / 100 • Status: Disetujui
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  Peserta telah dinilai dan dikoreksi pada tugas akhir (Refleksi 3-2-1 & Post-Test) oleh Fasilitator Utama <strong>{topic5Review?.reviewedBy || TRAINING_INFO.facilitator}</strong> pada {topic5Review?.reviewedAt || '18 September 2026'}.
                  {topic5Review?.feedback ? ` Catatan: "${topic5Review.feedback}"` : ''}
                </p>
              </div>

              {/* Signatures and Date */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs relative z-10">
                <div className="text-center">
                  <p className="text-[11px] text-slate-500">Mengetahui Peserta,</p>
                  <div className="h-14 flex items-center justify-center font-serif text-sm font-bold text-slate-700 italic">
                    (Tertanda Digital)
                  </div>
                  <p className="font-bold text-slate-800 border-t border-slate-300 inline-block px-4 pt-1">
                    {profile.name}
                  </p>
                  <p className="text-[10px] text-slate-500">Kepala Sekolah Peserta</p>
                </div>

                <div className="text-center">
                  <p className="text-[11px] text-slate-500">Jakarta, 18 September 2026</p>
                  <p className="text-[11px] text-slate-500">Fasilitator Utama Pelatihan,</p>
                  <div className="h-14 flex items-center justify-center font-serif text-sm font-bold text-indigo-900 italic">
                    Muhamad Firman
                  </div>
                  <p className="font-bold text-slate-800 border-t border-slate-300 inline-block px-4 pt-1">
                    {TRAINING_INFO.facilitator}
                  </p>
                  <p className="text-[10px] text-slate-500">ID Fasilitator: {TRAINING_INFO.facilitatorId}</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Modal Bottom Actions (Hidden in Print) */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <span>Sertifikat ini resmi dan terverifikasi dalam sistem Moodle Pelatihan.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-xs"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
