
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Book, Stats, User as UserType } from './types';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import BookTable from './components/BookTable';
import BookFormModal from './components/BookFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import DuplicateWarningModal from './components/DuplicateWarningModal';
import AuthModal from './components/AuthModal';
import { Library, Loader2, Info } from 'lucide-react';

const DB_NAME = 'AldiaaDB';
const STORE_NAME = 'books';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const App: React.FC = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [duplicateBookCheck, setDuplicateBookCheck] = useState<{data: Omit<Book, 'id' | 'createdAt' | 'userId'>, stayOpen: boolean} | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);
  
  const [searchFilters, setSearchFilters] = useState({
    title: '', author: '', publisher: '', printPlace: '', editor: '', course: ''
  });

  // محاكاة مزامنة سحابية عند تسجيل الدخول
  useEffect(() => {
    const savedUser = localStorage.getItem('aldiaa_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    const loadData = async () => {
      setLoading(true);
      try {
        const db = await initDB();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => {
          let books = request.result || [];
          setAllBooks(books);
          setLoading(false);
        };
      } catch (err) {
        console.error("Failed to load DB", err);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogin = (email: string, name: string) => {
    const newUser = { id: email.replace(/[^a-zA-Z0-9]/g, '_'), email, name, isLoggedIn: true };
    setUser(newUser);
    localStorage.setItem('aldiaa_user', JSON.stringify(newUser));
    
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aldiaa_user');
    setAllBooks([]); 
  };

  const stats: Stats = useMemo(() => {
    let uniqueAuthors = new Set();
    let totalVolumes = 0;
    allBooks.forEach(b => {
      uniqueAuthors.add(b.author.trim());
      totalVolumes += (Number(b.volumes) || 0);
    });
    return {
      totalBooks: allBooks.length, totalVolumes, totalAuthors: uniqueAuthors.size
    };
  }, [allBooks]);

  const filteredBooks = useMemo(() => {
    return allBooks.filter(book => {
      const matchesUser = user ? book.userId === user.id : true; 
      
      return matchesUser && (
        book.title.toLowerCase().includes(searchFilters.title.toLowerCase()) &&
        book.author.toLowerCase().includes(searchFilters.author.toLowerCase()) &&
        (book.publisher || '').toLowerCase().includes(searchFilters.publisher.toLowerCase()) &&
        (book.printPlace || '').toLowerCase().includes(searchFilters.printPlace.toLowerCase()) &&
        (book.editor || '').toLowerCase().includes(searchFilters.editor.toLowerCase()) &&
        (book.course || '').toLowerCase().includes(searchFilters.course.toLowerCase())
      );
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [allBooks, searchFilters, user]);

  const handleSaveBook = async (bookData: Omit<Book, 'id' | 'createdAt' | 'userId'>, stayOpen: boolean = false, force: boolean = false) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    if (!force) {
      const isDuplicate = allBooks.some(b => 
        b.title.trim().toLowerCase() === bookData.title.trim().toLowerCase() && 
        b.userId === user.id &&
        b.id !== editingBook?.id
      );
      if (isDuplicate) {
        setDuplicateBookCheck({ data: bookData, stayOpen });
        return;
      }
    }

    setIsSyncing(true);
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const newBook: Book = editingBook 
      ? { ...editingBook, ...bookData } 
      : { ...bookData, id: crypto.randomUUID(), userId: user.id, createdAt: Date.now() };

    const request = store.put(newBook);
    request.onsuccess = () => {
      setAllBooks(prev => {
        if (editingBook) return prev.map(b => b.id === newBook.id ? newBook : b);
        return [newBook, ...prev];
      });
      setIsSyncing(false);
      if (!stayOpen) {
        setIsModalOpen(false);
        setEditingBook(null);
      }
      setDuplicateBookCheck(null);
    };
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    setIsSyncing(true);
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME).delete(bookToDelete.id);
    store.onsuccess = () => {
      setAllBooks(prev => prev.filter(b => b.id !== bookToDelete.id));
      setBookToDelete(null);
      setIsSyncing(false);
    };
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col text-right" dir="rtl">
      <Header 
        onAddClick={() => { if(!user) setIsAuthOpen(true); else { setEditingBook(null); setIsModalOpen(true); } }} 
        onAuthClick={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
        isSyncing={isSyncing}
      />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12 w-full pb-20">
        <StatsCards stats={stats} />
        
        {!user && !loading && (
          <div className="mt-8 bg-[#94B4BC]/5 border border-[#94B4BC]/20 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#94B4BC] shadow-sm">
                <Info size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-800">سجل دخولك لتفعيل المزامنة</h4>
                <p className="text-sm text-slate-500 font-bold">يمكنك الوصول لمكتبتك من أي جهاز وحفظ بياناتك بأمان.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="bg-[#94B4BC] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#7da1aa] transition-all shadow-lg shadow-[#94B4BC]/20"
            >
              دخول الآن
            </button>
          </div>
        )}

        <div className="mt-8 md:mt-12 bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-50 p-6 md:p-8 mb-10">
          <SearchBar filters={searchFilters} onFilterChange={(k, v) => setSearchFilters(p => ({...p, [k]: v}))} />
        </div>

        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#94B4BC] rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl shadow-[#94B4BC]/20">
              <Library className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">محتويات المكتبة</h2>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#94B4BC]" />
            <p className="font-bold">جاري تحميل البيانات...</p>
          </div>
        ) : (
          <BookTable 
            books={filteredBooks.slice(0, visibleCount)} 
            onDelete={(id) => setBookToDelete(allBooks.find(b => b.id === id) || null)} 
            onEdit={(b) => { setEditingBook(b); setIsModalOpen(true); }}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <div className="mb-1">
            <span className="text-2xl font-black text-[#94B4BC] tracking-tight">مكتبة الضياء</span>
          </div>
          <p className="text-slate-400 text-sm font-black uppercase tracking-[0.3em] mb-4 select-none">
            ALDIAA ELECTRONIC LIBRARY
          </p>
          <div className="w-12 h-1 bg-slate-50 rounded-full mb-4"></div>
          <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">
            حقوق النشر © {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      <BookFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveBook} initialData={editingBook || undefined} />
      <DeleteConfirmModal isOpen={!!bookToDelete} onClose={() => setBookToDelete(null)} onConfirm={confirmDelete} bookTitle={bookToDelete?.title || ''} />
      <DuplicateWarningModal isOpen={!!duplicateBookCheck} onClose={() => setDuplicateBookCheck(null)} onConfirm={() => duplicateBookCheck && handleSaveBook(duplicateBookCheck.data, duplicateBookCheck.stayOpen, true)} bookTitle={duplicateBookCheck?.data.title || ''} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} />
    </div>
  );
};

export default App;
