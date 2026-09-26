import { CourseTopicMeta, QuizQuestion, ForumPost, PadletNote, ThreePillarsRow, MindsetTransformationRow, ActionPlanData, Reflection321Data, Modul1AssignmentData, MentimeterVote } from '../types';

export const TRAINING_INFO = {
  theme: "Kepemimpinan Berkelanjutan dan Pemimpin Perubahan dengan Pola Pikir Bertumbuh",
  target: "Kepala Sekolah",
  duration: "1 hari / ± 7 jam efektif (420 menit)",
  mode: "Blended Learning berbasis Moodle",
  approach: "Sinkronus + Asinkronus",
  model: "Experiential Learning + Problem Based Learning + Action Planning",
  facilitator: "Muhamad Firman, S.Pd",
  facilitatorId: "F2151251088",
  organization: "Program Pengembangan Keprofesian Berkelanjutan (PKB) Kepala Sekolah",
};

export const LEARNING_OBJECTIVES = [
  "Memahami kepemimpinan sekolah sebagai warisan kepemimpinan diri.",
  "Mengidentifikasi nilai pribadi yang menjadi dasar kepemimpinan.",
  "Menganalisis permasalahan kepemimpinan sekolah melalui studi kasus.",
  "Menjelaskan tiga pilar warisan kepemimpinan (Nilai Pribadi, Budaya Sekolah, Pemberdayaan).",
  "Memahami karakteristik pola pikir tetap (fixed mindset) dan pola pikir bertumbuh (growth mindset).",
  "Mengenali pola pikir tetap yang muncul dalam praktik kepemimpinan.",
  "Mengubah pola pikir tetap menjadi pola pikir bertumbuh.",
  "Merumuskan aksi nyata untuk menumbuhkan pola pikir bertumbuh.",
  "Menyusun Action Plan kepemimpinan yang realistis untuk diterapkan di sekolah."
];

export const SCHEDULE_STEPS = [
  { step: 1, title: "Orientasi LMS & Pre-assessment", mode: "Asinkronus", duration: "20 menit", topicId: "topik-1" },
  { step: 2, title: "Pembukaan & Refleksi Nilai Diri", mode: "Sinkronus", duration: "30 menit", topicId: "topik-2" },
  { step: 3, title: "Materi 1: Kepemimpinan Berkelanjutan", mode: "Sinkronus", duration: "90 menit", topicId: "topik-2" },
  { step: 4, title: "Pendalaman Materi 1 melalui Moodle", mode: "Asinkronus", duration: "30 menit", topicId: "topik-2" },
  { step: 5, title: "Materi 2: Pemimpin Perubahan Pola Pikir Bertumbuh", mode: "Sinkronus", duration: "100 menit", topicId: "topik-3" },
  { step: 6, title: "Penutupan & Komitmen", mode: "Sinkronus", duration: "20 menit", topicId: "topik-3" },
  { step: 7, title: "Pendalaman Materi 2 melalui Moodle", mode: "Asinkronus", duration: "30 menit", topicId: "topik-3" },
  { step: 8, title: "Action Planning Kepemimpinan", mode: "Asinkronus", duration: "70 menit", topicId: "topik-4" },
  { step: 9, title: "Post-test dan Refleksi 3-2-1", mode: "Asinkronus", duration: "30 menit", topicId: "topik-5" },
];

