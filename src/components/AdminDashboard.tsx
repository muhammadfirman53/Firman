import React, { useState } from 'react';
import { AdminUser, ParticipantUser, CourseMaterial, GoogleMeetConfig, TopicId, ParticipantTopicReviews, TopicReviewRecord } from '../types';
import { AdminMaterialsManager } from './AdminMaterialsManager';
import { AdminMeetManager } from './AdminMeetManager';
import { AdminTopicReviewModal } from './AdminTopicReviewModal';
import { COURSE_TOPICS } from '../data/courseData';
import { getPortalUrl, copyToClipboard } from '../utils/urlRouter';
import { loadParticipantFullBundle } from '../utils/storage';
import { checkCertificateEligibility } from '../utils/topicProgression';
import {
  ShieldCheck,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Search,
  Sparkles,
  Printer,
  Eye,
  Filter,
  GraduationCap,
  Trash2,
  Video,
  Settings,
  Plus,
  Link2,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageSquare,
  Lock,
  Unlock,
  RefreshCw,
  Edit3,
  UserPlus,
  AlertTriangle
} from 'lucide-react';

interface AdminDashboardProps {
  admin: AdminUser;
  participants: ParticipantUser[];
  materials: CourseMaterial[];
  meetConfig: GoogleMeetConfig;
  topicReviews?: ParticipantTopicReviews;
  onSelectParticipantPreview: (p: ParticipantUser) => void;
  onNavigateTopic: (topicId: any) => void;
  onClearParticipants?: () => void;
  onSaveMaterial: (material: CourseMaterial) => void;
  onDeleteMaterial: (materialId: string) => void;
  onSaveMeetConfig: (config: GoogleMeetConfig) => void;
  onSaveTopicReview?: (participantId: string, topicId: string, review: TopicReviewRecord) => void;
  onBatchApproveAllTopics?: (participantId: string) => void;
  onRefreshData?: () => void;
  onAddParticipant?: (participant: ParticipantUser) => void;
  onUpdateParticipant?: (participant: ParticipantUser) => void;
  onDeleteParticipant?: (participantId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  participants,
  materials,
  meetConfig,
  topicReviews = {},
  onSelectParticipantPreview,
  onNavigateTopic,
  onClearParticipants,
  onSaveMaterial,
  onDeleteMaterial,
  onSaveMeetConfig,
  onSaveTopicReview,
  onBatchApproveAllTopics,
  onRefreshData,
  onAddParticipant,
  onUpdateParticipant,
  onDeleteParticipant,
}) => {
  const [activeTab, setActiveTab] = useState<'participants' | 'materials' | 'meet'>('participants');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanParticipant, setSelectedPlanParticipant] = useState<ParticipantUser | null>(null);
  const [reviewingParticipant, setReviewingParticipant] = useState<ParticipantUser | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<ParticipantUser | null>(null);
  const [deleteTargetParticipant, setDeleteTargetParticipant] = useState<ParticipantUser | null>(null);

  const [participantForm, setParticipantForm] = useState({
    name: '',
    nip: '',
    schoolName: '',
    district: 'Jawa Barat',
    email: '',
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefreshData?.();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleOpenAddModal = () => {
    setParticipantForm({
      name: '',
      nip: '',
      schoolName: '',
      district: 'Jawa Barat',
      email: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: ParticipantUser) => {
    setParticipantForm({
      name: p.name,
      nip: p.nip && p.nip !== '-' ? p.nip : '',
      schoolName: p.schoolName,
      district: p.district || 'Jawa Barat',
      email: p.email || '',
    });
    setEditingParticipant(p);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantForm.name.trim() || !participantForm.schoolName.trim()) return;

    const newP: ParticipantUser = {
      id: `ks-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: participantForm.name.trim(),
      nip: participantForm.nip.trim() || '-',
      schoolName: participantForm.schoolName.trim(),
      district: participantForm.district.trim() || 'Jawa Barat',
      email: participantForm.email.trim(),
      role: 'peserta',
      registeredAt: new Date().toISOString().split('T')[0]
    };

    onAddParticipant?.(newP);
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant || !participantForm.name.trim() || !participantForm.schoolName.trim()) return;

    const updated: ParticipantUser = {
      ...editingParticipant,
      name: participantForm.name.trim(),
      nip: participantForm.nip.trim() || '-',
      schoolName: participantForm.schoolName.trim(),
      district: participantForm.district.trim() || 'Jawa Barat',
      email: participantForm.email.trim(),
    };

    onUpdateParticipant?.(updated);
    setEditingParticipant(null);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetParticipant) {
      onDeleteParticipant?.(deleteTargetParticipant.id);
      setDeleteTargetParticipant(null);
    }
  };

  // Dynamic progress display across participants using actual saved bundles
  const participantStats = participants.map((p) => {
    const bundle = loadParticipantFullBundle(p.id);
    const pReviews = topicReviews[p.id] || bundle.reviews || {};
    const approvedTopicsCount = COURSE_TOPICS.filter((t) => pReviews[t.id]?.isApproved).length;
    const isAllApproved = approvedTopicsCount === 5;
    const certCheck = checkCertificateEligibility(bundle.progress, pReviews);

    const m1Done = Boolean(
      pReviews['topik-2']?.isApproved ||
      bundle.threePillars.some((r) => r.tindakan?.trim() || r.kondisiSaatIni?.trim()) ||
      bundle.assignment.warisanInginDibangun?.trim() ||
      bundle.progress['apply-pillars'] ||
      bundle.progress['modul1-assignment']
    );

    const m2Done = Boolean(
      pReviews['topik-3']?.isApproved ||
      bundle.mindset.some((r) => r.sayaUbahMenjadi?.trim() || r.aksiNyata?.trim()) ||
      bundle.progress['apply-reframing'] ||
      bundle.progress['explore-mindset']
    );

    const actionPlanHasContent = Boolean(
      bundle.actionPlan.masalahPrioritas?.trim() ||
      bundle.actionPlan.warisanKepemimpinan?.trim() ||
      bundle.actionPlan.aksi?.trim() ||
      bundle.progress['action-plan']
    );

    const reflectionHasContent = Boolean(
      bundle.scores.postTestScore !== null ||
      bundle.reflection321.satuTindakan?.trim() ||
      (bundle.reflection321.tigaHalPenting && bundle.reflection321.tigaHalPenting.some((t) => t?.trim())) ||
      bundle.progress['reflection-321']
    );

    return {
      ...p,
      approvedTopicsCount,
      isAllApproved,
      preScore: bundle.scores.preTestScore,
      postScore: bundle.scores.postTestScore,
      m1Status: pReviews['topik-2']?.isApproved ? 'Disetujui' : m1Done ? 'Selesai' : 'Dalam Proses',
      m2Status: pReviews['topik-3']?.isApproved ? 'Disetujui' : m2Done ? 'Selesai' : 'Dalam Proses',
      actionPlanStatus: pReviews['topik-4']?.isApproved
        ? 'Terkumpul & Divalidasi'
        : actionPlanHasContent
        ? 'Terkumpul'
        : 'Belum Terkumpul',
      reflectionStatus: pReviews['topik-5']?.isApproved
        ? 'Lengkap & Disetujui'
        : reflectionHasContent
        ? 'Lengkap'
        : 'Belum Mengisi',
      certificateEligible: certCheck.isEligible,
      awaitingTopic5Review: certCheck.awaitingTopic5Review,
      completedTopicsCount: certCheck.completedTopicsCount,
      isTopic5Approved: certCheck.isTopic5Approved
    };
  });

  const filteredParticipants = participantStats.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCount = participants.length;
  const totalActionPlans = totalCount === 0 ? 0 : participantStats.filter((p) => p.actionPlanStatus.includes('Terkumpul')).length;
  
  const postScoresList = participantStats
    .map((p) => p.postScore)
    .filter((s): s is number => typeof s === 'number');
  const avgPostScore = postScoresList.length > 0
    ? `${Math.round(postScoresList.reduce((a, b) => a + b, 0) / postScoresList.length)} / 100`
    : '- / 100';

  const certifiedCount = totalCount === 0 ? 0 : participantStats.filter((p) => p.certificateEligible).length;

  const handlePrintRekap = () => {
    window.print();
  };

  const [copiedLinkType, setCopiedLinkType] = useState<'peserta' | 'admin' | 'wa' | null>(null);

  const handleCopyLink = async (type: 'peserta' | 'admin' | 'wa') => {
    let textToCopy = '';
    if (type === 'peserta') {
      textToCopy = getPortalUrl('peserta');
    } else if (type === 'admin') {
      textToCopy = getPortalUrl('admin');
    } else if (type === 'wa') {
      const link = getPortalUrl('peserta');
      textToCopy = `*PEMBERITAHUAN LMS KEPEMIMPINAN PEMBELAJARAN*\n\nYth. Bapak/Ibu Kepala Sekolah Peserta Pelatihan,\n\nSilakan mengakses Portal Pembelajaran melalui link berikut:\n👉 ${link}\n\nLangkah Masuk:\n1. Buka link melalui Google Chrome / browser HP / Laptop.\n2. Masuk menggunakan akun terdaftar atau lengkapi pendaftaran profil Kepala Sekolah baru.\n3. Ikuti 5 topik materi, pre-test/post-test, dan unggah Action Plan Canvas.\n\nFasilitator LMS: ${admin.name}\nSelamat belajar!`;
    }

    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopiedLinkType(type);
      setTimeout(() => setCopiedLinkType(null), 2500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Welcome & Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Dasbor Fasilitator & Administrator LMS</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Sistem Terhubung Real-Time</span>
              </div>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold font-serif">
              Selamat Bertugas, {admin.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              ID Fasilitator: <strong className="text-amber-300">{admin.facilitatorId}</strong> • Instansi: {admin.institution || 'Balai Guru Penggerak'} • Email: {admin.email}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-400/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Segarkan data pendaftaran dan progres tugas peserta secara langsung"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Menyegarkan...' : 'Segarkan Data'}</span>
            </button>

            {onClearParticipants && participants.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh data peserta yang terdaftar? Aplikasi akan kembali bersih.')) {
                    onClearParticipants();
                  }
                }}
                className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                title="Kosongkan seluruh data peserta"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Kosongkan Peserta</span>
              </button>
            )}

            <button
              onClick={handlePrintRekap}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
              title="Cetak format cetak laporan rekapitulasi nilai"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak Rekapitulasi</span>
            </button>

            <button
              onClick={() => onNavigateTopic('overview')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
              title="Buka tampilan modul kursus peserta"
            >
              <BookOpen className="w-4 h-4" />
              <span>Tinjau Modul Kursus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('participants')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'participants'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Rekapitulasi Penilaian & Peserta ({participants.length} KS)</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'materials'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kelola Materi Kursus ({materials.length} Materi)</span>
        </button>

        <button
          onClick={() => setActiveTab('meet')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'meet'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Pengaturan Google Meet (Sinkronus)</span>
          {meetConfig?.isActive && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* PORTAL LINK DISTRIBUTION CENTER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Pusat Pembagian Tautan Portal Terpisah</h3>
              <p className="text-xs text-slate-500">
                Gunakan tautan berbeda berikut untuk memisahkan alur masuk peserta Kepala Sekolah dan Tim Admin/Fasilitator
              </p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
            Mode Tautan URL Param (?role=...)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Card: Link Peserta */}
          <div className="bg-gradient-to-br from-indigo-50/60 to-white rounded-2xl border-2 border-indigo-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                  1. Tautan Portal Masuk Peserta (Kepala Sekolah)
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                ?role=peserta
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bagikan tautan ini kepada seluruh Bapak/Ibu Kepala Sekolah peserta pelatihan untuk langsung membuka formulir registrasi & pemilihan nama peserta tanpa opsi admin.
            </p>

            <div className="bg-white rounded-xl p-2 border border-indigo-200 font-mono text-xs text-indigo-900 truncate shadow-2xs">
              {getPortalUrl('peserta')}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCopyLink('peserta')}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                {copiedLinkType === 'peserta' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Tautan Peserta Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Tautan Peserta</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleCopyLink('wa')}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                title="Salin pesan pengumuman lengkap untuk disebarkan di WhatsApp Group"
              >
                {copiedLinkType === 'wa' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Pesan WhatsApp Tersalin!</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Salin Format Broadcast WA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card: Link Admin */}
          <div className="bg-gradient-to-br from-amber-50/60 to-white rounded-2xl border-2 border-amber-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                  2. Tautan Portal Fasilitator & Admin LMS
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                ?role=admin
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tautan khusus untuk rekan Tim Instruktur/Fasilitator agar langsung membuka formulir registrasi fasilitator, manajemen materi modul, Google Meet, dan rekap nilai.
            </p>

            <div className="bg-white rounded-xl p-2 border border-amber-200 font-mono text-xs text-amber-900 truncate shadow-2xs">
              {getPortalUrl('admin')}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCopyLink('admin')}
                className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                {copiedLinkType === 'admin' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Tautan Admin Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Tautan Admin</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: PARTICIPANTS & GRADES RECAP */}
      {activeTab === 'participants' && (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Peserta Terdaftar</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalCount} KS</h3>
            <span className="text-[11px] text-slate-500 font-medium">
              {totalCount === 0 ? 'Aplikasi baru (bersih)' : '100% Aktif Belajar'}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Action Plan Terkumpul</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalActionPlans} Dokumen</h3>
            <span className="text-[11px] text-slate-500 font-medium">
              {totalCount === 0 ? 'Menunggu kiriman peserta' : 'Dokumen Terkumpul'}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Rata-Rata Post-test</p>
            <h3 className="text-2xl font-bold text-slate-900">{avgPostScore}</h3>
            <span className="text-[11px] text-slate-500 font-medium">
              {totalCount === 0 ? 'Belum ada kuis dikerjakan' : 'Evaluasi Akhir Belajar'}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Sertifikat Diterbitkan</p>
            <h3 className="text-2xl font-bold text-slate-900">{certifiedCount} Sertifikat</h3>
            <span className="text-[11px] text-slate-500 font-medium">
              {totalCount === 0 ? 'Belum ada sertifikat terbit' : 'Memenuhi 7 Jam PKB'}
            </span>
          </div>
        </div>

      </div>

      {/* Participants Table & Management */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Rekapitulasi Penilaian & Progres Belajar Peserta
            </h3>
            <p className="text-xs text-slate-500">
              Pantau penyelesaian kuis, penugasan warisan, action plan canvas, dan refleksi 3-2-1
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              title="Tambahkan data peserta Kepala Sekolah secara langsung ke sistem admin"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Tambah Peserta</span>
            </button>

            {/* Search box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama / instansi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 pl-6">Kepala Sekolah & Sekolah</th>
                <th className="p-3.5 text-center">Pre-test</th>
                <th className="p-3.5 text-center">Post-test</th>
                <th className="p-3.5 text-center">Modul 1 (Pilar)</th>
                <th className="p-3.5 text-center">Action Plan Canvas</th>
                <th className="p-3.5 text-center">Refleksi 3-2-1</th>
                <th className="p-3.5 text-center">Persetujuan Topik</th>
                <th className="p-3.5 text-center">Status Sertifikat</th>
                <th className="p-3.5 pr-6 text-center">Aksi Fasilitator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-500">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {totalCount === 0
                          ? 'Belum Ada Peserta Terdaftar (Aplikasi Bersih)'
                          : 'Tidak Ada Peserta yang Sesuai Pencarian'}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {totalCount === 0
                          ? 'Daftar peserta telah dikosongkan agar aplikasi benar-benar baru. Saat Kepala Sekolah mendaftar melalui Portal Masuk, data nilai dan progres mereka akan langsung muncul di sini.'
                          : `Tidak ditemukan peserta dengan kata kunci "${searchQuery}".`}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 pl-6">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-slate-600">{p.schoolName}</div>
                    <div className="text-[10px] text-slate-400">NIP: {p.nip || '-'} • {p.district}</div>
                  </td>

                  <td className="p-3.5 text-center font-bold">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px]">
                      {p.preScore}
                    </span>
                  </td>

                  <td className="p-3.5 text-center font-bold">
                    {p.postScore ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px]">
                        {p.postScore}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">- Belum -</span>
                    )}
                  </td>

                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.m1Status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {p.m1Status}
                    </span>
                  </td>

                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.actionPlanStatus === 'Terkumpul & Divalidasi'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : p.actionPlanStatus === 'Draft Terkumpul'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {p.actionPlanStatus}
                    </span>
                  </td>

                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.reflectionStatus === 'Lengkap'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {p.reflectionStatus}
                    </span>
                  </td>

                  {/* Persetujuan Topik (Admin) */}
                  <td className="p-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => setReviewingParticipant(p)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                        p.isAllApproved
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : p.approvedTopicsCount > 0
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-300 hover:bg-indigo-100'
                          : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      }`}
                      title="Klik untuk membuka evaluasi & koreksi topik"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{p.approvedTopicsCount}/5 Topik</span>
                    </button>
                  </td>

                  <td className="p-3.5 text-center">
                    {p.certificateEligible ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        Lulus (7 JP)
                      </span>
                    ) : p.awaitingTopic5Review ? (
                      <button
                        type="button"
                        onClick={() => setReviewingParticipant(p)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 transition-colors animate-pulse"
                        title="Tugas akhir Topik 5 telah diserahkan peserta! Klik untuk mengoreksi dan menerbitkan sertifikat."
                      >
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Koreksi Topik 5</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Dalam Proses ({p.completedTopicsCount}/5)</span>
                    )}
                  </td>

                  <td className="p-3.5 pr-6 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setReviewingParticipant(p)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-xs flex items-center gap-1"
                        title="Koreksi & Persetujuan Topik"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Koreksi</span>
                      </button>

                      <button
                        onClick={() => setSelectedPlanParticipant(p)}
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                        title="Periksa Action Plan Peserta"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                        title="Edit Profil Peserta"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSelectParticipantPreview(p)}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                        title="Simulasi Masuk sebagai Peserta Ini"
                      >
                        Simulasi KS
                      </button>

                      <button
                        onClick={() => setDeleteTargetParticipant(p)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Hapus Akun Peserta Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Review & Persetujuan Topik Berjenjang */}
      {reviewingParticipant && (
        <AdminTopicReviewModal
          participant={reviewingParticipant}
          isOpen={Boolean(reviewingParticipant)}
          onClose={() => setReviewingParticipant(null)}
          topicReviews={topicReviews[reviewingParticipant.id] || {}}
          onSaveReview={(pId, tId, rev) => {
            onSaveTopicReview?.(pId, tId, rev);
          }}
          onBatchApproveAll={(pId) => {
            onBatchApproveAllTopics?.(pId);
          }}
          onOpenParticipantDirectView={(p, topicId) => {
            onSelectParticipantPreview(p);
            if (topicId) {
              onNavigateTopic(topicId);
            }
          }}
        />
      )}

      {/* Modal View Action Plan Participant */}
      {selectedPlanParticipant && (() => {
        const participantBundle = loadParticipantFullBundle(selectedPlanParticipant.id);
        const plan = participantBundle.actionPlan;
        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 space-y-4">
              <button
                onClick={() => setSelectedPlanParticipant(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Action Plan Canvas: {selectedPlanParticipant.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedPlanParticipant.schoolName} • {selectedPlanParticipant.district}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">1. Masalah Utama:</span>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">{plan.masalahPrioritas || '-'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">2. Warisan Kepemimpinan yang Ingin Ditinggalkan:</span>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">{plan.warisanKepemimpinan || '-'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">3. Nilai Pribadi Pondasi:</span>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">{plan.nilaiPribadi || '-'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">4. Budaya Sekolah Inklusif & Pemberdayaan Guru:</span>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                    Budaya: {plan.budaya || '-'} • Pemberdayaan: {plan.pemberdayaan || '-'}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">5. Transformasi Pola Pikir (Growth Mindset):</span>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">{plan.growthMindset || '-'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">6. Rencana Aksi Nyata & Linimasa:</span>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">{plan.aksi || '-'}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Waktu: {plan.waktu || '-'} • Dukungan: {plan.dukungan || '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Data tersinkronisasi dari kanvas peserta
                </span>

                <button
                  onClick={() => setSelectedPlanParticipant(null)}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>
          </div>
        );
      })()}
        </>
      )}

      {/* TAB 2: COURSE MATERIALS MANAGEMENT (ADD / EDIT) */}
      {activeTab === 'materials' && (
        <AdminMaterialsManager
          materials={materials}
          onSaveMaterial={onSaveMaterial}
          onDeleteMaterial={onDeleteMaterial}
          onNavigateTopic={onNavigateTopic}
        />
      )}

      {/* TAB 3: GOOGLE MEET & SYNCHRONOUS SETTINGS */}
      {activeTab === 'meet' && (
        <AdminMeetManager
          meetConfig={meetConfig}
          onSaveMeetConfig={onSaveMeetConfig}
        />
      )}

      {/* MODAL: TAMBAH PESERTA BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Tambah Peserta Baru</h3>
                  <p className="text-xs text-slate-500">Daftarkan Kepala Sekolah langsung ke sistem LMS</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Drs. H. Ahmad Fauzi, M.M.Pd."
                  value={participantForm.name}
                  onChange={(e) => setParticipantForm({ ...participantForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIP (Opsional)</label>
                  <input
                    type="text"
                    placeholder="197501012000031002"
                    value={participantForm.nip}
                    onChange={(e) => setParticipantForm({ ...participantForm, nip: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kabupaten / Wilayah</label>
                  <input
                    type="text"
                    placeholder="Kota Bandung"
                    value={participantForm.district}
                    onChange={(e) => setParticipantForm({ ...participantForm, district: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Asal Sekolah / Satuan Pendidikan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMP Negeri 1 Bandung"
                  value={participantForm.schoolName}
                  onChange={(e) => setParticipantForm({ ...participantForm, schoolName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email / Kontak (Opsional)</label>
                <input
                  type="email"
                  placeholder="ahmad.fauzi@sekolah.id"
                  value={participantForm.email}
                  onChange={(e) => setParticipantForm({ ...participantForm, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
                >
                  Simpan & Daftarkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT DATA PESERTA */}
      {editingParticipant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Edit Data Kepala Sekolah</h3>
                  <p className="text-xs text-slate-500">Perbarui identitas profil peserta</p>
                </div>
              </div>
              <button
                onClick={() => setEditingParticipant(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={participantForm.name}
                  onChange={(e) => setParticipantForm({ ...participantForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIP</label>
                  <input
                    type="text"
                    value={participantForm.nip}
                    onChange={(e) => setParticipantForm({ ...participantForm, nip: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kabupaten / Wilayah</label>
                  <input
                    type="text"
                    value={participantForm.district}
                    onChange={(e) => setParticipantForm({ ...participantForm, district: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Asal Sekolah / Satuan Pendidikan *</label>
                <input
                  type="text"
                  required
                  value={participantForm.schoolName}
                  onChange={(e) => setParticipantForm({ ...participantForm, schoolName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email / Kontak</label>
                <input
                  type="email"
                  value={participantForm.email}
                  onChange={(e) => setParticipantForm({ ...participantForm, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingParticipant(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS PESERTA */}
      {deleteTargetParticipant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-bold text-slate-900 text-base">Hapus Akun Peserta?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Anda akan menghapus <strong className="text-slate-900">{deleteTargetParticipant.name}</strong> ({deleteTargetParticipant.schoolName}). Seluruh riwayat pengerjaan modul, nilai pre/post-test, dan canvas peserta ini akan dihapus permanen.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetParticipant(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs"
              >
                Ya, Hapus Peserta
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
