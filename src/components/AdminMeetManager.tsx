import React, { useState } from 'react';
import { GoogleMeetConfig } from '../types';
import {
  Video,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Clock,
  ShieldAlert,
  Info,
  Sparkles,
  Save,
  CheckCircle2,
  Lock,
  Radio
} from 'lucide-react';

interface AdminMeetManagerProps {
  meetConfig: GoogleMeetConfig;
  onSaveMeetConfig: (config: GoogleMeetConfig) => void;
}

export const AdminMeetManager: React.FC<AdminMeetManagerProps> = ({
  meetConfig,
  onSaveMeetConfig
}) => {
  const [formData, setFormData] = useState<GoogleMeetConfig>({ ...meetConfig });
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auto extract meet code from URL if user pastes a meet link
  const handleUrlChange = (url: string) => {
    let extractedCode = formData.meetCode;
    const match = url.match(/meet\.google\.com\/([a-z0-9-]+)/i);
    if (match && match[1]) {
      extractedCode = match[1];
    }
    setFormData((prev) => ({
      ...prev,
      meetUrl: url,
      meetCode: extractedCode
    }));
  };

  const handleCopyLink = () => {
    if (!formData.meetUrl) return;
    navigator.clipboard.writeText(formData.meetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMeetConfig({
      ...formData,
      updatedAt: new Date().toISOString()
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert on Save */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-xs">Tautan Google Meet Berhasil Diperbarui!</p>
            <p className="text-[11px] text-emerald-700">
              Seluruh peserta Kepala Sekolah kini dapat melihat dan mengakses tautan sesi sinkronus ini dari beranda dan jadwal pelatihan.
            </p>
          </div>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Pengaturan Tautan Google Meet (Sesi Sinkronus)
              </h3>
              <p className="text-xs text-slate-500">
                Atur tautan ruang tatap maya pleno dan breakout room kelompok untuk 4 sesi sinkronus kepala sekolah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                formData.isActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  formData.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              {formData.isActive ? 'Status: Sesi Aktif' : 'Status: Sesi Ditutup'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Active Status Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Radio className="w-4 h-4 text-indigo-600" />
                Aktifkan Sesi Sinkronus untuk Peserta
              </label>
              <p className="text-[11px] text-slate-500">
                Bila diaktifkan, tombol masuk Google Meet dan status siaran langsung akan tampil di seluruh layar peserta.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Google Meet URL */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-800">
                Tautan Google Meet Utama (URL) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  placeholder="https://meet.google.com/xxx-yyyy-zzz"
                  value={formData.meetUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full text-xs font-mono pl-3 pr-24 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 transition-colors"
                    title="Salin Tautan"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px] font-bold">{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Contoh format: <code>https://meet.google.com/ocv-mwmu-ksg</code>. Pastikan link dapat diakses oleh akun peserta tanpa batasan domain tertutup jika menggunakan email personal.
              </p>
            </div>

            {/* Session Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Judul Sesi Tatap Maya <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Sesi Pleno Tatap Maya Pelatihan KS"
                value={formData.sessionTitle}
                onChange={(e) => setFormData({ ...formData, sessionTitle: e.target.value })}
                className="w-full text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            {/* Schedule Time */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Jadwal / Waktu Pelaksanaan
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: 08.00 - 15.30 WIB"
                  value={formData.scheduleTime}
                  onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>
            </div>

            {/* Meet Code */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Kode Rapat (Meet Code)
              </label>
              <input
                type="text"
                placeholder="Contoh: ocv-mwmu-ksg"
                value={formData.meetCode || ''}
                onChange={(e) => setFormData({ ...formData, meetCode: e.target.value })}
                className="w-full text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-900"
              />
            </div>

            {/* Passcode (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                PIN / Sandi Tambahan (Jika Ada)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Opsional (kosongkan jika tanpa PIN)"
                  value={formData.passcode || ''}
                  onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>
            </div>

            {/* Instructions / Guidance */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-800">
                Petunjuk & Tata Tertib Sesi untuk Peserta Kepala Sekolah
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan petunjuk masuk, tautan breakout room kelompok, atau panduan teknis audio/kamera..."
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full text-xs p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 leading-relaxed"
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {formData.meetUrl && (
                <a
                  href={formData.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-indigo-600" />
                  <span>Uji Buka Google Meet</span>
                </a>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan Google Meet</span>
            </button>
          </div>

        </form>

      </div>

      {/* Live Preview Card (How participants see it) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Pratinjau Tampilan Peserta (Live Preview Card)</span>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                {formData.isActive ? 'Sesi Tatap Maya Sedang Berlangsung' : 'Sesi Sinkronus Terjadwal'}
              </span>
            </div>
            <h4 className="text-base font-bold text-white">{formData.sessionTitle}</h4>
            <p className="text-xs text-slate-300">
              Waktu: <strong className="text-amber-300">{formData.scheduleTime || '08.00 - 15.30 WIB'}</strong> • Kode: <code className="text-indigo-300">{formData.meetCode || 'meet'}</code>
            </p>
            {formData.instructions && (
              <p className="text-[11px] text-slate-400 max-w-xl leading-relaxed mt-1">
                {formData.instructions}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            {formData.meetUrl ? (
              <a
                href={formData.meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Video className="w-4 h-4" />
                <span>Masuk Google Meet Sekarang</span>
              </a>
            ) : (
              <span className="text-xs text-slate-400 italic">Belum ada URL</span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