export const COURSE_TOPICS: CourseTopicMeta[] = [
  {
    id: 'topik-1',
    number: 1,
    title: 'Orientasi & Diagnostik',
    subtitle: 'Panduan Moodle, Asesmen Diagnostik Awal, dan Forum Perkenalan Warisan',
    duration: '20 Menit',
    mode: 'Asinkronus',
    steps: ['Video Orientasi LMS', 'Pre-test (Quiz Diagnostik)', 'Forum Perkenalan & Warisan']
  },
  {
    id: 'topik-2',
    number: 2,
    title: 'Kepemimpinan Berkelanjutan',
    subtitle: 'Alur Relate-Explore-Apply-Learn Again & Assignment Warisan Kepemimpinan',
    duration: '150 Menit (120 Syn + 30 Asyn)',
    mode: 'Blended',
    steps: ['Relate: Mentimeter Nilai Diri', 'Explore: Studi Kasus Pak Pandi', 'Apply: Matriks Tiga Pilar', 'Learn Again: Padlet Harapan', 'Assignment Moodle & Peer Review']
  },
  {
    id: 'topik-3',
    number: 3,
    title: 'Pemimpin Perubahan & Growth Mindset',
    subtitle: 'Transformasi Pola Pikir Tetap Menjadi Pola Pikir Bertumbuh',
    duration: '180 Menit (150 Syn + 30 Asyn)',
    mode: 'Blended',
    steps: ['Relate: Refleksi Kegagalan', 'Explore: Mindset Transformation Canvas', 'Apply: Studi Kasus Reframing', 'Learn Again: Padlet & Komitmen', 'Forum Reflektif Asinkronus']
  },
  {
    id: 'topik-4',
    number: 4,
    title: 'Action Planning Kepemimpinan',
    subtitle: 'Menyusun Rencana Perubahan Sekolah yang Realistis & Bermakna',
    duration: '70 Menit',
    mode: 'Asinkronus',
    steps: ['Penyusunan 10 Komponen Canvas', 'Prinsip Tindakan Kecil Bermakna', 'Ekspor & Pengunggahan PDF']
  },
  {
    id: 'topik-5',
    number: 5,
    title: 'Evaluasi & Refleksi',
    subtitle: 'Post-test, Refleksi Akhir 3-2-1, dan Sertifikat Kelulusan Pelatihan',
    duration: '30 Menit',
    mode: 'Asinkronus',
    steps: ['Post-test Kuis Evaluasi', 'Refleksi Akhir 3-2-1', 'Penerbitan E-Sertifikat 7 Jam']
  }
];

