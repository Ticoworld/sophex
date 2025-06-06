import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectMongoose } from '@/lib/mongo';
import { Admin } from '@/models/Admin';
import { rateLimitAdmin } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimitAdmin(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    await connectMongoose();
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin account already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'No admin account exists' }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/admin/signup GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimitAdmin(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    await connectMongoose();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin account already exists' }, { status: 400 });
    }

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    return NextResponse.json({ message: 'Admin created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error in /api/admin/signup POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}