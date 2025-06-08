'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import SpinButton from '@/components/spin-game/SpinButton';
import ResultModal from '@/components/spin-game/ResultModal';
import SpinCounter from '@/components/spin-game/SpinCounter';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { FaTwitter, FaGift, FaStar, FaCheck, FaHandPaper } from 'react-icons/fa';
import { GiFingersCrossed as GiFingersCrossedIcon } from 'react-icons/gi';
import Link from 'next/link';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Simple seeded random number generator
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const starCount = 50;
const seed = 12345;
const random = mulberry32(seed);
const stars = Array.from({ length: starCount }, () => ({
  top: `${random() * 100}%`,
  left: `${random() * 100}%`,
  width: `${random() * 3 + 1}px`,
  height: `${random() * 3 + 1}px`,
  opacity: random() * 0.8 + 0.2,
  animationDuration: `${random() * 3 + 2}s`,
}));

const SpinWheel = dynamic(() => import('@/components/spin-game/SpinWheel'), {
  ssr: false,
  loading: () => (
    <div className="w-64 h-64 flex items-center justify-center">
      <div className="w-48 h-48 rounded-full border-4 border-dashed border-orange-500 animate-spin"></div>
    </div>
  ),
});

const CosmicBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden">
    {stars.map((style, i) => (
      <div key={i} className="absolute rounded-full bg-white animate-pulse" style={style} />
    ))}
    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500 rounded-full mix-blend-screen opacity-20 blur-3xl"></div>
    <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-orange-400 rounded-full mix-blend-screen opacity-15 blur-3xl"></div>
  </div>
);

export default function SpinPageContent() {
  const { data: session, status } = useSession();
  const [spinsLeft, setSpinsLeft] = useState<number>(0);
  const [mustSpin, setMustSpin] = useState<boolean>(false);
  const [prizeNumber, setPrizeNumber] = useState<number>(0);
  const [result, setResult] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isAssociating, setIsAssociating] = useState<boolean>(false);
  const isAssociatingRef = useRef(false); // Add ref to track association


  const fetchSpins = useCallback(async () => {
    if (!deviceId) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/spin', {
        headers: { 'x-device-id': deviceId },
      });
      const data = await res.json();
      if (res.ok) {
        setSpinsLeft(data.spinsLeft || 0);
        if (data.message) setError(data.message);
        else setError(null);
      } else {
        setError(data.error || 'Failed to fetch spins');
        toast.error(data.error || 'Failed to fetch spins', {
          icon: <FaGift />,
          theme: 'dark',
          style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
        });
      }
    } catch (err: unknown) {
      setError('Network error');
      toast.error('Network error', {
        icon: <FaGift />,
        theme: 'dark',
        style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
      });
    } finally {
      setIsLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    setIsClient(true);
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);
    };
    loadFingerprint().catch(console.error);
  }, []);

