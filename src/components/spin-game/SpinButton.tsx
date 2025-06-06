import React from 'react';
import { FaRedo } from 'react-icons/fa';

const SpinButton = ({ onClick, disabled }: { 
  onClick: () => void; 
  disabled: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`mt-8 px-8 py-4 rounded-lg text-xl font-bold transition-all duration-300 flex items-center gap-2 ${
        disabled 
          ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
          : 'bg-gradient-to-r from-orange-600 to-orange-500 text-black hover:from-orange-700 hover:to-orange-600 transform hover:scale-105 shadow-lg shadow-orange-500/30'
      }`}
    >
      <FaRedo /> SPIN THE WHEEL
    </button>
  );
};

export default SpinButton;