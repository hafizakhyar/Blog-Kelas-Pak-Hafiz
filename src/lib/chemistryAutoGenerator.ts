// Comprehensive Chemistry Knowledge Base & Auto-Generator for Kelas Pak Hafiz

export interface GeneratedChemistryNote {
  category: string;
  classGrade: 'Kelas X' | 'Kelas XI' | 'Kelas XII' | 'Semua Tingkat';
  content: string;
  keyPoints: string[];
  tags: string[];
  suggestedPresetImageIndex?: number;
}

interface TopicRule {
  keywords: string[];
  category: string;
  classGrade: 'Kelas X' | 'Kelas XI' | 'Kelas XII' | 'Semua Tingkat';
  generate: (title: string) => {
    content: string;
    keyPoints: string[];
    tags: string[];
  };
}

const TOPIC_RULES: TopicRule[] = [
  // 1. Stoikiometri & Konsep Mol
  {
    keywords: ['mol', 'stoikiometri', 'avogadro', 'massa molar', 'rumus empiris', 'jembatan mol', 'pereaksi pembatas'],
    category: 'Materi Kimia',
    classGrade: 'Kelas X',
    generate: (title) => ({
      content: `Catatan pembelajaran "${title}". Konsep mol merupakan satuan dasar dalam stoikiometri untuk menghubungkan dunia mikroskopis (atom, molekul, ion) dengan pengukuran makroskopis di laboratorium (gram, liter, volume gas). Kunci menguasai stoikiometri adalah memahami 'Jembatan Mol': ubah seluruh besaran yang diketahui menjadi satuan mol terlebih dahulu sebelum melakukan perbandingan koefisien reaksi setara.`,
      keyPoints: [
        'Hubungan Massa: n = gram / Mr (atau Ar)',
        'Jumlah Partikel: N = n × L (L = 6,022 × 10²³ partikel/mol)',
        'Volume Gas STP (0°C, 1 atm): V = n × 22,4 Liter',
        'Persamaan Gas Ideal: P × V = n × R × T (R = 0,082 L.atm/mol.K)',
        'Perbandingan Mol dalam Reaksi = Perbandingan Koefisien Reaksi Setara',
        'Pereaksi Pembatas (PP): Hasil bagi (mol / koefisien) yang bernilai paling kecil habis bereaksi lebih dulu.'
      ],
      tags: ['Stoikiometri', 'KonsepMol', 'PerhitunganKimia', 'JembatanMol', 'KelasX']
    })
  },

  // 2. Asam Basa & Indikator
  {
    keywords: ['asam', 'basa', 'ph', 'poh', 'arrhenius', 'bronsted', 'lewis', 'indikator', 'lakmus', 'trayek'],
    category: 'Materi Kimia',
    classGrade: 'Kelas XI',
    generate: (title) => ({
      content: `Ringkasan konsep inti "${title}". Asam dan basa adalah senyawa kimia fundamental dalam kehidupan dan industri. Teori Bronsted-Lowry mendefinisikan asam sebagai donor proton (H⁺) dan basa sebagai akseptor proton (H⁺), membentuk pasangan asam-basa konjugasi. Kekuatan asam/basa ditentukan oleh derajat ionisasi (α) dan tetapan ionisasi (Ka atau Kb).`,
      keyPoints: [
        'Asam Kuat: [H⁺] = a × Ma | pH = -log [H⁺]',
        'Basa Kuat: [OH⁻] = b × Mb | pOH = -log [OH⁻] | pH = 14 - pOH',
        'Asam Lemah: [H⁺] = √(Ka × Ma) = α × Ma',
        'Basa Lemah: [OH⁻] = √(Kb × Mb) = α × Mb',
        'Hubungan Ka dan Kb: Kw = Ka × Kb = 10⁻¹⁴ pada 25°C',
        'Trayek pH Indikator: PP (8.3 - 10.0 / Tak Berwarna ke Merah Muda), BTB (6.0 - 7.6 / Kuning ke Biru).'
      ],
      tags: ['AsamBasa', 'HitungpH', 'IndikatorpH', 'TeoriKimia', 'KelasXI']
    })
  },

  // 3. Larutan Penyangga (Buffer)
  {
    keywords: ['buffer', 'penyangga', 'dapar', 'darah', 'kapasitas buffer'],
    category: 'Materi Kimia',
    classGrade: 'Kelas XI',
    generate: (title) => ({
      content: `Materi pembelajaran kelas "${title}". Larutan penyangga (buffer) memiliki kemampuan unik mempertahankan nilai pH relatif stabil meskipun ditambahkan sedikit asam kuat, sedikit basa kuat, atau diencerkan. Sistem buffer tersusun dari campuran asam lemah dengan basa konjugasinya, atau basa lemah dengan asam konjugasinya.`,
      keyPoints: [
        'Buffer Asam: [H⁺] = Ka × (mol Asam Lemah / mol Garam Basa Konjugasi)',
        'Buffer Basa: [OH⁻] = Kb × (mol Basa Lemah / mol Garam Asam Konjugasi)',
        'pH Penyangga: pH = pKa + log([Basa Konjugasi] / [Asam Lemah])',
        'Buffer dalam Tubuh Manusia: Sistem H₂CO₃ / HCO₃⁻ menjaga pH darah tetap berada pada rentang 7,35 - 7,45',
        'Kapasitas Maksimum tercapai saat konsentrasi asam lemah = basa konjugasinya (pH = pKa).'
      ],
      tags: ['LarutanBuffer', 'BufferAsam', 'BufferDarah', 'KelasXI', 'UTBK']
    })
  },

  // 4. Hidrolisis Garam
  {
    keywords: ['hidrolisis', 'garam', 'asam lemah basa kuat', 'asam kuat basa lemah'],
    category: 'Materi Kimia',
    classGrade: 'Kelas XI',
    generate: (title) => ({
      content: `Poin penting pembelajaran "${title}". Hidrolisis garam terjadi ketika ion dari asam lemah atau basa lemah bereaksi dengan molekul air menghasilkan ion H⁺ atau OH⁻. Kation dari basa kuat dan anion dari asam kuat tidak mengalami hidrolisis karena bersifat stabil dalam larutan air.`,
      keyPoints: [
        'Asam Kuat + Basa Kuat → Garam Netral (pH = 7, Tidak Terhidrolisis)',
        'Asam Kuat + Basa Lemah → Garam Asam: [H⁺] = √((Kw / Kb) × [Kation Garam]) | pH < 7',
        'Asam Lemah + Basa Kuat → Garam Basa: [OH⁻] = √((Kw / Ka) × [Anion Garam]) | pH > 7',
        'Asam Lemah + Basa Lemah → Terhidrolisis Total: [H⁺] = √((Kw × Ka) / Kb) | pH bergantung pada nilai Ka vs Kb',
        'Kh (Tetapan Hidrolisis) = Kw / Ka atau Kw / Kb.'
      ],
      tags: ['HidrolisisGaram', 'pHGaram', 'ReaksiKimia', 'KelasXI']
    })
  },

  // 5. Titrasi Asam Basa
  {
    keywords: ['titrasi', 'titran', 'titrat', 'titik ekivalen', 'titik akhir', 'buret', 'erlenmeyer'],
    category: 'Eksperimen Lab',
    classGrade: 'Kelas XI',
    generate: (title) => ({
      content: `Panduan praktikum & analisis "${title}". Titrasi asam basa adalah metode analisis kuantitatif volumetri untuk menentukan konsentrasi zat asam atau basa dengan mereaksikannya secara bertahap menggunakan larutan standar yang sudah diketahui konsentrasinya secara presisi.`,
      keyPoints: [
        'Rumus Ekivalen Titrasi: V₁ × M₁ × a = V₂ × M₂ × b (a & b = valensi asam/basa)',
        'Titik Ekivalen: Kondisi teoritis saat mol ekuivalen asam tepat sama dengan mol ekuivalen basa',
        'Titik Akhir Titrasi: Kondisi saat indikator mengalami perubahan warna visual teramati',
        'Pemilihan Indikator: Harus memiliki trayek perubahan warna yang memotong garis curam kurva titrasi',
        'Kiat Praktikum: Lakukan titrasi minimal triplo (3 kali) untuk mendapatkan rata-rata volume titran yang akurat.'
      ],
      tags: ['Titrasi', 'PraktikumLab', 'AnalisisKuantitatif', 'KurvaTitrasi', 'KelasXI']
    })
  },

  // 6. Termokimia & Hukum Hess
  {
    keywords: ['termokimia', 'hess', 'entalpi', 'eksoterm', 'endoterm', 'kalorimeter', 'energi ikatan', 'delta h', 'pembentukan standar'],
    category: 'Materi Kimia',
    classGrade: 'Kelas XI',
    generate: (title) => ({
      content: `Rangkuman materi "${title}". Termokimia mempelajari perubahan energi dan kalor (panas) yang menyertai suatu reaksi kimia. Sistem adalah bagian yang menjadi pusat perhatian, sedangkan lingkungan adalah segala sesuatu di luar sistem. Reaksi eksoterm melepaskan kalor ke lingkungan (ΔH < 0), sedangkan endoterm menyerap kalor (ΔH > 0).`,
      keyPoints: [
        'Kalor Reaksi: q = m × c × ΔT (c = kalor jenis) atau q = C × ΔT (C = kapasitas kalor)',
        'Hukum Hess: Perubahan entalpi reaksi hanya bergantung pada keadaan awal dan akhir pereaksi, tidak tergantung jalannya tahapan reaksi',
        'ΔH Reaksi dari ΔHf°: ΔH = Σ ΔHf°(Produk/Kanan) - Σ ΔHf°(Reaktan/Kiri)',
        'ΔH Reaksi dari Energi Ikatan: ΔH = Σ Energi Pemutusan Ikatan (Kiri) - Σ Energi Pembentukan Ikatan (Kanan)',
        'Diagram Tingkat Energi: Eksoterm panah ke bawah (ΔH negatif), Endoterm panah ke atas (ΔH positif).'
      ],
      tags: ['Termokimia', 'HukumHess', 'Entalpi', 'EnergiIkatan', 'KelasXI']
    })
  },

  // 7. Laju Reaksi & Teori Tumbukan
  {
    keywords: ['laju reaksi', 'orde reaksi', 'tumbukan', 'katalis', 'luas permukaan', 'suhu', 'konsentrasi', 'energi aktivasi'],
    category: 'Materi Kimia',
    classGrade: 'Kelas XI',
    generate: (title) => ({
      content: `Ringkasan materi "${title}". Laju reaksi menyatakan kecepatan berkurangnya konsentrasi pereaksi atau bertambahnya konsentrasi produk per satuan waktu. Reaksi kimia terjadi jika terjadi tumbukan efektif yang memenuhi orientasi geometri tepat dan memiliki energi tumbukan minimal melampaui Energi Aktivasi (Ea).`,
      keyPoints: [
        'Persamaan Laju Reaksi: v = k [A]^x [B]^y (x & y = orde reaksi, ditentukan HANYA lewat eksperimen)',
        'Faktor yang Mempercepat Laju: Konsentrasi tinggi, Luas permukaan besar, Suhu tinggi, Penambahan Katalis',
        'Pengaruh Suhu: Kenaikan suhu ΔT sebesar 10°C melipatgandakan laju menjadi n kali lipat: v₂ = v₁ × (n)^((T₂ - T₁)/ΔT)',
        'Peran Katalis: Menurunkan Energi Aktivasi (Ea) dengan menyediakan mekanisme jalur alternatif tanpa ikut terkonsumsi permanen',
        'Satuan Konstanta k: Bergantung pada total orde reaksi (x + y).'
      ],
      tags: ['LajuReaksi', 'OrdeReaksi', 'TeoriTumbukan', 'Katalis', 'KelasXI']
    })
  },

  // 8. Kesetimbangan Kimia & Asas Le Chatelier
  {
    keywords: ['kesetimbangan', 'le chatelier', 'kc', 'kp', 'pergeseran kesetimbangan', 'reversibel'],
    category: 'Materi Kimia',
    classGrade: 'Kelas XI',
    generate: (title) => ({
      content: `Konsep kunci "${title}". Kesetimbangan dinamis tercapai saat laju reaksi maju sama dengan laju reaksi balik, dan konsentrasi seluruh komponen tidak lagi berubah secara makroskopis. Asas Le Chatelier menyatakan jika pada sistem kesetimbangan diberikan gangguan (aksi), sistem akan bergeser untuk meminimalkan gangguan tersebut (reaksi).`,
      keyPoints: [
        'Tetapan Kesetimbangan Konsentrasi: Kc = ([C]^c × [D]^d) / ([A]^a × [B]^b) (Hanya fase gas (g) dan larutan (aq))',
        'Tetapan Tekanan Parsial: Kp = (P_C^c × P_D^d) / (P_A^a × P_B^b) (Hanya fase gas (g))',
        'Hubungan Kp dan Kc: Kp = Kc × (R × T)^Δn (Δn = koefisien gas produk - reaktan)',
        'Pengaruh Suhu: Suhu naik bergeser ke arah Endoterm (ΔH positif); Suhu turun bergeser ke arah Eksoterm (ΔH negatif)',
        'Pengaruh Volume & Tekanan: Volume diperkecil (Tekanan naik) bergeser ke arah koefisien gas lebih KECIL.'
      ],
      tags: ['KesetimbanganKimia', 'LeChatelier', 'TetapanKcKp', 'KelasXI']
    })
  },

  // 9. Redoks & Penyetaraan Reaksi
  {
    keywords: ['redoks', 'biloks', 'reduksi', 'oksidasi', 'setengah reaksi', 'pbo', 'oksidator', 'reduktor'],
    category: 'Materi Kimia',
    classGrade: 'Kelas XII',
    generate: (title) => ({
      content: `Panduan penyelesaian "${title}". Reaksi redoks melibatkan transfer elektron secara simultan antara reduktor (zat yang mengalami oksidasi/melepas elektron/kenaikan biloks) dan oksidator (zat yang mengalami reduksi/menerima elektron/penurunan biloks). Penyetaraan reaksi dapat dilakukan dengan metode PBO (Perubahan Bilangan Oksidasi) atau Metode Setengah Reaksi (Ion-Elektron).`,
      keyPoints: [
        'Oksidasi = Kenaikan Bilangan Oksidasi (Lepas Elektron); Reduksi = Penurunan Biloks (Terima Elektron)',
        'Aturan Utama Biloks: Unsur bebas = 0, F = -1, O = -2 (kecuali peroksida/OF₂), H = +1 (kecuali hidrida logam)',
        'Metode Setengah Reaksi Suasana Asam: Setarakan atom utama → Tambah H₂O pada sisi kurang O → Tambah H⁺ pada sisi kurang H → Setarakan muatan dengan e⁻',
        'Metode Setengah Reaksi Suasana Basa: Lakukan langkah asam lalu netralkan setiap ion H⁺ dengan ion OH⁻ pada kedua ruas',
        'Oksidator Kuat Populer: KMnO₄ (Permanganat), K₂Cr₂O₇ (Dikromat), HNO₃.'
      ],
      tags: ['Redoks', 'Biloks', 'PenyetaraanReaksi', 'OksidatorReduktor', 'KelasXII']
    })
  },

  // 10. Elektrokimia: Sel Volta & Deret Volta
  {
    keywords: ['sel volta', 'galvani', 'deret volta', 'potensial sel', 'e0 sel', 'anoda', 'katoda', 'korosi', 'spontan'],
    category: 'Materi Kimia',
    classGrade: 'Kelas XII',
    generate: (title) => ({
      content: `Ringkasan komprehensif "${title}". Sel Volta (Galvani) mengubah energi kimia dari reaksi redoks spontan menjadi energi listrik. Elektron mengalir dari Anoda (kutub negatif, tempat terjadinya reaksi oksidasi) menuju Katoda (kutub positif, tempat terjadinya reaksi reduksi) melalui kawat sirkuit luar.`,
      keyPoints: [
        'Jembatan Keledai Elektroda: KRAO (Katoda Reduksi, Anoda Oksidasi) & KNAP (Katoda Positif, Anoda Negatif pada Sel Volta)',
        'Potensial Sel Standar: E°sel = E°katoda (reduksi) - E°anoda (oksidasi)',
        'Kriteria Spontanitas: Reaksi berlangsung spontan jika nilai E°sel > 0 (Positif)',
        'Deret Volta: Li K Ba Ca Na Mg Al Mn Zn Cr Fe Cd Co Ni Sn Pb (H) Sb Bi Cu Hg Ag Pt Au (Makin ke kiri makin mudah dioksidasi/reduktor kuat)',
        'Notasi Sel Volta: Anoda | Ion Anoda || Ion Katoda | Katoda (Contoh: Zn | Zn²⁺ || Cu²⁺ | Cu).'
      ],
      tags: ['Elektrokimia', 'SelVolta', 'PotensialSel', 'DeretVolta', 'KelasXII']
    })
  },

  // 11. Elektrolisis & Hukum Faraday
  {
    keywords: ['elektrolisis', 'faraday', 'hukum faraday', 'penyepuhan', 'katoda anoda elektrolisis', 'endapan'],
    category: 'Materi Kimia',
    classGrade: 'Kelas XII',
    generate: (title) => ({
      content: `Materi pembelajaran "${title}". Sel Elektrolisis menggunakan energi arus listrik searah (DC) untuk memaksa terjadinya reaksi kimia redoks yang tidak spontan. Reaksi di elektroda ditentukan oleh jenis kation/anion larutan serta sifat elektroda (inert seperti Pt, C, Au vs non-inert).`,
      keyPoints: [
        'Hukum Faraday I: w = (e × i × t) / 96.500 = (Ar/valensi × i × t) / 96.500 (w = massa endapan dalam gram)',
        'Massa Ekivalen: e = Ar / n (n = jumlah elektron valensi)',
        'Hukum Faraday II: (w₁ / e₁) = (w₂ / e₂) pada rangkaian seri dengan muatan listrik sama',
        'Kutub Sel Elektrolisis: Katoda bermuatan Negatif (tetap Reduksi), Anoda bermuatan Positif (tetap Oksidasi)',
        'Aplikasi Industri: Pemurnian logam tembaga, penyepuhan emas (electroplating), dan produksi gas Cl₂/H₂.'
      ],
      tags: ['Elektrolisis', 'HukumFaraday', 'Penyepuhan', 'Elektrokimia', 'KelasXII']
    })
  },

  // 12. Struktur Atom, Konfigurasi Elektron, & Bilangan Kuantum
  {
    keywords: ['atom', 'bohr', 'mekanika kuantum', 'konfigurasi elektron', 'bilangan kuantum', 'aufbau', 'hund', 'pauli', 'orbital'],
    category: 'Materi Kimia',
    classGrade: 'Kelas X',
    generate: (title) => ({
      content: `Rangkuman konsep "${title}". Teori atom berkembang dari Dalton, Thomson, Rutherford, Bohr hingga Mekanika Kuantum (Schrodinger & Heisenberg). Elektron berada dalam orbital yang dipetakan oleh 4 bilangan kuantum: utama (n), azimut (l), magnetik (m), dan spin (s).`,
      keyPoints: [
        'Prinsip Aufbau: Pengisian elektron dimulai dari orbital berenergi terendah (1s, 2s, 2p, 3s, 3p, 4s, 3d, ...)',
        'Kaidah Hund: Elektron mengisi orbital degenerat secara paralel tunggal sebelum berpasangan',
        'Larangan Pauli: Tidak boleh ada dua elektron dalam satu atom memiliki 4 bilangan kuantum yang persis sama',
        'Nilai Bilangan Kuantum: n (tingkat kulit 1,2,3...), l (subkulit: s=0, p=1, d=2, f=3), m (-l s.d. +l), s (+1/2 atau -1/2)',
        'Gas Mulia Penyingkat: [He]=2, [Ne]=10, [Ar]=18, [Kr]=36, [Xe]=54.'
      ],
      tags: ['StrukturAtom', 'KonfigurasiElektron', 'BilanganKuantum', 'Aufbau', 'KelasX']
    })
  },

  // 13. Sistem Periodik Unsur (SPU) & Sifat Keperiodikan
  {
    keywords: ['spu', 'tabel periodik', 'keperiodikan', 'jari-jari atom', 'elektronegativitas', 'energi ionisasi', 'afinitas'],
    category: 'Materi Kimia',
    classGrade: 'Kelas X',
    generate: (title) => ({
      content: `Peta materi "${title}". Tabel Periodik Unsur Modern disusun berdasarkan kenaikan nomor atom dan kemiripan konfigurasi elektron valensi. Sifat keperiodikan unsur berubah secara teratur sepanjang golongan (vertikal) dan periode (horizontal).`,
      keyPoints: [
        'Jari-jari Atom: Dalam satu golongan (atas ke bawah) MAKIN BESAR; dalam satu periode (kiri ke kanan) MAKIN KECIL',
        'Energi Ionisasi, Elektronegativitas, & Afinitas Elektron: Dalam satu periode (kiri ke kanan) CENDERUNG NAIK; dalam satu golongan (atas ke bawah) CENDERUNG TURUN',
        'Pengecualian Energi Ionisasi: Golongan IIA > IIIA dan Golongan VA > VIA karena kestabilan subkulit penuh dan setengah penuh',
        'Golongan Utama: IA (Alkali), IIA (Alkali Tanah), VIIA (Halogen), VIIIA (Gas Mulia)',
        'Unsur Paling Elektronegatif: Fluorin (F = 4,0 skala Pauling).'
      ],
      tags: ['TabelPeriodik', 'SPU', 'SifatKeperiodikan', 'JariJariAtom', 'KelasX']
    })
  },

  // 14. Ikatan Kimia & Bentuk Geometri Molekul (VSEPR / Hibridisasi)
  {
    keywords: ['ikatan kimia', 'kovalen', 'ionik', 'logam', 'vsepr', 'hibridisasi', 'polar', 'nonpolar', 'bentuk molekul', 'lewis'],
    category: 'Materi Kimia',
    classGrade: 'Kelas X',
    generate: (title) => ({
      content: `Ringkasan materi "${title}". Ikatan kimia terbentuk agar atom-atom mencapai kestabilan konfigurasi gas mulia (oktet/duplet). Ikatan ionik terbentuk akibat serah terima elektron antara logam dan non-logam, sedangkan ikatan kovalen terbentuk akibat pemakaian bersama pasangan elektron. Teori VSEPR memprediksi bentuk geometri 3D molekul berdasarkan tolakan pasangan elektron ikatan (PEI) dan pasangan elektron bebas (PEB).`,
      keyPoints: [
        'Rumus Tipe Molekul VSEPR: AX_n E_m (n = PEI, m = PEB)',
        'Geometri Populer: AX₂ (Linear, 180°), AX₃ (Trigonal Planar, 120°), AX₄ (Tetrahedral, 109,5°), AX₃E (Trigonal Piramida / NH₃), AX₂E₂ (Bengkok / H₂O)',
        'Kekuatan Tolakan: PEB-PEB > PEB-PEI > PEI-PEI (keberadaan PEB menekan sudut ikatan)',
        'Kepolaran: Polar memiliki PEB pada atom pusat atau persebaran dipol asimetris (contoh: H₂O, NH₃); Nonpolar simetris tanpa PEB (contoh: CH₄, CO₂)',
        'Hibridisasi: sp (linear), sp² (trigonal planar), sp³ (tetrahedral), sp³d (trigonal bipiramida), sp³d² (oktahedral).'
      ],
      tags: ['IkatanKimia', 'BentukMolekul', 'VSEPR', 'Hibridisasi', 'KovalenPolar', 'KelasX']
    })
  },

  // 15. Sifat Koligatif Larutan
  {
    keywords: ['koligatif', 'tekanan uap', 'titik didih', 'titik beku', 'osmotik', 'van\'t hoff', 'vant hoff', 'raoult', 'molalitas'],
    category: 'Materi Kimia',
    classGrade: 'Kelas XII',
    generate: (title) => ({
      content: `Ringkasan rumus & aplikasi "${title}". Sifat koligatif larutan bergantung semata-mata pada jumlah partikel zat terlarut dalam sejumlah pelarut tertentu, bukan pada jenis partikelnya. Meliputi penurunan tekanan uap (ΔP), kenaikan titik didih (ΔTb), penurunan titik beku (ΔTf), dan tekanan osmotik (π). Untuk zat elektrolit, selalu kalikan dengan faktor Van't Hoff i = 1 + (n - 1)α.`,
      keyPoints: [
        '1. Penurunan Tekanan Uap: ΔP = P° × Xt | P = P° × Xp (Hukum Raoult)',
        '2. Kenaikan Titik Didih: ΔTb = m × Kb × i | Tb = Tb° + ΔTb',
        '3. Penurunan Titik Beku: ΔTf = m × Kf × i | Tf = Tf° - ΔTf',
        '4. Tekanan Osmotik: π = M × R × T × i (R = 0,082 L.atm/mol.K)',
        'Molalitas: m = (gram / Mr) × (1000 / p_gram_pelarut)',
        'Aplikasi Kehidupan: Mencairkan salju dengan garam, etilen glikol radiator, cairan infus isotonik tubuh, dan desalinasi reverse osmosis.'
      ],
      tags: ['SifatKoligatif', 'PenurunanTitikBeku', 'TekananOsmotik', 'FaktorVantHoff', 'KelasXII']
    })
  },

  // 15. Kimia Karbon & Gugus Fungsi Organik
  {
    keywords: ['karbon', 'alkana', 'alkena', 'alkuna', 'alkohol', 'eter', 'aldehid', 'keton', 'asam karboksilat', 'ester', 'haloalkana', 'isomer'],
    category: 'Materi Kimia',
    classGrade: 'Kelas XII',
    generate: (title) => ({
      content: `Materi intisari "${title}". Senyawa organik karbon diklasifikasikan berdasarkan gugus fungsi yang terikat pada rantai karbonnya. Gugus fungsi menentukan sifat fisika, titik didih, kelarutan, serta reaktivitas kimia khas masing-masing homolog.`,
      keyPoints: [
        'Alkohol (-OH) berisomer fungsi dengan Eter (-O-): C_n H_{2n+2} O',
        'Aldehid (-CHO) berisomer fungsi dengan Keton (-CO-): C_n H_{2n} O',
        'Asam Karboksilat (-COOH) berisomer fungsi dengan Ester (-COO-): C_n H_{2n} O₂',
        'Uji Pembeda Khas: Fehling / Tollens bereaksi positif dengan Aldehid (cermin perak), negatif dengan Keton',
        'Reaksi Esterifikasi: Asam Karboksilat + Alkohol ⇌ Ester + Air (Katalis H₂SO₄ pekat)',
        'Titik Didih: Alkohol dan Asam Karboksilat memiliki titik didih tinggi karena membentuk Ikatan Hidrogen antarmolekul.'
      ],
      tags: ['KimiaOrganik', 'GugusFungsi', 'Isomer', 'AlkanaAlkena', 'Esterifikasi', 'KelasXII']
    })
  },

  // 16. Benzena & Turunannya
  {
    keywords: ['benzena', 'aromatik', 'toluena', 'anilina', 'fenol', 'nitrobenzena', 'asam benzoat', 'orto', 'meta', 'para'],
    category: 'Materi Kimia',
    classGrade: 'Kelas XII',
    generate: (title) => ({
      content: `Peta materi "${title}". Benzena (C₆H₆) merupakan senyawa hidrokarbon aromatik siklik tak jenuh yang sangat stabil akibat resonansi elektron terdelokalisasi pada cincin heksagonalnya. Karena kestabilan resonansi, benzena lebih mudah mengalami reaksi substitusi elektrofilik daripada reaksi adisi.`,
      keyPoints: [
        'Struktur Benzena: Kekule C₆H₆ dengan ikatan rangkap terdelokalisasi',
        'Turunan Monosubstitusi Populer: Toluena (-CH₃), Fenol (-OH / bersifat asam lemah & desinfektan), Anilina (-NH₂ / bahan pewarna diazo), Asam Benzoat (-COOH / pengawet)',
        'Posisi Disubstitusi: Orto (1,2), Meta (1,3), Para (1,4)',
        'Reaksi Substitusi Benzena: Halogenasi (FeCl₃), Nitrasi (HNO₃ + H₂SO₄ pekat), Sulfonasi (H₂SO₄ berasap), Alkilasi Friedel-Crafts (R-Cl + AlCl₃)',
        'Turunan Eksplosif & Polimer: TNT (Trinitrotoluena) dan Stirena (bahan polistirena).'
      ],
      tags: ['Benzena', 'SenyawaAromatik', 'TurunanBenzena', 'Resonansi', 'KelasXII']
    })
  },

  // 17. Sifat Koligatif Larutan
  {
    keywords: ['koligatif', 'penurunan tekanan uap', 'kenaikan titik didih', 'penurunan titik beku', 'tekanan osmosis', 'vant hoff', 'roult'],
    category: 'Materi Kimia',
    classGrade: 'Kelas XII',
    generate: (title) => ({
      content: `Ringkasan materi "${title}". Sifat koligatif larutan adalah sifat larutan yang hanya bergantung pada konsentrasi atau jumlah partikel zat terlarut, dan sama sekali tidak bergantung pada jenis zat terlarut. Untuk larutan elektrolit, perhitungannya dikalikan dengan Faktor Van't Hoff (i).`,
      keyPoints: [
        'Faktor Van\'t Hoff: i = 1 + (n - 1)α (n = jumlah ion saat terurai)',
        'Penurunan Tekanan Uap (Hukum Raoult): ΔP = P° × Xt | P = P° × Xp',
        'Kenaikan Titik Didih: ΔTb = m × Kb × i | Tb = Tb° + ΔTb (Tb° air = 100°C)',
        'Penurunan Titik Beku: ΔTf = m × Kf × i | Tf = Tf° - ΔTf (Tf° air = 0°C)',
        'Tekanan Osmosis: π = M × R × T × i (R = 0,082 L.atm/mol.K)',
        'Aplikasi Kehidupan: Pembuatan es krim putar (penurunan titik beku), garam penabur salju, dan cairan infus isotonik darah.'
      ],
      tags: ['SifatKoligatif', 'VantHoff', 'TitikDidih', 'Osmosis', 'KelasXII']
    })
  },

  // 18. Sistem Koloid
  {
    keywords: ['koloid', 'efek tyndall', 'gerak brown', 'koagulasi', 'adsorpsi', 'dialisis', 'emulsi', 'aerosol', 'sol'],
    category: 'Materi Kimia',
    classGrade: 'Kelas XI',
    generate: (title) => ({
      content: `Rangkuman konsep "${title}". Koloid adalah bentuk campuran heterogen dua atau lebih zat di mana ukuran partikel terdispersi berada di antara larutan sejati dan suspensi (1 - 100 nm). Koloid memiliki sifat-sifat optik dan kinetik yang unik serta banyak dimanfaatkan dalam industri kosmetik, farmasi, dan pengolahan air.`,
      keyPoints: [
        'Jenis Koloid: Sol (padat dlm cair), Sol Padat, Emulsi (cair dlm cair), Busa (gas dlm cair), Aerosol (padat/cair dlm gas)',
        'Efek Tyndall: Penghamburan berkas cahaya oleh partikel koloid (contoh: sorot lampu mobil saat berkabut)',
        'Gerak Brown: Gerakan acak zig-zag partikel koloid akibat tumbukan tak seimbang dengan medium pendispersi',
        'Adsorpsi: Penyerapan ion/molekul pada permukaan partikel koloid (contoh: pemutihan gula tebu dengan karbon aktif)',
        'Koagulasi: Penggumpalan partikel koloid akibat penambahan elektrolit atau pemanasan (contoh: penjernihan air dengan tawas Al₂(SO₄)₃).'
      ],
      tags: ['SistemKoloid', 'EfekTyndall', 'Koagulasi', 'Adsorpsi', 'KelasXI']
    })
  },

  // 19. Tips Belajar Kimia / Mindset / Teknik Belajar
  {
    keywords: ['tips belajar', 'feynman', 'mindset', 'trik', 'cara cepat', 'menghafal', 'metode', 'belajar efektif', 'mind map', 'flashcard', 'strategi'],
    category: 'Tips Belajar & Mindset',
    classGrade: 'Semua Tingkat',
    generate: (title) => ({
      content: `Panduan strategi belajar "${title}". Kimia sering dianggap sulit karena menggabungkan konsep pemahaman abstrak mikroskopis dengan perhitungan matematis. Kunci sukses belajar kimia bukan menghafal rumus secara mekanis, melainkan memahami logika di balik hukum alam yang mendasarinya dan memvisualisasikan reaksi partikelnya.`,
      keyPoints: [
        'Visualisasi Molekuler: Jangan hanya melihat simbol huruf (C, H, O), bayangkan bagaimana atom saling berikatan dan bertukar elektron secara 3D.',
        'Kuasai Pondasi Pertama: Pastikan lancar menuliskan rumus senyawa, tata nama, menyetarakan reaksi kimia, dan menghitung mol sebelum masuk materi lanjutan.',
        'Teknik Feynman: Jelaskan konsep yang baru kamu pelajari kepada teman atau dirimu sendiri dengan bahasa sederhana tanpa contekan buku.',
        'Latihan Bertahap: Kerjakan 3 soal dasar untuk memantapkan konsep, lalu 2 soal variasi tipe UTBK/SNBT untuk melatih fleksibilitas berpikir.',
        'Buat Catatan Ringkas Peta Konsep (Mind Map): Hubungkan satu bab dengan bab lain, karena kimia adalah ilmu yang saling terhubung.'
      ],
      tags: ['TipsBelajar', 'MindsetKimia', 'MetodeFeynman', 'StrategiUTBK', 'SemuaTingkat']
    })
  }
];

