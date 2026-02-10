
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Book, Stats, User as UserType } from './types';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import BookTable from './components/BookTable';
import BookFormModal from './components/BookFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import AuthModal from './components/AuthModal';
import { Library, Loader2, Cloud } from 'lucide-react';

// مكون العداد المتحرك الداخلي
const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const prevValueRef = useRef(0);
  const duration = 1000;

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easeOutExpo = (x: number): number => x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      const currentCount = Math.floor(prevValueRef.current + (value - prevValueRef.current) * easeOutExpo(progress));
      setDisplayValue(currentCount);
      if (progress < 1) requestAnimationFrame(animate);
      else {
        setDisplayValue(value);
        prevValueRef.current = value;
        startTimeRef.current = null;
      }
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue.toLocaleString('ar-EG')}</span>;
};

// IndexedDB Helper
const DB_NAME = 'AldiaaDB';
const STORE_NAME = 'books';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
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

interface SearchFilters {
  title: string;
  author: string;
  publisher: string;
  printPlace: string;
  editor: string;
  course: string;
}

const App: React.FC = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    title: '',
    author: '',
    publisher: '',
    printPlace: '',
    editor: '',
    course: ''
  });

  // Load from IndexedDB
  useEffect(() => {
    const loadData = async () => {
      try {
        const db = await initDB();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => {
          setAllBooks(request.result || []);
          setLoading(false);
        };
      } catch (err) {
        console.error("Failed to load DB", err);
        setLoading(false);
      }
    };
    loadData();

    // استعادة حالة المستخدم من localStorage (محاكاة)
    const savedUser = localStorage.getItem('aldiaa_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (email: string, name: string) => {
    const newUser = { id: crypto.randomUUID(), email, name, isLoggedIn: true };
    setUser(newUser);
    localStorage.setItem('aldiaa_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aldiaa_user');
  };

  const stats: Stats = useMemo(() => {
    let uniqueAuthors = new Set();
    let totalVolumes = 0;
    allBooks.forEach(b => {
      uniqueAuthors.add(b.author.trim());
      totalVolumes += (Number(b.volumes) || 0);
    });
    return {
      totalBooks: allBooks.length,
      totalVolumes,
      totalAuthors: uniqueAuthors.size
    };
  }, [allBooks]);

  const filteredBooks = useMemo(() => {
    return allBooks.filter(book => {
      return (
        book.title.toLowerCase().includes(searchFilters.title.toLowerCase()) &&
        book.author.toLowerCase().includes(searchFilters.author.toLowerCase()) &&
        (book.publisher || '').toLowerCase().includes(searchFilters.publisher.toLowerCase()) &&
        (book.printPlace || '').toLowerCase().includes(searchFilters.printPlace.toLowerCase()) &&
        (book.editor || '').toLowerCase().includes(searchFilters.editor.toLowerCase()) &&
        (book.course || '').toLowerCase().includes(searchFilters.course.toLowerCase())
      );
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [allBooks, searchFilters]);

  const currentVisibleBooks = useMemo(() => {
    return filteredBooks.slice(0, visibleCount);
  }, [filteredBooks, visibleCount]);

  const handleSaveBook = async (bookData: Omit<Book, 'id' | 'createdAt'>, stayOpen: boolean = false) => {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    let newBook: Book;
    if (editingBook) {
      newBook = { ...editingBook, ...bookData, userId: user?.id };
    } else {
      newBook = {
        ...bookData,
        id: crypto.randomUUID(),
        userId: user?.id,
        createdAt: Date.now()
      };
    }

    const request = store.put(newBook);
    request.onsuccess = () => {
      setAllBooks(prev => {
        if (editingBook) return prev.map(b => b.id === newBook.id ? newBook : b);
        return [newBook, ...prev];
      });
      if (!stayOpen) {
        setIsModalOpen(false);
        setEditingBook(null);
      }
    };
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;

    try {
      const db = await initDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.delete(bookToDelete.id);
      request.onsuccess = () => {
        setAllBooks(prev => prev.filter(b => b.id !== bookToDelete.id));
        setBookToDelete(null);
      };
    } catch (err) {
      console.error("Failed to delete book", err);
      alert("حدث خطأ أثناء محاولة حذف الكتاب.");
    }
  };

  const loadMore = () => setVisibleCount(prev => prev + 20);

  const updateSearchFilter = (key: keyof SearchFilters, value: string) => {
    setVisibleCount(20); // Reset scroll on search
    setSearchFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-24 text-right" dir="rtl">
      <Header 
        onAddClick={() => { setEditingBook(null); setIsModalOpen(true); }} 
        onAuthClick={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
        <StatsCards stats={stats} />
        
        {user && (
           <div className="mt-8 flex items-center justify-center">
             <div className="flex items-center gap-3 bg-green-50 text-green-600 px-6 py-3 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-bottom-2">
               <Cloud size={18} className="animate-pulse" />
               <span className="text-sm font-bold">المزامنة السحابية نشطة لجهازك الآن</span>
             </div>
           </div>
        )}

        <div className="mt-8 md:mt-12 bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-50 p-6 md:p-8 mb-10">
          <SearchBar filters={searchFilters} onFilterChange={updateSearchFilter} />
        </div>

        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#94B4BC] rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl shadow-[#94B4BC]/20">
              <Library className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">محتويات المكتبة</h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400 bg-slate-50 px-5 py-2 rounded-full w-fit">
             <span className="text-[#94B4BC] min-w-[3ch] inline-block text-center">
                <AnimatedNumber value={filteredBooks.length} />
             </span> 
             {" "} كتاب في المكتبة
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#94B4BC]" />
            <p className="font-bold">جاري تحميل البيانات...</p>
          </div>
        ) : (
          <>
            <BookTable 
              books={currentVisibleBooks} 
              onDelete={(id) => {
                const book = allBooks.find(b => b.id === id);
                if (book) setBookToDelete(book);
              }} 
              onEdit={(b) => { setEditingBook(b); setIsModalOpen(true); }}
            />
            
            {filteredBooks.length > visibleCount && (
              <div className="mt-16 flex justify-center">
                <button 
                  onClick={loadMore}
                  className="px-10 py-4 bg-white border-2 border-[#94B4BC] text-[#94B4BC] font-black rounded-2xl hover:bg-[#94B4BC] hover:text-white transition-all shadow-lg shadow-[#94B4BC]/5"
                >
                  تحميل المزيد من الكتب
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <BookFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSaveBook}
        initialData={editingBook || undefined}
      />

      <DeleteConfirmModal 
        isOpen={!!bookToDelete}
        onClose={() => setBookToDelete(null)}
        onConfirm={confirmDelete}
        bookTitle={bookToDelete?.title || ''}
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={handleLogin}
      />
    </div>
  );
};

export default App;
