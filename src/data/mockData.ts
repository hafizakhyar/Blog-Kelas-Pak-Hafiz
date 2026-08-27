import { GalleryItem, DocumentItem, BlogPost, NaturalIndicator, TestSolution, ClassNote, TeacherBioProfile, PracticalVideoItem } from '../types';

export const TEACHER_INFO = {
  name: 'Pak Hafiz Akhyar, S.Si.',
  shortName: 'Pak Hafiz',
  title: 'Guru Kimia & Edukator Sains SMA',
  email: 'kelaspakhafiz@gmail.com',
  avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi',
  logo: '/logo.svg',
  website: 'https://www.kelaspakhafiz.my.id/',
  instagram: 'https://www.instagram.com/kelaspakhafiz/',
  youtube: 'https://www.youtube.com/@KelasPakHafiz',
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Eksperimen Indikator Alami: Ekstrak Kunyit & Perubahan pH',
    category: 'Indikator Alami',
    date: '14 Agustus 2026',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Populer di Kelas XI',
    isPinned: true,
    description: 'Uji keasaman menggunakan ekstrak rimpang kunyit segar terhadap larutan asam cuka, air netral, dan air kapur/sabun.',
    chemistryConcept: 'Kurkuminoid (Kurkumin) mengalami perubahan struktur tautomer saat berada di lingkungan basa (pH > 8.5), menghasilkan pergeseran serapan spektrum cahaya ke merah bata.',
    materials: [
      'Ekstrak kunyit segar yang diparut dan dilarutkan air hangat',
      'Tabung reaksi dan rak tabung',
      'Pipet tetes',
      'Larutan cuka dapur (CH3COOH)',
      'Air sabun / detergen (Basa)',
      'Air suling / aquades'
    ],
    steps: [
      'Siapkan 3 tabung reaksi bersih yang telah diberi label: Asam, Netral, dan Basa.',
      'Teteskan 3 ml larutan uji ke masing-masing tabung reaksi.',
      'Tambahkan 5-8 tetes ekstrak kunyit ke dalam masing-masing tabung secara perlahan.',
      'Goyang perlahan tabung reaksi dan amati transisi warna kuning cerah ke merah jingga pekat.'
    ],
    results: 'Pada suasana asam warna tetap kuning cerah, sedangkan pada suasana basa warna berubah drastis menjadi merah tua / merah bata.',
    videoDuration: '04:15'
  },
  {
    id: 'gal-2',
    title: 'Pesona Antosianin Bunga Telang (Clitoria ternatea)',
    category: 'Indikator Alami',
    date: '8 Agustus 2026',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b4?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Eksperimen Viral Siswa',
    isPinned: true,
    description: 'Mengeksplorasi perubahan warna spektrum biru laut menjadi ungu hingga merah muda saat ditetesi air perasan jeruk nipis.',
    chemistryConcept: 'Molekul antosianin pada bunga telang bertindak sebagai kation flavilium pada pH rendah (warna merah muda) dan berubah menjadi basa kuinonoid tak bermuatan pada pH basa (kehijauan).',
    materials: [
      'Seduhan bunga telang kering',
      'Gelas beaker 100 mL',
      'Jeruk nipis / asam sitrat',
      'Larutan baking soda (NaHCO3)',
      'Kertas pH universal'
    ],
    steps: [
      'Seduh 5 kuntum bunga telang dalam 50 ml air panas hingga berwarna biru pekat.',
      'Bagi larutan biru ke dalam dua gelas kimia kecil.',
      'Peras jeruk nipis ke gelas pertama, amati perubahan seketika menjadi ungu keunguan cerah.',
      'Tambahkan sedikit larutan baking soda ke gelas kedua, amati perubahan menjadi hijau toska.'
    ],
    results: 'Bunga telang sangat peka terhadap perubahan pH: Pink (Asam), Biru (Netral), Hijau (Basa Lemah), Kuning (Basa Kuat).',
    videoDuration: '03:40'
  },
  {
    id: 'gal-3',
    title: 'Indikator Alami Kulit Manggis & Reaksi Asam-Basa',
    category: 'Indikator Alami',
    date: '28 Juli 2026',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Proyek Kearifan Lokal',
    isPinned: true,
    description: 'Pemanfaatan limbah kulit manggis yang kaya senyawa xanton dan antosianin sebagai kertas indikator alternatif yang ramah lingkungan.',
    chemistryConcept: 'Pigmen pigmen alami pada perikarp manggis bereaksi terhadap konsentrasi ion H+ dan OH-, mengubah warna merah keunguan pekat menjadi cokelat kehijauan.',
    materials: [
      'Kulit manggis yang dihaluskan dengan sedikit alkohol 70%',
      'Kertas saring dipotong ukuran 1x5 cm',
      'Cawan petri',
      'Sampel larutan rumah tangga (cuka, pembersih lantai, teh)'
    ],
    steps: [
      'Rendam potongan kertas saring ke dalam ekstrak kulit manggis selama 15 menit.',
      'Keringkan kertas saring di tempat teduh (jangan terkena sinar matahari langsung).',
      'Celupkan kertas indikator kering ke sampel larutan asam dan basa.'
    ],
    results: 'Warna coklat kemerahan stabil di asam, dan berubah hijau tua kecoklatan di larutan basa kuat.',
    videoDuration: '05:10'
  },
  {
    id: 'gal-4',
    title: 'Titrasi Asam Basa: Menentukan Kadar Asam Asetat Cuka Dapur',
    category: 'Eksperimen Lab',
    date: '19 Juli 2026',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Praktikum Inti Kelas XI',
    description: 'Siswa mempraktikkan teknik titrasi volumetri dengan buret dan indikator fenolftalein (PP) hingga mencapai titik ekivalen.',
    chemistryConcept: 'Reaksi netralisasi stoikiometri CH3COOH + NaOH -> CH3COONa + H2O dengan kurva titrasi asam lemah - basa kuat.',
    materials: [
      'Buret 50 mL dengan klem dan statif',
      'Erlenmeyer 250 mL',
      'Larutan standar NaOH 0.1 M',
      'Sampel cuka komersial yang telah diencerkan',
      'Indikator PP (Phenolphthalein)'
    ],
    steps: [
      'Isi buret dengan larutan baku NaOH 0.1 M hingga batas skala nol.',
      'Pipet 10 mL sampel cuka encer ke dalam Erlenmeyer, tetesi 3 tetes indikator PP.',
      'Kran buret dibuka perlahan sembari menggoyang Erlenmeyer hingga muncul warna merah muda seulas yang bertahan 30 detik.',
      'Catat volume akhir titran dan ulangi sebanyak 3 kali (triplo).'
    ],
    results: 'Rata-rata volume titran terukur 18.4 mL, menghasilkan perhitungan kadar asam cuka sebesar 5.2% m/v (sesuai label produk).',
    videoDuration: '07:20'
  },
  {
    id: 'gal-5',
    title: 'Uji Daya Hantar Listrik Larutan Elektrolit & Non-Elektrolit',
    category: 'Eksperimen Lab',
    date: '10 Juli 2026',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Konsep Dasar Kelas X',
    description: 'Membuktikan keberadaan ion bebas yang bergerak dalam larutan garam dapur, larutan gula, asam cuka, dan air kelapa muda.',
    chemistryConcept: 'Derajat ionisasi (alfa) menentukan kemampuan larutan menghantarkan arus listrik melalui mobilitas kation dan anion.',
    materials: [
      'Rangkaian alat uji elektrolit (lampu LED, baterai 9V, elektroda karbon)',
      'Gelas beker 100 mL',
      'Larutan NaCl 1M, Larutan Gula 1M, Asam Cuka 10%, Air Sumur, Air Kelapa'
    ],
    steps: [
      'Celupkan elektroda karbon ke dalam larutan NaCl, amati nyala lampu dan pembentukan gelembung gas di elektroda.',
      'Bilas elektroda dengan aquades dan lap kering sebelum menguji sampel berikutnya.',
      'Catat intensitas cahaya lampu dan banyaknya gelembung gas.'
    ],
    results: 'Larutan garam & air kelapa menyalakan lampu terang dengan banyak gelembung ionik, sedangkan larutan gula tidak menyala sama sekali.',
    videoDuration: '06:05'
  },
  {
    id: 'gal-6',
    title: 'Pameran Mini Maket Bentuk Molekul (Teori VSEPR)',
    category: 'Karya Siswa',
    date: '25 Juni 2026',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Kreativitas Siswa',
    description: 'Visualisasi 3D geometri molekul (Tetrahedral, Trigonal Bipiramida, Oktahedral) menggunakan plastisin ramah lingkungan dan tusuk bambu.',
    chemistryConcept: 'Teori domain elektron dan tolakan pasangan elektron bebas (PEB-PEI) menentukan sudut ikatan dan kepolaran molekul.',
    materials: [
      'Plastisin aneka warna',
      'Tusuk gigi & stik kayu',
      'Busur derajat untuk mengukur sudut ikatan (109.5°, 120°, 90°)'
    ],
    steps: [
      'Menentukan struktur Lewis molekul target (CH4, NH3, H2O, SF6).',
      'Membuat bola plastisin pusat dan ligan dengan skala proporsional.',
      'Merakit model geometri 3D dengan sudut yang akurat sesuai tolakan minimum.'
    ],
    results: 'Siswa berhasil mendemonstrasikan mengapa molekul air H2O berbentuk huruf V bengkok akibat desakan 2 pasang elektron bebas.',
    videoDuration: '04:50'
  }
];