const handleSignOut = useCallback(async () => {
    try {
      await signOut({ callbackUrl: '/spin' });
      toast.success('Signed out successfully!', {
        icon: <FaHandPaper />,
        theme: 'dark',
        style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
      });
      setDeviceId(null);
    } catch (err: unknown) {
      toast.error('Failed to sign out', {
        icon: <FaGift />,
        theme: 'dark',
        style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
      });
    }
  }, []);

 useEffect(() => {
    if (status === 'authenticated' && deviceId && !isAssociatingRef.current) {
      const controller = new AbortController();
      isAssociatingRef.current = true;
      setIsAssociating(true);
      fetch('/api/device/associate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
        signal: controller.signal,
      })
        .then(async (res) => {
          if (res.ok) {
            fetchSpins();
          } else {
            const data = await res.json();
            if (res.status === 403) {
              toast.error(data.error || 'This device is already linked to another account.');
              setTimeout(() => handleSignOut(), 2000);
            } else {
              throw new Error(data.error || 'Association failed');
            }
          }
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          console.error('Association error:', err);
          setError('Failed to associate device');
          setTimeout(() => handleSignOut(), 2000);
        })
        .finally(() => {
          setIsAssociating(false);
          isAssociatingRef.current = false;
        });

      return () => controller.abort();
    } else if (status === 'unauthenticated') {
      setSpinsLeft(0);
    }
  }, [status, deviceId, fetchSpins, handleSignOut]);

  

  const handleSpin = async () => {
    if (spinsLeft <= 0 || mustSpin || isLoading || !!error?.includes('Whitelist won')) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'x-device-id': deviceId || '' },
      });
      const data = await res.json();
      if (res.ok) {
        setPrizeNumber(data.prizeNumber);
        setResult(data.result);
        setSpinsLeft(data.spinsLeft);
        setMustSpin(true);
      } else {
        setError(data.error || 'Failed to spin');
        toast.error(data.error || 'Failed to spin', {
          icon: <FaGift />,
          theme: 'dark',
          style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
        });
      }
    } catch (err: unknown) {
      setError('Network error');
      toast.error('Network error', {
        icon: <FaGift />,
        theme: 'dark',
        style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpinComplete = () => {
    setMustSpin(false);
    if (result === 'free-spin') {
      toast.success('You won a free spin! Spinning again...', {
        icon: <FaStar />,
        theme: 'dark',
        style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
      });
      setSpinsLeft((prev) => prev + 1);
      setTimeout(() => {
        if (!isLoading && !mustSpin) handleSpin();
      }, 2000);
    } else {
      setShowModal(true);
      if (result === 'whitelist') {
        toast.success('You won a whitelist spot!', {
          icon: <FaGift />,
          theme: 'dark',
          style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
        });
      } else if (result === 'empty') {
        toast.info('Spin lost this time!', {
          icon: <GiFingersCrossedIcon />,
          theme: 'dark',
          style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
        });
      }
    }
  };

  const handleWalletSubmit = async (walletAddress: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        toast.success('Wallet submitted successfully!', {
          icon: <FaCheck />,
          theme: 'dark',
          style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
        });
      } else {
        setError(data.error || 'Failed to submit wallet');
        toast.error(data.error || 'Failed to submit wallet', {
          icon: <FaGift />,
          theme: 'dark',
          style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
        });
      }
    } catch (err: unknown) {
      setError('Network error');
      toast.error('Network error', {
        icon: <FaGift />,
        theme: 'dark',
        style: { background: '#1a1a1a', border: '1px solid #f97316', color: '#f97316' },
      });
    } finally {
      setIsLoading(false);
    }
  };



  if (isAssociating) return <div className="text-center p-4">Associating device...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white px-4 py-1 overflow-hidden">
      <CosmicBackground />
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

      <div className="relative p-4">
        <div className="flex items-center justify-between w-full z-30 px-1 py-1 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 rounded-lg p-1">
              <Image
                src="/assets/nft2.png"
                alt="SOPHEX Logo"
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-full"
              />
            </div>
            <h1 className="md:text-2xl text-lg font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              SOPHEX
            </h1>
          </div>
          <div>
            <Link
              href="/"
              className="ml-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-3 text-center bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
          Spin to Win Whitelist
        </h1>

        {status === 'authenticated' && (
          <div className="flex items-center gap-4 mb-4">
            <span className="text-lg font-medium text-orange-300">@{session.user?.name}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-1 bg-transparent border border-orange-500 rounded-lg text-sm font-semibold text-orange-300 hover:bg-orange-900 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}

        {error && error.includes('Whitelist won') && (
          <div className="mb-2 p-2 bg-green-900 text-green-200 rounded-lg border border-green-500 text-center">
            {error}
          </div>
        )}
        {error && !error.includes('Whitelist won') && (
          <div className="mb-2 p-2 bg-orange-900 text-orange-200 rounded-lg border border-orange-500">
            Error: {error}
          </div>
        )}

        {isLoading && <div className="mb-2 p-2 text-orange-500">Loading...</div>}

        <SpinCounter spinsLeft={spinsLeft} />

        {isClient && (
          <SpinWheel mustSpin={mustSpin} prizeNumber={prizeNumber} onStopSpinning={handleSpinComplete} />
        )}

        {status === 'authenticated' ? (
          <SpinButton
            onClick={handleSpin}
            disabled={spinsLeft <= 0 || mustSpin || isLoading || !!error?.includes('Whitelist won')}
          />
        ) : (
          <button
            className="mt-6 px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-lg font-semibold rounded-lg flex items-center gap-2 hover:from-orange-700 hover:to-orange-600 transition-all transform hover:scale-105"
            onClick={() => signIn('twitter')}
          >
            <FaTwitter className="w-5 h-5" />
            Sign in with Twitter to Play
          </button>
        )}

        {showModal && result && result !== 'free-spin' && isClient && (
          <ResultModal
            result={result}
            spinsLeft={spinsLeft}
            onClose={() => setShowModal(false)}
            onSubmit={handleWalletSubmit}
          />
        )}
      </div>
    </div>
  );
}