/**
 * Intelligent generator that creates rich description, key formula points, and tags
 * directly from the note title provided by Pak Hafiz!
 */
export function generateChemistryContentFromTitle(
  title: string,
  preferredCategory?: string,
  preferredGrade?: 'Kelas X' | 'Kelas XI' | 'Kelas XII' | 'Semua Tingkat'
): GeneratedChemistryNote {
  if (!title || title.trim() === '') {
    return {
      category: preferredCategory || 'Materi Kimia',
      classGrade: preferredGrade || 'Semua Tingkat',
      content: '',
      keyPoints: [''],
      tags: ['KimiaSMA', 'CatatanPakHafiz']
    };
  }

  const normalizedTitle = title.toLowerCase();

  // 1. Try to find an exact matching topic rule
  for (const rule of TOPIC_RULES) {
    const match = rule.keywords.some((kw) => normalizedTitle.includes(kw));
    if (match) {
      const generated = rule.generate(title.trim());
      return {
        category: preferredCategory && preferredCategory !== 'Materi Kimia' ? preferredCategory : rule.category,
        classGrade: preferredGrade && preferredGrade !== 'Semua Tingkat' ? preferredGrade : rule.classGrade,
        content: generated.content,
        keyPoints: generated.keyPoints,
        tags: generated.tags
      };
    }
  }

  // 2. Fallback smart dynamic generator for any custom title entered by the teacher
  const words = title.trim().split(/\s+/);
  const cleanTags = words
    .filter((w) => w.length > 3 && !['dan', 'yang', 'untuk', 'dengan', 'pada', 'dari', 'atau', 'cara', 'trik', 'cepat'].includes(w.toLowerCase()))
    .slice(0, 4)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, ''));

  return {
    category: preferredCategory || (normalizedTitle.includes('praktikum') || normalizedTitle.includes('uji') || normalizedTitle.includes('lab') ? 'Eksperimen Lab' : 'Materi Kimia'),
    classGrade: preferredGrade || (normalizedTitle.includes('10') || normalizedTitle.includes('x') ? 'Kelas X' : normalizedTitle.includes('11') || normalizedTitle.includes('xi') ? 'Kelas XI' : normalizedTitle.includes('12') || normalizedTitle.includes('xii') ? 'Kelas XII' : 'Semua Tingkat'),
    content: `Rangkuman materi dan catatan papan tulis "${title.trim()}". Pembahasan ini menguraikan konsep dasar, prinsip kerja ilmiah, serta langkah sistematis dalam memahami topik ini secara tuntas. Pelajari intisari konsep dan rumus kunci di bawah ini untuk memperkuat pemahaman kimia Anda.`,
    keyPoints: [
      `Konsep Utama: Pahami definisi fundamental dan hukum kimia yang mendasari materi "${title.trim()}".`,
      'Analisis Persamaan: Perhatikan hubungan variabel dan rumus perhitungan terkait secara terstruktur.',
      'Aplikasi Soal: Identifikasi data yang diketahui, besaran yang ditanyakan, dan pilih rumus yang paling efisien.',
      'Tips Pengajar: Hubungkan teori dengan fenomena nyata atau eksperimen laboratorium untuk pemahaman mendalam.'
    ],
    tags: [
      ...cleanTags,
      'KimiaSMA',
      'CatatanPakHafiz',
      'MateriKimia'
    ].filter((t, i, arr) => t && arr.indexOf(t) === i)
  };
}

