import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectMongoose } from '@/lib/mongo';
import { User } from '@/models/User';
import { rateLimit } from '@/lib/rateLimit';

// Constants for spin logic
const DAILY_SPINS = 2;
const WHEEL_SEGMENTS = ['SPIN LOST', 'FREE SPIN', 'SPIN LOST', 'WHITELIST', 'SPIN LOST', 'FREE SPIN'];
const RESULT_MAP: { [key: string]: string } = {
  WHITELIST: 'whitelist',
  'FREE SPIN': 'free-spin',
  'SPIN LOST': 'empty',
};

export async function GET(req: NextRequest) {
  const rateLimitResult = await rateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoose();
    const user = await User.findOne({ twitterId: session.user.id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Whitelist check
    if (user.whitelistWon) {
      return NextResponse.json({
        spinsLeft: 0,
        message: 'Whitelist won! Thanks for participating.',
        canSpin: false,
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const lastSpinDate = user.lastSpinDate ? user.lastSpinDate.toISOString().split('T')[0] : null;
    if (lastSpinDate !== today) {
      user.spinsUsed = 0;
      user.lastSpinDate = new Date();
      await user.save();
    }

    const spinsLeft = DAILY_SPINS - user.spinsUsed + user.freeSpins;
    return NextResponse.json({ spinsLeft, canSpin: true });
  } catch (error) {
    console.error('Error in /api/spin GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const rateLimitResult = await rateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoose();
    const user = await User.findOne({ twitterId: session.user.id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Whitelist check
    if (user.whitelistWon) {
      return NextResponse.json({
        error: 'Whitelist won! No more spins allowed.',
        spinsLeft: 0,
        canSpin: false,
      }, { status: 403 });
    }

    const today = new Date().toISOString().split('T')[0];
    const lastSpinDate = user.lastSpinDate ? user.lastSpinDate.toISOString().split('T')[0] : null;
    if (lastSpinDate !== today) {
      user.spinsUsed = 0;
      user.lastSpinDate = new Date();
    }

    const spinsLeft = DAILY_SPINS - user.spinsUsed + user.freeSpins;
    if (spinsLeft <= 0) {
      return NextResponse.json({ error: 'No spins left' }, { status: 400 });
    }

    if (user.freeSpins > 0) {
      user.freeSpins -= 1;
    } else {
      user.spinsUsed += 1;
    }
    user.lastSpinDate = new Date();

    // Define weighted probabilities
    const probabilities = [
      { option: 'SPIN LOST', weight: 0.93 }, // 93% chance
      { option: 'FREE SPIN', weight: 0.06 }, // 6% chance
      { option: 'WHITELIST', weight: 0.01 }, // 1% chance
    ];

    // Normalize weights to sum to 1 (optional safeguard)
    const totalWeight = probabilities.reduce((sum, p) => sum + p.weight, 0);
    const normalizedProbabilities = probabilities.map(p => ({
      option: p.option,
      weight: p.weight / totalWeight,
    }));

    // Generate a random number between 0 and 1
    const rand = Math.random();
    let cumulative = 0;
    let selectedOption = 'SPIN LOST'; // Default to 'SPIN LOST'

    for (const prob of normalizedProbabilities) {
      cumulative += prob.weight;
      if (rand <= cumulative) {
        selectedOption = prob.option;
        break;
      }
    }

    // Map selected option to a random prizeNumber from matching segments
    const possibleIndices = WHEEL_SEGMENTS.reduce((indices, segment, index) => {
      if (segment === selectedOption) indices.push(index);
      return indices;
    }, [] as number[]);
    const prizeNumber = possibleIndices[Math.floor(Math.random() * possibleIndices.length)] || 0; // Fallback to 0 if no match

    const result = RESULT_MAP[selectedOption];

    if (result === 'free-spin') {
      user.freeSpins += 1;
    } else if (result === 'whitelist') {
      user.whitelistWon = true;
    }

    await user.save();

    return NextResponse.json({
      prizeNumber,
      result,
      spinsLeft: spinsLeft - 1,
      canSpin: !user.whitelistWon,
    });
  } catch (error) {
    console.error('Error in /api/spin POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}