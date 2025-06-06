import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectMongoose } from '@/lib/mongo';
import { WhitelistWinner } from '@/models/WhitelistWinner';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { walletAddress } = await req.json();
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    await connectMongoose();

    // Check for duplicate submission
    const existingWinner = await WhitelistWinner.findOne({ twitterId: session.user.id });
    if (existingWinner) {
      return NextResponse.json({ error: 'Already submitted' }, { status: 400 });
    }

    const winner = new WhitelistWinner({
      twitterId: session.user.id,
      username: session.user.name || 'Unknown',
      walletAddress,
    });

    await winner.save();

    return NextResponse.json({ message: 'Wallet address submitted successfully' });
  } catch (error) {
    console.error('Error in /api/whitelist POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}