export const PRE_TEST_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Apa esensi mendasar dari konsep 'Kepemimpinan Berkelanjutan' di lingkungan satuan pendidikan?",
    options: [
      "Kepemimpinan yang berfokus menyelesaikan proyek fisik sekolah dalam waktu sesingkat-singkatnya.",
      "Kepemimpinan yang meninggalkan warisan nilai, budaya positif, dan pemberdayaan manusia yang terus bertumbuh melampaui masa jabatan.",
      "Kepatuhan mutlak seluruh warga sekolah terhadap regulasi birokrasi dan hierarki formal.",
      "Kemampuan kepala sekolah mempertahankan jabatan selama mungkin di sekolah yang sama."
    ],
    correctAnswer: 1,
    explanation: "Kepemimpinan berkelanjutan berfokus pada pembangunan kapasitas jangka panjang melalui tiga pilar: nilai pribadi, budaya sekolah, dan pemberdayaan orang lain agar perubahan tetap lestari.",
    category: 'kepemimpinan'
  },
  {
    id: 2,
    question: "Menurut Carol Dweck, karakteristik utama dari seseorang yang memiliki Pola Pikir Tetap (Fixed Mindset) adalah...",
    options: [
      "Melihat kegagalan sebagai kesempatan untuk belajar dan meningkatkan strategi.",
      "Memandang kecerdasan dan bakat adalah sifat bawaan yang statis serta cenderung menghindari tantangan.",
      "Selalu terbuka terhadap kritik yang membangun demi kemajuan organisasi.",
      "Senang melihat rekan sejawat mencapai keberhasilan dan menjadikannya inspirasi."
    ],
    correctAnswer: 1,
    explanation: "Fixed mindset meyakini kecerdasan bersifat bawaan dan tidak dapat diubah, sehingga individu cenderung menghindari tantangan karena takut terlihat tidak kompeten.",
    category: 'mindset'
  },
  {
    id: 3,
    question: "Dalam studi kasus kepemimpinan inklusif (Kasus Pak Pandi), ketika seorang guru hanya aktif melibatkan murid laki-laki cerdas sementara murid disabilitas terabaikan, apa prioritas tindakan kepala sekolah?",
    options: [
      "Memberikan sanksi pemotongan tunjangan kepada guru tersebut secara terbuka.",
      "Memindahkan murid disabilitas ke sekolah lain agar guru tidak kesulitan.",
      "Melakukan dialog reflektif, membangun budaya kelas inklusif, dan memberdayakan guru melalui pelatihan diferensiasi.",
      "Mengabaikan situasi tersebut selama hasil ujian akhir sekolah tetap mencapai target."
    ],
    correctAnswer: 2,
    explanation: "Kepemimpinan kepala sekolah harus mengedepankan nilai inklusivitas melalui pembinaan berkelanjutan, membangun budaya empati, dan memberdayakan guru agar mampu merangkul seluruh murid.",
    category: 'kepemimpinan'
  },
  {
    id: 4,
    question: "Tiga Pilar Warisan Kepemimpinan yang harus ditumbuhkan oleh kepala sekolah terdiri dari:",
    options: [
      "Fasilitas Sekolah, Anggaran Operasional, dan Reputasi Eksternal.",
      "Nilai Pribadi, Budaya yang Diterapkan, dan Pemberdayaan Orang Lain.",
      "Instruksi Pimpinan, Kepatuhan Staf, dan Sistem Pengawasan Ketat.",
      "Prestasi Akademik, Akreditasi A, dan Jumlah Siswa Pendaftar."
    ],
    correctAnswer: 1,
    explanation: "Warisan kepemimpinan sejati berpijak pada 3 pilar: Nilai Pribadi (pondasi), Budaya Sekolah (kebiasaan kolektif), dan Pemberdayaan Orang Lain (mencetak pemimpin-pemimpin baru).",
    category: 'kepemimpinan'
  },
  {
    id: 5,
    question: "Pernyataan mana di bawah ini yang mencerminkan Pola Pikir Bertumbuh (Growth Mindset) seorang kepala sekolah?",
    options: [
      "'Guru-guru senior di sekolah saya sudah tidak mungkin bisa diajak belajar teknologi baru.'",
      "'Sekolah kami berada di pelosok, jadi mustahil kami bisa bersaing dengan sekolah di perkotaan.'",
      "'Tantangan implementasi kurikulum baru ini sulit, namun dengan kolaborasi dan mencoba metode baru, kita pasti bisa menguasainya secara bertahap.'",
      "'Saya memang tidak berbakat memimpin manajemen keuangan sekolah.'"
    ],
    correctAnswer: 2,
    explanation: "Growth mindset memandang kesulitan sebagai fase belajar yang dapat diatasi lewat daya juang, kolaborasi, dan strategi baru ('Belum bisa' bukan 'Tidak bisa').",
    category: 'mindset'
  },
  {
    id: 6,
    question: "Apa tujuan utama dari alur pembelajaran Relate–Explore–Apply–Learn Again dalam pelatihan ini?",
    options: [
      "Memaksa peserta mendengarkan ceramah narasumber dari awal hingga akhir.",
      "Menghubungkan pengalaman nyata peserta, mengeksplorasi konsep, menerapkan langsung pada masalah sekolah, dan merefleksikan komitmen aksi.",
      "Menggantikan peran kepala sekolah dengan modul digital otomatis.",
      "Menyusun laporan administrasi formal untuk dinas pendidikan."
    ],
    correctAnswer: 1,
    explanation: "Alur ini berbasis Experiential Learning yang memandu peserta mengaitkan realitas diri (Relate), mendalami kasus (Explore), mempraktikkan solusi (Apply), dan menginternalisasi makna (Learn Again).",
    category: 'kepemimpinan'
  },
  {
    id: 7,
    question: "Bagaimana cara efektif mengubah pemikiran defisit 'Siswa di sekolah kami sedikit, jadi sekolah tidak akan bisa maju' menjadi pola pikir bertumbuh?",
    options: [
      "'Jumlah murid yang sedikit memberi peluang emas untuk memberikan perhatian personal mendalam dan membina potensi unggulan tiap anak.'",
      "'Kita harus pasrah menerima nasib karena dana BOS kita kecil.'",
      "'Menyalahkan dinas pendidikan karena tidak mengarahkan siswa baru ke sekolah kita.'",
      "'Menurunkan standar kelulusan agar siswa tidak terbebani.'"
    ],
    correctAnswer: 0,
    explanation: "Mengubah keterbatasan kuantitas menjadi peluang diferensiasi dan kualitas relasi merupakan bentuk reframing pola pikir bertumbuh yang solutif.",
    category: 'mindset'
  },
  {
    id: 8,
    question: "Dalam prinsip penyusunan Action Plan pelatihan ini, kriteria utama yang ditekankan adalah:",
    options: [
      "Membuat rencana mega-proyek 5 tahun yang membutuhkan biaya puluhan juta rupiah.",
      "Satu tindakan nyata kecil namun bermakna dan realistis yang dapat dimulai minggu ini.",
      "Menyalin program kerja sekolah percontohan lain tanpa adaptasi.",
      "Menunggu arahan resmi dan SK dari pengawas pembina sebelum mulai bertindak."
    ],
    correctAnswer: 1,
    explanation: "Prinsip aksi nyata kepemimpinan perubahan adalah memulai dari satu perubahan kecil yang bermakna ('small wins') yang dapat segera dieksekusi secara nyata.",
    category: 'kepemimpinan'
  },
  {
    id: 9,
    question: "Pemberdayaan guru (empowerment) oleh kepala sekolah tercapai apabila:",
    options: [
      "Semua guru hanya menjalankan persis apa yang diperintahkan kepala sekolah.",
      "Guru merasa takut jika melakukan kesalahan saat bereksperimen di kelas.",
      "Guru merasa aman, percaya diri, memiliki otonomi pedagogis, dan berani memimpin inisiatif perbaikan pembelajaran.",
      "Kepala sekolah mengerjakan sendiri semua tugas agar cepat selesai."
    ],
    correctAnswer: 2,
    explanation: "Pemberdayaan sejati menumbuhkan keberanian, kemandirian, dan kapasitas kepemimpinan guru di komunitas belajar sekolah.",
    category: 'kepemimpinan'
  },
  {
    id: 10,
    question: "Apa tujuan dilakukannya asesmen awal (Pre-test) dalam rancangan blended learning ini?",
    options: [
      "Menentukan lulus atau tidaknya kepala sekolah dalam pelatihan.",
      "Memetakan pemahaman awal dan kesiapan peserta sehingga pembelajaran dapat terarah secara efektif.",
      "Memberikan peringkat sekolah terbaik dan terburuk.",
      "Membandingkan nilai antar kepala sekolah untuk keperluan promosi."
    ],
    correctAnswer: 1,
    explanation: "Pre-test berfungsi sebagai diagnostik awal untuk mengukur titik mula pemahaman dan membantu fasilitator memfasilitasi kebutuhan belajar peserta.",
    category: 'kepemimpinan'
  }
];

