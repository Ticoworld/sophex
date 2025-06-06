'use client';
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut, SessionProvider } from 'next-auth/react';
import { FaSignOutAlt, FaDownload } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Winner {
  twitterHandle: string;
  walletAddress: string;
  whitelistWon: boolean;
  lastSpinDate: string;
}

function AdminPageContent() {
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated: () => console.log('Session unauthenticated'),
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debug session fetch errors
  useEffect(() => {
    if (status === 'loading') {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        if (args[0] === '/api/admin/auth/session') {
          try {
            const response = await originalFetch(...args);
            if (!response.ok) {
              console.error('Session fetch failed:', {
                status: response.status,
                statusText: response.statusText,
              });
              try {
                const body = await response.text();
                console.error('Session response body:', body);
              } catch (err) {
                console.error('Failed to read session response body:', err);
              }
            }
            return response;
          } catch (err: unknown) {
            console.error('Session fetch error:', err);
            throw err;
          }
        }
        return originalFetch(...args);
      };
      return () => {
        window.fetch = originalFetch;
      };
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchWinners();
    }
  }, [status]);

  const fetchWinners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/winners', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setWinners(data);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to fetch winners', {
          style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
        });
      }
    } catch (_error: unknown) {
      toast.error('Network error', {
        style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/admin',
      });
      if (result?.error) {
        toast.error(result.error, {
          style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
        });
      } else {
        toast.success('Logged in successfully!', {
          style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
        });
      }
    } catch (_error: unknown) {
      toast.error('Network error', {
        style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/admin/winners?export=csv');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'winners.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to export winners', {
          style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
        });
      }
    } catch (_error: unknown) {
      toast.error('Network error', {
        style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
      });
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen bg-black text-orange-500 flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastStyle={{ background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' }}
        />
        <div className="bg-black rounded-xl p-8 max-w-md w-full border-2 border-orange-500">
          <h1 className="text-2xl font-bold text-center mb-6 text-orange-500">SOPHEX Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-orange-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded border border-orange-500 bg-gray-900 text-white placeholder-orange-500"
                placeholder="Enter email"
                required
              />
            </div>
            <div>
              <label className="block text-orange-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded border border-orange-500 bg-gray-900 text-white placeholder-orange-500"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-orange-500 rounded-lg font-bold text-black hover:bg-orange-600 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{ background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' }}
      />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-orange-500">SOPHEX Admin Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: '/admin' })}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 rounded-lg text-black hover:bg-orange-600"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
        <div className="bg-black border-2 border-orange-500 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-orange-300">Whitelist Winners</h2>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 rounded-lg text-black hover:bg-orange-600"
            >
              <FaDownload /> Export CSV
            </button>
          </div>
          {isLoading ? (
            <div className="text-orange-500 text-center">Loading...</div>
          ) : winners.length === 0 ? (
            <div className="text-orange-300 text-center">No winners yet.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-orange-500">
                  <th className="py-2 text-orange-300">Twitter Handle</th>
                  <th className="py-2 text-orange-300">Wallet Address</th>
                  <th className="py-2 text-orange-300">Won</th>
                  <th className="py-2 text-orange-300">Claimed At</th>
                </tr>
              </thead>
              <tbody>
                {winners.map((winner, index) => (
                  <tr key={index} className="border-b border-orange-500">
                    <td className="py-2 text-white">{winner.twitterHandle || 'Error'}</td>
                    <td className="py-2 text-white">{winner.walletAddress || 'Error'}</td>
                    <td className="py-2 text-white">{winner.whitelistWon ? 'Yes' : 'No'}</td>
                    <td className="py-2 text-white">{new Date(winner.lastSpinDate).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <SessionProvider basePath="/api/admin/auth">
      <AdminPageContent />
    </SessionProvider>
  );
}