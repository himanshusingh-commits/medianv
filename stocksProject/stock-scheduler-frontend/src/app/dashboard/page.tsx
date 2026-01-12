'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Stock {
  id: number;
  symbol: string;
  name: string;
  currentPrice: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return router.push('/login');

        const stocksRes = await api.get('/stocks');
        setStocks(stocksRes.data);

        const bookmarksRes = await api.get('/stocks/my-bookmarks');
        setBookmarks(bookmarksRes.data.map((s: Stock) => s.id));
      } catch (error) {
        console.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const toggleBookmark = async (stockId: number) => {
    try {
      await api.post(`/stocks/${stockId}/bookmark`);
      if (bookmarks.includes(stockId)) {
        setBookmarks(bookmarks.filter((id) => id !== stockId));
      } else {
        setBookmarks([...bookmarks, stockId]);
      }
    } catch (error) {
      alert('Failed to update bookmark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-gray-600 text-xl font-medium animate-pulse">Loading Market Data...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <span className="text-2xl">📈</span>
           <h1 className="text-xl font-bold text-gray-800">StockScheduler</h1>
        </div>
        <button 
          onClick={handleLogout} 
          className="text-sm text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Today's Market</h2>
          <p className="text-gray-500 mt-1">Bookmark stocks to receive daily morning alerts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock) => {
            const isBookmarked = bookmarks.includes(stock.id);
            return (
              <div 
                key={stock.id} 
                className={`
                  relative p-6 rounded-xl border transition-all duration-200
                  ${isBookmarked 
                    ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500' 
                    : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}
                `}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded w-fit mb-2">
                      {stock.symbol}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{stock.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-bold text-gray-900">
                      ${Number(stock.currentPrice).toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400">Current Price</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleBookmark(stock.id)}
                  className={`
                    w-full py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2
                    ${isBookmarked
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}
                  `}
                >
                  {isBookmarked ? (
                    <>
                      <span>★</span> Following
                    </>
                  ) : (
                    <>
                      <span>☆</span> Add to Watchlist
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}