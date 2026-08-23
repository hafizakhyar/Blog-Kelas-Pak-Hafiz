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
  isPinned?: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Modul Ajar' | 'LKPD Praktikum' | 'Ringkasan & Rumus' | 'Bank Soal' | 'RPP & ATP' | 'Silabus' | string;
  classGrade: 'Kelas X' | 'Kelas XI' | 'Kelas XII' | 'Semua Tingkat' | string;
  fileFormat: 'PDF' | 'DOCX' | 'PPTX' | 'XLSX' | 'GDRIVE' | string;
  fileSize: string;
  downloads: number;
  updatedDate: string;
  summary: string;
  topics: string[];
  pages: number;
  fileUrl?: string;
  driveUrl?: string;
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

export interface ClassNote {
  id: string;
  title: string;
  category: string;
  classGrade: 'Kelas X' | 'Kelas XI' | 'Kelas XII' | 'Semua Tingkat';
  content: string;
  keyPoints: string[];
  imageUrl?: string;
  date: string;
  authorName: string;
  isPinned?: boolean;
  likes?: number;
  tags?: string[];
}

export interface ProfileExperienceItem {
  id: string;
  title: string;
  institution?: string;
  period?: string;
  category: 'Pendidikan' | 'Pengalaman' | 'Keahlian' | 'Sertifikasi' | string;
  description?: string;
  subItems?: string[];
}

export interface PortfolioCertificateItem {
  id: string;
  title: string;
  category: 'Sertifikat' | 'Karya Riset' | 'Pelatihan' | 'Penghargaan' | string;
  issuer: string;
  year: string;
  imageUrl: string;
  credentialUrl?: string;
  description?: string;
}