export const POST_TEST_QUESTIONS: QuizQuestion[] = [
  ...PRE_TEST_QUESTIONS.slice(0, 5),
  {
    id: 6,
    question: "Ketika kepala sekolah mendapati guru ragu menyusun modul ajar diferensiasi karena takut salah, respons yang mencerminkan Growth Mindset adalah:",
    options: [
      "'Kalau tidak bisa, lebih baik serahkan ke guru lain yang lebih pintar.'",
      "'Mari kita coba bersama, kesalahan adalah bagian dari proses belajar kita menyempurnakan pendekatan bagi murid.'",
      "'Harusnya bapak/ibu sudah menguasai ini sejak kuliah dulu.'",
      "'Terapkan saja ceramah seperti biasa agar tidak ada risiko.'"
    ],
    correctAnswer: 1,
    explanation: "Menciptakan ruang aman psikologis (psychological safety) dan memandang kesalahan sebagai data belajar adalah inti dari budaya bertumbuh.",
    category: 'mindset'
  },
  {
    id: 7,
    question: "Pada pilar 'Budaya Sekolah', warisan kepemimpinan kepala sekolah terwujud dalam bentuk:",
    options: [
      "Buku pedoman sekolah yang disimpan di lemari arsip kepala sekolah.",
      "Kebiasaan, iklim relasi positif, dan norma kolaboratif yang tetap hidup dan dipraktikkan warga sekolah meski kepala sekolah telah berganti.",
      "Spanduk visi misi sekolah yang dipasang di gerbang utama.",
      "Instruksi lisan kepala sekolah saat apel hari Senin."
    ],
    correctAnswer: 1,
    explanation: "Budaya sekolah adalah kebiasaan bersama yang terinternalisasi secara konsisten dan lestari melampaui figur individu kepala sekolah.",
    category: 'kepemimpinan'
  },
  {
    id: 8,
    question: "Mengapa pemberian umpan balik sebaya (peer review) pada penugasan 'Warisan Kepemimpinan' mewajibkan pertanyaan tentang murid rentan (gender, disabilitas, sosial ekonomi)?",
    options: [
      "Hanya sebagai formalitas dokumen akreditasi sekolah.",
      "Memastikan bahwa rancangan kepemimpinan tidak eksklusif, melainkan berkeadilan sosial bagi seluruh murid tanpa terkecuali.",
      "Menambah beban kerja peserta pelatihan agar lebih sibuk.",
      "Untuk mengkritik kelemahan sekolah rekan sejawat."
    ],
    correctAnswer: 1,
    explanation: "Kepemimpinan transformatif harus berkeadilan dan inklusif, memastikan tidak ada murid yang tertinggal dalam proses transformasi sekolah.",
    category: 'kepemimpinan'
  },
  {
    id: 9,
    question: "Refleksi akhir '3-2-1' memfasilitasi kepala sekolah untuk:",
    options: [
      "Menghitung waktu mengajar guru dalam 3 minggu, 2 bulan, dan 1 semester.",
      "Mengidentifikasi 3 hal penting yang dipelajari, 2 pertanyaan yang masih dimiliki, dan 1 tindakan nyata yang akan dieksekusi.",
      "Memberikan 3 pujian, 2 kritik, dan 1 saran kepada fasilitator pelatihan.",
      "Membuat 3 kelompok guru, 2 tim kerja, dan 1 kepanitiaan baru."
    ],
    correctAnswer: 1,
    explanation: "Format 3-2-1 adalah alat metakognisi efektif untuk merangkum esensi pemahaman, menampung rasa ingin tahu lebih lanjut, dan mengunci komitmen aksi.",
    category: 'kepemimpinan'
  },
  {
    id: 10,
    question: "Kunci utama keberlanjutan perubahan kepemimpinan sekolah terletak pada prinsip:",
    options: [
      "Ketergantungan sekolah pada kepemimpinan satu sosok pahlawan tunggal (hero leader).",
      "Perubahan yang dimulai dari transformasi pola pikir diri pemimpin, meneladankan nilai, dan membangun ekosistem yang memberdayakan guru.",
      "Ketersediaan bantuan sarana prasarana mewah dari pihak swasta.",
      "Penerapan sanksi ketat bagi siapa saja yang tidak sependapat."
    ],
    correctAnswer: 1,
    explanation: "Kepemimpinan berkelanjutan berakar dari transformasi diri pimpinan yang memancar menjadi budaya bersama dan memberdayakan komunitas.",
    category: 'kepemimpinan'
  }
];

