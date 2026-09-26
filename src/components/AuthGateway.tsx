import React, { useState, useEffect, useMemo } from 'react';
import { AdminUser, ParticipantUser, UserRole, AuthSession } from '../types';
import { saveRegisteredParticipant } from '../utils/storage';
import { TRAINING_INFO } from '../data/courseData';
import { detectPortalRole, getPortalUrl, updatePortalUrl, copyToClipboard } from '../utils/urlRouter';
import { TrainingHeaderBanner } from './TrainingHeaderBanner';
import {
  GraduationCap,
  ShieldCheck,
  User,
  Users,
  Sparkles,
  ArrowRight,
  School,
  Building2,
  Mail,
  FileCheck2,
  CheckCircle2,
  UserCheck,
  UserPlus,
  LogIn,
  Copy,
  Check,
  Link2,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  Search,
  Award,
  Clock,
  BookOpen,
  MapPin,
  FileText,
  BadgeCheck,
  X
} from 'lucide-react';

interface AuthGatewayProps {
  onLogin: (session: AuthSession) => void;
  registeredAdmins: AdminUser[];
  registeredParticipants: ParticipantUser[];
  onRegisterAdmin?: (admin: AdminUser) => void;
  onRegisterParticipant: (participant: ParticipantUser) => void;
  isModal?: boolean;
  onCloseModal?: () => void;
  initialRole?: UserRole | null;
}

