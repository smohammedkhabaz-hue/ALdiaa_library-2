
export interface Book {
  id: string;
  userId: string; // إلزامي لربط الكتاب بالمستخدم
  title: string;
  author: string;
  editor: string; 
  course: string; 
  volumes: number; 
  publisher: string; 
  printPlace: string; 
  notes: string; 
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  isLoggedIn: boolean;
}

export interface Stats {
  totalBooks: number;
  totalVolumes: number;
  totalAuthors: number;
}
