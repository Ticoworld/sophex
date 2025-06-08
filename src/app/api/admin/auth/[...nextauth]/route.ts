import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectMongoose } from '@/lib/mongo';
import { Admin } from '@/models/Admin';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimitAdmin } from '@/lib/rateLimit';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[Auth] Missing credentials');
          }
          throw new Error('Missing credentials');
        }

        try {
          await connectMongoose();
          const admin = await Admin.findOne({ email: credentials.email });

          if (!admin) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn('[Auth] Admin not found');
            }
            throw new Error('Invalid email or password');
          }

          const isValid = await bcrypt.compare(credentials.password, admin.password);
          if (!isValid) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn('[Auth] Invalid password');
            }
            throw new Error('Invalid email or password');
          }

          return { id: admin._id.toString(), email: admin.email };
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('[Auth] Error in authorize:', error);
          }
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin',
  },
  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name: 'admin.next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: 'admin.next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: 'admin.next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_ADMIN_SECRET,
  debug: process.env.NEXTAUTH_DEBUG_ADMIN === 'true',
};

// Wrap NextAuth handler with rate limiting
interface RequestContext {
  params: Record<string, string>;
}

const handler = async (req: NextRequest, context: RequestContext) => {
  try {
    const rateLimitResult = await rateLimitAdmin(req);
    if (rateLimitResult) return rateLimitResult;

    const response = await NextAuth(authOptions)(req, context);
    return response || NextResponse.json({}, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[NextAuth] Handler error:', error);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export { handler as GET, handler as POST };