// Forum Perkenalan & Warisan: Dikosongkan agar peserta memulai perkenalan baru
export const INITIAL_FORUM_POSTS: ForumPost[] = [];

export const INITIAL_MENTIMETER_VALUES: MentimeterVote[] = [
  { id: 'v1', label: 'Inklusivitas & Keadilan', votes: 0, description: 'Menghargai seluruh murid tanpa membedakan latar belakang atau kemampuan' },
  { id: 'v2', label: 'Integritas & Keteladanan', votes: 0, description: 'Satunya kata dengan perbuatan dalam setiap keputusan kepemimpinan' },
  { id: 'v3', label: 'Empati & Kepedulian', votes: 0, description: 'Mendengarkan secara aktif dan memahami kebutuhan guru serta murid' },
  { id: 'v4', label: 'Pemberdayaan (Kolaboratif)', votes: 0, description: 'Memberi ruang bagi guru dan staf untuk berani memimpin inisiatif' },
  { id: 'v5', label: 'Keberanian untuk Bertumbuh', votes: 0, description: 'Melihat tantangan dan kesalahan sebagai kesempatan belajar baru' }
];

export const INITIAL_PADLET_NOTES: PadletNote[] = [];

export const DEFAULT_THREE_PILLARS: ThreePillarsRow[] = [
  {
    pilar: 'Nilai Pribadi',
    kondisiSaatIni: '',
    kondisiDiinginkan: '',
    tindakan: ''
  },
  {
    pilar: 'Budaya Sekolah',
    kondisiSaatIni: '',
    kondisiDiinginkan: '',
    tindakan: ''
  },
  {
    pilar: 'Pemberdayaan',
    kondisiSaatIni: '',
    kondisiDiinginkan: '',
    tindakan: ''
  }
];