/**
 * Suggested popular chemistry topic ideas for 1-click creation
 */
export const QUICK_CHEMISTRY_TOPIC_PRESETS = [
  {
    title: 'Peta Konsep & Karakteristik Ikatan Kimia: Ionik, Kovalen, dan Logam',
    category: 'Struktur Atom & Ikatan',
    grade: 'Kelas X' as const,
    badge: 'Ikatan Kimia'
  },
  {
    title: 'Ringkasan Rumus & Penerapan Sifat Koligatif Larutan (Elektrolit & Non-Elektrolit)',
    category: 'Sifat Koligatif Larutan',
    grade: 'Kelas XII' as const,
    badge: 'Sifat Koligatif'
  },
  {
    title: 'Master Tren Sifat Periodik Unsur & Pengaruh Muatan Inti Efektif',
    category: 'Struktur Atom & Sifat Periodik',
    grade: 'Kelas X' as const,
    badge: 'Sifat Periodik'
  },
  {
    title: 'Trik Jembatan Mol & Stoikiometri',
    category: 'Materi Kimia',
    grade: 'Kelas X' as const,
    badge: 'Stoikiometri'
  },
  {
    title: 'Menghitung pH Asam Kuat, Lemah, & Indikator',
    category: 'Materi Kimia',
    grade: 'Kelas XI' as const,
    badge: 'Asam Basa'
  },
  {
    title: 'Konsep Larutan Penyangga (Buffer) & pH Darah',
    category: 'Materi Kimia',
    grade: 'Kelas XI' as const,
    badge: 'Buffer'
  },
  {
    title: 'Penyetaraan Redoks Cepat Metode Setengah Reaksi',
    category: 'Materi Kimia',
    grade: 'Kelas XII' as const,
    badge: 'Redoks'
  },
  {
    title: 'Sel Volta, Deret Volta, & Perhitungan E°sel',
    category: 'Materi Kimia',
    grade: 'Kelas XII' as const,
    badge: 'Sel Volta'
  },
  {
    title: 'Bentuk Geometri Molekul Teori VSEPR & Hibridisasi',
    category: 'Materi Kimia',
    grade: 'Kelas X' as const,
    badge: 'VSEPR'
  },
  {
    title: 'Hukum Hess & Perhitungan Entalpi Reaksi Termokimia',
    category: 'Materi Kimia',
    grade: 'Kelas XI' as const,
    badge: 'Termokimia'
  },
  {
    title: 'Teknik Belajar Feynman Menguasai Kimia Tanpa Hafalan',
    category: 'Tips Belajar & Mindset',
    grade: 'Semua Tingkat' as const,
    badge: 'Tips Belajar'
  }
];

