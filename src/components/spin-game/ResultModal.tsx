import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FaTimes, FaWallet, FaGift } from 'react-icons/fa';

const Confetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

interface ResultModalProps {
  result: string;
  spinsLeft: number;
  onClose: () => void;
  onSubmit: (wallet: string) => void;
}

const ResultModal = ({ result, spinsLeft, onClose, onSubmit }: ResultModalProps) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (result === 'whitelist') {
      setShowConfetti(true);
    }
    
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }, [result]);

  const getTitle = () => {
    switch(result) {
      case 'whitelist':
        return <div className="flex items-center justify-center gap-2"><FaGift className="text-orange-500" /> YOU WON A WHITELIST SPOT!</div>;
      default:
        return <div className="flex items-center justify-center gap-2"><FaGift className="text-orange-500" /> TRY AGAIN</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      {showConfetti && typeof window !== 'undefined' && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={['#f97316', '#f59e0b', '#eab308']}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
      
      <div className="bg-black rounded-xl p-8 max-w-md w-full mx-4 relative border-2 border-orange-500">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-orange-400 hover:text-orange-300"
        >
          <FaTimes />
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-6 text-orange-400">
          {getTitle()}
        </h2>
        
        {result === 'whitelist' ? (
          <div className="space-y-4">
            <p className="text-center text-orange-200">
              Congratulations! You&apos;ve won a rare whitelist spot. 
              Submit your wallet address (Erc-20) to claim your spot.
            </p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaWallet className="text-orange-400" />
              </div>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="w-full pl-10 pr-4 py-2 rounded border border-orange-500 bg-gray-900 text-orange-200 placeholder-orange-400"
              />
            </div>
            <button
              onClick={() => onSubmit(walletAddress)}
              disabled={!walletAddress.trim()}
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg font-bold disabled:opacity-50 text-black flex items-center justify-center gap-2"
            >
              <FaGift /> CLAIM WHITELIST SPOT
            </button>
          </div>
        ) : (
          <div className="text-center">
            {spinsLeft > 0 ? (
              <p className="mb-6 text-orange-200">Spin lost this time, but you have {spinsLeft} spin(s) left! Try again now.</p>
            ) : (
              <p className="mb-6 text-orange-200">No win this time, but come back tomorrow for more chances!</p>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg font-bold text-black"
            >
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultModal;