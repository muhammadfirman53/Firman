import React, { useState } from 'react';
import { ParticipantProfile, AuthSession, TopicId, GoogleMeetConfig } from '../types';
import { getPortalUrl, copyToClipboard } from '../utils/urlRouter';
import {
  Award,
  Calendar,
  CheckCircle,
  GraduationCap,
  ShieldCheck,
  User,
  Users,
  LogOut,
  LayoutDashboard,
  Video,
  Link2,
  Check,
  Share2,
  Lock,
  Clock
} from 'lucide-react';

interface HeaderProps {
  profile: ParticipantProfile;
  authSession: AuthSession | null;
  activeTopic: TopicId;
  meetConfig?: GoogleMeetConfig;
  onOpenProfile: () => void;
  onOpenSchedule: () => void;
  onOpenCertificate: () => void;
  onOpenAuthModal: () => void;
  onOpenAdminDashboard: () => void;
  onOpenCourse: () => void;
  onLogout?: () => void;
  progressPercent: number;
  completedTasksCount: number;
  totalTasksCount: number;
  isCertificateEligible?: boolean;
  completedTopicsCount?: number;
  awaitingTopic5Review?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  authSession,
  activeTopic,
  meetConfig,
  onOpenProfile,
  onOpenSchedule,
  onOpenCertificate,
  onOpenAuthModal,
  onOpenAdminDashboard,
  onOpenCourse,
  onLogout,
  progressPercent,
  completedTasksCount,
  totalTasksCount,
  isCertificateEligible = false,
  completedTopicsCount = 0,
  awaitingTopic5Review = false,
}) => {
  const isAdmin = authSession?.role === 'admin';
  const adminName = isAdmin ? authSession.user.name : null;
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyParticipantLink = async () => {
    const url = getPortalUrl('peserta');
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 ${
              isAdmin
                ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900'
                : 'bg-gradient-to-br from-indigo-700 via-blue-700 to-indigo-900'
            }`}>
              {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isAdmin
                    ? 'text-amber-800 bg-amber-50 border-amber-200'
                    : 'text-indigo-700 bg-indigo-50 border-indigo-100'
                }`}>
                  {isAdmin ? 'Mode Fasilitator' : 'Moodle LMS Blended'}
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline-flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Fasilitator: Muhamad Firman, S.Pd
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                Pengembangan Profesional Kepala Sekolah
              </h1>
            </div>
          </div>

          {/* Center Progress bar for participant, or Admin Quick Nav */}
          {!isAdmin ? (
            <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs mx-4">
              <div className="w-full">
                <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                  <span className="font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Progres Pelatihan
                  </span>
                  <span className="font-bold text-indigo-700">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={onOpenAdminDashboard}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTopic === 'admin-dashboard'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dasbor Fasilitator
              </button>

              <button
                onClick={onOpenCourse}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTopic !== 'admin-dashboard'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Tinjau Kursus (Topik 1-5)
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Google Meet Direct Link if Active */}
            {meetConfig?.meetUrl && meetConfig?.isActive && (
              <a
                href={meetConfig.meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                title="Masuk Ruang Google Meet Tatap Maya"
              >
                <Video className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Google Meet</span>
                <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse hidden sm:inline-block"></span>
              </a>
            )}

            {/* 7-Hour Schedule Button */}
            <button
              onClick={onOpenSchedule}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Lihat Jadwal Pembelajaran 7 Jam"
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Jadwal 7 Jam</span>
            </button>

            {/* E-Sertifikat Button (Participant mode) */}
            {!isAdmin && (
              <button
                onClick={onOpenCertificate}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  isCertificateEligible
                    ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 shadow-xs'
                    : awaitingTopic5Review
                    ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 shadow-xs'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300'
                }`}
                title={
                  isCertificateEligible
                    ? 'Tugas akhir Topik 5 telah disahkan fasilitator! Klik untuk membuka E-Sertifikat Kelulusan Resmi (7 JP)'
                    : awaitingTopic5Review
                    ? 'Tugas akhir Topik 5 telah Anda kirimkan. E-Sertifikat akan terbit setelah admin/fasilitator selesai mengoreksi.'
                    : `E-Sertifikat masih terkunci. Anda baru menyelesaikan ${completedTopicsCount} dari 5 topik.`
                }
              >
                {isCertificateEligible ? (
                  <Award className="w-4 h-4 text-emerald-600" />
                ) : awaitingTopic5Review ? (
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span className="hidden sm:inline">E-Sertifikat</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isCertificateEligible
                    ? 'bg-emerald-200 text-emerald-900'
                    : awaitingTopic5Review
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {isCertificateEligible ? 'Siap' : awaitingTopic5Review ? 'Menunggu Koreksi' : `${completedTopicsCount}/5`}
                </span>
              </button>
            )}

            {/* Profile Avatar & Switcher */}
            {!isAdmin ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 pl-2 pr-3 py-1 text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                title="Ubah Profil Kepala Sekolah"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {profile.name.charAt(0) || 'K'}
                </div>
                <div className="text-left hidden lg:block leading-tight max-w-[120px] truncate">
                  <p className="font-semibold text-slate-800 truncate">{profile.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{profile.schoolName}</p>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-2 pr-3 py-1 text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left hidden lg:block leading-tight max-w-[130px] truncate">
                    <p className="font-bold text-slate-900 truncate">{adminName}</p>
                    <p className="text-[10px] text-amber-700 font-semibold truncate">Fasilitator PKB</p>
                  </div>
                </div>

                {/* Quick Share Participant Link for Facilitator */}
                <button
                  type="button"
                  onClick={handleCopyParticipantLink}
                  className="px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1.5"
                  title="Salin Tautan Login Khusus Peserta untuk dibagikan"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline text-emerald-700 font-bold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="hidden sm:inline">Link Peserta</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Ganti Akun / Peran Button */}
            {!isAdmin ? (
              <button
                onClick={onOpenAuthModal}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                title="Ganti Akun Peserta Kepala Sekolah"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">Ganti Akun</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                title="Ganti Akun / Peran"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">Ganti Peran</span>
              </button>
            )}

            {/* Keluar Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
                title="Keluar dari sesi ini"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden md:inline">Keluar</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