// ==========================================
// LAB EXPERIMENTS AUTO-GENERATOR & PRESETS
// ==========================================

export interface GeneratedLabExperiment {
  category: string;
  badge: string;
  description: string;
  chemistryConcept: string;
  materials: string[];
  steps: string[];
  results: string;
  suggestedSampleImage?: string;
}

export const LAB_CATEGORY_SUGGESTIONS = [
  'Indikator Alami',
  'Eksperimen Lab',
  'Karya Siswa',
  'Titrasi Asam Basa',
  'Uji Elektrolit',
  'Reaksi Redoks',
  'Termokimia & Kalorimetri',
  'Laju Reaksi & Katalis',
  'Kesetimbangan Kimia',
  'Koloid & Efek Tyndall',
  'Uji Nyala Api Logam',
  'Elektrolisis & Elektrokimia',
  'Kimia Organik & Esterifikasi',
  'Pemisahan & Kristalisasi'
];

export const LAB_BADGE_SUGGESTIONS = [
  'Praktikum Siswa',
  'Eksperimen Mandiri',
  'Demo Guru',
  'Praktikum Kelas X',
  'Praktikum Kelas XI',
  'Praktikum Kelas XII',
  'Proyek Sains',
  'Uji Cepat Lab'
];

interface LabExperimentRule {
  keywords: string[];
  category: string;
  badge: string;
  generate: (title: string) => {
    description: string;
    chemistryConcept: string;
    materials: string[];
    steps: string[];
    results: string;
  };
}