export const DOCUMENT_ITEMS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Modul Lengkap: Asam, Basa & Stoikiometri Larutan',
    category: 'Modul Ajar',
    classGrade: 'Kelas XI',
    fileFormat: 'PDF',
    fileSize: '4.8 MB',
    downloads: 1420,
    updatedDate: 'Agustus 2026',
    summary: 'Rangkuman komprehensif teori Arrhenius, Bronsted-Lowry, Lewis, perhitungan pH asam-basa kuat/lemah, dan hidrolisis garam disertai latihan soal berjenjang.',
    topics: ['Teori Asam Basa', 'Konsep pH & pOH', 'Indikator Alami & Sintesis', 'Titrasi Asam Basa'],
    pages: 42,
    driveUrl: 'https://drive.google.com/file/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi/view?usp=sharing'
  },
  {
    id: 'doc-2',
    title: 'LKPD Praktikum: Eksplorasi Indikator Alami Berbasis Dapur',
    category: 'LKPD Praktikum',
    classGrade: 'Semua Tingkat',
    fileFormat: 'PDF',
    fileSize: '2.1 MB',
    downloads: 980,
    updatedDate: 'Agustus 2026',
    summary: 'Lembar Kerja Peserta Didik terstruktur untuk melakukan percobaan mandiri di rumah maupun di lab sekolah dengan alat & bahan yang mudah didapat.',
    topics: ['Alat & Bahan Sederhana', 'Tabel Pengamatan Warna', 'Analisis Data & Diskusi', 'Rubrik Penilaian'],
    pages: 12,
    driveUrl: 'https://drive.google.com/file/d/1Oqck2N6fpJ_lbowm_21Kz4KGGt1Szuge/view?usp=sharing'
  },
  {
    id: 'doc-3',
    title: 'Cheat Sheet Master Rumus Kimia SMA: Stoikiometri & Gas',
    category: 'Ringkasan & Rumus',
    classGrade: 'Kelas X',
    fileFormat: 'PDF',
    fileSize: '1.4 MB',
    downloads: 2850,
    updatedDate: 'Juli 2026',
    summary: '1 Lembar ringkasan cepat konversi Mol, Hukum Dasar Kimia (Lavoisier, Proust, Dalton, Gay-Lussac, Avogadro), dan Gas Ideal PV=nRT dengan visual diagram alir.',
    topics: ['Jembatan Mol', 'Persamaan Reaksi', 'Pereaksi Pembatas', 'Kadar Zat & Molaritas'],
    pages: 4,
    driveUrl: 'https://drive.google.com/file/d/1kZ8W_rumus_stoikiometri/view?usp=sharing'
  },
  {
    id: 'doc-4',
    title: 'Modul Kimia Karbon: Senyawa Hidrokarbon & Minyak Bumi',
    category: 'Modul Ajar',
    classGrade: 'Kelas XI',
    fileFormat: 'DOCX',
    fileSize: '3.6 MB',
    downloads: 870,
    updatedDate: 'Juli 2026',
    summary: 'Tata nama IUPAC Alkana, Alkena, Alkuna, isomer rangka/posisi/geometri, reaksi pembakaran hidrokarbon, dan dampak lingkungan emisi gas buang.',
    topics: ['Kekhasan Atom Karbon', 'Tata Nama IUPAC', 'Isomerisme', 'Fraksi Minyak Bumi'],
    pages: 34,
    driveUrl: 'https://drive.google.com/file/d/1mB7X_kimia_karbon_doc/view?usp=sharing'
  },
  {
    id: 'doc-5',
    title: 'Bank Soal & Pembahasan Mandiri: Redoks & Elektrokimia',
    category: 'Bank Soal',
    classGrade: 'Kelas XII',
    fileFormat: 'PDF',
    fileSize: '3.9 MB',
    downloads: 1650,
    updatedDate: 'Juni 2026',
    summary: 'Kumpulan 50 soal pilihan ganda HOTS dan esai penyetaraan redoks (metode PBO & setengah reaksi), Sel Volta, Sel Elektrolisis, dan Korosi beserta pembahasan langkah demi langkah.',
    topics: ['Penyetaraan Redoks', 'Potensial Sel E°', 'Hukum Faraday I & II', 'Pencegahan Korosi'],
    pages: 28,
    driveUrl: 'https://drive.google.com/file/d/1pQ9Y_bank_soal_redoks/view?usp=sharing'
  },
  {
    id: 'doc-6',
    title: 'Alur Tujuan Pembelajaran (ATP) & Modul Ajar Kurikulum Merdeka',
    category: 'RPP & ATP',
    classGrade: 'Semua Tingkat',
    fileFormat: 'DOCX',
    fileSize: '1.8 MB',
    downloads: 1120,
    updatedDate: 'Juni 2026',
    summary: 'Perangkat ajar lengkap fase E & F mencakup Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), dan rancangan modul berbasis diferensiasi proses.',
    topics: ['Capaian Pembelajaran CP', 'Pemetaan Alur Tujuan ATP', 'Asesmen Formatif & Sumatif', 'Rubrik Kinerja Profil Pelajar Pancasila'],
    pages: 24,
    driveUrl: 'https://drive.google.com/file/d/1rT2Z_atp_kurikulum_merdeka/view?usp=sharing'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Mengapa Apel Berubah Cokelat Setelah Dipotong? Rahasia Reaksi Enzimatik & Vitamin C',
    slug: 'mengapa-apel-berubah-cokelat-reaksi-redoks',
    summary: 'Pernahkah kamu memotong apel dan beberapa menit kemudian warnanya menjadi kecokelatan? Ternyata itu adalah reaksi oksidasi polifenol yang bisa dicegah dengan trik kimia sederhana!',
    content: [
      'Ketika kamu mengiris buah apel, dinding sel buah akan rusak dan enzim Polifenol Oksidase (PPO) yang tersimpan di dalam sel akan terpapar langsung oleh oksigen bebas dari udara sekitar.',
      'Enzim ini mengkatalisis oksidasi senyawa fenol alami dalam apel menjadi o-kuinon. Selanjutnya, molekul o-kuinon bereaksi secara polimerisasi membentuk pigmen melanin kecokelatan.',
      'Bagaimana cara mencegahnya secara ilmiah? Cukup lumuri irisan apel dengan air perasan lemon! Asam askorbat (Vitamin C) pada lemon adalah agen pereduksi (antioksidan) kuat yang akan mereduksi kembali kuinon menjadi fenol sebelum sempat berubah warna, ditambah suasana asam (pH rendah) yang menginaktivasi kerja enzim PPO.',
      'Ini adalah contoh nyata bahwa kimia bukan sekadar rumus di papan tulis, melainkan mekanisme alami yang menjaga dan mengubah makanan kita setiap hari!'
    ],
    category: 'Kimia Sehari-hari',
    author: {
      name: 'Pak Hafiz Akhyar, S.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi'
    },
    date: '17 Agustus 2026',
    readTime: '4 menit baca',
    coverImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=1000&q=80',
    tags: ['Reaksi Redoks', 'Kimia Makanan', 'Antioksidan', 'Enzim'],
    keyTakeaways: [
      'Browning pada apel adalah reaksi enzimatik antara polifenol dan oksigen.',
      'Asam askorbat (Vitamin C) bertindak sebagai antioksidan pereduksi.',
      'Penurunan pH dengan asam sitrat menonaktifkan enzim polifenol oksidase.'
    ],
    reactions: 142
  },
  {
    id: 'post-2',
    title: 'Bunga Telang: Keajaiban Sains di Secangkir Teh Biru yang Berubah Warna',
    slug: 'keajaiban-bunga-telang-indikator-ph-alami',
    summary: 'Teh biru yang sedang tren di kafe kekinian ini berubah menjadi ungu cerah saat diperas jeruk lemon. Bagaimana pigmen antosianin merespons ion hidrogen?',
    content: [
      'Bunga telang (*Clitoria ternatea*) mengandung konsentrasi tinggi senyawa flavonoid bernama antosianin, khususnya jenis delphinidin.',
      'Molekul antosianin ini memiliki struktur ikatan rangkap terkonjugasi yang sangat sensitif terhadap konsentrasi ion hidronium (H3O+) di dalam larutan.',
      'Pada suasana netral (pH 7), senyawa ini menyerap panjang gelombang merah dan kuning, sehingga warna yang terpancar ke mata kita adalah biru tua yang memikat.',
      'Namun saat kamu meneteskan perasan lemon yang kaya asam sitrat (pH 2.5 - 3.0), ion H+ akan berikatan pada gugus fenolik dan mengubah struktur molekul menjadi kation flavilium yang memantulkan warna merah muda keunguan yang menawan!',
      'Melihat proses ini secara langsung membantu siswa memahami konsep kesetimbangan asam-basa tanpa rasa takut terhadap rumus matematika yang rumit.'
    ],
    category: 'Eksperimen Kreatif',
    author: {
      name: 'Pak Hafiz Akhyar, S.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi'
    },
    date: '12 Agustus 2026',
    readTime: '5 menit baca',
    coverImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80',
    tags: ['Antosianin', 'Indikator Alami', 'Asam Basa', 'Kimia Dapur'],
    keyTakeaways: [
      'Pigmen delphinidin mengubah warna berdasarkan pergeseran pH larutan.',
      'Bisa dimanfaatkan sebagai indikator titrasi ramah lingkungan dan aman.',
      'Menghubungkan konsep kesetimbangan kimia dengan kuliner modern.'
    ],
    reactions: 218
  },
  {
    id: 'post-3',
    title: '5 Tips Menguasai Stoikiometri Tanpa Harus Menghafal Rumus Buta',
    slug: 'tips-menguasai-stoikiometri-kimia-sma',
    summary: 'Banyak siswa menganggap stoikiometri adalah bab tersulit di kelas X. Simak metode "Jembatan Mol Visual" yang membuat perhitungan kimia semudah menukar uang di kasir!',
    content: [
      'Banyak siswa merasa terbebani oleh stoikiometri karena mencoba menghafalkan lusinan rumus secara terpisah: n = m/Mr, n = V/22.4, n = M x V, n = N/6.02x10^23.',
      'Sebenarnya, kunci utama stoikiometri hanyalah satu konsep: **Mol adalah mata uang internasional kimia**.',
      'Bayangkan kamu ingin membeli barang di berbagai negara: kamu harus menukarkan mata uang lokal ke Dollar AS terlebih dahulu. Hal yang sama berlaku pada atom dan molekul!',
      'Apapun data yang kamu miliki (massa gram, volume gas, jumlah partikel, molaritas), selalu ubah dulu ke bentuk **Mol**. Setelah berada di mol, gunakan perbandingan koefisien reaksi yang telah setara untuk mencari mol zat yang ditargetkan.',
      'Dengan pendekatan visual ini, siswa tidak lagi panik menghadapi soal pereaksi pembatas atau perhitungan kadar zat di UTBK/SNBT.'
    ],
    category: 'Tips Belajar',
    author: {
      name: 'Pak Hafiz Akhyar, S.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi'
    },
    date: '03 Agustus 2026',
    readTime: '6 menit baca',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80',
    tags: ['Tips Belajar', 'Stoikiometri', 'Persiapan UTBK', 'Konsep Mol'],
    keyTakeaways: [
      'Jadikan mol sebagai titik transit pusat seluruh variabel kuantitatif.',
      'Setarakan reaksi sebelum melakukan perbandingan koefisien.',
      'Latih pemahaman fisis daripada sekadar menghafal rumus substitusi.'
    ],
    reactions: 305
  },
  {
    id: 'post-4',
    title: 'Mengapa Garam Dapur Bisa Melelehkan Salju dan Membekukan Es Krim Lebih Cepat?',
    slug: 'sifat-koligatif-larutan-garam-dan-es-krim',
    summary: 'Memahami fenomena penurunan titik beku dan kenaikan titik didih melalui tradisi pembuatan es puter tradisional Indonesia.',
    content: [
      'Pernahkah kamu melihat penjual es puter atau es goyang memutar tabung logam di tengah tumpukan es batu yang ditaburi garam kasar?',
      'Ketika garam (NaCl) dilarutkan ke dalam es batu yang mulai mencair, partikel ion Na+ dan Cl- akan menghalangi molekul air untuk merapat membentuk kristal es.',
      'Akibatnya, titik beku larutan turun jauh di bawah 0°C, bahkan bisa mencapai -15°C hingga -21°C tanpa membeku menjadi bongkahan padat.',
      'Suhu ultra-dingin inilah yang memungkinkan adonan santan dan susu membeku dengan cepat menghasilkan tekstur es krim yang lembut.',
      'Inilah aplikasi nyata dari materi **Sifat Koligatif Larutan (Penurunan Titik Beku - Delta Tf)** kelas XII yang sarat kearifan lokal Nusantara.'
    ],
    category: 'Fakta Unik',
    author: {
      name: 'Pak Hafiz Akhyar, S.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi'
    },
    date: '26 Juli 2026',
    readTime: '4 menit baca',
    coverImage: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=1000&q=80',
    tags: ['Sifat Koligatif', 'Termodinamika', 'Es Puter', 'Kimia Kelas XII'],
    keyTakeaways: [
      'Zat terlarut non-volatil menghambat pembentukan kisi kristal es.',
      'Faktor Van\'t Hoff (i) pada elektrolit NaCl melipatgandakan efek penurunan titik beku.',
      'Pemanfaatan teknologi tradisional berbasis sains presisi.'
    ],
    reactions: 189
  },
  {
    id: 'post-5',
    title: 'Mengapa Minum Obat Tidak Boleh Bersamaan dengan Susu atau Teh Pekat? Rahasia Reaksi Khelasi & Penyerapan',
    slug: 'bahaya-minum-obat-dengan-susu-dan-teh-khelasi-kimia',
    summary: 'Sering mendengar larangan minum obat dengan susu atau teh? Ini bukan sekadar mitos, melainkan reaksi khelasi ion logam dan presipitasi tanin yang bisa menonaktifkan khasiat obat di dalam tubuhmu!',
    content: [
      'Pernahkah kamu disarankan untuk tidak meminum antibiotik atau suplemen penambah darah bersamaan dengan segelas susu sapi atau secangkir teh kental? Di balik anjuran medis ini, terdapat prinsip kimia koordinasi dan termodinamika larutan yang sangat krusial.',
      'Pertama, fenomena Pembentukan Senyawa Kompleks (Khelasi). Susu kaya akan kation divalen seperti Kalsium (Ca²⁺) dan Magnesium (Mg²⁺). Beberapa jenis antibiotik (seperti golongan Tetrasiklin dan Fluoroquinolon / Siprofloksasin) memiliki gugus fungsional yang mampu mengapit kation Ca²⁺ membentuk senyawa kompleks khelat tak larut. Akibatnya, molekul obat mengendap di saluran cerna dan tidak dapat diserap dinding usus ke aliran darah.',
      'Kedua, pengaruh Asam Tanat pada Teh. Daun teh mengandung senyawa polifenol tanin yang bersifat astringen dan memiliki kemampuan mengikat kation Besi (Fe²⁺) pada tablet suplemen anemia. Reaksi ini menghasilkan endapan besi-tanat berwarna gelap yang tidak larut, membatalkan terapi penambah darah yang sedang dijalani.',
      'Ketiga, perubahan pH Lambung. Susu bersifat sedikit basa penyangga (buffer) yang dapat menaikkan pH lambung seketika. Bagi obat-obatan bersalut enterik (enteric-coated) yang dirancang baru pecah di usus halus, hilangnya suasana asam lambung justru membuat lapisan pelindungnya pecah lebih awal di lambung, memicu iritasi lambung dan merusak zat aktif obat.',
      'Kesimpulannya, minumlah obat dengan air putih netral bersuhu ruang, dan beri jeda minimal 2 jam jika kamu ingin menikmati susu segar atau teh hangat favoritmu!'
    ],
    category: 'Kimia Sehari-hari',
    author: {
      name: 'Pak Hafiz Akhyar, S.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi'
    },
    date: '21 Agustus 2026',
    readTime: '5 menit baca',
    coverImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80',
    tags: ['KimiaFarmasi', 'ReaksiKhelasi', 'SusuDanObat', 'TaninTeh', 'Kesehatan'],
    keyTakeaways: [
      'Kation Ca²⁺ dan Mg²⁺ pada susu membentuk senyawa khelat tak larut dengan antibiotik tertentu.',
      'Tanin pada teh mengendapkan ion besi Fe²⁺ sehingga menggagalkan penyerapan suplemen darah.',
      'Air putih netral adalah media pelarut obat paling aman tanpa risiko interaksi kimiawi.'
    ],
    reactions: 276
  },
  {
    id: 'post-6',
    title: 'Nasi Dingin atau Nasi Kemarin Lebih Aman untuk Gula Darah? Fakta Sains di Balik "Pati Resisten"',
    slug: 'rahasia-nasi-dingin-pati-resisten-retrogradasi-kimia',
    summary: 'Banyak ahli gizi menyarankan nasi yang didinginkan untuk penderita diabetes. Bagaimana struktur rantai amilosa berubah menjadi kristal retrogradasi yang ramah indeks glikemik?',
    content: [
      'Beras mentah tersusun atas dua polimer glukosa utama: Amilosa (rantai lurus heliks) dan Amilopektin (rantai bercabang banyak). Ketika beras dimasak dengan air mendidih, molekul air menyusup ke sela-sela rantai polimer, memutus ikatan hidrogen intermolekul, dan menyebabkan butiran pati membengkak dalam proses yang disebut Gelatinisasi.',
      'Pada kondisi nasi panas baru matang, rantai pati dalam kondisi longgar dan terurai, sehingga enzim alfa-amilase di air liur dan pankreas kita dengan sangat cepat memotongnya menjadi glukosa sederhana yang langsung diserap ke darah, memicu lonjakan gula darah (Indeks Glikemik tinggi).',
      'Namun, saat nasi matang didinginkan di dalam lemari es (suhu 4°C) selama 12 hingga 24 jam, terjadi fenomena kimia fisik bernama Retrogradasi Pati. Rantai-rantai amilosa yang longgar mulai merapat kembali, saling berikatan hidrogen dengan sangat rapat dan membentuk kisi-kisi mikrokristalin teratur.',
      'Kisi kristal ini mengubah pati biasa menjadi Resistant Starch Tipe 3 (Pati Resisten). Karena strukturnya yang begitu rapat, enzim pencernaan kita tidak mampu memutus rantai tersebut di lambung maupun usus halus.',
      'Pati resisten ini lolos menuju usus besar tanpa menaikkan gula darah, di mana bakteri baik (mikrobioma) memfermentasinya menjadi Asam Lemak Rantai Pendek (SCFA) seperti butirat yang sangat menyehatkan usus. Menariknya, bahkan jika nasi dingin tersebut dihangatkan kembali, struktur pati resisten tersebut sebagian besar tetap bertahan!'
    ],
    category: 'Fakta Unik',
    author: {
      name: 'Pak Hafiz Akhyar, S.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi'
    },
    date: '20 Agustus 2026',
    readTime: '5 menit baca',
    coverImage: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1000&q=80',
    tags: ['PatiResisten', 'Retrogradasi', 'KimiaKarbohidrat', 'Diabetes', 'Gizi'],
    keyTakeaways: [
      'Pendinginan nasi memicu retrogradasi rantai amilosa menjadi struktur mikrokristalin padat.',
      'Resistant Starch Tipe 3 sulit dihidrolisis oleh enzim amilase, menurunkan respons insulin.',
      'Bertindak sebagai prebiotik alami di usus besar yang menghasilkan asam lemak rantai pendek (SCFA).'
    ],
    reactions: 341
  },
  {
    id: 'post-7',
    title: 'Mengapa Pagar & Kendaraan Berkarat Lebih Cepat di Musim Hujan? Bedah Reaksi Korosi Elektrokimia',
    slug: 'mekanisme-korosi-besi-elektrokimia-dan-pencegahan',
    summary: 'Karat bukan sekadar kotoran merah, melainkan sel galvanik mini yang memakan logam berharga triliunan rupiah tiap tahun. Pelajari siklus redoksnya dan teknik perlindungan katodik modern!',
    content: [
      'Setiap kali kita melihat karat cokelat kemerahan pada pagar besi atau rantai sepeda, kita sebenarnya sedang menyaksikan proses elektrokimia spontan yang berjalan lambat namun destruktif.',
      'Besi murni (Fe) pada dasarnya tidak akan berkarat jika hanya berada di udara kering tanpa kelembapan, atau di dalam air murni tanpa oksigen terlarut. Korosi memerlukan kehadiran simultan dari dua komponen: Oksigen (O₂) dan Air (H₂O) yang bertindak sebagai jembatan elektrolit.',
      'Di titik cacat permukaan besi, terbentuk sel volta mikro. Daerah besi yang kurang kontak dengan udara bertindak sebagai Anoda: Fe(s) → Fe²⁺(aq) + 2e⁻ (E° = -0.44 V). Elektron yang dilepaskan mengalir melalui logam menuju bagian tepi tetesan air yang kaya oksigen, yang bertindak sebagai Katoda: O₂(g) + 2H₂O(l) + 4e⁻ → 4OH⁻(aq) (E° = +0.40 V).',
      'Ion Fe²⁺ kemudian bereaksi dengan ion OH⁻ membentuk endapan Fe(OH)₂, yang selanjutnya teroksidasi lebih lanjut oleh oksigen terlarut menjadi Karat Besi terhidrasi: Fe₂O₃·xH₂O yang rapuh dan berpori. Karena berpori, karat tidak melindungi lapisan besi di bawahnya, sehingga korosi terus menggerogoti hingga logam keropos.',
      'Bagaimana para insinyur mengatasinya? Melalui 3 metode utama: Pelapisan Fisik (cat, oli, plastik), Pelapisan Logam Pasif (pelapisan timah / tin plating), dan Proteksi Katodik Anoda Korban (Galvanisasi dengan Seng / Zn atau penempelan batang Magnesium pada pipa bawah tanah). Karena Zn dan Mg memiliki potensial reduksi lebih negatif dari Fe, mereka rela teroksidasi duluan demi menyelamatkan besi induknya.'
    ],
    category: 'Kimia Sehari-hari',
    author: {
      name: 'Pak Hafiz Akhyar, S.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi'
    },
    date: '19 Agustus 2026',
    readTime: '6 menit baca',
    coverImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1000&q=80',
    tags: ['Korosi', 'Elektrokimia', 'Redoks', 'SelVolta', 'KimiaXII'],
    keyTakeaways: [
      'Korosi besi adalah reaksi redoks spontan yang membentuk sel elektrokimia mikroskopis.',
      'Air bertindak sebagai medium transfer ion sedangkan oksigen sebagai oksidator utama.',
      'Metode anoda korban (galvanisasi Zn/Mg) memanfaatkan deret volta untuk melindungi besi.'
    ],
    reactions: 289
  },
  {
    id: 'post-8',
    title: 'Rahasia di Balik Wangi "Petrichor" Hujan Pertama: Simfoni Molekul Geosmin & Ozon',
    slug: 'aroma-petrichor-hujan-pertama-senyawa-geosmin',
    summary: 'Pernahkah kamu menghirup aroma khas tanah yang begitu menenangkan saat tetesan hujan pertama menyentuh bumi kering? Inilah kimia di balik wangi "Petrichor" yang begitu dicintai manusia!',
    content: [
      'Istilah "Petrichor" pertama kali dicetuskan pada tahun 1964 oleh dua ilmuwan mineralogi Australia, Isabel Joy Bear dan Richard Thomas. Kata ini berasal dari bahasa Yunani: petra (batu) dan ichor (cairan yang mengalir dalam pembuluh darah para dewa mitologi).',
      'Aroma magis ini sebenarnya merupakan kombinasi dari tiga kelompok senyawa kimia organik dan anorganik:',
      '1. Geosmin (C₁₂H₂₂O): Senyawa bisiklik alkohol yang diproduksi oleh bakteri tanah filamen Streptomyces dan mikroalga biru-hijau (Cyanobacteria). Hidung manusia memiliki sensitivitas luar biasa terhadap Geosmin—kita dapat mendeteksinya bahkan pada konsentrasi sekecil 5 bagian per triliun (5 ppt)! Secara evolusioner, kemampuan ini membantu nenek moyang kita mendeteksi sumber air dan kesuburan tanah dari jarak bermil-mil.',
      '2. Minyak Tumbuhan Volatil: Selama musim kemarau kering, tanaman mengeluarkan asam lemak rantai panjang (seperti asam stearat dan asam palmitat) ke tanah dan celah bebatuan untuk menahan penguapan air.',
      '3. Ozon (O₃): Kilatan petir di awan memecah molekul O₂ dan N₂ di atmosfer, membentuk gas ozon segar yang terdorong turun oleh embusan angin sebelum hujan tiba.',
      'Ketika tetesan hujan menghantam tanah berpori dengan kecepatan tertentu, gelembung udara mikro terperangkap di dasar tetesan, melesat ke atas, dan meletus menjadi kabut aerosol halus yang menerbangkan jutaan molekul Geosmin ke udara bebas tepat di depan indera penciuman kita!'
    ],
    category: 'Fakta Unik',
    author: {
      name: 'Pak Hafiz Akhyar, S.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi'
    },
    date: '18 Agustus 2026',
    readTime: '4 menit baca',
    coverImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80',
    tags: ['Petrichor', 'Geosmin', 'Aromaterapi', 'FenomenaAlam', 'KimiaOrganik'],
    keyTakeaways: [
      'Molekul Geosmin diproduksi oleh mikroorganisme tanah Streptomyces saat musim kering.',
      'Hidung manusia mampu mendeteksi geosmin pada batas konsentrasi ultra-rendah (5 ppt).',
      'Tetesan hujan bekerja seperti penyemprot aerosol alami yang melepaskan partikel aroma ke udara.'
    ],
    reactions: 382
  },
  {
    id: 'post-9',
    title: 'Baking Soda vs Baking Powder: Kenapa Salah Pilih Bisa Bikin Kue Bantat & Pahit?',
    slug: 'perbedaan-kimia-baking-soda-dan-baking-powder',
    summary: 'Keduanya tampak seperti serbuk putih serupa, namun mekanisme reaksi asam-basanya sangat berbeda! Ketahui kapan resep membutuhkan soda kue murni atau pengembang ganda (double-acting).',
    content: [
      'Di dunia kuliner dan tata boga, memahami reaksi asam-basa adalah kunci utama keberhasilan tekstur kue bolu, martabak manis, pancake, dan cookies.',
      '1. Baking Soda (Soda Kue) adalah 100% Natrium Bikarbonat murni (NaHCO₃). Senyawa ini bersifat basa. Agar dapat menghasilkan gelembung gas karbon dioksida (CO₂) yang mengembangkan adonan, ia HARUS bertemu dengan bahan asam dalam resep (seperti asam laktat buttermilk/yogurt, asam sitrat lemon, asam asetat cuka, asam tartrat bubuk cokelat alami, atau gula merah/molase).',
      'Reaksi kimianya: NaHCO₃ + H⁺ (dari asam resep) → Na⁺ + H₂O + CO₂(g). Jika kamu memasukkan baking soda ke adonan tanpa bahan asam yang cukup, sisa baking soda yang tidak bereaksi akan terurai secara termal menjadi Natrium Karbonat (Na₂CO₃) yang membuat kue berasa getir/pahit seperti sabun dan berwarna kekuningan tak sedap!',
      '2. Baking Powder adalah campuran lengkap yang sudah terkalibrasi antara Natrium Bikarbonat (NaHCO₃), zat asam kering padat (seperti Monokalsium Fosfat atau Sodium Asam Pirofosfat), dan pati jagung (maizena) sebagai penyerap kelembapan agar tidak bereaksi di dalam kemasan.',
      'Baking powder komersial modern umumnya bertipe Double-Acting (Aksi Ganda): Reaksi pertama terjadi seketika saat terkena cairan adonan basah pada suhu ruang, dan reaksi kedua terjadi saat adonan terpapar panas oven di atas 60°C. Sangat ideal untuk kue yang adonannya tidak mengandung bahan asam alami.',
      'Ingat aturan praktisnya: Jika resepmu mengandung bahan asam (seperti martabak dengan ragi/susu asam atau kue pisang), gunakan Baking Soda. Jika adonanmu netral (seperti bolu vanila atau biskuit mentega), gunakan Baking Powder!'
    ],
    category: 'Eksperimen Kreatif',
    author: {
      name: 'Pak Hafiz Akhyar, S.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi'
    },
    date: '16 Agustus 2026',
    readTime: '5 menit baca',
    coverImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80',
    tags: ['BakingSoda', 'BakingPowder', 'AsamBasa', 'KimiaDapur', 'PengembangKue'],
    keyTakeaways: [
      'Baking soda murni memerlukan aktivator asam dari bahan resep untuk melepas gas CO₂.',
      'Kelebihan baking soda tanpa asam menyisakan Na₂CO₃ basa yang berasa getir/pahit.',
      'Baking powder double-acting bekerja dua tahap: saat terkena air dan saat dipanggang di oven.'
    ],
    reactions: 312
  },
  {
    id: 'post-10',
    title: 'Mengapa Bawang Merah Bikin Menangis saat Diiris? Sains di Balik Gas Lakrimatori & Trik Kimia Mengatasinya',
    slug: 'mengapa-bawang-merah-bikin-menangis-gas-lakrimatori',
    summary: 'Setiap mengiris bawang merah, mata tiba-tiba perih dan air mata bercucuran. Bagaimana reaksi enzimatis membentuk asam sulfat mikro di kornea matamu, dan bagaimana cara kimiawi menghentikannya?',
    content: [
      'Memotong bawang merah sering kali berakhir dengan tetesan air mata bukan karena kesedihan, melainkan sebuah senjata pertahanan kimia alami tumbuhan yang sangat canggih.',
      'Di dalam sel-sel bawang utuh yang belum terpotong, terdapat dua kompartemen terpisah: senyawa asam amino sulfoksida dan enzim alliinase (allinase). Ketika mata pisau merusak dinding sel, kedua zat ini bercampur seketika.',
      'Enzim alliinase menghidrolisis asam amino sulfoksida menjadi Asam Sulfenat. Selanjutnya, enzim kedua bernama lachrymatory factor synthase mengubah asam sulfenat menjadi gas syn-propanethial-S-oxide (C₃H₆OS) yang sangat volatil (mudah menguap ke udara).',
      'Ketika gas ini melayang dan menyentuh lapisan air pelindung kornea mata kita, terjadi reaksi hidrolisis lanjutan: C₃H₆OS + H₂O → H₂SO₄ (asam sulfat dalam konsentrasi sangat encer) + propanal. Asam sulfat mikro inilah yang mengiritasi ujung saraf sensorik kornea (saraf trigeminal). Otak kemudian merespons dengan memicu kelenjar lakrimalis untuk memproduksi air mata sebanyak mungkin guna membilas zat iritan tersebut.',
      'Bagaimana trik kimia untuk mencegahnya? 1) Dinginkan bawang di lemari es sebelum diiris: suhu rendah menurunkan energi kinetik molekul dan memperlambat laju reaksi enzimatis. 2) Gunakan pisau yang sangat tajam: pisau tumpul meremukkan lebih banyak dinding sel sehingga gas yang lepas berlipat ganda. 3) Potong di dekat aliran air atau nyalakan lilin di dekat talenan karena panas nyala api dapat mengoksidasi senyawa belerang volatil sebelum mencapai matamu.'
    ],
    category: 'Kimia Sehari-hari',
    author: {
      name: 'Pak Hafiz Akhyar, S.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi'
    },
    date: '21 Agustus 2026',
    readTime: '4 menit baca',
    coverImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80',
    tags: ['KimiaDapur', 'BawangMerah', 'GasLakrimatori', 'Enzimatis', 'KinetikaKimia'],
    keyTakeaways: [
      'Pecahnya dinding sel bawang mempertemukan asam amino sulfoksida dengan enzim alliinase.',
      'Gas syn-propanethial-S-oxide terhidrolisis menjadi asam sulfat mikro pada air kornea mata.',
      'Mendinginkan bawang dan pisau tajam secara signifikan menurunkan pembentukan gas lakrimatori.'
    ],
    reactions: 325
  },
  {
    id: 'post-11',
    title: 'Mengapa Air Dingin Gagal Meredakan Pedas Cabai? Rahasia Molekul Kapsaisin & Protein Kasein',
    slug: 'mengapa-air-dingin-gagal-meredakan-pedas-kapsaisin-kasein',
    summary: 'Meneguk bergelas-gelas air es saat kepedasan justru membuat lidah makin terbakar. Pahami konsep polaritas kelarutan "Like Dissolves Like" dan alasan mengapa susu adalah penawar sejatinya!',
    content: [
      'Sensasi terbakar saat memakan cabai rawit atau sambal bukan sensasi rasa gustatori dasar, melainkan respon termal dan nyeri yang dipicu oleh senyawa alkaloid Kapsaisin (8-metil-N-vanilil-6-nonenamida, C₁₈H₂₇NO₃).',
      'Molekul kapsaisin berikatan kuat dengan reseptor sensorik TRPV1 (Transient Receptor Potential Vanilloid 1) pada membran sel saraf sensorik lidah kita. Reseptor ini sejatinya bertugas mendeteksi suhu panas fisik di atas 43°C, sehingga ikatan kapsaisin membohongi otak seolah-olah lidah sedang terpanggang api nyata.',
      'Mengapa air putih dingin tidak mempan? Struktur kimia kapsaisin memiliki cincin vanilil hidrofilik kecil namun didominasi oleh ekor hidrokarbon non-polar alifatik yang panjang (sangat hidrofobik/lipofilik). Berdasarkan kaidah kelarutan universal "Like Dissolves Like", air murni yang bersifat sangat polar tidak mampu melarutkan atau melepas ikatan kapsaisin dari reseptor TRPV1. Minum air hanya meredakan nyeri beberapa detik akibat efek dingin termal, namun setelahnya air justru menyebarkan molekul kapsaisin ke seluruh penjuru rongga mulut.',
      'Solusi kimiawi paling efektif adalah Susu, Es Krim, atau Keju. Susu sapi mengandung protein Kasein yang memiliki domain molekul non-polar hidrofobik. Protein kasein menyelubungi molekul kapsaisin seperti detergen mengangkat lemak, mencabutnya dari reseptor TRPV1, dan membilasnya ke saluran cerna.'
    ],
    category: 'Fakta Unik',
    author: {
      name: 'Pak Hafiz Akhyar, S.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi'
    },
    date: '20 Agustus 2026',
    readTime: '5 menit baca',
    coverImage: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1000&q=80',
    tags: ['Kapsaisin', 'Kepolaran', 'LikeDissolvesLike', 'KaseinSusu', 'SarafTRPV1'],
    keyTakeaways: [
      'Kapsaisin bersifat non-polar lipofilik dan berikatan kuat dengan reseptor panas TRPV1 lidah.',
      'Air yang bersifat polar tidak bisa melarutkan kapsaisin dan hanya menyebarkannya.',
      'Protein kasein pada produk susu mengikat kapsaisin dan mencabutnya dari reseptor saraf.'
    ],
    reactions: 394
  },
  {
    id: 'post-12',
    title: 'Mengapa Minuman Bersoda Berdesis & Cepat Hambar saat Hangat? Menyingkap Hukum Henry & Karbonasi',
    slug: 'minuman-bersoda-hukum-henry-kesetimbangan-karbonasi',
    summary: 'Suara mendesis saat membuka kaleng soda adalah demonstrasi nyata Hukum Henry dan kesetimbangan kimia asam karbonat. Mengapa suhu hangat membuat soda kehilangan rasa "gigitan"-nya?',
    content: [
      'Minuman berkarbonasi modern dibuat di pabrik dengan menginjeksikan gas Karbon Dioksida (CO₂) ke dalam cairan sirup pada tekanan tinggi antara 3 hingga 5 atmosfer serta suhu mendekati 0°C.',
      'Dasar ilmiah proses ini dijelaskan oleh Hukum Henry: Kelarutan suatu gas dalam cairan berbanding lurus dengan tekanan parsial gas tersebut di atas permukaan cairan (C = k_H × P_gas). Pada tekanan tinggi di dalam kaleng tersegel, sejumlah besar gas CO₂ terpaksa larut dan bereaksi dengan molekul air membentuk Asam Karbonat: CO₂(g) + H₂O(l) ⇌ H₂CO₃(aq) ⇌ H⁺(aq) + HCO₃⁻(aq).',
      'Ion H⁺ dari asam karbonat inilah yang menstimulasi reseptor rasa asam dan memicu sensasi "menggigit" (sharp fizzy bite) di lidah yang menyegarkan.',
      'Ketika penutup botol dibuka, tekanan dalam ruang gas botol anjlok seketika dari ~4 atm ke tekanan atmosfer 1 atm. Sesuai Asas Le Chatelier dan Hukum Henry, penurunan tekanan memaksa kesetimbangan bergeser ke kiri, melepaskan gas CO₂ terlarut dalam bentuk gelembung desisan cepat.',
      'Mengapa soda hangat cepat menjadi hambar ("flat")? Pelarutan gas ke dalam air selalu merupakan proses eksotermik (ΔH < 0). Ketika suhu naik, kesetimbangan semakin terdorong ke arah pelepasan gas CO₂ ke udara bebas, sehingga konsentrasi asam karbonat dalam larutan turun drastis dan sensasi tajamnya hilang.'
    ],
    category: 'Kimia Sehari-hari',
    author: {
      name: 'Pak Hafiz Akhyar, S.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi'
    },
    date: '19 Agustus 2026',
    readTime: '5 menit baca',
    coverImage: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1000&q=80',
    tags: ['HukumHenry', 'AsamKarbonat', 'KesetimbanganKimia', 'LeChatelier', 'KimiaXI'],
    keyTakeaways: [
      'Kelarutan gas CO₂ bergantung pada tekanan parsial (Hukum Henry) dan suhu cairan.',
      'Rasa menggigit soda berasal dari ion H⁺ asam karbonat (H₂CO₃) yang terbentuk.',
      'Proses pelarutan gas bersifat eksotermik sehingga suhu hangat memicu hilangnya gas CO₂.'
    ],
    reactions: 310
  },
  {
    id: 'post-13',
    title: 'Mengapa Roti Mengembang Empuk & Berkerak Cokelat Harum? Perpaduan Fermentasi Ragi & Reaksi Maillard',
    slug: 'kimia-roti-fermentasi-ragi-dan-reaksi-maillard',
    summary: 'Dari tepung mentah menjadi roti empuk beraroma menggoda, pembuatan roti adalah laboratorium biokimia termal paling lezat di dunia!',
    content: [
      'Proses pembuatan sepotong roti yang sempurna menggabungkan dua tonggak penting ilmu kimia: biokimia fermentasi mikrobiologis dan reaksi browning non-enzimatik pada temperatur tinggi.',
      'Tahap pertama adalah Fermentasi oleh Ragi (Saccharomyces cerevisiae). Enzim invertase dan zymase pada ragi memecah karbohidrat tepung (glukosa) menjadi alkohol dan gas: C₆H₁₂O₆ → 2 C₂H₅OH (etanol) + 2 CO₂(g). Gas CO₂ yang terlepas tidak langsung terbang ke udara bebas karena terperangkap di dalam anyaman jaring protein gluten (gliadin dan glutenin) yang elastis.',
      'Tahap kedua berlangsung di dalam oven pemanggang. Berdasarkan Hukum Charles (V₁/T₁ = V₂/T₂), pemanasan hingga 200°C menyebabkan gas CO₂ dan uap etanol memuai dengan sangat kuat, mendorong dinding gluten mengembang hingga membentuk pori-pori rongga roti yang empuk.',
      'Tahap ketiga adalah Reaksi Maillard pada permukaan luar roti saat suhu melampaui 140°C. Gugus amina (-NH₂) dari asam amino protein tepung bereaksi dengan gugus karbonil (C=O) dari gula pereduksi, menghasilkan senyawa polimer melanoidin yang memberi warna cokelat keemasan serta ratusan senyawa pirazin dan furan yang menghasilkan aroma wangi khas bakery!'
    ],
    category: 'Eksperimen Kreatif',
    author: {
      name: 'Pak Hafiz Akhyar, S.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi'
    },
    date: '18 Agustus 2026',
    readTime: '6 menit baca',
    coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    tags: ['Fermentasi', 'ReaksiMaillard', 'BiokimiaPangan', 'Gluten', 'HukumCharles'],
    keyTakeaways: [
      'Ragi Saccharomyces cerevisiae memfermentasi gula menjadi gas CO₂ dan etanol.',
      'Anyaman gluten memerangkap gas CO₂ yang kemudian memuai saat terkena panas oven.',
      'Reaksi Maillard antara asam amino dan gula pereduksi menghasilkan warna cokelat dan aroma harum.'
    ],
    reactions: 356
  },
  {
    id: 'post-14',
    title: 'Bagaimana Sabun Mengangkat Lemak Minyak Membandel? Arsitektur Misel & Kimia Surfaktan',
    slug: 'bagaimana-sabun-mengangkat-minyak-misel-surfaktan',
    summary: 'Air dan minyak secara termodinamika bermusuhan dan tidak dapat bersatu. Mengapa sebatang sabun mampu mendamaikan keduanya dan membilas noda minyak tanpa sisa?',
    content: [
      'Secara mendasar, molekul air (H₂O) bersifat sangat polar dan saling terikat kuat melalui ikatan hidrogen intermolekuler. Di sisi lain, minyak dan lemak gorengan tersusun atas rantai hidrokarbon trigliserida yang bersifat non-polar. Karena perbedaan gaya antarmolekul ini, minyak selalu terpisah dan mengapung di atas air.',
      'Sabun adalah garam natrium atau kalium dari asam lemak rantai panjang (contohnya Natrium Stearat, C₁₇H₃₅COONa). Molekul sabun memiliki anatomi amfifilik yang brilian:',
      '1. Kepala Polar (-COO⁻ Na⁺): Mengandung muatan ionik yang bersifat hidrofilik (suka air / larut dalam air).',
      '2. Ekor Non-polar rantai karbon panjang (-C₁₇H₃₅): Bersifat hidrofobik / lipofilik (takut air, tetapi sangat suka minyak dan lemak).',
      'Ketika sabun dilarutkan dalam air cucian yang kotor oleh lemak, ekor hidrofobik dari ratusan molekul sabun akan menusuk dan menenggelamkan diri ke dalam gumpalan minyak. Kepala polar mereka tetap berada di permukaan luar menghadap ke molekul air.',
      'Susunan ini membentuk struktur bola mikroskopis bernama Misel (Micelle). Minyak lemak terkurung rapat di inti tengah misel, sedangkan permukaan luar misel yang bermuatan negatif saling tolak-menolak mencegah minyak menyatu kembali. Saat dibilas dengan air mengalir, seluruh bola misel beserta kotoran minyaknya hanyut dengan mudah!'
    ],
    category: 'Kimia Sehari-hari',
    author: {
      name: 'Pak Hafiz Akhyar, S.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi'
    },
    date: '17 Agustus 2026',
    readTime: '5 menit baca',
    coverImage: 'https://images.unsplash.com/photo-1607006483702-33225a17684a?auto=format&fit=crop&w=1000&q=80',
    tags: ['Misel', 'Surfaktan', 'KoloidEmulsi', 'TeganganPermukaan', 'KimiaXI'],
    keyTakeaways: [
      'Molekul sabun memiliki struktur amfifilik: kepala polar hidrofilik dan ekor non-polar lipofilik.',
      'Misel memerangkap partikel lemak di bagian tengah inti hidrofobik.',
      'Muatan seragam pada permukaan luar misel mencegah gumpalan minyak bersatu kembali.'
    ],
    reactions: 367
  }
];

