import { GalleryItem, DocumentItem, BlogPost, NaturalIndicator, TestSolution } from '../types';

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Eksperimen Indikator Alami: Ekstrak Kunyit & Perubahan pH',
    category: 'Indikator Alami',
    date: '14 Agustus 2026',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',
    badge: 'Populer di Kelas XI',
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
    badge: 'Eksperimen Viral Siswa',
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
    badge: 'Proyek Kearifan Lokal',
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
    pages: 42
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
    pages: 12
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
    pages: 4
  },
  {
    id: 'doc-4',
    title: 'Modul Kimia Karbon: Senyawa Hidrokarbon & Minyak Bumi',
    category: 'Modul Ajar',
    classGrade: 'Kelas XI',
    fileFormat: 'PDF',
    fileSize: '3.6 MB',
    downloads: 870,
    updatedDate: 'Juli 2026',
    summary: 'Tata nama IUPAC Alkana, Alkena, Alkuna, isomer rangka/posisi/geometri, reaksi pembakaran hidrokarbon, dan dampak lingkungan emisi gas buang.',
    topics: ['Kekhasan Atom Karbon', 'Tata Nama IUPAC', 'Isomerisme', 'Fraksi Minyak Bumi'],
    pages: 34
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
    pages: 28
  },
  {
    id: 'doc-6',
    title: 'Modul Struktur Atom & Sistem Periodik Unsur (SPU Modern)',
    category: 'Modul Ajar',
    classGrade: 'Kelas X',
    fileFormat: 'PDF',
    fileSize: '3.2 MB',
    downloads: 1120,
    updatedDate: 'Juni 2026',
    summary: 'Perkembangan model atom mekanika kuantum, bilangan kuantum (n, l, m, s), konfigurasi Aufbau & Hund, serta sifat keperiodikan unsur (jari-jari, energi ionisasi, afinitas).',
    topics: ['Model Mekanika Kuantum', 'Aturan Aufbau', 'Sifat Periodik', 'Elektron Valensi'],
    pages: 30
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
      name: 'Pak Hafiz, S.Pd., M.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
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
      name: 'Pak Hafiz, S.Pd., M.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
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
      name: 'Pak Hafiz, S.Pd., M.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
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
      name: 'Pak Hafiz, S.Pd., M.Si.',
      role: 'Guru Kimia & Edukator Sains SMA',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
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
    answer: 'Anda cukup mengklik tombol "Masuk ke Kelas Utama" di navigasi atas atau tombol CTA di berbagai bagian halaman ini. Anda akan diarahkan ke portal LMS interaktif yang memuat kuis gamifikasi, video materi berdurasi penuh, serta forum tanya jawab materi kimia.'
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