// Topik 3: Seluruh isian default dikosongkan agar peserta memulai dari awal
export const DEFAULT_MINDSET_TRANSFORMATIONS: MindsetTransformationRow[] = [];

export const REFRAMING_CASES = [
  {
    id: 'rc-1',
    fixedStatement: "Sangat sulit mengajar murid penyandang disabilitas.",
    growthPerspective: "Kehadiran murid disabilitas adalah cermin kebermaknaan sekolah kita. Kesulitannya bukan pada murid, melainkan pada kebutuhan kita untuk mempelajari metode diferensiasi dan menyediakan akomodasi yang layak.",
    exampleAction: "Memfasilitasi guru pendamping khusus (GPK) atau teman sebaya, serta mengundang narasumber praktisi pendidikan inklusif untuk sesi sharing di sekolah."
  },
  {
    id: 'rc-2',
    fixedStatement: "Saya tidak akan bisa menjadi kepala sekolah yang hebat seperti pemimpin di sekolah unggulan.",
    growthPerspective: "Kepemimpinan bukanlah bakat turunan, melainkan keterampilan yang dilatih melalui kemauan belajar dari kesalahan, mendengar kritik, dan komitmen melayani komunitas.",
    exampleAction: "Memulai jurnal refleksi harian kepemimpinan dan secara rutin meminta umpan balik konstruktif dari komite sekolah dan perwakilan guru."
  },
  {
    id: 'rc-3',
    fixedStatement: "Sekolah saya siswanya sedikit, tidak akan bisa maju.",
    growthPerspective: "Jumlah murid yang ringkas adalah keunggulan strategis kita untuk menciptakan ekosistem belajar yang sangat akrab, personal, dan memperhatikan bakat setiap anak hingga tuntas.",
    exampleAction: "Menjadadikan rasio guru-murid yang ideal sebagai keunggulan 'personalized learning' dan memperkuat portofolio karya setiap anak untuk dipamerkan kepada orang tua."
  }
];

// Topik 4: Seluruh 10 komponen Action Plan Canvas dikosongkan
export const DEFAULT_ACTION_PLAN: ActionPlanData = {
  masalahPrioritas: "",
  warisanKepemimpinan: "",
  nilaiPribadi: "",
  budaya: "",
  pemberdayaan: "",
  fixedMindset: "",
  growthMindset: "",
  aksi: "",
  indikator: "",
  waktu: "",
  dukungan: ""
};

export const DEFAULT_ASSIGNMENT: Modul1AssignmentData = {
  warisanInginDibangun: "",
  nilaiPribadiPondasi: "",
  budayaSekolah: "",
  caraMemberdayakanGuru: "",
  satuTindakanAwal: "",
  submittedAt: "",
  peerFeedback: []
};

// Topik 5: Seluruh isian Refleksi 3-2-1 dikosongkan
export const DEFAULT_REFLECTION_321: Reflection321Data = {
  tigaHalPenting: ["", "", ""],
  duaPertanyaan: ["", ""],
  satuTindakan: ""
};

export interface TopicTaskDefinition {
  id: string;
  name: string;
  stageName: string;
  description: string;
}