const LAB_EXPERIMENT_RULES: LabExperimentRule[] = [
  // 1. Indikator Alami Asam Basa (Kunyit, Telang, Kol Ungu, Manggis, dll)
  {
    keywords: ['kunyit', 'telang', 'indikator alami', 'kol ungu', 'manggis', 'mahkota bunga', 'bunga sepatu', 'daun pandan', 'alami'],
    category: 'Indikator Alami',
    badge: 'Praktikum Siswa',
    generate: (title) => ({
      description: `Praktikum "${title}". Bertujuan untuk mengidentifikasi sifat asam dan basa berbagai larutan rumah tangga (cuka, air jeruk, air sabun, detergen, pasta gigi) menggunakan ekstrak zat warna alami tumbuhan sebagai indikator alternatif yang ramah lingkungan.`,
      chemistryConcept: `Perubahan warna terjadi akibat modifikasi struktur molekul pigmen (seperti antosianin pada bunga telang/kol ungu atau kurkuminoid pada kunyit) ketika terjadi pelepasan/penerimaan proton (H⁺) dalam media asam (pH < 7) dan basa (pH > 7).`,
      materials: [
        'Ekstrak tumbuhan (kunyit / bunga telang / kol ungu)',
        'Sampel asam (cuka dapur, perasan jeruk nipis)',
        'Sampel basa (air sabun, larutan detergen, baking soda)',
        'Sampel netral (air suling/akuades, larutan garam dapur)',
        'Plat tetes porselen, pipet tetes, tabung reaksi & rak'
      ],
      steps: [
        '1. Siapkan ekstrak bahan alami dengan menumbuk bahan dan mengekstraknya menggunakan sedikit akuades/alkohol.',
        '2. Teteskan masing-masing larutan uji (asam, basa, netral) sebanyak 3 tetes ke dalam lekukan plat tetes.',
        '3. Tambahkan 2 tetes ekstrak indikator alami ke setiap lekukan sampel uji.',
        '4. Aduk perlahan dan amati perubahan warna larutan yang terjadi secara seksama.',
        '5. Catat pergeseran warna dalam tabel pengamatan dan simpulkan trayek perubahan pH masing-masing sampel.'
      ],
      results: `Ekstrak kunyit tetap berwarna kuning cerah pada suasana asam/netral dan berubah menjadi merah kecokelatan pekat pada suasana basa. Ekstrak telang berwarna merah muda keunguan pada asam dan biru kehijauan pada basa.`
    })
  },

  // 2. Titrasi Asam Basa
  {
    keywords: ['titrasi', 'buret', 'erlenmeyer', 'titik ekivalen', 'netralisasi', 'hcl', 'naoh', 'standarisasi', 'fenolftalein'],
    category: 'Titrasi Asam Basa',
    badge: 'Praktikum Siswa',
    generate: (title) => ({
      description: `Eksperimen kuantitatif "${title}". Menentukan konsentrasi larutan asam/basa yang belum diketahui konsentrasinya melalui reaksi netralisasi bertahap menggunakan buret presisi dengan bantuan indikator visual penentu titik akhir titrasi.`,
      chemistryConcept: `Reaksi netralisasi stoikiometris: H⁺(aq) + OH⁻(aq) → H₂O(l). Titik ekivalen tercapai saat mol H⁺ tepat habis bereaksi dengan mol OH⁻: (V × M × a) asam = (V × M × b) basa.`,
      materials: [
        'Buret 50 mL dengan kran teflon & statif penjepit',
        'Labu Erlenmeyer 250 mL, pipet volume 10 mL & bulb filler',
        'Larutan standar NaOH 0,1 M (titran)',
        'Larutan sampel HCl atau asam cuka dapur (titrat)',
        'Indikator Fenolftalein (PP) 1%'
      ],
      steps: [
        '1. Bilas buret dengan larutan NaOH standar, kemudian isi buret hingga skala 0,00 mL tanpa gelembung udara.',
        '2. Pipet 10,0 mL larutan asam ke dalam labu Erlenmeyer menggunakan pipet volume.',
        '3. Tambahkan 2-3 tetes indikator PP ke dalam Erlenmeyer (larutan tetap tak berwarna).',
        '4. Lakukan titrasi dengan meneteskan NaOH perlahan sambil menggoyang Erlenmeyer secara konstan.',
        '5. Hentikan titrasi tepat saat muncul warna merah muda pucat yang stabil selama minimal 15 detik (titik akhir titrasi), lalu catat volume NaOH terpakai.'
      ],
      results: `Titrasi berhasil mencapai titik akhir dengan warna merah muda seulas stabil pada penambahan volume titran yang konsisten dalam 3 kali percobaan (triplo).`
    })
  },

  // 3. Uji Larutan Elektrolit & Daya Hantar Listrik
  {
    keywords: ['elektrolit', 'daya hantar', 'lampu uji', 'ion', 'ionisasi', 'non-elektrolit', 'gelembung'],
    category: 'Uji Elektrolit',
    badge: 'Eksperimen Lab',
    generate: (title) => ({
      description: `Praktikum uji daya hantar listrik "${title}". Menguji dan mengelompokkan berbagai jenis larutan ke dalam elektrolit kuat, elektrolit lemah, dan non-elektrolit berdasarkan kemampuan menghantarkan arus listrik dan derajat ionisasinya.`,
      chemistryConcept: `Daya hantar listrik larutan ditentukan oleh keberadaan ion-ion bebas yang dapat bergerak (mobile ions) hasil ionisasi atau disosiasi solut: NaCl(s) → Na⁺(aq) + Cl⁻(aq). Senyawa kovalen non-polar tidak terionisasi (α = 0).`,
      materials: [
        'Alat uji elektrolit (rangkaian baterai/adaptor DC, lampu LED/bohlam, sakelar)',
        'Sepasang elektroda karbon / tembaga',
        'Gelas kimia 100 mL dan botol semprot akuades',
        'Sampel larutan: NaCl, HCl, NaOH, CH₃COOH, NH₄OH, larutan gula pasir, urea, alkohol 70%'
      ],
      steps: [
        '1. Rangkai alat uji elektrolit dan pastikan lampu menyala saat kedua elektroda saling disentuhkan.',
        '2. Masukkan 50 mL larutan uji ke dalam gelas kimia 100 mL.',
        '3. Celupkan kedua elektroda karbon ke dalam larutan (jangan saling bersentuhan).',
        '4. Amati nyala lampu (terang / redup / padam) dan pembentukan gelembung gas di sekitar elektroda.',
        '5. Bersihkan dan bilas elektroda dengan akuades serta keringkan sebelum menguji larutan berikutnya.'
      ],
      results: `Larutan elektrolit kuat (NaCl, HCl) menghasilkan nyala lampu terang benderang dan gelembung gas melimpah. Elektrolit lemah (CH₃COOH) lampu redup/padam dengan sedikit gelembung. Non-elektrolit (gula, alkohol) lampu padam tanpa gelembung gas.`
    })
  },

  // 4. Reaksi Redoks & Sel Volta
  {
    keywords: ['redoks', 'sel volta', 'paku', 'seng', 'tembaga', 'cuso4', 'zn', 'fe', 'deret volta', 'baterai buah', 'korosi'],
    category: 'Reaksi Redoks',
    badge: 'Praktikum Siswa',
    generate: (title) => ({
      description: `Eksperimen reaksi transfer elektron "${title}". Membuktikan spontanitas reaksi redoks serta menghasilkan energi listrik searah (arus DC) dari reaksi kimia spontan menggunakan pasangan elektroda logam dengan potensial reduksi berbeda.`,
      chemistryConcept: `Reaksi Redoks Spontan: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s). Logam Seng teroksidasi di Anoda (E° = -0,76 V), sedangkan ion Cu²⁺ tereduksi menjadi endapan tembaga di Katoda (E° = +0,34 V) menghasilkan beda potensial E°sel = +1,10 Volt.`,
      materials: [
        'Lempeng logam Seng (Zn) dan Lempeng Tembaga (Cu)',
        'Larutan CuSO₄ 0,1 M dan ZnSO₄ 0,1 M',
        'Gelas kimia, kabel penjepit buaya, Voltmeter digital / Multimeter',
        'Jembatan garam (pipa U berisi agar-agar + larutan KNO₃ atau kain saring)'
      ],
      steps: [
        '1. Bersihkan permukaan lempeng logam Zn dan Cu menggunakan amplas halus.',
        '2. Siapkan dua gelas kimia: satu berisi 50 mL CuSO₄ (katoda Cu) dan satu lagi berisi 50 mL ZnSO₄ (anoda Zn).',
        '3. Hubungkan kedua gelas kimia menggunakan jembatan garam.',
        '4. Pasang kabel voltmeter: kutub positif ke lempeng Cu dan kutub negatif ke lempeng Zn.',
        '5. Catat nilai beda potensial (Volt) yang tertera pada display voltmeter dan amati perubahan warna/endapan pada elektroda.'
      ],
      results: `Voltmeter menunjukkan tegangan positif berkisar 1,05 – 1,10 Volt. Lempeng tembaga mengalami penebalan akibat terbentuknya endapan tembaga kemerahan, sementara larutan CuSO₄ perlahan memudar.`
    })
  },

  // 5. Elektrolisis Larutan
  {
    keywords: ['elektrolisis', 'ki', 'kalium iodida', 'penyepuhan', 'katoda', 'anoda', 'gas h2', 'gas o2'],
    category: 'Elektrolisis & Elektrokimia',
    badge: 'Eksperimen Lab',
    generate: (title) => ({
      description: `Praktikum elektrokimia "${title}". Memanfaatkan energi listrik searah untuk menggerakkan reaksi kimia non-spontan, menguraikan senyawa ionik menjadi unsur-unsurnya, dan membuktikan hukum Faraday pada peristiwa elektrolisis.`,
      chemistryConcept: `Pada elektrolisis larutan KI dengan elektroda karbon: Katoda (Reduksi Air): 2H₂O(l) + 2e⁻ → H₂(g) + 2OH⁻(aq) [bersifat basa]. Anoda (Oksidasi I⁻): 2I⁻(aq) → I₂(aq) + 2e⁻ [larutan berubah kuning/cokelat iodin].`,
      materials: [
        'Pipa U kaca, statif dan klem',
        'Sepasang elektroda karbon (grafit pensil / baterai bekas)',
        'Catu daya DC (Power Supply) atau baterai kotak 9 Volt',
        'Larutan Kalium Iodida (KI) 0,2 M',
        'Indikator Fenolftalein (PP) dan Larutan Amilum / Tepung Kanji'
      ],
      steps: [
        '1. Masukkan larutan KI ke dalam pipa U hingga terisi sekitar 3/4 bagian.',
        '2. Pasang elektroda karbon di kedua mulut pipa U dan hubungkan ke kutub baterai/power supply.',
        '3. Alirkan arus listrik selama kurang lebih 3-5 menit dan amati reaksi di kedua kutub elektroda.',
        '4. Ambil 1 mL larutan dari ruang katoda, tetesi indikator PP (mengamati warna merah muda/basa).',
        '5. Ambil 1 mL larutan dari ruang anoda, tetesi larutan amilum (mengamati warna biru kehitaman/iodin).'
      ],
      results: `Di katoda terbentuk gelembung gas hidrogen dan larutan berubah merah muda saat ditetesi PP (terbentuk ion OH⁻). Di anoda larutan berubah kuning kecokelatan dan berubah biru tua saat ditambah amilum (terbentuk iodin I₂).`
    })
  },

  // 6. Laju Reaksi & Faktor yang Mempengaruhi
  {
    keywords: ['laju reaksi', 'na2s2o3', 'natrium tiosulfat', 'konsentrasi', 'suhu', 'katalis', 'luas permukaan', 'stopwatch', 'tanda silang'],
    category: 'Laju Reaksi & Katalis',
    badge: 'Praktikum Siswa',
    generate: (title) => ({
      description: `Eksperimen kinetika kimia "${title}". Mempelajari pengaruh variabel konsentrasi reaktan, suhu lingkungan, luas permukaan sentuh, dan katalisator terhadap kecepatan/laju suatu reaksi kimia berdasarkan teori tumbukan efektif.`,
      chemistryConcept: `Reaksi pengendapan belerang: Na₂S₂O₃(aq) + 2HCl(aq) → 2NaCl(aq) + H₂O(l) + SO₂(g) + S(s). Pembentukan endapan koloid belerang (S) yang keruh menghalangi pandangan tanda silang hitam. Laju reaksi berbanding terbalik dengan waktu reaksi: v = 1/t.`,
      materials: [
        'Larutan Na₂S₂O₃ 0,2 M (dan pengencerannya: 0,15 M; 0,1 M; 0,05 M)',
        'Larutan HCl 1 M atau 2 M',
        'Gelas Erlenmeyer 100 mL & gelas ukur 25 mL',
        'Kertas putih bergambar tanda silang hitam tebal (X)',
        'Stopwatch presisi, termometer laboratorium, pembakar spiritus'
      ],
      steps: [
        '1. Letakkan labu Erlenmeyer tepat di atas tanda silang hitam pada kertas putih.',
        '2. Masukkan 20 mL larutan Na₂S₂O₃ dengan konsentrasi tertentu ke dalam Erlenmeyer.',
        '3. Tambahkan 5 mL larutan HCl 1 M dan nyalakan stopwatch tepat saat kedua larutan bercampur.',
        '4. Goyang Erlenmeyer sekali lalu amati tanda silang dari arah atas labu.',
        '5. Hentikan stopwatch tepat saat tanda silang hitam sudah tidak tampak lagi akibat endapan belerang kuning keruh. Catat waktu reaksi.'
      ],
      results: `Semakin tinggi konsentrasi Na₂S₂O₃ dan semakin tinggi suhu larutan, semakin cepat waktu yang dibutuhkan untuk menutupi tanda silang (laju reaksi meningkat signifikan).`
    })
  },

  // 7. Sistem Koloid & Efek Tyndall
  {
    keywords: ['koloid', 'efek tyndall', 'hamburan cahaya', 'susu', 'emulsi', 'sabun', 'mayones', 'koagulasi', 'laser'],
    category: 'Koloid & Efek Tyndall',
    badge: 'Karya Siswa',
    generate: (title) => ({
      description: `Praktikum identifikasi campuran materi "${title}". Membedakan karakteristik larutan sejati, sistem koloid, dan suspensi kasar melalui uji hamburan berkas cahaya (Efek Tyndall) serta pembuatan sistem koloid secara kondensasi/dispersi.`,
      chemistryConcept: `Efek Tyndall adalah peristiwa penghamburan berkas sinar oleh partikel-partikel koloid (ukuran 1 - 100 nm). Partikel larutan sejati terlalu kecil (< 1 nm) sehingga meneruskan cahaya tanpa hamburan, sedangkan suspensi mengendap akibat gravitasi.`,
      materials: [
        'Penunjuk laser pointer merah / hijau atau senter LED fokus',
        'Gelas kimia bening 100 mL (3 buah)',
        'Sampel 1: Larutan gula pasir / garam dapur (Larutan Sejati)',
        'Sampel 2: Campuran susu cair / santan / larutan sabun (Koloid)',
        'Sampel 3: Campuran air dan tepung terigu / kopi (Suspensi)'
      ],
      steps: [
        '1. Isi ketiga gelas kimia masing-masing dengan 50 mL sampel: larutan gula (gelas 1), susu encer (gelas 2), dan air tepung (gelas 3).',
        '2. Tempatkan gelas di ruangan dengan pencahayaan redup agar lintasan berkas sinar terlihat kontras.',
        '3. Sorotkan berkas laser pointer secara horizontal menembus cairan di dalam masing-masing gelas kimia.',
        '4. Amati apakah lintasan berkas cahaya tampak jelas di dalam cairan dari arah tegak lurus (90°).',
        '5. Dokumentasikan dengan foto dan simpulkan jenis campuran berdasarkan sifat optik Tyndall.'
      ],
      results: `Pada larutan gula berkas laser tidak terlihat di dalam larutan (diteruskan). Pada susu/koloid lintasan berkas cahaya tampak berpendar sangat jelas (Efek Tyndall positif). Pada suspensi berkas cahaya terhambur kuat disertai pengendapan partikel kasar.`
    })
  },

  // 8. Uji Nyala Logam Alkali & Alkali Tanah
  {
    keywords: ['uji nyala', 'warna nyala', 'kation', 'alkali', 'alkali tanah', 'kawat nikrom', 'natrium', 'kalium', 'kalsium', 'stronsium', 'barium', 'tembaga'],
    category: 'Uji Nyala Api Logam',
    badge: 'Eksperimen Lab',
    generate: (title) => ({
      description: `Eksperimen uji spektroskopi emisi kualitatif "${title}". Mengidentifikasi keberadaan kation logam tertentu dalam garam sampel berdasarkan karakteristik pancaran warna nyala api yang khas saat tereksitasi panas pembakar Bunsen.`,
      chemistryConcept: `Panas api mengeksitasi elektron kation logam ke tingkat energi lebih tinggi (keadaan tereksitasi). Saat elektron kembali relaksasi ke keadaan dasar (ground state), energi dilepaskan dalam bentuk foton cahaya tampak dengan panjang gelombang (λ) spesifik: ΔE = h × c / λ.`,
      materials: [
        'Kawat Nikrom (Nikel-Kromium) atau Platina bertangkai kaca',
        'Pembakar Bunsen / Pembakar Spiritus dengan nyala biru tak berjelaga',
        'Asam Klorida pekat (HCl pekat) dalam kaca arloji (untuk pembersih kawat)',
        'Garam sampel: NaCl, KCl, CaCl₂, SrCl₂, BaCl₂, CuCl₂ / CuSO₄'
      ],
      steps: [
        '1. Bersihkan kawat nikrom dengan mencelupkannya ke dalam HCl pekat, lalu bakar di zona oksidasi api Bunsen hingga tidak muncul warna nyala asing.',
        '2. Celupkan ujung kawat nikrom bersih ke dalam HCl pekat lalu sentuhkan ke serbuk garam sampel yang diuji.',
        '3. Masukkan kawat yang memuat sedikit garam ke bagian bawah nyala api biru yang paling panas.',
        '4. Amati dan catat warna khas nyala api yang dipancarkan seketika.',
        '5. Bersihkan kembali kawat nikrom sebelum menguji sampel garam berikutnya.'
      ],
      results: `Warna nyala teramati: Natrium (Na⁺) = Kuning keemasan terang; Kalium (K⁺) = Ungu lilac; Kalsium (Ca²⁺) = Merah jingga/bata; Stronsium (Sr²⁺) = Merah kirmizi tua; Barium (Ba²⁺) = Hijau apel; Tembaga (Cu²⁺) = Hijau kebiruan.`
    })
  },

  // 9. Termokimia & Reaksi Eksoterm / Endoterm
  {
    keywords: ['termokimia', 'kalorimeter', 'eksoterm', 'endoterm', 'entalpi', 'suhu naik', 'suhu turun', 'urea', 'pelarutan naoh', 'barium hidroksida'],
    category: 'Termokimia & Kalorimetri',
    badge: 'Praktikum Siswa',
    generate: (title) => ({
      description: `Praktikum pengukuran kalor reaksi "${title}". Membedakan dan mengukur perubahan entalpi (ΔH) pada reaksi kimia/pelarutan yang melepaskan kalor ke lingkungan (eksoterm) dan menyerap kalor dari lingkungan (endoterm).`,
      chemistryConcept: `Eksoterm: Sistem melepas kalor ke lingkungan, entalpi sistem berkurang (ΔH < 0, suhu lingkungan naik: T₂ > T₁). Endoterm: Sistem menyerap kalor dari lingkungan, entalpi sistem bertambah (ΔH > 0, suhu lingkungan turun: T₂ < T₁). Kalor reaksi dihitung: q = m × c × ΔT.`,
      materials: [
        'Kalorimeter sederhana (cangkir styrofoam tertutup berlubang)',
        'Termometer laboratorium dengan ketelitian 0,1°C',
        'Gelas ukur 50 mL dan pengaduk kaca',
        'Bahan eksoterm: Pelet NaOH padat / Bubuk Kalsium Oksida (Kapur tohor)',
        'Bahan endoterm: Butiran Pupuk Urea CO(NH₂)₂ / Garam Amonium Nitrat / Amonium Klorida',
        'Akuades suhu kamar'
      ],
      steps: [
        '1. Masukkan 50 mL akuades ke dalam kalorimeter styrofoam dan ukur suhu awalnya (T₁) secara konstan.',
        '2. Timbang 5 gram sampel zat padat (misal: NaOH untuk eksoterm atau Urea untuk endoterm).',
        '3. Masukkan zat padat ke dalam kalorimeter, tutup rapat, dan aduk perlahan secara merata.',
        '4. Pantau perubahan suhu pada termometer dan catat suhu maksimum atau minimum (T₂) yang tercapai.',
        '5. Hitung perubahan suhu (ΔT = T₂ - T₁) dan hitung besar kalor pelarutan per mol zat.'
      ],
      results: `Pelarutan NaOH menghasilkan kenaikan suhu drastis (reaksi eksoterm, wadah terasa hangat/panas). Pelarutan urea menghasilkan penurunan suhu signifikan hingga terasa dingin membekukan di dinding gelas (reaksi endoterm).`
    })
  },

  // 10. Kimia Organik & Sintesis Ester (Aroma Buah)
  {
    keywords: ['ester', 'esterifikasi', 'aroma', 'minyak', 'alkohol', 'asam karboksilat', 'asam asetat', 'etanol', 'h2so4', 'organik'],
    category: 'Kimia Organik & Esterifikasi',
    badge: 'Karya Siswa',
    generate: (title) => ({
      description: `Eksperimen sintesis senyawa organik "${title}". Melakukan reaksi esterifikasi Fischer antara asam karboksilat dan alkohol dengan katalis asam kuat untuk menghasilkan senyawa ester yang memiliki wangi/aroma buah-buahan yang khas.`,
      chemistryConcept: `Reaksi Esterifikasi Fischer: R-COOH + R'-OH ⇌ (H₂SO₄ pekat) ⇌ R-COO-R' + H₂O. Reaksi bersifat reversibel dan pelepasan molekul air dibantu oleh asam sulfat pekat yang juga bertindak sebagai zat pendehidrasi.`,
      materials: [
        'Tabung reaksi tahan panas, penjepit kayu, dan rak tabung',
        'Penangas air (water bath) dan pembakar spiritus',
        'Asam Asetat glasial (CH₃COOH) dan Etanol 96% / Amil Alkohol',
        'Asam Sulfat pekat (H₂SO₄ pekat) sebagai katalisator',
        'Gelas kimia berisi air dingin untuk uji aroma'
      ],
      steps: [
        '1. Masukkan 2 mL asam asetat glasial dan 2 mL etanol ke dalam tabung reaksi bersih dan kering.',
        '2. Tambahkan secara hati-hati 3-4 tetes asam sulfat pekat (H₂SO₄ pekat) melalui dinding tabung.',
        '3. Panaskan tabung reaksi di dalam penangas air mendidih selama 5-7 menit.',
        '4. Tuangkan campuran reaksi ke dalam gelas kimia yang berisi 30 mL air dingin.',
        '5. Kibaskan uap di atas gelas kimia ke arah hidung dengan telapak tangan dan kenali aroma buah (seperti pisang / apel / permen karet) yang terbentuk.'
      ],
      results: `Terbentuk lapisan minyak tipis di permukaan air dingin yang memancarkan aroma wangi harum manis khas ester buah (Etil Asetat / aroma buah pir/apel).`
    })
  }
];

