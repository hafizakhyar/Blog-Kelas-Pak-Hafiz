export interface CuratedLabImage {
  id: string;
  title: string;
  category: string;
  tags: string[];
  url: string;
  thumbnail: string;
  author?: string;
  description: string;
}

export const CURATED_CHEMISTRY_IMAGES: CuratedLabImage[] = [
  {
    id: 'img-1',
    title: 'Indikator Tabung Reaksi Asam Basa',
    category: 'Indikator Alami',
    tags: ['indikator', 'asam', 'basa', 'kunyit', 'telang', 'warna', 'ph', 'tabung reaksi'],
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=400&q=75',
    author: 'Science In HD / Unsplash',
    description: 'Spektrum warna gradasi indikator pH dalam deretan tabung reaksi laboratorium'
  },
  {
    id: 'img-2',
    title: 'Titrasi & Buret Kimia Analitik',
    category: 'Eksperimen Lab',
    tags: ['titrasi', 'buret', 'erlenmeyer', 'volumetri', 'asam asetat', 'cuka', 'naoh', 'lab'],
    url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=75',
    author: 'Chokniti Khongchum / Unsplash',
    description: 'Proses titrasi larutan asam basa menggunakan buret dan labu erlenmeyer'
  },
  {
    id: 'img-3',
    title: 'Bunga Telang & Ekstrak Antosianin Alami',
    category: 'Indikator Alami',
    tags: ['telang', 'antosianin', 'bunga', 'biru', 'ungu', 'herbal', 'indikator', 'ph'],
    url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=75',
    author: 'Ravi Sharma / Unsplash',
    description: 'Ekstraksi zat warna antosianin alami yang peka terhadap derajat keasaman'
  },
  {
    id: 'img-4',
    title: 'Kunyit & Rimpang Kurkuminoid',
    category: 'Indikator Alami',
    tags: ['kunyit', 'kurkumin', 'rimpang', 'kuning', 'merah bata', 'indikator alami', 'dapur'],
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=75',
    author: 'Tamanna Rumee / Unsplash',
    description: 'Rimpang kunyit penghasil senyawa kurkuminoid untuk uji indikator asam basa'
  },
  {
    id: 'img-5',
    title: 'Larutan Kimia Berwarna & Gelas Beaker',
    category: 'Eksperimen Lab',
    tags: ['beaker', 'larutan', 'senyawa', 'warna', 'pipet', 'gelas kimia', 'reaksi'],
    url: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=400&q=75',
    author: 'Louis Reed / Unsplash',
    description: 'Peralatan gelas laboratorium dengan larutan kimia berwarna cerah'
  },
  {
    id: 'img-6',
    title: 'Uji Daya Hantar Listrik Elektrolit',
    category: 'Eksperimen Lab',
    tags: ['elektrolit', 'listrik', 'ion', 'nacl', 'baterai', 'lampu', 'gelembung', 'elektroda'],
    url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=75',
    author: 'Science Photo / Unsplash',
    description: 'Eksperimen penghantaran arus listrik oleh pergerakan ion dalam larutan'
  },
  {
    id: 'img-7',
    title: 'Uji Nyala Api & Pembakaran Bunsen',
    category: 'Eksperimen Lab',
    tags: ['uji nyala', 'api', 'bunsen', 'logam', 'natrium', 'kalium', 'tembaga', 'spektrum', 'panas'],
    url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=75',
    author: 'Public Domain / Unsplash',
    description: 'Uji nyala karakteristik kation logam menggunakan pembakar Bunsen lab'
  },
  {
    id: 'img-8',
    title: 'Model Bentuk Molekul 3D & Ikatan Kimia',
    category: 'Karya Siswa',
    tags: ['maket', 'molekul', 'vsepr', 'ikatan', 'tetrahedral', 'atom', 'karya siswa', '3d'],
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=75',
    author: 'Science Laboratory / Unsplash',
    description: 'Model bola tongkat (molymod) struktur geometri molekul kimia SMA'
  },
  {
    id: 'img-9',
    title: 'Mikroskop & Analisis Kristal Presipitasi',
    category: 'Eksperimen Lab',
    tags: ['mikroskop', 'kristal', 'endapan', 'presipitasi', 'sel', 'analisis', 'reaksi'],
    url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=75',
    author: 'National Cancer Institute / Unsplash',
    description: 'Pengamatan mikroskopis struktur kristal dan endapan hasil reaksi kimia'
  },
  {
    id: 'img-10',
    title: 'Reaksi Redoks & Pelapisan Logam (Elektrokimia)',
    category: 'Eksperimen Lab',
    tags: ['redoks', 'elektrokimia', 'seng', 'tembaga', 'korosi', 'sel volta', 'larutan cuso4'],
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=75',
    author: 'CDC / Unsplash',
    description: 'Reaksi transfer elektron spontan logam seng dalam larutan tembaga(II) sulfat'
  },
  {
    id: 'img-11',
    title: 'Efek Tyndall Koloid & Hamburan Berkas Cahaya',
    category: 'Eksperimen Lab',
    tags: ['koloid', 'tyndall', 'laser', 'hamburan', 'suspensi', 'larutan sejati', 'susu', 'cahaya'],
    url: 'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b4?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b4?auto=format&fit=crop&w=400&q=75',
    author: 'Hans Reniers / Unsplash',
    description: 'Hamburan berkas sinar optik oleh partikel koloid dalam medium pendispersi'
  },
  {
    id: 'img-12',
    title: 'Aktivitas Siswa & Kolaborasi Praktikum Sains',
    category: 'Karya Siswa',
    tags: ['siswa', 'kelas', 'praktikum', 'kerja kelompok', 'diskusi', 'lab sekolah', 'kimia sma'],
    url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=400&q=75',
    author: 'Science Team / Unsplash',
    description: 'Siswa bekerja sama dalam prosedur eksperimen laboratorium sains'
  }
];

export const POPULAR_IMAGE_SEARCH_TOPICS = [
  { label: 'Titrasi Asam Basa', query: 'titrasi asam basa buret erlenmeyer' },
  { label: 'Indikator Kunyit', query: 'indikator alami kunyit kurkumin ph' },
  { label: 'Bunga Telang', query: 'ekstrak bunga telang antosianin' },
  { label: 'Uji Nyala Logam', query: 'flame test chemistry uji nyala api' },
  { label: 'Efek Tyndall Koloid', query: 'tyndall effect colloid laser scattering' },
  { label: 'Uji Elektrolit', query: 'larutan elektrolit lampu ionisasi' },
  { label: 'Reaksi Redoks Zn CuSO4', query: 'redox reaction zinc copper sulfate' },
  { label: 'Bentuk Molekul 3D', query: 'vsepr molecular geometry model molymod' },
  { label: 'Peralatan Gelas Lab', query: 'chemistry glassware beaker flask' },
];

/**
 * Filter curated images by search keywords
 */
export function searchCuratedLabImages(query: string): CuratedLabImage[] {
  const clean = query.toLowerCase().trim();
  if (!clean) return CURATED_CHEMISTRY_IMAGES;

  const terms = clean.split(/\s+/).filter(Boolean);

  return CURATED_CHEMISTRY_IMAGES.filter((item) => {
    const combinedText = `${item.title} ${item.category} ${item.description} ${item.tags.join(' ')}`.toLowerCase();
    return terms.some((term) => combinedText.includes(term));
  });
}

/**
 * Generate a direct Google Images search link for opening in a new tab
 */
export function getGoogleImagesSearchUrl(query: string): string {
  const cleanQuery = `${query} kimia praktikum laboratorium high quality`.trim();
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(cleanQuery)}`;
}