export const TOPIC_TASK_DEFINITIONS: Record<string, TopicTaskDefinition[]> = {
  'topik-1': [
    {
      id: 'orientasi-video',
      name: 'Video Panduan Orientasi',
      stageName: 'Tahap 1: Asinkronus',
      description: 'Menonton video dan menyimak panduan navigasi platform LMS Moodle'
    },
    {
      id: 'pre-test',
      name: 'Asesmen Diagnostik (Pre-test)',
      stageName: 'Tahap 1: Asinkronus',
      description: 'Mengerjakan kuis diagnostik 10 soal pilihan ganda studi kasus kepemimpinan'
    },
    {
      id: 'forum-perkenalan',
      name: 'Forum Perkenalan & Refleksi Warisan',
      stageName: 'Tahap 1: Asinkronus',
      description: 'Mengirimkan perkenalan diri dan aspirasi warisan kepemimpinan di forum'
    }
  ],
  'topik-2': [
    {
      id: 'relate-menti',
      name: 'Mentimeter Nilai Pribadi Pemimpin',
      stageName: 'Tahap 2: Sinkronus (Google Meet)',
      description: 'Partisipasi polling nilai integritas dan keteladanan kepala sekolah'
    },
    {
      id: 'explore-pandi',
      name: 'Analisis Kasus Pak Pandi',
      stageName: 'Tahap 2: Sinkronus (Google Meet)',
      description: 'Menganalisis dilema kepemimpinan dan strategi inklusi pembelajaran'
    },
    {
      id: 'apply-pillars',
      name: 'Matriks Tiga Pilar Kepemimpinan',
      stageName: 'Tahap 2: Sinkronus / Asinkronus',
      description: 'Mengisi pilar nilai pribadi, budaya sekolah, dan pemberdayaan rekan guru'
    },
    {
      id: 'learnagain-padlet1',
      name: 'Padlet Komitmen Tiga Pilar',
      stageName: 'Tahap 2: Asinkronus',
      description: 'Mengunggah catatan visi dan aksi konkret pada kanvas interaktif Padlet'
    },
    {
      id: 'modul1-assignment',
      name: 'Tugas Akhir & Peer Review Modul 1',
      stageName: 'Tahap 2: Asinkronus',
      description: 'Menyusun rancangan warisan kepemimpinan dan telaah inklusivitas'
    }
  ],
  'topik-3': [
    {
      id: 'relate-kegagalan',
      name: 'Refleksi Pengalaman Tantangan',
      stageName: 'Tahap 3: Sinkronus (Google Meet)',
      description: 'Menceritakan kegagalan dan narasi batin awal saat memimpin inisiatif baru'
    },
    {
      id: 'explore-mindset',
      name: 'Matriks Transformasi Pola Pikir',
      stageName: 'Tahap 3: Sinkronus (Google Meet)',
      description: 'Memetakan fixed mindset vs growth mindset dalam merespons kendala sekolah'
    },
    {
      id: 'apply-reframing',
      name: 'Praktik Reframing Narasi Batin',
      stageName: 'Tahap 3: Asinkronus',
      description: 'Mengubah 4 kasus fixed mindset menjadi pola pikir bertumbuh solutif'
    },
    {
      id: 'learnagain-padlet2',
      name: 'Padlet Komitmen Mindset Baru',
      stageName: 'Tahap 3: Asinkronus',
      description: 'Membagikan kalimat afirmasi growth mindset kepada sesama kepala sekolah'
    },
    {
      id: 'modul2-forum',
      name: 'Forum Reflektif Modul 2',
      stageName: 'Tahap 3: Asinkronus',
      description: 'Mendiskusikan pembiasaan kultur belajar tanpa takut salah di sekolah'
    }
  ],
  'topik-4': [
    {
      id: 'action-plan',
      name: 'Action Plan Canvas 10 Komponen',
      stageName: 'Tahap 4: Asinkronus Moodle',
      description: 'Menyusun dan mengunduh rencana aksi kepemimpinan sekolah yang aplikatif'
    }
  ],
  'topik-5': [
    {
      id: 'post-test',
      name: 'Post-test Akhir Pelatihan',
      stageName: 'Tahap 5: Asinkronus',
      description: 'Menuntaskan evaluasi pemahaman akhir 10 soal kepemimpinan dan mindset'
    },
    {
      id: 'reflection-321',
      name: 'Lembar Refleksi Akhir 3-2-1',
      stageName: 'Tahap 5: Asinkronus',
      description: 'Menuliskan 3 hal penting, 2 pertanyaan tersisa, dan 1 komitmen aksi nyata'
    }
  ]
};

