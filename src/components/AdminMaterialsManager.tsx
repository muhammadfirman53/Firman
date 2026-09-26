import React, { useState } from 'react';
import { CourseMaterial, MaterialCategory, TopicId } from '../types';
import { COURSE_TOPICS } from '../data/courseData';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  Video,
  FileText,
  Presentation,
  FileCode,
  Link,
  ClipboardList,
  CheckCircle2,
  Clock,
  Eye,
  X,
  Save,
  Check,
  Globe,
  Radio
} from 'lucide-react';

interface AdminMaterialsManagerProps {
  materials: CourseMaterial[];
  onSaveMaterial: (material: CourseMaterial) => void;
  onDeleteMaterial: (materialId: string) => void;
  onNavigateTopic: (topicId: TopicId) => void;
}

const CATEGORY_CONFIG: Record<MaterialCategory, { label: string; icon: any; color: string; bg: string }> = {
  video: { label: 'Video Tutorial', icon: Video, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  slide: { label: 'Slide Presentasi', icon: Presentation, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  pdf: { label: 'Dokumen PDF', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  artikel: { label: 'Artikel & Bacaan', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  tugas: { label: 'Lembar Tugas / Canvas', icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
  link: { label: 'Tautan Eksternal', icon: Link, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
};

const BLANK_MATERIAL: CourseMaterial = {
  id: '',
  topicId: 'topik-1',
  title: '',
  category: 'video',
  mode: 'Asinkronus',
  duration: '30 Menit',
  description: '',
  contentUrl: '',
  textNotes: '',
  isPublished: true,
  createdAt: ''
};

export const AdminMaterialsManager: React.FC<AdminMaterialsManagerProps> = ({
  materials,
  onSaveMaterial,
  onDeleteMaterial,
  onNavigateTopic
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CourseMaterial>(BLANK_MATERIAL);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPreviewMaterial, setSelectedPreviewMaterial] = useState<CourseMaterial | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddModal = () => {
    setFormData({
      ...BLANK_MATERIAL,
      id: 'mat-' + Date.now(),
      createdAt: new Date().toISOString()
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (material: CourseMaterial) => {
    setFormData({ ...material });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(BLANK_MATERIAL);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Judul materi wajib diisi');
      return;
    }

    onSaveMaterial(formData);
    handleCloseModal();
    showToast(isEditing ? 'Materi berhasil diperbarui!' : 'Materi baru berhasil ditambahkan!');
  };

  const handleDelete = (material: CourseMaterial) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus materi "${material.title}"?`)) {
      onDeleteMaterial(material.id);
      showToast('Materi berhasil dihapus');
    }
  };

  const handleTogglePublish = (material: CourseMaterial) => {
    const updated: CourseMaterial = {
      ...material,
      isPublished: !material.isPublished
    };
    onSaveMaterial(updated);
    showToast(
      updated.isPublished ? 'Materi dipublikasikan ke peserta' : 'Materi disimpan sebagai draf'
    );
  };

  // Filtered materials
  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.textNotes && m.textNotes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTopic = selectedTopicFilter === 'all' || m.topicId === selectedTopicFilter;
    const matchesCat = selectedCategoryFilter === 'all' || m.category === selectedCategoryFilter;

    return matchesSearch && matchesTopic && matchesCat;
  });

  const getTopicTitle = (topicId: TopicId) => {
    const topic = COURSE_TOPICS.find((t) => t.id === topicId);
    return topic ? `Topik ${topic.number}: ${topic.title}` : topicId;
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                Manajemen Konten Pelatihan
              </span>
              <span className="text-xs text-slate-500 font-medium">
                • {materials.length} Materi Terdaftar
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
              Kelola Materi & Bahan Ajar Kursus
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Fasilitator dapat menambah materi baru, mengedit bahan tayang, video panduan, slide presentasi, dokumen studi kasus, dan tautan tugas yang langsung tersinkronisasi ke tampilan peserta.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Materi Baru</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul materi / kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          {/* Topic Filter */}
          <select
            value={selectedTopicFilter}
            onChange={(e) => setSelectedTopicFilter(e.target.value)}
            className="text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
          >
            <option value="all">Semua Modul / Topik (Topik 1-5)</option>
            {COURSE_TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                Topik {t.number}: {t.title}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
          >
            <option value="all">Semua Kategori Media</option>
            <option value="video">Video Tutorial</option>
            <option value="slide">Slide Presentasi</option>
            <option value="pdf">Dokumen PDF</option>
            <option value="artikel">Artikel & Panduan</option>
            <option value="tugas">Lembar Tugas / Canvas</option>
            <option value="link">Tautan Eksternal</option>
          </select>

        </div>

        {/* Materials Grid / List */}
        {filteredMaterials.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Tidak Ada Materi Ditemukan</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                {searchQuery || selectedTopicFilter !== 'all' || selectedCategoryFilter !== 'all'
                  ? 'Tidak ada materi yang cocok dengan filter pencarian saat ini.'
                  : 'Belum ada materi pembelajaran yang dibuat. Silakan klik tombol "Tambah Materi Baru".'}
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Materi Pertama</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMaterials.map((material) => {
              const catConfig = CATEGORY_CONFIG[material.category] || CATEGORY_CONFIG.artikel;
              const IconComp = catConfig.icon;

              return (
                <div
                  key={material.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    material.isPublished
                      ? 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 border-dashed opacity-80'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catConfig.bg} ${catConfig.color}`}
                        >
                          <IconComp className="w-3 h-3" />
                          <span>{catConfig.label}</span>
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                          {material.mode}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{material.duration}</span>
                        </span>
                      </div>

                      <button
                        onClick={() => handleTogglePublish(material)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                          material.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Klik untuk mengubah status publikasi"
                      >
                        {material.isPublished ? '● Diterbitkan' : '○ Draf (Tersimpan)'}
                      </button>
                    </div>

                    {/* Topic Name */}
                    <p className="text-[11px] font-bold text-indigo-600 truncate">
                      {getTopicTitle(material.topicId)}
                    </p>

                    {/* Title */}
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {material.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {material.description}
                    </p>

                    {/* Content URL snippet if any */}
                    {material.contentUrl && (
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-600">
                        <span className="truncate font-mono text-[10px] text-indigo-700">
                          {material.contentUrl}
                        </span>
                        <a
                          href={material.contentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-white shrink-0"
                          title="Buka Tautan"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                  </div>

                  {/* Footer Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedPreviewMaterial(material)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Tinjau</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(material)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                        title="Edit Materi Pembelajaran"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Materi</span>
                      </button>

                      <button
                        onClick={() => handleDelete(material)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Materi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal: Tambah / Edit Materi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    {isEditing ? 'Edit Materi Pembelajaran' : 'Tambah Materi Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lengkapi informasi modul pembelajaran untuk Kepala Sekolah
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">
                  Judul Materi Pembelajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Video Panduan LMS Moodle / Slide Matriks Tiga Pilar"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              {/* Topic and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">
                    Penempatan Modul / Topik Kursus
                  </label>
                  <select
                    value={formData.topicId}
                    onChange={(e) => setFormData({ ...formData, topicId: e.target.value as TopicId })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  >
                    {COURSE_TOPICS.map((t) => (
                      <option key={t.id} value={t.id}>
                        Topik {t.number}: {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">
                    Kategori Format Media
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as MaterialCategory })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  >
                    <option value="video">Video Tutorial</option>
                    <option value="slide">Slide Presentasi</option>
                    <option value="pdf">Dokumen PDF / E-Book</option>
                    <option value="artikel">Artikel & Bahan Bacaan</option>
                    <option value="tugas">Lembar Tugas / Action Plan</option>
                    <option value="link">Tautan Eksternal</option>
                  </select>
                </div>
              </div>

              {/* Mode and Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">
                    Moda Pembelajaran
                  </label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  >
                    <option value="Asinkronus">Asinkronus (Mandiri di Moodle)</option>
                    <option value="Sinkronus">Sinkronus (Tatap Maya Google Meet)</option>
                    <option value="Blended">Blended Learning (Gabungan)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">
                    Estimasi Durasi / Waktu Belajar
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 30 Menit / 1 JP"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Content URL */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">
                  Tautan Materi / Video / Dokumen (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://youtu.be/... atau https://drive.google.com/..."
                  value={formData.contentUrl || ''}
                  onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px] text-slate-900"
                />
                <p className="text-[10px] text-slate-400">
                  Masukkan link video YouTube, presentasi Google Slides, file Google Drive, atau tautan repositori Kemdikbud.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">
                  Ringkasan & Deskripsi Singkat Materi <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan intisari materi dan tujuan dari pembelajaran ini..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 leading-relaxed"
                />
              </div>

              {/* Instructions / Notes */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">
                  Petunjuk & Catatan Tambahan Fasilitator (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tuliskan petunjuk teknis belajar, misalnya: Simak video hingga selesai sebelum mengerjakan lembar kerja."
                  value={formData.textNotes || ''}
                  onChange={(e) => setFormData({ ...formData, textNotes: e.target.value })}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 leading-relaxed"
                />
              </div>

              {/* Publish Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-bold text-slate-800">
                    Publikasikan materi ini (dapat dilihat dan diakses oleh peserta)
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Simpan Perubahan Materi' : 'Terbitkan Materi Baru'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal: Pratinjau Materi */}
      {selectedPreviewMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                Pratinjau Materi Pembelajaran
              </span>
              <button
                onClick={() => setSelectedPreviewMaterial(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-indigo-600">
                {getTopicTitle(selectedPreviewMaterial.topicId)}
              </p>
              <h3 className="font-bold text-slate-900 text-lg">
                {selectedPreviewMaterial.title}
              </h3>
              
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  Kategori: {selectedPreviewMaterial.category.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  Moda: {selectedPreviewMaterial.mode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  Durasi: {selectedPreviewMaterial.duration}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
                <p className="font-bold text-slate-900">Deskripsi:</p>
                <p>{selectedPreviewMaterial.description}</p>
              </div>

              {selectedPreviewMaterial.textNotes && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-1">
                  <p className="font-bold">Catatan & Petunjuk Fasilitator:</p>
                  <p>{selectedPreviewMaterial.textNotes}</p>
                </div>
              )}

              {selectedPreviewMaterial.contentUrl && (
                <div className="pt-2">
                  <a
                    href={selectedPreviewMaterial.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Buka Tautan Materi di Tab Baru</span>
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedPreviewMaterial(null);
                  handleOpenEditModal(selectedPreviewMaterial);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                Edit Materi Ini
              </button>
              <button
                onClick={() => setSelectedPreviewMaterial(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
