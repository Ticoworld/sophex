import React from 'react';
import { FaSync } from 'react-icons/fa';

const SpinCounter = ({ spinsLeft }: { spinsLeft: number }) => {
  return (
    <div className="mb-6 p-4 bg-black rounded-lg border border-orange-500">
      <div className="flex items-center justify-center">
        <div className="mr-3 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
          <span className="text-black font-bold">{spinsLeft}</span>
        </div>
        <span className="text-xl text-orange-300">
          {spinsLeft === 1 ? '1 spin remaining' : `${spinsLeft} spins remaining`}
        </span>
      </div>
      <p className="text-center text-orange-400 text-sm mt-2 flex items-center justify-center gap-1">
        <FaSync /> Resets daily at 00:00 UTC
      </p>
    </div>
  );
};

export default SpinCounter;