export const NATURAL_INDICATORS: NaturalIndicator[] = [
  {
    id: 'kunyit',
    name: 'Ekstrak Kunyit Segar',
    latinName: 'Curcuma longa',
    activeCompound: 'Kurkuminoid (Kurkumin)',
    normalColor: 'Kuning Cerah',
    normalColorHex: '#EAB308',
    acidColor: 'Kuning Terang Stabil',
    acidColorHex: '#FACC15',
    neutralColor: 'Kuning Keemasan',
    neutralColorHex: '#EAB308',
    baseColor: 'Merah Bata / Cokelat Tua',
    baseColorHex: '#991B1B',
    description: 'Kurkumin merupakan senyawa polifenol hidrofobik. Pada kondisi basa kuat, hidrogen fenolik terdeprotonasi sehingga terjadi delokalisasi elektron pi yang menggeser warna ke merah bata pekat.'
  },
  {
    id: 'telang',
    name: 'Ekstrak Bunga Telang',
    latinName: 'Clitoria ternatea',
    activeCompound: 'Antosianin (Ternatin & Delphinidin)',
    normalColor: 'Biru Nila / Indigo',
    normalColorHex: '#2563EB',
    acidColor: 'Merah Muda / Ungu Fanta',
    acidColorHex: '#DB2777',
    neutralColor: 'Biru Kobalt',
    neutralColorHex: '#2563EB',
    baseColor: 'Hijau Toska / Kuning Lumut',
    baseColorHex: '#059669',
    description: 'Antosianin memiliki cincin flavilium kationik pada pH asam (< 3) yang menghasilkan warna merah muda cerah, dan beralih ke struktur kuinonoid pada pH netral (biru) serta kalkon pada pH basa (kehijauan).'
  },
  {
    id: 'manggis',
    name: 'Ekstrak Kulit Manggis',
    latinName: 'Garcinia mangostana',
    activeCompound: 'Xanthone & Antosianin Perikarp',
    normalColor: 'Ungu Kemerahan / Marun',
    normalColorHex: '#831843',
    acidColor: 'Merah Segar Stabil',
    acidColorHex: '#BE123C',
    neutralColor: 'Coklat Marun Kemerahan',
    neutralColorHex: '#831843',
    baseColor: 'Hijau Tua Kecokelatan',
    baseColorHex: '#365314',
    description: 'Kandungan pigmen polifenolik pada kulit manggis sangat stabil pada suasana asam dan mengalami degradasi/perubahan serapan menuju kehijauan saat bereaksi dengan ion hidroksida (OH-).'
  }
];

