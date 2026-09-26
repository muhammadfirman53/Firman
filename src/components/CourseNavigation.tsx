import React from 'react';
import { COURSE_TOPICS } from '../data/courseData';
import { TopicId, TopicUnlockStatus } from '../types';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  HelpCircle,
  Home,
  MessageSquare,
  Sparkles,
  Target,
  Users,
  LayoutDashboard,
  ShieldCheck,
  Lock,
  Check
} from 'lucide-react';

interface CourseNavigationProps {
  activeTopic: TopicId;
  onSelectTopic: (topicId: TopicId) => void;
  progressMap: Record<string, boolean>;
  unlockStatusMap?: Record<TopicId, TopicUnlockStatus>;
  isAdmin?: boolean;
}

export const CourseNavigation: React.FC<CourseNavigationProps> = ({
  activeTopic,
  onSelectTopic,
  progressMap,
  unlockStatusMap = {} as Record<TopicId, TopicUnlockStatus>,
  isAdmin = false,
}) => {
  const getTopicIcon = (id: TopicId, isLocked: boolean, isApproved: boolean) => {
    if (isLocked) {
      return <Lock className="w-4 h-4 text-slate-400" />;
    }
    if (isApproved) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
    switch (id) {
      case 'topik-1':
        return <HelpCircle className="w-4 h-4" />;
      case 'topik-2':
        return <Compass className="w-4 h-4" />;
      case 'topik-3':
        return <Sparkles className="w-4 h-4" />;
      case 'topik-4':
        return <Target className="w-4 h-4" />;
      case 'topik-5':
        return <Award className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
    }
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      
      {/* Course Title Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Navigasi Kursus Moodle
        </span>
        <h3 className="font-bold text-slate-900 text-sm leading-tight">
          PKB Kepala Sekolah: Kepemimpinan & Growth Mindset
        </h3>
      </div>

      {/* Navigation List */}
      <nav className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs space-y-1">
        
        {/* Admin Dashboard Button if in admin mode */}
        {isAdmin && (
          <button
            onClick={() => onSelectTopic('admin-dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-semibold transition-all mb-1 border ${
              activeTopic === 'admin-dashboard'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <div className="flex-1 truncate">
              <span className="block font-bold">Dasbor Fasilitator</span>
              <span className={`text-[10px] font-normal block truncate ${
                activeTopic === 'admin-dashboard' ? 'text-amber-100' : 'text-amber-700'
              }`}>
                Rekap Peserta & Nilai
              </span>
            </div>
          </button>
        )}

        {/* Overview Button */}
        <button
          onClick={() => onSelectTopic('overview')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-semibold transition-all ${
            activeTopic === 'overview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100/80'
          }`}
        >
          <Home className="w-4 h-4 shrink-0" />
          <div className="flex-1 truncate">
            <span className="block">Beranda & Pengantar</span>
            <span className={`text-[10px] font-normal block truncate ${
              activeTopic === 'overview' ? 'text-indigo-100' : 'text-slate-400'
            }`}>
              Tujuan & Struktur 7 Jam
            </span>
          </div>
        </button>

        {/* Topics List */}
        {COURSE_TOPICS.map((topic) => {
          const isActive = activeTopic === topic.id;
          const status = unlockStatusMap[topic.id];
          const isLocked = Boolean(status && !status.isUnlocked);
          const isApproved = Boolean(status?.isApproved);

          return (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl text-left text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isLocked
                  ? 'bg-slate-50/70 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-transparent hover:border-slate-200'
                  : 'text-slate-700 hover:bg-slate-100/80'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {getTopicIcon(topic.id, isLocked, isApproved)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`truncate block font-bold ${isLocked && !isActive ? 'text-slate-500' : ''}`}>
                    Topik {topic.number}
                  </span>
                  
                  {isLocked ? (
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      Terkunci
                    </span>
                  ) : isApproved ? (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      isActive ? 'bg-emerald-500/30 text-emerald-100' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      ✓ Disetujui
                    </span>
                  ) : (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                      isActive ? 'bg-indigo-500 text-indigo-100' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {status ? `${status.completedTasks}/${status.totalTasks}` : topic.duration.split(' ')[0]}
                    </span>
                  )}
                </div>

                <span className={`text-[11px] block truncate font-medium mt-0.5 ${
                  isActive
                    ? 'text-indigo-50'
                    : isLocked
                    ? 'text-slate-500'
                    : 'text-slate-800'
                }`}>
                  {topic.title}
                </span>

                <span className={`text-[10px] block truncate ${
                  isActive
                    ? 'text-indigo-200'
                    : isLocked
                    ? 'text-slate-400'
                    : 'text-slate-400'
                }`}>
                  {isLocked ? 'Menunggu koreksi topik sebelumnya' : topic.mode}
                </span>
              </div>
            </button>
          );
        })}

      </nav>

      {/* Facilitator Info Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
            MF
          </div>
          <div>
            <h4 className="text-xs font-bold leading-none">Muhamad Firman, S.Pd</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">ID: F2151251088</p>
          </div>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed border-t border-white/10 pt-2">
          Fasilitator Utama Program Pengembangan Profesional Kepala Sekolah.
        </p>
      </div>

    </aside>
  );
};
