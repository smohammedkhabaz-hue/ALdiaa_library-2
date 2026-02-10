
export interface Book {
  id: string;
  userId?: string; // لربط الكتاب بالمستخدم
  title: string;
  author: string;
  editor: string; // المحقق
  course: string; // المقرر
  volumes: number; // عدد الأجزاء
  publisher: string; // دار النشر
  printPlace: string; // مكان الطباعة
  notes: string; // ملاحظات إضافية
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  isLoggedIn: boolean;
}

export type SearchCategory = 'title' | 'author' | 'publisher' | 'printPlace';

export interface Stats {
  totalBooks: number;
  totalVolumes: number;
  totalAuthors: number;
}