export const TEST_SOLUTIONS: TestSolution[] = [
  {
    id: 'cuka',
    name: 'Asam Cuka Dapur (CH3COOH)',
    type: 'acid',
    pH: 2.8,
    householdExample: 'Bumbu dapur asam, pembersih kerak alami'
  },
  {
    id: 'lemon',
    name: 'Air Perasan Jeruk Lemon (Asam Sitrat)',
    type: 'acid',
    pH: 2.2,
    householdExample: 'Minuman segar, sumber vitamin C'
  },
  {
    id: 'aquades',
    name: 'Air Murni / Aquades (H2O)',
    type: 'neutral',
    pH: 7.0,
    householdExample: 'Air suling pelarut laboratorium'
  },
  {
    id: 'sabun',
    name: 'Larutan Air Sabun Mandi',
    type: 'base',
    pH: 9.2,
    householdExample: 'Pembersih tubuh, surfaktan lembut'
  },
  {
    id: 'detergen',
    name: 'Larutan Detergen & Pembersih Lantai',
    type: 'base',
    pH: 11.5,
    householdExample: 'Pembersih noda pakaian, basa kuat rumah tangga'
  }
];

export const FAQ_ITEMS = [
  {
    question: 'Apa itu platform Kelas Pak Hafiz?',
    answer: 'Kelas Pak Hafiz adalah website portofolio dokumentasi, galeri laboratorium interaktif, pusat unduhan berkas/modul kimia SMA, dan artikel pembelajaran edukatif yang dikelola langsung oleh Pak Hafiz. Platform ini juga merupakan pintu gerbang utama menuju portal kelas pembelajaran daring resmi kami.'
  },
  {
    question: 'Apakah semua dokumen dan LKPD praktikum dapat diunduh gratis?',
    answer: 'Ya! Seluruh modul ajar, ringkasan rumus (cheat sheet), dan Lembar Kerja Peserta Didik (LKPD) yang tersedia di halaman Dokumentasi File dapat diunduh secara gratis oleh siswa maupun rekan guru di seluruh Indonesia.'
  },
  {
    question: 'Bagaimana cara mengakses Website Pembelajaran Utama (LMS)?',
    answer: 'Anda cukup mengklik tombol "Masuk ke Portal Pembelajaran" di navigasi atas atau tombol CTA di berbagai bagian halaman ini. Anda akan diarahkan ke portal LMS interaktif yang memuat kuis gamifikasi, video materi berdurasi penuh, serta forum tanya jawab materi kimia.'
  },
  {
    question: 'Apakah eksperimen indikator alami aman dicoba sendiri di rumah?',
    answer: 'Sangat aman! Eksperimen indikator alami seperti kunyit, bunga telang, dan kulit manggis hanya menggunakan bahan-bahan dapur organik yang tidak beracun (non-toxic). Namun tetap disarankan untuk berhati-hati saat menggunakan bahan pembersih kimia rumah tangga seperti detergen atau cuka pekat.'
  },
  {
    question: 'Bisakah saya mengundang Pak Hafiz untuk webinar atau workshop praktikum sains?',
    answer: 'Tentu saja! Anda dapat menghubungi Pak Hafiz melalui formulir kontak di bagian bawah situs ini atau melalui email resmi kelaspakhafiz@gmail.com untuk kolaborasi pengajaran, workshop praktikum kreatif, dan seminar pendidikan IPA/Kimia.'
  }
];