/**
 * Generate full laboratory experiment data from title
 */
export function generateLabExperimentFromTitle(
  title: string,
  currentCategory?: string,
  currentBadge?: string
): GeneratedLabExperiment {
  const cleanTitle = title.trim();
  const lower = cleanTitle.toLowerCase();

  // Find matching rule
  for (const rule of LAB_EXPERIMENT_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      const generated = rule.generate(cleanTitle);
      return {
        category: currentCategory && currentCategory !== 'Semua' ? currentCategory : rule.category,
        badge: currentBadge && currentBadge.trim() ? currentBadge : rule.badge,
        description: generated.description,
        chemistryConcept: generated.chemistryConcept,
        materials: generated.materials,
        steps: generated.steps,
        results: generated.results
      };
    }
  }

  // Fallback intelligent lab experiment generator
  return {
    category: currentCategory && currentCategory !== 'Semua' ? currentCategory : 'Eksperimen Lab',
    badge: currentBadge && currentBadge.trim() ? currentBadge : 'Praktikum Siswa',
    description: `Dokumentasi praktikum laboratorium "${cleanTitle}". Kegiatan ini dirancang untuk membuktikan hukum-hukum dasar kimia, mengamati fenomena reaksi secara empiris, serta mengasah keterampilan kerja ilmiah dan keselamatan kerja di laboratorium kimia SMA.`,
    chemistryConcept: `Prinsip Kimia: Eksperimen ini mendasarkan pada analisis reaksi stoikiometris, perubahan wujud/warna, perpindahan energi, serta kesetimbangan ionik solut dalam larutan berair. Reaksi kimia teramati menghasilkan produk spesifik sesuai persamaan reaksi setara.`,
    materials: [
      'Peralatan gelas laboratorium (Gelas kimia, tabung reaksi, pipet tetes, labu ukur)',
      'Sampel zat uji dan pereaksi kimia standar laboratorium',
      'Akuades untuk pencucian dan pelarut',
      'Alat keselamatan kerja (Jas lab, kacamata pelindung, sarung tangan)'
    ],
    steps: [
      '1. Siapkan semua alat laboratorium dalam kondisi bersih dan bahan uji sesuai takaran stoikiometri.',
      '2. Masukkan larutan reaktan pertama ke dalam wadah reaksi secara presisi menggunakan pipet ukur.',
      '3. Tambahkan larutan pereaksi kedua perlahan sambil mengamati perubahan fisik (suhu, warna, endapan, gas).',
      '4. Dokumentasikan setiap tahapan fenomena perubahan dengan foto dokumentasi.',
      '5. Catat data pengamatan lengkap dan bersihkan alat laboratorium sesuai SOP keselamatan.'
    ],
    results: `Reaksi kimia berlangsung sempurna dan teramati secara visual sesuai dengan hipotesis teoritis materi kimia.`
  };
}

