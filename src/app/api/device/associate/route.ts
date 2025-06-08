import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectMongoose } from '@/lib/mongo';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deviceId } = await req.json();
    if (!deviceId) {
      return NextResponse.json({ error: 'Missing deviceId' }, { status: 400 });
    }

    await connectMongoose();
    const user = await User.findOne({ twitterId: session.user.id });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if deviceId is already associated with another user
    const existingDeviceUser = await User.findOne({ deviceId });
    if (existingDeviceUser && existingDeviceUser.twitterId !== user.twitterId) {
      return NextResponse.json({ error: 'Device already associated with another account' }, { status: 403 });
    }

    user.deviceId = deviceId;
    await user.save();

    return NextResponse.json({ message: 'Device associated successfully' });
  } catch (error) {
    console.error('Error in /api/device/associate POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}