export const INITIAL_CLASS_NOTES: ClassNote[] = [
  {
    id: 'note-1',
    title: 'Ringkasan Cepat: Cara Mudah Menentukan Bilangan Oksidasi (Biloks)',
    category: 'Redoks & Elektrokimia',
    classGrade: 'Kelas XII',
    content: 'Saat menyetarakan reaksi redoks (metode setengah reaksi atau perubahan biloks), kunci utamanya adalah menguasai aturan dasar bilangan oksidasi tanpa perlu panik.',
    keyPoints: [
      'Unsur bebas selalu bernilai 0 (Contoh: Fe, O₂, H₂, Cl₂, Na)',
      'Fluor (F) selalu bernilai -1 dalam semua senyawanya',
      'Golongan IA (Li, Na, K) = +1, Golongan IIA (Mg, Ca, Ba) = +2',
      'Hidrogen (H) = +1 (kecuali hidrida logam seperti NaH nilainya -1)',
      'Oksigen (O) = -2 (kecuali peroksida H₂O₂ = -1, dan senyawa OF₂ = +2)',
      'Total biloks molekul netral = 0, sedangkan total biloks ion poliatom = muatan ionnya'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    date: '20 Agustus 2026',
    authorName: 'Pak Hafiz Akhyar, S.Si.',
    isPinned: true,
    likes: 42,
    tags: ['Biloks', 'Redoks', 'KimiaXII', 'RumusCepat']
  },
  {
    id: 'note-2',
    title: 'Jembatan Keledai Tata Nama & Gugus Fungsi Senyawa Karbon',
    category: 'Kimia Organik',
    classGrade: 'Kelas XII',
    content: 'Mengingat gugus fungsi turunan alkana sering membingungkan jika dihafal tanpa pola. Gunakan urutan prioritas IUPAC dan jembatan keledai visual berikut agar tidak tertukar antara aldehid, keton, dan ester.',
    keyPoints: [
      'Alkohol (-OH) -> Berakhiran -ol (Contoh: Etanol)',
      'Eter (-O-) -> Alkoksi Alkana (Pelarut organik)',
      'Aldehid (-CHO) -> Alkanal | Posisi selalu di ujung rantai (C-1)',
      'Keton (-CO-) -> Alkanon | Gugus karbonil diapit oleh 2 atom karbon',
      'Asam Karboksilat (-COOH) -> Asam Alkanoat (Gugus paling prioritas)',
      'Ester (-COO-) -> Alkil Alkanoat (Pemberi aroma esens buah)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b4?auto=format&fit=crop&w=800&q=80',
    date: '18 Agustus 2026',
    authorName: 'Pak Hafiz Akhyar, S.Si.',
    isPinned: true,
    likes: 38,
    tags: ['KimiaOrganik', 'GugusFungsi', 'Alkana', 'UTBK']
  },
  {
    id: 'note-3',
    title: 'Peta Konsep Stoikiometri & Konversi Jembatan Mol',
    category: 'Stoikiometri',
    classGrade: 'Kelas X',
    content: 'Mol (n) adalah "mata uang" dalam perhitungan kimia. Semua data massa (gram), volume gas (Liter), konsentrasi (Molaritas), dan jumlah partikel harus dikonversi melewati pos Mol terlebih dahulu.',
    keyPoints: [
      'Massa ke Mol : n = gram / Mr',
      'Jumlah Partikel : N = n × 6,02 × 10²³ (Bilangan Avogadro)',
      'Volume Gas STP (0°C, 1 atm) : V = n × 22,4 Liter',
      'Volume Gas RTP (25°C, 1 atm) : V = n × 24 Liter',
      'Gas Ideal Keadaan Sembarang : P × V = n × R × T',
      'Molaritas Larutan : M = n / V (Liter)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    date: '15 Agustus 2026',
    authorName: 'Pak Hafiz Akhyar, S.Si.',
    isPinned: false,
    likes: 29,
    tags: ['Stoikiometri', 'Mol', 'RumusKimia', 'KelasX']
  },
  {
    id: 'note-4',
    title: 'Tips & Rumus Cepat Menghitung pH Larutan Asam Basa & Buffer',
    category: 'Larutan Asam Basa',
    classGrade: 'Kelas XI',
    content: 'Sebelum menghitung pH, tentukan terlebih dahulu jenis larutannya: Asam/Basa Kuat, Asam/Basa Lemah, Larutan Penyangga (Buffer), atau Hidrolisis Garam.',
    keyPoints: [
      'Asam Kuat: [H⁺] = a × Ma  =>  pH = -log [H⁺]',
      'Asam Lemah: [H⁺] = √(Ka × Ma)  atau  [H⁺] = α × Ma',
      'Buffer Asam: [H⁺] = Ka × (mol Asam Lemah / mol Garam/Basa Konjugasi)',
      'Buffer Basa: [OH⁻] = Kb × (mol Basa Lemah / mol Asam Konjugasi)',
      'Garam Terhidrolisis Parsial (Asam Lemah + Basa Kuat): [OH⁻] = √( (Kw/Ka) × [Garam] × valensi )',
      'Ingat rumus hubungan: pH + pOH = 14 (pada suhu 25°C)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=800&q=80',
    date: '10 Agustus 2026',
    authorName: 'Pak Hafiz Akhyar, S.Si.',
    isPinned: false,
    likes: 34,
    tags: ['AsamBasa', 'Buffer', 'pH', 'KelasXI']
  },
  {
    id: 'note-5',
    title: '5 Langkah Metode Feynman untuk Menaklukkan Konsep Kimia Abstrak',
    category: 'Tips Belajar di Kelas',
    classGrade: 'Semua Tingkat',
    content: 'Metode Feynman adalah teknik belajar berbasis metakognisi paling terbukti untuk memahami konsep kimia abstrak (seperti orbital atom, hibridisasi, larutan penyangga, atau hukum termodinamika) tanpa terjebak hafalan buta.',
    keyPoints: [
      'Langkah 1 (Pilih Konsep): Tulis 1 topik kimia spesifik (misal: "Larutan Penyangga/Buffer") di bagian atas kertas kosong.',
      'Langkah 2 (Ajarkan ke Orang Awam): Jelaskan konsep tersebut seolah kamu mengajar anak SMP usia 12 tahun tanpa istilah jargon rumit.',
      'Langkah 3 (Identifikasi Lubang Pemahaman): Saat kamu tersendat atau tergoda memakai istilah asing tanpa paham maknanya, tandai bagian itu.',
      'Langkah 4 (Buka Catatan & Klarifikasi): Pelajari kembali modul atau tanyakan ke Pak Hafiz untuk menambal bagian yang belum jelas.',
      'Langkah 5 (Sederhanakan & Buat Analogi): Buat analogi konkret (misal: Larutan Buffer dianalogikan seperti spons penyerap tumpahan asam/basa).'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    date: '21 Agustus 2026',
    authorName: 'Pak Hafiz Akhyar, S.Si.',
    isPinned: true,
    likes: 58,
    tags: ['TipsBelajar', 'MetodeFeynman', 'BelajarEfektif', 'Metakognisi', 'KimiaSMA']
  },
  {
    id: 'note-6',
    title: 'Sistem Catatan Cornell: Format Khusus Reaksi & Rumus Hitungan Kimia',
    category: 'Tips Belajar di Kelas',
    classGrade: 'Semua Tingkat',
    content: 'Mencatat di kelas kimia membutuhkan struktur yang memudahkan review saat menjelang ujian. Bagi halaman buku catatanmu menjadi 3 zona strategis: Kolom Kiri (Pemicu Pertanyaan), Kolom Kanan (Catatan Utama), dan Baris Bawah (Ringkasan).',
    keyPoints: [
      'Kolom Kanan (65% Lebar): Catat penurunan rumus, grafik laju reaksi, persamaan reaksi redoks, dan contoh soal dari guru.',
      'Kolom Kiri (25% Lebar): Tulis kata pemicu & pertanyaan kilat (Contoh: "Syarat Buffer?", "Mengapa eksoterm?", "Satuan Konstanta R?").',
      'Baris Bawah (10% Tinggi): Tulis kesimpulan inti pembelajaran hari ini dalam 1-2 kalimat dengan bahasamu sendiri.',
      'Metode Uji Mandiri: Tutup kolom kanan dengan telapak tangan, lalu uji apakah kamu bisa menjawab semua pertanyaan pemicu di kolom kiri.',
      'Kode Warna Tint: Biru untuk penjelasan umum, Merah untuk jebakan/pengecualian soal, Hijau untuk satuan fisika/konstanta.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
    date: '21 Agustus 2026',
    authorName: 'Pak Hafiz Akhyar, S.Si.',
    isPinned: false,
    likes: 52,
    tags: ['CornellNote', 'TipsMencatat', 'CatatanKelas', 'ManajemenBelajar']
  },
  {
    id: 'note-7',
    title: 'Trik Active Recall & Spaced Repetition Menghafal Sifat Periodik Unsur',
    category: 'Tips Belajar di Kelas',
    classGrade: 'Kelas X',
    content: 'Menghafal tren periodik unsur (Jari-jari atom, Energi Ionisasi, Afinitas Elektron, Elektronegativitas) sering kali terbalik jika hanya dibaca pasif berulang-ulang. Gunakan teknik active recall visual dan interval pengulangan terprogram.',
    keyPoints: [
      'Hukum Visual Jari-Jari Atom: "Makin ke KIRI dan ke BAWAH makin BESAR" (Visualisasikan manusia salju yang makin gendut ke bawah).',
      'Tren Energi Ionisasi & Elektronegativitas: Berbanding terbalik dengan jari-jari atom ("Makin ke KANAN dan ke ATAS makin KUAT").',
      'Flashcard Unsur: Sisi depan tulis simbol kimia & golongan (misal: "Na, Golongan IA"), sisi belakang tulis jumlah proton, konfigurasi, dan sifat reaksinya.',
      'Jadwal Spaced Repetition: Ulangi pengujian flashcard pada interval Hari ke-1, Hari ke-3, Hari ke-7, dan Hari ke-21.',
      'Hubungkan ke Fakta Nyata: Logam alkali (Na/K) sangat reaktif meletup di air, Gas mulia (He/Ne) stabil tidak reaktif.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    date: '20 Agustus 2026',
    authorName: 'Pak Hafiz Akhyar, S.Si.',
    isPinned: false,
    likes: 64,
    tags: ['TabelPeriodik', 'ActiveRecall', 'SpacedRepetition', 'TipsBelajar', 'KelasX']
  },
  {
    id: 'note-8',
    title: 'Strategi Manajemen Waktu & Anti-Blunder Menghadapi Ujian Hitungan Kimia',
    category: 'Tips Belajar di Kelas',
    classGrade: 'Kelas XII',
    content: 'Banyak siswa kehilangan poin berharga dalam ujian kimia bukan karena tidak mengerti rumus, melainkan akibat kesalahan sepele seperti lupa menyetarakan koefisien reaksi, salah konversi satuan suhu, atau pembulatan angka prematur.',
    keyPoints: [
      'Aturan Emas 1 (Cek Kesetaraan Reaksi): Sebelum menghitung stoikiometri mol, SELALU pastikan persamaan reaksi sudah setara!',
      'Aturan Emas 2 (Lingkari Satuan Soal): Waspadai jebakan satuan mL vs Liter, gram vs kilogram, dan Celcius vs Kelvin (T = °C + 273).',
      'Strategi 15 Menit Awal: Kerjakan seluruh soal teori deskriptif dan tata nama terlebih dahulu untuk mengamankan poin cepat.',
      'Tuliskan Rumus Dasar: Selalu tulis rumus sebelum memasukkan angka (guru biasanya memberi poin langkah pengerjaan).',
      'Uji Kelayakan Jawaban: pH larutan asam tidak boleh > 7, mol tidak mungkin negatif, dan massa produk tidak boleh melebihi massa total reaktan.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    date: '19 Agustus 2026',
    authorName: 'Pak Hafiz Akhyar, S.Si.',
    isPinned: false,
    likes: 71,
    tags: ['StrategiUjian', 'AntiBlunder', 'Stoikiometri', 'UTBK', 'TipsUjian']
  },
  {
    id: 'note-9',
    title: 'Etika & Prosedur Praktikum Laboratorium Kimia SMA agar Aman & Presisi',
    category: 'Tips Belajar di Kelas',
    classGrade: 'Semua Tingkat',
    content: 'Laboratorium sains adalah tempat yang sangat seru untuk membuktikan teori, namun menuntut disiplin keselamatan tinggi. Pahami tata cara membaca alat ukur dan penanganan bahan kimia dengan benar.',
    keyPoints: [
      'Kelengkapan APD: Jas laboratorium lengan panjang berkancing rapi, kacamata pelindung (goggles), dan sepatu tertutup.',
      'Aturan Asam Pekat: "JANGAN PERNAH menuangkan air ke dalam asam pekat!" Selalu tuangkan asam perlahan ke dalam air lewat dinding gelas.',
      'Cara Mencium Aroma Zat: Jangan menghirup langsung di mulut tabung reaksi! Kibaskan uap ke arah hidung dengan telapak tangan (metode wafting).',
      'Membaca Meniskus Buret/Gelas Ukur: Untuk cairan bening baca garis batas dasar cekungan (meniskus bawah) tepat sejajar dengan pandangan mata.',
      'Pengelolaan Limbah: Sisa larutan logam berat dan asam/basa kuat harus dibuang ke jeriken penampungan limbah khusus, bukan ke wastafel.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    date: '18 Agustus 2026',
    authorName: 'Pak Hafiz Akhyar, S.Si.',
    isPinned: false,
    likes: 49,
    tags: ['KeselamatanLab', 'PraktikumKimia', 'EtikaLab', 'Meniskus', 'TipsSains']
  },
  {
    id: 'note-10',
    title: 'Peta Konsep & Karakteristik Ikatan Kimia: Ionik, Kovalen, dan Logam',
    category: 'Struktur Atom & Ikatan',
    classGrade: 'Kelas X',
    content: 'Ikatan kimia terbentuk agar atom-atom mencapai kestabilan konfigurasi elektron seperti gas mulia (Kaidah Duplet & Oktet). Pemahaman kunci terletak pada perbedaan keelektronegatifan, proses serah-terima elektron, atau pemakaian bersama pasangan elektron (PEI).',
    keyPoints: [
      'Ikatan Ion (Elektrovalen): Terjadi antara kation logam (melepas e⁻) dan anion non-logam (menerima e⁻) melalui gaya tarik elektrostatik. Memiliki titik leleh/didih tinggi serta lelehan & larutannya menghantarkan arus listrik (Contoh: NaCl, MgO, CaCl₂).',
      'Ikatan Kovalen: Terjadi akibat pemakaian bersama pasangan elektron antar sesama unsur non-logam. Terdiri atas Kovalen Tunggal (H-H), Kovalen Rangkap Dua (O=O), dan Kovalen Rangkap Tiga (N≡N).',
      'Kovalen Polar vs Non-Polar: Senyawa polar memiliki perbedaan keelektronegatifan, momen dipol ≠ 0, dan bentuk asimetris dengan pasangan elektron bebas/PEB pada atom pusat (Contoh: H₂O, NH₃, HF). Senyawa nonpolar simetris tanpa PEB (Contoh: CH₄, CO₂, Cl₂).',
      'Ikatan Kovalen Koordinasi (Datif): Pasangan elektron ikatan (PEI) hanya disumbangkan oleh salah satu atom penyusun (Contoh: NH₄⁺, H₃O⁺, SO₃).',
      'Ikatan Logam: Terbentuk akibat gaya elektrostatik antara kation logam bermuatan positif dengan "Lautan Elektron" valensi yang terdelokalisasi, menjadikan logam sebagai konduktor listrik & panas yang unggul serta dapat ditempa.',
      'Gaya Antarmolekul: Ikatan Hidrogen (sangat kuat, terjadi jika atom H terikat langsung pada atom F, O, atau N) menghasilkan anomali titik didih tinggi pada air (H₂O). Diikuti oleh gaya tarik dipol-dipol dan gaya dispersi London.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b4?auto=format&fit=crop&w=800&q=80',
    date: '25 Agustus 2026',
    authorName: 'Pak Hafiz Akhyar, S.Si.',
    isPinned: true,
    likes: 58,
    tags: ['IkatanKimia', 'IkatanIon', 'IkatanKovalen', 'KovalenKoordinasi', 'GayaAntarmolekul', 'KelasX']
  },
  {
    id: 'note-11',
    title: 'Ringkasan Rumus & Penerapan Sifat Koligatif Larutan (Elektrolit & Non-Elektrolit)',
    category: 'Sifat Koligatif Larutan',
    classGrade: 'Kelas XII',
    content: 'Sifat koligatif adalah sifat larutan yang hanya bergantung pada jumlah (konsentrasi) partikel zat terlarut, bukan pada jenis partikelnya. Untuk larutan elektrolit, selalu gunakan pengali Faktor Van\'t Hoff: i = 1 + (n - 1)α.',
    keyPoints: [
      '1. Penurunan Tekanan Uap (ΔP): Hukum Raoult: ΔP = P° × Xt dan P_larutan = P° × Xp. Penambahan zat terlarut non-volatil menurunkan tekanan uap jenuh pelarut murni.',
      '2. Kenaikan Titik Didih (ΔTb): ΔTb = m × Kb × i dan Tb_larutan = Tb° + ΔTb. Molekul zat terlarut menghalangi pelarut untuk lepas ke fase gas sehingga dibutuhkan temperatur lebih tinggi.',
      '3. Penurunan Titik Beku (ΔTf): ΔTf = m × Kf × i dan Tf_larutan = Tf° - ΔTf. Penerapan aplikatif: Penggunaan garam NaCl/CaCl₂ untuk mencairkan salju di jalan serta etilen glikol sebagai zat antibeku radiator kendaraan.',
      '4. Tekanan Osmotik (π): π = M × R × T × i (R = 0,082 L.atm/mol.K, T dalam Kelvin). Penerapan nyata: Cairan infus fisiologis isotonik tubuh (NaCl 0,9%) dan teknologi pemurnian air laut (Reverse Osmosis).',
      'Molalitas (m) vs Molaritas (M): Molalitas m = (gram / Mr) × (1000 / p_gram_pelarut). Molalitas tidak berubah terhadap fluktuasi temperatur karena berbasis massa pelarut.',
      'Faktor Van\'t Hoff (i): Larutan non-elektrolit memiliki i = 1; sedangkan larutan elektrolit kuat (α = 1) memiliki i = jumlah ion (n) (misal: NaCl -> i = 2; H₂SO₄ -> i = 3).'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=800&q=80',
    date: '25 Agustus 2026',
    authorName: 'Pak Hafiz Akhyar, S.Si.',
    isPinned: true,
    likes: 64,
    tags: ['SifatKoligatif', 'TekananUap', 'KenaikanTitikDidih', 'PenurunanTitikBeku', 'TekananOsmotik', 'FaktorVantHoff', 'KelasXII']
  },
  {
    id: 'note-12',
    title: 'Master Tren Sifat Periodik Unsur & Pengaruh Muatan Inti Efektif',
    category: 'Struktur Atom & Sifat Periodik',
    classGrade: 'Kelas X',
    content: 'Sifat periodik unsur berulang secara teratur seiring bertambahnya nomor atom dalam tabel periodik. Pola ini dikendalikan oleh dua faktor utama: jumlah kulit elektron (efek perisai) dan muatan inti efektif (jumlah proton penarik elektron).',
    keyPoints: [
      '1. Jari-Jari Atom: Jarak inti atom ke elektron terluar. Dalam satu GOLONGAN (atas ke bawah) MAKIN BESAR karena jumlah kulit bertambah. Dalam satu PERIODE (kiri ke kanan) MAKIN KECIL karena jumlah proton bertambah sehingga tarikan inti makin kuat.',
      '2. Energi Ionisasi (EI): Energi minimum untuk melepas 1 elektron valensi pada fase gas. Tren: Kiri ke Kanan MAKIN BESAR, Atas ke Bawah MAKIN KECIL. (Pengecualian kestabilan subkulit penuh/setengah penuh: Golongan IIA > IIIA dan VA > VIA).',
      '3. Afinitas Elektron (AE): Energi yang dilepas/diserap saat atom netral fase gas menangkap elektron membentuk ion negatif. Tren: Kiri ke Kanan MAKIN BESAR (lebih mudah membentuk anion, tertinggi pada Halogen VIIA seperti Cl dan F).',
      '4. Keelektronegatifan (Elektronegativitas): Kecenderungan atom menarik pasangan elektron dalam ikatan. Fluor (F = 4,0 Skala Pauling) adalah unsur paling elektronegatif. Tren: Kiri ke Kanan MAKIN BESAR, Atas ke Bawah MAKIN KECIL.',
      '5. Sifat Logam & Basa: Karakter logam dan sifat basa oksida makin kuat ke arah KIRI-BAWAH (Fransium dan Cesium paling reaktif sebagai logam). Sifat non-logam dan asam oksida makin kuat ke KANAN-ATAS.',
      'Jembatan Keledai Tren: Sifat yang bertambah ke KANAN-ATAS adalah "K-E-A-S" (Keelektronegatifan, Energi Ionisasi, Afinitas Elektron, Sifat Asam). Sedangkan yang bertambah ke KIRI-BAWAH adalah "J-L-B" (Jari-jari, sifat Logam, sifat Basa).'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    date: '25 Agustus 2026',
    authorName: 'Pak Hafiz Akhyar, S.Si.',
    isPinned: true,
    likes: 72,
    tags: ['SifatPeriodik', 'TabelPeriodik', 'JariJariAtom', 'EnergiIonisasi', 'Elektronegativitas', 'AfinitasElektron', 'KelasX']
  }
];

export const INITIAL_PROFILE_EXPERIENCES: import('../types').ProfileExperienceItem[] = [
  {
    id: 'prof-1',
    title: 'Lulusan S-1 Kimia (S.Si.)',
    institution: 'UIN Syarif Hidayatullah Jakarta',
    period: '2019 - 2023',
    category: 'Pendidikan',
    description: 'Fokus studi Kimia Murni dengan spesialisasi Kimia Organik & Kimia Analitik, aktif dalam riset laboratorium dan asistensi praktikum mahasiswa.',
    subItems: [
      'Skripsi bidang ekstraksi dan karakterisasi senyawa aktif bahan alam.',
      'Praktisi instrumentasi spektrofotometer UV-Vis, kromatografi, dan titrimetri.'
    ]
  },
  {
    id: 'prof-2',
    title: 'Asisten Laboratorium Kimia',
    institution: 'UIN Syarif Hidayatullah Jakarta',
    period: '2022 - 2023',
    category: 'Pengalaman',
    description: 'Membimbing praktikum Kimia Dasar dan Kimia Organik bagi mahasiswa baru, menyiapkan reagen standar, serta menguji validitas modul praktikum.',
    subItems: [
      'Instruktur keselamatan kerja dan SOP laboratorium kimia.',
      'Pengelolaan inventaris bahan kimia dan preparasi larutan reagen.'
    ]
  },
  {
    id: 'prof-3',
    title: 'Asisten Laboratorium Kimia & Fisika',
    institution: 'Institut Teknologi Indonesia (ITI) Serpong',
    period: '2023 - 2024',
    category: 'Pengalaman',
    description: 'Memandu sesi praktikum sains terintegrasi (Kimia dan Fisika Dasar) untuk mahasiswa teknik, kalibrasi alat ukur presisi, dan evaluasi laporan praktikum.',
    subItems: [
      'Pendampingan uji eksperimen termokimia dan mekanika fluida.',
      'Pembimbingan analisis data hasil pengamatan eksperimen.'
    ]
  },
  {
    id: 'prof-4',
    title: 'Laboran Analisis Development (R&D)',
    institution: 'NCU Jakarta',
    period: '2024',
    category: 'Pengalaman',
    description: 'Melakukan pengujian mutu analitik sampel, validasi metode analisis kimia, penanganan instrumen laboratorium, serta dokumentasi data riset produk.',
    subItems: [
      'Quality control pengujian kadar zat aktif dan uji stabilitas larutan.',
      'Penyusunan standar operating procedure (SOP) pengujian kimia.'
    ]
  },
  {
    id: 'prof-5',
    title: 'Pengajar IPA dan Kimia SMA',
    institution: 'SMA IAS Jakarta',
    period: '2024 - Sekarang',
    category: 'Pengalaman',
    description: 'Merancang kurikulum pembelajaran kimia kontekstual, memimpin praktikum sains interaktif berbasis indikator alami, serta membina siswa menuju olimpiade sains & seleksi masuk PTN (SNBT).',
    subItems: [
      'Inovator modul ajar LKPD praktikum kimia ramah lingkungan.',
      'Pengembang media belajar digital interaktif Kelas Pak Hafiz.'
    ]
  }
];

export const INITIAL_PORTFOLIO_CERTIFICATES: import('../types').PortfolioCertificateItem[] = [
  {
    id: 'cert-1',
    title: 'Sertifikat Kompetensi Asisten Laboratorium Kimia',
    category: 'Sertifikat',
    issuer: 'Laboratorium Terpadu UIN Syarif Hidayatullah Jakarta',
    year: '2023',
    imageUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
    description: 'Kompetensi teruji dalam keselamatan kerja laboratorium (K3), preparasi larutan reagen baku, dan asistensi praktikum sains.'
  },
  {
    id: 'cert-2',
    title: 'Sertifikasi Pengujian Analisis & Mutu Laboratorium',
    category: 'Sertifikat',
    issuer: 'NCU Development Laboratory',
    year: '2024',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    description: 'Sertifikasi keahlian dalam verifikasi metode analisis kuantitatif, spektroskopi, dan pengendalian mutu laboratorium kimia.'
  },
  {
    id: 'cert-3',
    title: 'Karya Riset & Modul: Kimia Kontekstual Indikator Alami',
    category: 'Karya Riset',
    issuer: 'SMA IAS Jakarta & Edukasi Sains',
    year: '2025',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    description: 'Pengembangan kurikulum lembar kerja praktikum (LKPD) berbasis bahan alam lokal (Kunyit & Bunga Telang) untuk siswa SMA.'
  },
  {
    id: 'cert-4',
    title: 'Piagam Pembina & Fasilitator Olimpiade Sains Kimia SMA',
    category: 'Penghargaan',
    issuer: 'SMA IAS Jakarta',
    year: '2025',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    description: 'Apresiasi atas dedikasi pembinaan intensif persiapan siswa dalam kompetisi sains dan pembekalan materi kimia tingkat lanjut.'
  },
  {
    id: 'cert-5',
    title: 'Pelatihan Pedagogi & Media Pembelajaran Sains Digital',
    category: 'Pelatihan',
    issuer: 'Asosiasi Pendidik Sains Indonesia',
    year: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    description: 'Pelatihan pembuatan media simulasi kimia interaktif dan gamifikasi pembelajaran untuk peningkatan pemahaman konsep siswa.'
  }
];

export const INITIAL_TEACHER_PROFILE: TeacherBioProfile = {
  id: 'main-teacher-profile',
  name: 'Pak Hafiz Akhyar, S.Si.',
  title: 'Guru Kimia & Praktisi Lab',
  verifiedBadgeText: 'Pendidik Terverifikasi',
  avatarUrl: 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi',
  bioDescription: 'Mendedikasikan pembelajaran sains kimia secara kontekstual, berbasis laboratorium ramah lingkungan, serta menumbuhkan nalar kritis siswa menuju prestasi olimpiade dan perguruan tinggi.',
  skillsAndFocus: [
    'S-1 Kimia UIN Jakarta',
    'Kimia Organik & Analitik',
    'Instruktur Lab & K3',
    'Modul LKPD Indikator Alami',
    'Pembina Olimpiade Sains (OSN)'
  ],
  contacts: [
    {
      id: 'cnt-email',
      type: 'email',
      label: 'kelaspakhafiz@gmail.com',
      value: 'kelaspakhafiz@gmail.com',
      url: 'mailto:kelaspakhafiz@gmail.com'
    },
    {
      id: 'cnt-ig',
      type: 'instagram',
      label: '@kelaspakhafiz (Instagram)',
      value: '@kelaspakhafiz',
      url: 'https://www.instagram.com/kelaspakhafiz/'
    },
    {
      id: 'cnt-yt',
      type: 'youtube',
      label: 'Kelas Pak Hafiz (YouTube)',
      value: 'Kelas Pak Hafiz',
      url: 'https://www.youtube.com/@KelasPakHafiz'
    }
  ]
};

export const INITIAL_PRACTICAL_VIDEOS: PracticalVideoItem[] = [
  {
    id: 'vid-1',
    title: 'Praktikum Indikator Alami Asam Basa: Ekstrak Kunyit & Bunga Telang',
    youtubeUrl: 'https://www.youtube.com/watch?v=kYdK8N-2b_U',
    youtubeId: 'kYdK8N-2b_U',
    thumbnailUrl: 'https://img.youtube.com/vi/kYdK8N-2b_U/hqdefault.jpg',
    category: 'Indikator Alami',
    badge: 'Video Utama Kelas XI',
    duration: '06:45',
    date: '16 Agustus 2026',
    description: 'Panduan lengkap demonstrasi pengujian sifat asam basa larutan rumah tangga menggunakan ekstrak rimpang kunyit dan bunga telang segar.',
    chemistryConcept: 'Pergeseran ion flavilium dan kurkuminoid akibat perubahan pH larutan.',
    isPinned: true
  },
  {
    id: 'vid-2',
    title: 'Teknik Titrasi Asam Basa & Cara Menentukan Titik Akhir Indikator PP',
    youtubeUrl: 'https://www.youtube.com/watch?v=sFpFCPTDv2w',
    youtubeId: 'sFpFCPTDv2w',
    thumbnailUrl: 'https://img.youtube.com/vi/sFpFCPTDv2w/hqdefault.jpg',
    category: 'Eksperimen Lab',
    badge: 'Keterampilan Lab',
    duration: '08:20',
    date: '10 Agustus 2026',
    description: 'Tata cara pembacaan meniskus buret yang benar, pengaturan tetesan titran NaOH, dan deteksi warna merah muda seulas indikator PP.',
    chemistryConcept: 'Stoikiometri titrasi asam monoprotik dan kurva pH netralisasi.',
    isPinned: true
  },
  {
    id: 'vid-3',
    title: 'Uji Daya Hantar Listrik: Elektrolit Kuat, Lemah, dan Non-Elektrolit',
    youtubeUrl: 'https://www.youtube.com/watch?v=t_98g0B4yFw',
    youtubeId: 't_98g0B4yFw',
    thumbnailUrl: 'https://img.youtube.com/vi/t_98g0B4yFw/hqdefault.jpg',
    category: 'Larutan Elektrolit',
    badge: 'Eksperimen Kelas X',
    duration: '05:15',
    date: '2 Agustus 2026',
    description: 'Rangkaian alat uji elektrolit sederhana dengan elektroda karbon dan lampu LED untuk membedakan derajat ionisasi larutan.',
    chemistryConcept: 'Disosiasi ion bebas dalam pelarut air yang menghantarkan arus listrik.',
    isPinned: true
  },
  {
    id: 'vid-4',
    title: 'Sifat Koloid: Efek Tyndall & Pembuatan Gel Sederhana di Rumah',
    youtubeUrl: 'https://www.youtube.com/watch?v=F3x94L3N5g8',
    youtubeId: 'F3x94L3N5g8',
    thumbnailUrl: 'https://img.youtube.com/vi/F3x94L3N5g8/hqdefault.jpg',
    category: 'Sistem Koloid',
    badge: 'Proyek Siswa',
    duration: '07:10',
    date: '24 Juli 2026',
    description: 'Perbandingan penghamburan berkas sinar laser pada larutan sejati (gula), koloid (susu/agar-agar), dan suspensi (kopi).',
    chemistryConcept: 'Efek Tyndall akibat ukuran partikel fase terdispersi berkisar antara 1 hingga 100 nm.',
    isPinned: false
  },
  {
    id: 'vid-5',
    title: 'Termokimia: Mengamati Reaksi Eksoterm & Endoterm Menggunakan Termometer',
    youtubeUrl: 'https://www.youtube.com/watch?v=eK9j1n_N-7g',
    youtubeId: 'eK9j1n_N-7g',
    thumbnailUrl: 'https://img.youtube.com/vi/eK9j1n_N-7g/hqdefault.jpg',
    category: 'Termokimia',
    badge: 'Praktikum Inti',
    duration: '05:50',
    date: '15 Juli 2026',
    description: 'Pengukuran kenaikan suhu pada pelarutan soda api (NaOH) dan penurunan suhu drastis pada pelarutan pupuk urea dalam kalorimeter sederhana.',
    chemistryConcept: 'Perubahan entalpi pelarutan (ΔH) dan perpindahan kalor antara sistem dan lingkungan.',
    isPinned: false
  }
];