/**
 * 1-Click quick lab experiment presets for teachers
 */
export const QUICK_LAB_EXPERIMENT_PRESETS = [
  {
    title: 'Uji Indikator Alami Asam Basa Ekstrak Kunyit & Telang',
    category: 'Indikator Alami',
    badge: 'Praktikum Siswa',
    iconLabel: '🌿 Indikator Alami'
  },
  {
    title: 'Titrasi Asam Basa: Standarisasi Larutan HCl dengan NaOH',
    category: 'Titrasi Asam Basa',
    badge: 'Praktikum Siswa',
    iconLabel: '🧪 Titrasi Presisi'
  },
  {
    title: 'Uji Daya Hantar Listrik Larutan Elektrolit & Non-Elektrolit',
    category: 'Uji Elektrolit',
    badge: 'Eksperimen Lab',
    iconLabel: '⚡ Uji Elektrolit'
  },
  {
    title: 'Reaksi Redoks Spontan Lempeng Seng (Zn) dalam Larutan CuSO₄',
    category: 'Reaksi Redoks',
    badge: 'Praktikum Siswa',
    iconLabel: '🔋 Redoks & Sel Volta'
  },
  {
    title: 'Pengaruh Konsentrasi terhadap Laju Reaksi Na₂S₂O₃ & HCl',
    category: 'Laju Reaksi & Katalis',
    badge: 'Praktikum Siswa',
    iconLabel: '⏱️ Laju Reaksi'
  },
  {
    title: 'Uji Efek Tyndall pada Larutan Gula, Susu Koloid, & Air Tepung',
    category: 'Koloid & Efek Tyndall',
    badge: 'Karya Siswa',
    iconLabel: '💡 Efek Tyndall Koloid'
  },
  {
    title: 'Uji Nyala Api Spektroskopi Kation Logam Alkali (Na, K, Ca, Cu)',
    category: 'Uji Nyala Api Logam',
    badge: 'Eksperimen Lab',
    iconLabel: '🔥 Uji Nyala Api'
  },
  {
    title: 'Elektrolisis Larutan KI dengan Elektroda Karbon',
    category: 'Elektrolisis & Elektrokimia',
    badge: 'Eksperimen Lab',
    iconLabel: '⚗️ Elektrolisis'
  }
];

// =========================================================================
// AI AUTO-GENERATOR FOR PRACTICAL CHEMISTRY VIDEOS (YOUTUBE LINK TO DATA)
// =========================================================================

export interface GeneratedPracticalVideo {
  title: string;
  category: string;
  badge: string;
  duration: string;
  description: string;
  chemistryConcept: string;
  gradeLevel?: string;
}

interface VideoTopicRule {
  keywords: string[];
  category: string;
  badge: string;
  suggestedDuration: string;
  gradeLevel: string;
  generate: (titleContext: string) => {
    title: string;
    description: string;
    chemistryConcept: string;
  };
}

