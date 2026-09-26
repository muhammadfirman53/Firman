import React from 'react';
import { SCHEDULE_STEPS, TRAINING_INFO } from '../data/courseData';
import { Calendar, Clock, ExternalLink, Info, Monitor, Video, X } from 'lucide-react';
import { TopicId, GoogleMeetConfig } from '../types';

interface VirtualScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topicId: TopicId) => void;
  meetConfig?: GoogleMeetConfig;
}

export const VirtualScheduleModal: React.FC<VirtualScheduleModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
  meetConfig,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Struktur Pembelajaran 7 Jam (420 Menit)</h3>
              <p className="text-xs text-indigo-200">
                {TRAINING_INFO.theme} • {TRAINING_INFO.mode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <span className="text-[11px] text-slate-500 font-medium block">Total Durasi</span>
              <span className="text-sm font-bold text-slate-800">420 Menit / 7 Jam</span>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
              <span className="text-[11px] text-indigo-700 font-medium block">Sesi Sinkronus</span>
              <span className="text-sm font-bold text-indigo-900">4 Sesi (Google Meet)</span>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <span className="text-[11px] text-blue-700 font-medium block">Sesi Asinkronus</span>
              <span className="text-sm font-bold text-blue-900">5 Sesi (LMS Moodle)</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              <span className="text-[11px] text-emerald-700 font-medium block">Fasilitator Utama</span>
              <span className="text-sm font-bold text-emerald-900 truncate block">M. Firman, S.Pd</span>
            </div>
          </div>

          {/* Virtual Classroom Link Box */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 via-blue-50 to-emerald-50 rounded-2xl border border-indigo-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-indigo-950">
                  {meetConfig?.sessionTitle || 'Ruang Virtual Google Meet (Sesi Sinkronus)'}
                </h4>
                <p className="text-[11px] text-indigo-700">
                  Jadwal: {meetConfig?.scheduleTime || '08.00 - 15.30 WIB'} • {meetConfig?.instructions || 'Tatap maya pleno & breakout room'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {meetConfig?.meetUrl ? (
                <a
                  href={meetConfig.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Gabung Google Meet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  Tautan Belum Diatur
                </span>
              )}
            </div>
          </div>

          {/* Table of 9 Steps */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3 w-12 text-center">Tahap</th>
                  <th className="py-2.5 px-3">Aktivitas Pembelajaran</th>
                  <th className="py-2.5 px-3 w-28">Moda</th>
                  <th className="py-2.5 px-3 w-24">Waktu</th>
                  <th className="py-2.5 px-3 w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {SCHEDULE_STEPS.map((s) => (
                  <tr key={s.step} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-500">{s.step}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-800">{s.title}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        s.mode === 'Sinkronus' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {s.mode === 'Sinkronus' ? <Video className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                        {s.mode}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-600">{s.duration}</td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => {
                          onSelectTopic(s.topicId as TopicId);
                          onClose();
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        Buka
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Pelatihan ini mengadopsi model <strong>Experiential Learning + Problem Based Learning + Action Planning</strong>. 
              Peserta diharapkan berpartisipasi aktif pada sesi pleno serta menyelesaikan modul pendalaman di Moodle secara mandiri.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-xs"
          >
            Tutup Jadwal
          </button>
        </div>

      </div>
    </div>
  );
};
