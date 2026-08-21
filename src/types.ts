export interface GalleryItem {
  id: string;
  title: string;
  category: 'Indikator Alami' | 'Eksperimen Lab' | 'Karya Siswa' | 'Video Tutorial';
  date: string;
  image: string;
  badge: string;
  description: string;
  chemistryConcept: string;
  materials: string[];
  steps: string[];
  results: string;
  videoDuration?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Modul Ajar' | 'LKPD Praktikum' | 'Ringkasan & Rumus' | 'Bank Soal';
  classGrade: 'Kelas X' | 'Kelas XI' | 'Kelas XII' | 'Semua Tingkat';
  fileFormat: 'PDF' | 'DOCX' | 'PPTX';
  fileSize: string;
  downloads: number;
  updatedDate: string;
  summary: string;
  topics: string[];
  pages: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string[];
  category: 'Kimia Sehari-hari' | 'Tips Belajar' | 'Eksperimen Kreatif' | 'Fakta Unik';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  keyTakeaways: string[];
  reactions: number;
}

export interface NaturalIndicator {
  id: 'kunyit' | 'telang' | 'manggis';
  name: string;
  latinName: string;
  activeCompound: string;
  normalColor: string;
  normalColorHex: string;
  acidColor: string;
  acidColorHex: string;
  neutralColor: string;
  neutralColorHex: string;
  baseColor: string;
  baseColorHex: string;
  description: string;
}

export interface TestSolution {
  id: string;
  name: string;
  type: 'acid' | 'neutral' | 'base';
  pH: number;
  householdExample: string;
}