const VIDEO_TOPIC_RULES: VideoTopicRule[] = [
  // 1. Indikator Alami Asam Basa
  {
    keywords: ['kunyit', 'telang', 'kol ungu', 'manggis', 'indikator alami', 'bunga sepatu', 'daun pandan', 'kulit manggis', 'asam basa alami'],
    category: 'Indikator Alami',
    badge: 'Praktikum Siswa Kelas XI',
    suggestedDuration: '06:45',
    gradeLevel: 'Kelas XI',
    generate: (ctx) => ({
      title: ctx.length > 8 && !ctx.toLowerCase().includes('youtube') 
        ? `Praktikum Indikator Alami Asam Basa: ${ctx.replace(/^(video|praktikum|uji|eksperimen|demonstrasi)\s*[:\-]?\s*/i, '')}`
        : 'Praktikum Uji Asam Basa dengan Indikator Alami Tumbuhan',
      description: 'Demonstrasi dan prosedur pembuatan ekstrak indikator alami (kunyit, bunga telang, atau kol ungu) serta pengujian trayek perubahan warna pada berbagai larutan sampel rumah tangga (cuka dapur, air sabun, dan kapur sirih).',
      chemistryConcept: 'Pigmen organik tumbuhan (seperti antosianin dan kurkumin) mengalami perubahan struktur molekul dan ionisasi saat bereaksi dengan ion H⁺ (suasana asam) atau OH⁻ (suasana basa), menghasilkan pergeseran spektrum absorbansi warna tampak yang khas.'
    })
  },

  // 2. Titrasi Asam Basa & Netralisasi
  {
    keywords: ['titrasi', 'buret', 'erlenmeyer', 'titik ekivalen', 'standarisasi', 'hcl', 'naoh', 'fenolftalein', 'indikator pp', 'volumetri'],
    category: 'Titrasi Asam Basa',
    badge: 'Keterampilan Lab Volumetri',
    suggestedDuration: '08:30',
    gradeLevel: 'Kelas XI',
    generate: (ctx) => ({
      title: ctx.length > 8 && !ctx.toLowerCase().includes('youtube')
        ? `Praktikum Titrasi Asam Basa: ${ctx.replace(/^(video|praktikum|uji|eksperimen|demonstrasi)\s*[:\-]?\s*/i, '')}`
        : 'Praktikum Titrasi Asam Basa & Penentuan Titik Akhir Indikator PP',
      description: 'Panduan lengkap teknik penggunaan buret presisi, pembacaan meniskus, penambahan titran secara bertahap, dan pengamatan perubahan warna seulas merah muda pada titik akhir titrasi.',
      chemistryConcept: 'Reaksi netralisasi stoikiometris H⁺(aq) + OH⁻(aq) → H₂O(l). Titik ekivalen tercapai saat mol asam ekuivalen tepat bereaksi dengan mol basa: V_asam × M_asam × a = V_basa × M_basa × b.'
    })
  },

  // 3. Daya Hantar Listrik & Larutan Elektrolit
  {
    keywords: ['elektrolit', 'daya hantar', 'lampu', 'gelembung', 'alat uji', 'ionisasi', 'hantaran listrik', 'garam', 'gula', 'cuka'],
    category: 'Larutan Elektrolit',
    badge: 'Praktikum Kelas X',
    suggestedDuration: '05:40',
    gradeLevel: 'Kelas X',
    generate: (ctx) => ({
      title: ctx.length > 8 && !ctx.toLowerCase().includes('youtube')
        ? `Praktikum Uji Daya Hantar Listrik: ${ctx.replace(/^(video|praktikum|uji|eksperimen|demonstrasi)\s*[:\-]?\s*/i, '')}`
        : 'Uji Daya Hantar Listrik Larutan Elektrolit & Non-Elektrolit',
      description: 'Eksperimen perbandingan intensitas nyala lampu bohlam dan pembentukan gelembung gas di elektroda pada larutan elektrolit kuat (NaCl, HCl), elektrolit lemah (CH₃COOH), dan non-elektrolit (gula, alkohol).',
      chemistryConcept: 'Kemampuan larutan menghantarkan arus listrik bergantung pada keberadaan dan mobilitas ion-ion bebas hasil ionisasi sempurna (α = 1) atau terurai sebagian (0 < α < 1) dalam air menurut teori Svante Arrhenius.'
    })
  },

  // 4. Reaksi Redoks & Sel Volta (Baterai Buah / Seng-Tembaga)
  {
    keywords: ['redoks', 'sel volta', 'galvani', 'baterai buah', 'jeruk', 'lemon', 'seng', 'tembaga', 'zn', 'cu', 'potensial sel', 'korosi'],
    category: 'Reaksi Redoks & Elektrokimia',
    badge: 'Praktikum Kelas XII',
    suggestedDuration: '07:15',
    gradeLevel: 'Kelas XII',
    generate: (ctx) => ({
      title: ctx.length > 8 && !ctx.toLowerCase().includes('youtube')
        ? `Praktikum Sel Volta & Redoks: ${ctx.replace(/^(video|praktikum|uji|eksperimen|demonstrasi)\s*[:\-]?\s*/i, '')}`
        : 'Praktikum Pembuatan Sel Volta Mandiri & Pengukuran Beda Potensial',
      description: 'Eksperimen membuktikan reaksi transfer elektron spontan menjadi energi listrik DC. Mengamati aliran arus listrik, perubahan massa elektroda, serta pembacaan tegangan pada multimeter.',
      chemistryConcept: 'Reaksi redoks spontan: Seng (Zn) mengalami oksidasi di anoda (Zn → Zn²⁺ + 2e⁻, E° = -0,76 V) dan ion Tembaga (Cu²⁺) mengalami reduksi di katoda (Cu²⁺ + 2e⁻ → Cu, E° = +0,34 V) menghasilkan potensial standar sel E°sel = +1,10 Volt.'
    })
  },

  // 5. Elektrolisis Larutan (Elektrolisis KI / Air / Logam)
  {
    keywords: ['elektrolisis', 'pipa u', 'katoda anoda', 'iodida', 'ki', 'penyepuhan', 'grafit', 'karbon', 'faraday', 'gas hidrogen'],
    category: 'Reaksi Redoks & Elektrokimia',
    badge: 'Praktikum Kelas XII',
    suggestedDuration: '06:50',
    gradeLevel: 'Kelas XII',
    generate: (ctx) => ({
      title: ctx.length > 8 && !ctx.toLowerCase().includes('youtube')
        ? `Praktikum Elektrolisis: ${ctx.replace(/^(video|praktikum|uji|eksperimen|demonstrasi)\s*[:\-]?\s*/i, '')}`
        : 'Praktikum Elektrolisis Larutan KI dengan Elektroda Karbon',
      description: 'Demonstrasi pemanfaatan arus listrik searah untuk menggerakkan reaksi redoks non-spontan pada pipa U kaca, disertai pembuktian produk katoda (gas H₂ & ion OH⁻ via indikator PP) dan produk anoda (iodin I₂ via amilum).',
      chemistryConcept: 'Di katoda terjadi reduksi air menghasilkan gas H₂ dan basa (2H₂O + 2e⁻ → H₂ + 2OH⁻), sedangkan di anoda ion iodida dioksidasi menghasilkan larutan iodin berwarna cokelat (2I⁻ → I₂ + 2e⁻).'
    })
  },

  // 6. Laju Reaksi & Faktor-Faktor yang Mempengaruhinya
  {
    keywords: ['laju reaksi', 'na2s2o3', 'natrium tiosulfat', 'suhu', 'katalis', 'konsentrasi', 'luas permukaan', 'tumbukan', 'stopwatch', 'tanda silang'],
    category: 'Laju Reaksi',
    badge: 'Praktikum Kelas XI',
    suggestedDuration: '07:45',
    gradeLevel: 'Kelas XI',
    generate: (ctx) => ({
      title: ctx.length > 8 && !ctx.toLowerCase().includes('youtube')
        ? `Praktikum Kinetika Kimia: ${ctx.replace(/^(video|praktikum|uji|eksperimen|demonstrasi)\s*[:\-]?\s*/i, '')}`
        : 'Pengaruh Konsentrasi & Suhu terhadap Laju Reaksi Na₂S₂O₃ + HCl',
      description: 'Eksperimen investigasi faktor-faktor yang mempengaruhi laju reaksi kimia dengan mengukur waktu yang diperlukan endapan belerang untuk menutupi tanda silang hitam di bawah labu Erlenmeyer.',
      chemistryConcept: 'Teori tumbukan menyatakan bahwa laju reaksi sebanding dengan frekuensi tumbukan efektif partikel yang memiliki orientasi tepat dan energi kinetik melampaui Energi Aktivasi (Ea). Kenaikan konsentrasi dan suhu mempercepat laju reaksi secara eksponensial.'
    })
  },

  // 7. Sistem Koloid & Efek Tyndall
  {
    keywords: ['koloid', 'efek tyndall', 'laser', 'susu', 'santan', 'hamburan cahaya', 'koagulasi', 'dispersi', 'emulsi', 'sol'],
    category: 'Sistem Koloid',
    badge: 'Praktikum Kelas XI',
    suggestedDuration: '05:30',
    gradeLevel: 'Kelas XI',
    generate: (ctx) => ({
      title: ctx.length > 8 && !ctx.toLowerCase().includes('youtube')
        ? `Praktikum Sistem Koloid: ${ctx.replace(/^(video|praktikum|uji|eksperimen|demonstrasi)\s*[:\-]?\s*/i, '')}`
        : 'Praktikum Uji Efek Tyndall & Karakteristik Sistem Koloid',
      description: 'Pengujian sifat optik Efek Tyndall menggunakan sinar laser horizontal pada larutan sejati (gula), koloid (susu/santan), dan suspensi kasar (kopi/tepung) serta pembuatan koloid sederhana.',
      chemistryConcept: 'Efek Tyndall terjadi karena partikel koloid (diameter 1 - 100 nm) cukup besar untuk menghamburkan berkas sinar tampak ke segala arah, sedangkan partikel larutan sejati (< 1 nm) meneruskan cahaya tanpa hamburan.'
    })
  },

  // 8. Termokimia & Kalorimetri (Eksoterm / Endoterm)
  {
    keywords: ['termokimia', 'kalorimeter', 'eksoterm', 'endoterm', 'entalpi', 'suhu naik', 'suhu turun', 'pelarutan naoh', 'urea'],
    category: 'Termokimia',
    badge: 'Praktikum Kelas XI',
    suggestedDuration: '06:15',
    gradeLevel: 'Kelas XI',
    generate: (ctx) => ({
      title: ctx.length > 8 && !ctx.toLowerCase().includes('youtube')
        ? `Praktikum Termokimia: ${ctx.replace(/^(video|praktikum|uji|eksperimen|demonstrasi)\s*[:\-]?\s*/i, '')}`
        : 'Praktikum Penentuan Perubahan Entalpi Reaksi Eksoterm & Endoterm',
      description: 'Pengukuran perpindahan kalor antara sistem dan lingkungan menggunakan kalorimeter sederhana, mencatat perubahan suhu (ΔT) pada pelarutan NaOH padat dan pupuk Urea dalam air.',
      chemistryConcept: 'Pada reaksi eksoterm sistem melepaskan kalor ke lingkungan (ΔH < 0, suhu naik), sedangkan pada reaksi endoterm sistem menyerap kalor dari lingkungan (ΔH > 0, suhu turun). Kalor dihitung dengan rumus q = m × c × ΔT.'
    })
  },

  // 9. Uji Nyala Api Spektroskopi Kation Logam
  {
    keywords: ['uji nyala', 'warna nyala', 'kation', 'kawat nikrom', 'bunsen', 'natrium', 'kalium', 'kalsium', 'barium', 'tembaga', 'stronsium'],
    category: 'Eksperimen Lab',
    badge: 'Praktikum Spektroskopi',
    suggestedDuration: '05:10',
    gradeLevel: 'Kelas XII',
    generate: (ctx) => ({
      title: ctx.length > 8 && !ctx.toLowerCase().includes('youtube')
        ? `Praktikum Uji Nyala Api: ${ctx.replace(/^(video|praktikum|uji|eksperimen|demonstrasi)\s*[:\-]?\s*/i, '')}`
        : 'Identifikasi Kation Logam Melalui Uji Spektroskopi Nyala Api',
      description: 'Prosedur pembersihan kawat nikrom dengan HCl pekat dan pembakaran garam kation (Na⁺, K⁺, Ca²⁺, Ba²⁺, Cu²⁺) pada zona oksidasi api biru Bunsen untuk mengamati pancaran warna nyala khas.',
      chemistryConcept: 'Energi termal mengeksitasi elektron kation ke orbital berenergi lebih tinggi. Ketika elektron kembali mengalami de-eksitasi (relaksasi) ke tingkat dasar, energi dipancarkan sebagai foton cahaya tampak dengan panjang gelombang spesifik (ΔE = h × c / λ).'
    })
  },

  // 10. Kimia Organik & Sintesis Ester (Esterifikasi)
  {
    keywords: ['ester', 'esterifikasi', 'aroma buah', 'organik', 'alkohol', 'asam asetat', 'etanol', 'minyak', 'gugus fungsi'],
    category: 'Karya Siswa',
    badge: 'Praktikum Sintesis Organik',
    suggestedDuration: '07:30',
    gradeLevel: 'Kelas XII',
    generate: (ctx) => ({
      title: ctx.length > 8 && !ctx.toLowerCase().includes('youtube')
        ? `Praktikum Kimia Organik: ${ctx.replace(/^(video|praktikum|uji|eksperimen|demonstrasi)\s*[:\-]?\s*/i, '')}`
        : 'Sintesis Senyawa Ester Beraroma Buah (Reaksi Esterifikasi Fischer)',
      description: 'Eksperimen pembentukan senyawa ester dengan mereaksikan asam karboksilat dan alkohol menggunakan katalis asam sulfat pekat (H₂SO₄) dalam penangas air panas, serta uji identifikasi aroma buah yang dihasilkan.',
      chemistryConcept: 'Reaksi substitusi nukleofilik asil reversibel antara asam karboksilat (R-COOH) dan alkohol (R\'-OH) menghasilkan senyawa ester (R-COO-R\') dan air, di mana asam sulfat pekat bertindak sebagai katalisator dan pendehidrasi.'
    })
  },

  // 11. Kesetimbangan Kimia & Pergeseran Le Chatelier
  {
    keywords: ['kesetimbangan', 'le chatelier', 'pergeseran', 'fe(scn)', 'besi tiosianat', 'kromat dikromat', 'reversibel', 'warna larutan'],
    category: 'Eksperimen Lab',
    badge: 'Praktikum Kelas XI',
    suggestedDuration: '06:20',
    gradeLevel: 'Kelas XI',
    generate: (ctx) => ({
      title: ctx.length > 8 && !ctx.toLowerCase().includes('youtube')
        ? `Praktikum Kesetimbangan Kimia: ${ctx.replace(/^(video|praktikum|uji|eksperimen|demonstrasi)\s*[:\-]?\s*/i, '')}`
        : 'Uji Pergeseran Kesetimbangan Kimia (Asas Le Chatelier)',
      description: 'Investigasi pengaruh perubahan konsentrasi dan suhu terhadap arah pergeseran kesetimbangan dinamis pada sistem ion besi(III) tiosianat [Fe(SCN)]²⁺ dan kesetimbangan kromat-dikromat.',
      chemistryConcept: 'Asas Le Chatelier: Jika pada sistem kesetimbangan dinamis diberikan aksi berupa perubahan konsentrasi, tekanan, atau suhu, maka sistem akan bergeser sedemikian rupa untuk meniadakan pengaruh aksi tersebut.'
    })
  }
];

/**
 * Fetch video metadata from YouTube public oEmbed endpoint without needing an API key
 */
export async function fetchYouTubeOEmbedMetadata(youtubeUrlOrId: string): Promise<{ title?: string; author_name?: string } | null> {
  try {
    const cleanUrl = youtubeUrlOrId.includes('http') 
      ? youtubeUrlOrId 
      : `https://www.youtube.com/watch?v=${youtubeUrlOrId}`;
    
    // Use YouTube's public oEmbed API
    const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(cleanUrl)}`;
    const response = await fetch(oembedUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data.title) {
        return {
          title: data.title,
          author_name: data.author_name || 'YouTube Channel'
        };
      }
    }
  } catch (err) {
    console.warn('Could not fetch YouTube oEmbed data, falling back to intelligent parser:', err);
  }
  return null;
}

/**
 * AI generator that automatically produces clean chemistry Title, Description, Category, Badge,
 * Duration, and Chemistry Concept based on the YouTube link or raw video title.
 */
export function generatePracticalVideoFromLinkOrTitle(
  rawInput: string,
  currentCategory?: string,
  currentBadge?: string
): GeneratedPracticalVideo {
  const cleanInput = rawInput.trim();
  const lower = cleanInput.toLowerCase();

  // 1. Search for matching rule based on keywords in URL or title
  for (const rule of VIDEO_TOPIC_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      const generated = rule.generate(cleanInput);
      return {
        title: generated.title,
        category: currentCategory && currentCategory !== 'Lainnya' ? currentCategory : rule.category,
        badge: currentBadge && currentBadge.trim() ? currentBadge : rule.badge,
        duration: rule.suggestedDuration,
        description: generated.description,
        chemistryConcept: generated.chemistryConcept,
        gradeLevel: rule.gradeLevel
      };
    }
  }

  // 2. Intelligent fallback if no exact topic keyword matched
  // Extract meaningful words from URL/title to format a nice chemistry title
  const cleanTitleCandidate = cleanInput
    .replace(/https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/gi, '')
    .replace(/[_\-+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const formattedTitle = cleanTitleCandidate.length > 5
    ? `Praktikum Kimia Laboratorium: ${cleanTitleCandidate}`
    : 'Praktikum & Demonstrasi Eksperimen Kimia Laboratorium SMA';

  return {
    title: formattedTitle,
    category: currentCategory && currentCategory !== 'Lainnya' ? currentCategory : 'Eksperimen Lab',
    badge: currentBadge && currentBadge.trim() ? currentBadge : 'Video Praktikum Siswa',
    duration: '06:30',
    description: `Video panduan dan dokumentasi eksperimen praktikum kimia laboratorium. Membahas tujuan kegiatan, pengenalan alat & bahan, langkah-langkah prosedur kerja ilmiah, serta pengamatan fenomena reaksi kimia secara empiris.`,
    chemistryConcept: `Eksperimen ini menerapkan prinsip dasar stoikiometri, kinetika reaksi, dan interaksi partikel kimia dalam larutan berair sesuai dengan capaian pembelajaran kurikulum kimia SMA.`,
    gradeLevel: 'Semua Tingkat'
  };
}

