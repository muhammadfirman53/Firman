import React from 'react';

interface TrainingHeaderBannerProps {
  className?: string;
  variant?: 'full' | 'compact';
  subtitle?: string;
}

export const TrainingHeaderBanner: React.FC<TrainingHeaderBannerProps> = ({
  className = '',
  variant = 'full',
  subtitle
}) => {
  return (
    <div
      id="training-header-banner"
      className={`relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white shadow-md transition-all hover:shadow-lg ${className}`}
    >
      <div className="relative w-full overflow-hidden bg-slate-900 group">
        <img
          src="/banner.jpg"
          alt="Pelatihan Pengembangan Profesional Kepala Sekolah - Kepemimpinan Berkelanjutan dan Pemimpin Perubahan dengan Pola Pikir Bertumbuh"
          referrerPolicy="no-referrer"
          className={`w-full object-cover sm:object-contain transition-transform duration-700 ${
            variant === 'compact'
              ? 'h-36 sm:h-48 md:h-56 lg:h-64 object-center'
              : 'h-auto max-h-[360px] object-center'
          }`}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {subtitle && (
        <div className="bg-slate-900/90 backdrop-blur-xs text-white px-4 py-2 sm:px-6 sm:py-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 text-xs">
          <span className="font-medium text-slate-200 tracking-wide">{subtitle}</span>
          <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
            Pola Pikir Bertumbuh (Growth Mindset)
          </span>
        </div>
      )}
    </div>
  );
};