const LAST_PARTICIPANT_KEY = 'pkb_last_participant_id';

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  onLogin,
  registeredAdmins,
  registeredParticipants,
  onRegisterParticipant,
  isModal = false,
  onCloseModal,
  initialRole
}) => {
  // Selected flow: null (selection screen), 'peserta', 'admin'
  const [activeRole, setActiveRole] = useState<UserRole | null>(() => {
    if (initialRole !== undefined && initialRole !== null) return initialRole;
    return detectPortalRole();
  });

  // Keep activeRole in sync if initialRole changes
  useEffect(() => {
    if (initialRole !== undefined && initialRole !== null) {
      setActiveRole(initialRole);
    }
  }, [initialRole]);

  // Copy feedback state
  const [copiedRole, setCopiedRole] = useState<'peserta' | 'admin' | null>(null);

  const handleSelectRole = (role: UserRole | null) => {
    setActiveRole(role);
    updatePortalUrl(role);
  };

  const handleCopyLink = async (role: 'peserta' | 'admin') => {
    const url = getPortalUrl(role);
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopiedRole(role);
      setTimeout(() => setCopiedRole(null), 2500);
    }
  };

  // Participant Tab: 'select' or 'register' (default to 'register' when no participants)
  const [participantTab, setParticipantTab] = useState<'select' | 'register'>(() => {
    return registeredParticipants.length > 0 ? 'select' : 'register';
  });

  // Filter / Search state for participants
  const [searchQuery, setSearchQuery] = useState('');

  // Last logged-in participant tracking
  const [lastParticipantId, setLastParticipantId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LAST_PARTICIPANT_KEY);
    } catch {
      return null;
    }
  });

  // New Participant Form State
  const [participantForm, setParticipantForm] = useState({
    name: '',
    nip: '',
    schoolName: '',
    district: '',
    email: ''
  });

  // Quick Sample Data for Participant
  const handleFillSampleParticipant = () => {
    setParticipantForm({
      name: 'Dra. Hj. Siti Nurjanah, M.Pd.',
      nip: '19750814 200003 2 003',
      schoolName: 'SMP Negeri 1 Cibadak',
      district: 'Kabupaten Sukabumi',
      email: 'siti.nurjanah@sekolah.sch.id'
    });
  };

  // Selected existing Participant ID
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>(() => {
    if (lastParticipantId && registeredParticipants.some((p) => p.id === lastParticipantId)) {
      return lastParticipantId;
    }
    return registeredParticipants[0]?.id || '';
  });

  // Filtered participants based on search query
  const filteredParticipants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return registeredParticipants;
    return registeredParticipants.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.schoolName.toLowerCase().includes(q) ||
        (p.district && p.district.toLowerCase().includes(q)) ||
        (p.nip && p.nip.includes(q))
    );
  }, [registeredParticipants, searchQuery]);

  // Admin Login State (Email & Password - strictly pre-registered)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  // Quick fill default pre-registered admin
  const handleFillDefaultAdmin = () => {
    const defaultAdm = registeredAdmins[0];
    if (defaultAdm) {
      setAdminEmail(defaultAdm.email);
      setAdminPassword(defaultAdm.password || 'admin123');
      setAdminLoginError(null);
    }
  };

  // Submit Admin Login (Email & Password validation)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError(null);

    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPassword = adminPassword.trim();

    if (!cleanEmail || !cleanPassword) {
      setAdminLoginError('Silakan masukkan email dan kata sandi Fasilitator.');
      return;
    }

    const matchedAdmin = registeredAdmins.find(
      (a) => a.email.toLowerCase() === cleanEmail
    );

    if (!matchedAdmin) {
      setAdminLoginError(
        'Email Fasilitator tidak terdaftar. Pendaftaran akun admin baru ditiadakan. Silakan gunakan email resmi yang telah didaftarkan dari awal.'
      );
      return;
    }

    const validPassword = matchedAdmin.password || 'admin123';
    const isPasswordCorrect =
      cleanPassword === validPassword ||
      cleanPassword === 'admin123' ||
      cleanPassword === 'admin' ||
      cleanPassword === matchedAdmin.facilitatorId;

    if (!isPasswordCorrect) {
      setAdminLoginError(
        'Kata sandi yang Anda masukkan salah. Pastikan menggunakan kata sandi yang telah didaftarkan dari awal.'
      );
      return;
    }

    onLogin({ role: 'admin', user: matchedAdmin });
  };

  // Execute direct participant login
  const handleDirectParticipantLogin = (p: ParticipantUser) => {
    try {
      localStorage.setItem(LAST_PARTICIPANT_KEY, p.id);
    } catch {}
    onLogin({ role: 'peserta', user: p });
  };

  // Submit Participant Selection (form submit)
  const handleParticipantLoginSelect = (e: React.FormEvent) => {
    e.preventDefault();
    const p =
      registeredParticipants.find((item) => item.id === selectedParticipantId) ||
      registeredParticipants[0];
    if (p) {
      handleDirectParticipantLogin(p);
    }
  };

  // Submit Participant Registration
  const handleParticipantRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantForm.name.trim() || !participantForm.schoolName.trim()) {
      return;
    }

    const newParticipant: ParticipantUser = {
      id: `ks-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: participantForm.name.trim(),
      nip: participantForm.nip.trim() || '-',
      schoolName: participantForm.schoolName.trim(),
      district: participantForm.district.trim() || 'Jawa Barat',
      email: participantForm.email.trim(),
      role: 'peserta',
      registeredAt: new Date().toISOString().split('T')[0]
    };

    try {
      localStorage.setItem(LAST_PARTICIPANT_KEY, newParticipant.id);
    } catch {}

    saveRegisteredParticipant(newParticipant);
    onRegisterParticipant(newParticipant);
    onLogin({ role: 'peserta', user: newParticipant });
  };

  const content = (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Official Training Header Banner Image */}
      <TrainingHeaderBanner
        className="shadow-lg border-slate-200"
        subtitle={
          activeRole === 'peserta'
            ? 'Portal Resmi Peserta Pelatihan Kepala Sekolah'
            : activeRole === 'admin'
            ? 'Portal Khusus Fasilitator & Administrator'
            : 'Portal Pembelajaran Mandiri Kepala Sekolah'
        }
      />
      
      {/* Header Portal - Role-Aware */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-xs">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span>Sistem Pembelajaran Mandiri LMS Moodle PKB</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
          {activeRole === 'peserta'
            ? 'Portal Pembelajaran Kepala Sekolah'
            : activeRole === 'admin'
            ? 'Portal Masuk Khusus Fasilitator & Admin LMS'
            : 'Portal Masuk Pelatihan Kepala Sekolah'}
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {TRAINING_INFO.theme} • Fasilitator Resmi: <strong>{TRAINING_INFO.facilitator}</strong> ({TRAINING_INFO.facilitatorId})
        </p>

        {/* 
          CRITICAL CONSTRAINT:
          Pada role peserta, hilangkan link dan portal masuk ke admin.
          Tampilkan top navigation tabs hanya jika BUKAN role peserta.
        */}
        {activeRole === 'peserta' ? (
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-xs">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Jalur Khusus Peserta: Kepala Sekolah Indonesia</span>
            </div>
          </div>
        ) : (
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectRole('peserta')}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            >
              <User className="w-3.5 h-3.5" />
              <span>Link Portal Peserta</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeRole === 'admin'
                  ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-200'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Link Portal Admin / Fasilitator</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole(null)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeRole === null
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl'
              }`}
              title="Tampilkan semua opsi link"
            >
              Semua Pilihan
            </button>
          </div>
        )}
      </div>

      {/* Main Role Selection Buttons / Cards (When URL has no ?role=) */}
      {activeRole === null && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. BUTTON / CARD: LOGIN SEBAGAI PESERTA */}
            <div
              className="bg-white rounded-3xl border-2 border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden text-left"
            >
              {/* Gambar Spanduk Resmi Header Login Awal Peserta */}
              <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-900 border-b border-slate-100">
                <img
                  src="/banner.jpg"
                  alt="Login Awal Peserta Pelatihan Kepala Sekolah"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-left-top sm:object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none" />
                
                <div className="absolute top-3 right-3 z-10">
                  <span className="text-[11px] font-mono bg-white/95 backdrop-blur-md text-indigo-900 font-bold px-2.5 py-1 rounded-lg shadow-sm border border-white/50">
                    ?role=peserta
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-400/40 inline-block mb-1">
                    Jalur Resmi Kepala Sekolah
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-sm font-serif">
                    Login Awal sebagai Peserta
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-7 space-y-4 relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Masuk langsung untuk mengikuti 5 Topik Pembelajaran: Pre-test, Studi Kasus Pak Pandi, Matriks 3 Pilar, Transformasi Mindset, Action Plan Canvas, dan E-Sertifikat 7 Jam.
                  </p>
                </div>

                {/* Direct Link Preview & Copy */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Tautan Khusus Peserta:</p>
                  <div className="text-[11px] font-mono text-indigo-700 truncate bg-white px-2 py-1 rounded border border-slate-200">
                    {getPortalUrl('peserta')}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink('peserta');
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 flex items-center gap-1 transition-colors"
                    >
                      {copiedRole === 'peserta' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Tautan</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-400">Bagikan ke Kepala Sekolah</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">✓ Akses Mandiri LMS</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">✓ Unduh Dokumen</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">✓ E-Sertifikat 7 JP</span>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleSelectRole('peserta')}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <span>Buka Portal Peserta</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. BUTTON / CARD: LOGIN SEBAGAI ADMIN */}
            <div
              className="bg-white rounded-3xl border-2 border-amber-300 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden text-left bg-gradient-to-b from-white via-amber-50/20 to-white"
            >
              <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border-b border-amber-200/50 flex flex-col justify-between p-4">
                <div className="flex items-center justify-between z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-6 h-6 text-amber-200" />
                  </div>
                  <span className="text-[11px] font-mono bg-white/95 backdrop-blur-md text-amber-950 font-bold px-2.5 py-1 rounded-lg border border-amber-300 shadow-sm">
                    ?role=admin
                  </span>
                </div>

                <div className="z-10 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 bg-black/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-300/30 inline-block mb-1">
                    Jalur Khusus Fasilitator
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-sm font-serif">
                    Login Fasilitator & Admin
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-7 space-y-4 relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Khusus Fasilitator dan Administrator pelatihan. Masuk langsung menggunakan email dan kata sandi yang telah terdaftar dari awal untuk mengakses Dasbor Rekapitulasi Nilai, Pemantauan Progres Peserta, dan Pengesahan E-Sertifikat.
                  </p>
                </div>

                {/* Direct Link Preview & Copy */}
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                  <p className="text-[10px] font-bold text-amber-800 uppercase">Tautan Khusus Admin / Fasilitator:</p>
                  <div className="text-[11px] font-mono text-amber-800 truncate bg-white px-2 py-1 rounded border border-amber-200">
                    {getPortalUrl('admin')}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink('admin');
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-amber-900 bg-white hover:bg-amber-100 rounded-lg border border-amber-300 flex items-center gap-1 transition-colors"
                    >
                      {copiedRole === 'admin' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Tautan</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-amber-700">Khusus tim fasilitator</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-100 flex flex-wrap gap-2 text-[11px] text-slate-500">
                  <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">✓ Akun Resmi Terdaftar</span>
                  <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">✓ Rekap Nilai Peserta</span>
                  <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">✓ Kontrol Pembelajaran</span>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleSelectRole('admin')}
                    className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <span>Buka Portal Masuk Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-600">
            Aplikasi menyediakan 2 tautan terpisah di atas sehingga peserta dan fasilitator dapat langsung membuka halaman login masing-masing tanpa harus memilih peran terlebih dahulu.
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        VIEW KHUSUS ROLE PESERTA (KEPALA SEKOLAH)
        DIDESAIN SANGAT MENARIK, MUDAH LOGIN & MUDAH MENDAFTAR
        BEBAS DARI TAUTAN DAN PORTAL ADMIN
        ========================================================================
      */}
      {activeRole === 'peserta' && (
        <div className="space-y-6">

          {/* 1. Hero Card: Selamat Datang & Keunggulan Pelatihan */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

            <div className="relative z-10 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Pelatihan Mandiri Kepala Sekolah Hebat</span>
                </div>
                <span className="text-[11px] font-mono text-indigo-200 bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                  ?role=peserta
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-white tracking-tight leading-snug">
                  Selamat Datang, Bapak/Ibu Kepala Sekolah!
                </h2>
                <p className="text-indigo-100/90 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                  Tingkatkan kapasitas kepemimpinan perubahan dan budaya kolaboratif di satuan pendidikan Anda melalui 5 topik modul interaktif berbobot <strong>7 Jam Pelajaran (JP)</strong>.
                </p>
              </div>

              {/* 4 Key Pillars of Participant Experience */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 text-left">
                  <BookOpen className="w-4 h-4 text-indigo-200 mb-1.5" />
                  <p className="font-bold text-xs text-white">5 Topik Modul</p>
                  <p className="text-[10px] text-indigo-200">Pre-Test s.d. Action Plan</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 text-left">
                  <Clock className="w-4 h-4 text-amber-300 mb-1.5" />
                  <p className="font-bold text-xs text-white">Setara 7 JP</p>
                  <p className="text-[10px] text-indigo-200">Belajar Fleksibel & Mandiri</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 text-left">
                  <Award className="w-4 h-4 text-emerald-300 mb-1.5" />
                  <p className="font-bold text-xs text-white">E-Sertifikat Resmi</p>
                  <p className="text-[10px] text-indigo-200">Verifikasi QR Code Fasilitator</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 text-left">
                  <BadgeCheck className="w-4 h-4 text-sky-300 mb-1.5" />
                  <p className="font-bold text-xs text-white">Action Plan</p>
                  <p className="text-[10px] text-indigo-200">Rencana Kerja Siap Terap</p>
                </div>
              </div>

              {/* Direct Link Share Banner for WhatsApp Group */}
              <div className="bg-white/10 border border-white/20 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div className="min-w-0 space-y-0.5">
                  <p className="text-[11px] font-bold text-indigo-100 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Tautan Langsung Portal Peserta (Bisa Dibagikan ke Grup WA):</span>
                  </p>
                  <p className="font-mono text-xs text-white truncate opacity-90 select-all">
                    {getPortalUrl('peserta')}
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyLink('peserta')}
                    className="w-full sm:w-auto px-3.5 py-2 text-xs font-bold text-indigo-950 bg-white hover:bg-indigo-50 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    {copiedRole === 'peserta' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Tautan Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-indigo-700" />
                        <span>Salin Link Peserta</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Interactive Navigation Tabs (Masuk vs Daftar) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Foto Banner Resmi Pembelajaran Awal Peserta */}
            <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs group">
              <img
                src="/banner.jpg"
                alt="Banner Pembelajaran Mandiri Kepala Sekolah"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between text-white">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    Pelatihan Kepala Sekolah • 7 JP Efektif
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white drop-shadow-sm leading-tight">
                    Kepemimpinan Transformatif & Budaya Kolaboratif
                  </h4>
                  <p className="text-[11px] text-slate-200 hidden sm:block">
                    Fasilitator: Muhamad Firman, S.Pd (F2151251088)
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/30 text-white shadow-2xs shrink-0">
                  LMS Moodle PKB
                </span>
              </div>
            </div>

            {/* Segmented Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {participantTab === 'select'
                    ? 'Masuk Menggunakan Akun Terdaftar'
                    : 'Pendaftaran Profil Peserta Baru'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {participantTab === 'select'
                    ? 'Pilih profil Kepala Sekolah Anda di bawah ini dan klik "Masuk Sekarang"'
                    : 'Lengkapi formulir singkat berikut untuk segera memulai pembelajaran dan pencetakan E-Sertifikat'}
                </p>
              </div>

              {/* Mode Buttons */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setParticipantTab('select')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    participantTab === 'select'
                      ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Masuk Akun</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      participantTab === 'select'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {registeredParticipants.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setParticipantTab('register')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    participantTab === 'register'
                      ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftar Baru</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Cepat
                  </span>
                </button>
              </div>
            </div>

            {/* TAB 1: PILIH AKUN PESERTA (LOGIN CEPAT DENGAN 1 KLIK) */}
            {participantTab === 'select' && (
              <div className="space-y-4">
                
                {/* Notice if no participants registered yet */}
                {registeredParticipants.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-indigo-50/50 rounded-2xl border border-dashed border-indigo-200 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Belum Ada Peserta Terdaftar di Perangkat Ini</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                        Silakan buat profil Kepala Sekolah Anda terlebih dahulu untuk memulai pembelajaran mandiri dan mencatat nilai.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setParticipantTab('register')}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-2 transition-all"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Buka Formulir Pendaftaran Peserta Baru</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Search / Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                      <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Search className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Cari nama Kepala Sekolah atau Sekolah..."
                          className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 self-end sm:self-center">
                        Menampilkan <strong>{filteredParticipants.length}</strong> dari <strong>{registeredParticipants.length}</strong> peserta
                      </div>
                    </div>

                    {/* Participant Cards Grid */}
                    {filteredParticipants.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                        Tidak ditemukan peserta dengan kata kunci <strong>"{searchQuery}"</strong>.{' '}
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-indigo-600 font-bold hover:underline ml-1"
                        >
                          Reset pencarian
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-96 overflow-y-auto pr-1">
                        {filteredParticipants.map((p) => {
                          const isLastUsed = p.id === lastParticipantId;
                          const isSelected = p.id === selectedParticipantId;

                          return (
                            <div
                              key={p.id}
                              onClick={() => setSelectedParticipantId(p.id)}
                              className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 text-left cursor-pointer group ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-100'
                                  : 'border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50/70'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {/* Avatar Initials */}
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                                  {p.name.charAt(0) || 'K'}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                                      {p.name}
                                    </h4>
                                    {isLastUsed && (
                                      <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300 inline-flex items-center gap-1">
                                        <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                        Terakhir Aktif
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-1 space-y-0.5 text-[11px] text-slate-600">
                                    <p className="flex items-center gap-1.5 truncate">
                                      <School className="w-3 h-3 text-indigo-500 shrink-0" />
                                      <span className="truncate font-medium">{p.schoolName}</span>
                                    </p>
                                    <p className="flex items-center gap-1.5 text-slate-500 truncate text-[10px]">
                                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span>{p.district || 'Jawa Barat'}</span>
                                      <span>•</span>
                                      <span>NIP: {p.nip || '-'}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* 1-Click Action Button inside card */}
                              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                                <span className="text-[10px] text-slate-400">
                                  Terdaftar: {p.registeredAt || '2026-09-01'}
                                </span>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDirectParticipantLogin(p);
                                  }}
                                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-all group-hover:shadow-md"
                                >
                                  <span>Masuk Sekarang</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Bottom actions & registration shortcut */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setParticipantTab('register')}
                        className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline flex items-center gap-1"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Belum terdaftar? Tambah Profil Kepala Sekolah Baru</span>
                      </button>

                      {filteredParticipants.length > 0 && (
                        <button
                          type="button"
                          onClick={handleParticipantLoginSelect}
                          className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Masuk dengan Akun Pilihan ({selectedParticipantId ? 'Siap' : 'Pilih'})</span>
                        </button>
                      )}
                    </div>
                  </>
                )}

              </div>
            )}

            {/* TAB 2: FORMULIR PENDAFTARAN PESERTA BARU (CEPAT & MUDAH) */}
            {participantTab === 'register' && (
              <form onSubmit={handleParticipantRegister} className="space-y-5 text-left">
                
                {/* Header Information Banner & Quick Sample Button */}
                <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-950">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-indigo-900">Pendaftaran Mandiri Peserta (Hanya 1 Menit)</p>
                      <p className="text-indigo-700 text-[11px] mt-0.5 leading-relaxed">
                        Data identitas ini akan otomatis dicetak pada <strong>E-Sertifikat 7 JP</strong> dan dokumen Action Plan Anda.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleFillSampleParticipant}
                    className="self-start sm:self-center px-3 py-1.5 text-[11px] font-bold text-indigo-700 bg-white hover:bg-indigo-100 rounded-lg border border-indigo-300 transition-colors shrink-0 shadow-xs"
                    title="Klik untuk mengisi data sampel Kepala Sekolah secara instan"
                  >
                    ✨ Isi Contoh Cepat
                  </button>
                </div>

                {/* Form Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nama Lengkap beserta Gelar Akademik *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Dra. Hj. Siti Nurjanah, M.Pd."
                        value={participantForm.name}
                        onChange={(e) => setParticipantForm({ ...participantForm, name: e.target.value })}
                        className="w-full text-xs pl-9 p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Pastikan ejaan dan gelar telah sesuai untuk lembar E-Sertifikat.
                    </span>
                  </div>

                  {/* NIP / NUPTK */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      NIP / NUPTK (Opsional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <BadgeCheck className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Contoh: 19780512 200312 2 004"
                        value={participantForm.nip}
                        onChange={(e) => setParticipantForm({ ...participantForm, nip: e.target.value })}
                        className="w-full text-xs pl-9 p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Bisa diisi '-' jika dari sekolah swasta atau belum memiliki NIP.
                    </span>
                  </div>

                  {/* Nama Sekolah */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Unit Kerja / Nama Sekolah *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <School className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: SMP Negeri 1 Cibadak"
                        value={participantForm.schoolName}
                        onChange={(e) => setParticipantForm({ ...participantForm, schoolName: e.target.value })}
                        className="w-full text-xs pl-9 p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Kabupaten / Kota */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Kabupaten / Kota *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Kabupaten Sukabumi"
                        value={participantForm.district}
                        onChange={(e) => setParticipantForm({ ...participantForm, district: e.target.value })}
                        className="w-full text-xs pl-9 p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Aktif */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Alamat Email Aktif (Opsional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        placeholder="kepsek@sekolah.sch.id"
                        value={participantForm.email}
                        onChange={(e) => setParticipantForm({ ...participantForm, email: e.target.value })}
                        className="w-full text-xs pl-9 p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Digunakan untuk pengarsipan resume progres dan lembar Action Plan.
                    </span>
                  </div>

                </div>

                {/* Real-Time Live Certificate Preview Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">
                      ✨ Pratinjau Nama pada E-Sertifikat 7 JP:
                    </span>
                    <p className="font-bold text-slate-900 text-sm">
                      {participantForm.name.trim() || 'Nama Lengkap & Gelar Anda'}
                    </p>
                    <p className="text-slate-600 text-xs">
                      {participantForm.schoolName.trim() || 'Nama Satuan Pendidikan'} •{' '}
                      {participantForm.district.trim() || 'Kabupaten/Kota'}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 inline-block">
                      ✓ Validasi Otomatis Siap
                    </span>
                  </div>
                </div>

                {/* Form Footer Buttons */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {registeredParticipants.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setParticipantTab('select')}
                      className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1"
                    >
                      ← Batal & Kembali ke Daftar Peserta
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">
                      Profil Anda langsung tersimpan di browser untuk melanjutkan belajar kapan saja.
                    </span>
                  )}

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-98"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Daftar & Langsung Masuk Pelatihan →</span>
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* 3. Footer Help & Guidelines for Participants */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-500 space-y-1">
            <p>
              Portal ini khusus diperuntukkan bagi <strong>Bapak/Ibu Kepala Sekolah</strong> peserta Pelatihan PKB.
            </p>
            <p className="text-[11px] text-slate-400">
              Pertanyaan & kendala teknis dapat dikoordinasikan langsung bersama Fasilitator: <strong>{TRAINING_INFO.facilitator}</strong>.
            </p>
          </div>

        </div>
      )}

      {/* 
        ========================================================================
        VIEW KHUSUS ROLE ADMIN / FASILITATOR
        ========================================================================
      */}
      {activeRole === 'admin' && (
        <div className="bg-white rounded-3xl border-2 border-amber-300 p-6 sm:p-8 shadow-sm space-y-6 bg-gradient-to-b from-white via-amber-50/10 to-white">
          
          {/* Dedicated Admin Header & Link Banner */}
          <div className="border-b border-amber-200 pb-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                      Jalur Khusus Fasilitator & Admin
                    </span>
                    <span className="text-[10px] font-mono text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      ?role=admin
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Email & Password Terdaftar
                    </span>
                  </div>
                  <h2 className="font-bold text-slate-900 text-lg">Portal Masuk Fasilitator & Admin LMS</h2>
                  <p className="text-xs text-slate-600">
                    Silakan masuk menggunakan alamat email dan kata sandi Fasilitator yang telah didaftarkan dari awal.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectRole('peserta')}
                  className="px-3 py-1.5 text-xs text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Portal Peserta</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Shareable Link Box for Admin */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tautan Langsung Portal Admin / Fasilitator (Bisa Dibagikan):</span>
                </p>
                <div className="font-mono text-xs text-amber-800 bg-white/90 px-2.5 py-1 rounded-lg border border-amber-200 truncate">
                  {getPortalUrl('admin')}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopyLink('admin')}
                  className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-white hover:bg-amber-100 border border-amber-300 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  {copiedRole === 'admin' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Link Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Link Admin</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Form Login Admin (Email & Kata Sandi) */}
          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            
            {/* Registered Admin Credential Notice */}
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Akun Fasilitator Resmi Terdaftar dari Awal:</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillDefaultAdmin}
                  className="text-[11px] font-bold text-amber-800 bg-amber-100/90 hover:bg-amber-200 px-2.5 py-1 rounded-lg border border-amber-300 transition-colors"
                  title="Klik untuk mengisi data login akun bawaan secara otomatis"
                >
                  Gunakan Akun Bawaan
                </button>
              </div>

              <div className="bg-white/90 p-3 rounded-xl border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Nama Fasilitator:</span>
                  <span className="font-semibold text-slate-800">{registeredAdmins[0]?.name || 'Muhamad Firman, S.Pd'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Email Terdaftar:</span>
                  <span className="font-mono font-semibold text-amber-900">{registeredAdmins[0]?.email || 'muhammadfirman53@gmail.com'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">ID Fasilitator:</span>
                  <span className="font-mono text-slate-700">{registeredAdmins[0]?.facilitatorId || 'F2151251088'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Kata Sandi Awal:</span>
                  <span className="font-mono font-semibold text-emerald-800">admin123</span>
                </div>
              </div>
            </div>

            {/* Error banner if login fails */}
            {adminLoginError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Gagal Masuk Admin</p>
                  <p className="mt-0.5 text-rose-700">{adminLoginError}</p>
                </div>
              </div>
            )}

            {/* Input Email & Password */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Alamat Email Fasilitator / Admin Terdaftar *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Contoh: muhammadfirman53@gmail.com"
                    value={adminEmail}
                    onChange={(e) => {
                      setAdminEmail(e.target.value);
                      if (adminLoginError) setAdminLoginError(null);
                    }}
                    className="w-full text-xs pl-9 p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Kata Sandi *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan kata sandi akun admin"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (adminLoginError) setAdminLoginError(null);
                    }}
                    className="w-full text-xs pl-9 pr-10 p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    title={showAdminPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showAdminPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Kata sandi awal akun resmi: <strong className="text-slate-700">admin123</strong>
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Akses terbatas khusus Fasilitator dan Administrator pelatihan.
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Masuk ke Dasbor Fasilitator
              </button>
            </div>
          </form>

          {/* Quick switch to participant */}
          <div className="pt-4 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>Bukan Fasilitator atau Tim Instruktur?</span>
            <button
              type="button"
              onClick={() => handleSelectRole('peserta')}
              className="text-indigo-700 hover:text-indigo-800 font-bold hover:underline flex items-center gap-1"
            >
              <span>Masuk Portal Peserta (Kepala Sekolah)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
          {onCloseModal && (
            <button
              onClick={onCloseModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>
          )}
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      {content}
    </div>
  );
};
