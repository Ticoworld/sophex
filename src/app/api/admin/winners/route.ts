import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/admin/auth/[...nextauth]/route';
import { connectMongoose } from '@/lib/mongo';
import { WhitelistWinner } from '@/models/WhitelistWinner';
import { Parser } from 'json2csv';
import { rateLimitAdmin } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimitAdmin(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoose();
    const winners = await WhitelistWinner.find().select('username walletAddress claimedAt');

    const searchParams = req.nextUrl.searchParams;
    if (searchParams.get('export') === 'csv') {
      const fields = ['twitterHandle', 'walletAddress', 'claimedAt'];
      const parser = new Parser({ fields });
      const csv = parser.parse(winners.map(w => ({
        twitterHandle: w.username,
        walletAddress: w.walletAddress,
        claimedAt: w.claimedAt?.toISOString(),
      })));
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=winners.csv',
        },
      });
    }

    return NextResponse.json(winners.map(w => ({
      twitterHandle: w.username,
      walletAddress: w.walletAddress,
      whitelistWon: true,
      lastSpinDate: w.claimedAt?.toISOString(),
    })));
  } catch (error) {
    console.error('Error in /api/admin/winners GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}