import React from 'react';
import { Wheel } from 'react-custom-roulette';
import Image from 'next/image';

interface SpinWheelProps {
  mustSpin: boolean;
  prizeNumber: number;
  onStopSpinning: () => void;
}

const SpinWheel = ({ mustSpin, prizeNumber, onStopSpinning }: SpinWheelProps) => {
  const data = [
    { option: 'TRY AGAIN', style: { backgroundColor: '#000', textColor: '#f97316' } },
    { option: 'FREE SPIN', style: { backgroundColor: '#f97316', textColor: '#000' } },
    { option: 'TRY AGAIN', style: { backgroundColor: '#000', textColor: '#f97316' } },
    { option: 'WHITELIST', style: { backgroundColor: '#f8f5f7', textColor: '#f97316' } },
    { option: 'TRY AGAIN', style: { backgroundColor: '#000', textColor: '#f97316' } },
    { option: 'FREE SPIN', style: { backgroundColor: '#f97316', textColor: '#000' } },
  ];

  return (
    <div className="w-full max-w-md my-8">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        onStopSpinning={onStopSpinning}
        outerBorderColor="#f97316"
        outerBorderWidth={10}
        innerBorderColor="#000"
        radiusLineColor="#f97316"
        radiusLineWidth={2}
        fontSize={16}
        textDistance={70}
        spinDuration={0.6}
        pointerProps={{
          src: '/assets/nft2.png', 
          style: {
            width: '70px',
            top: '50px',
          }
        }}
      />
    </div>
  );
};

export default SpinWheel;