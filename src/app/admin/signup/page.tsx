'use client';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const AdminSignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if admin exists
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/admin/signup', { method: 'GET' });
        if (res.status === 400) {
          setAdminExists(true);
        }
      } catch (err) {
        console.error('Error checking admin:', err);
      }
    };
    checkAdmin();
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Admin account created successfully!', {
          style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
        });
        setTimeout(() => router.push('/admin'), 2000); // Redirect to admin login
      } else {
        toast.error(data.error || 'Failed to create admin account', {
          style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
        });
      }
    } catch (err: unknown) {
      toast.error('Network error', {
        style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (adminExists) {
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
        <div className="bg-black rounded-xl p-8 max-w-md w-full border-2 border-orange-500 text-center">
          <h1 className="text-2xl font-bold text-orange-500 mb-6">SOPHEX Admin Signup</h1>
          <p className="text-orange-300">An admin account already exists. Please proceed to login.</p>
          <button
            onClick={() => router.push('/admin')}
            className="mt-4 px-6 py-2 bg-orange-500 rounded-lg font-bold text-black hover:bg-orange-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-center mb-6 text-orange-500">SOPHEX Admin Signup</h1>
        <form onSubmit={handleSignup} className="space-y-4">
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
            className="w-full py-3 bg-orange-500 rounded-lg font-bold text-black hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FaUserPlus /> {isLoading ? 'Creating...' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignupPage;