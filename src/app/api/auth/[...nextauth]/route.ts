import NextAuth, { NextAuthOptions } from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { clientPromise } from '@/lib/mongo';
import { connectMongoose } from '@/lib/mongo';
import { User } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

interface TwitterProfile {
  id: string;
  username: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0',
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET!,
  debug: process.env.NEXTAUTH_DEBUG === 'true',
  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'twitter') {
        try {
          await connectMongoose();
          const twitterProfile = profile as TwitterProfile;
          const twitterId = twitterProfile.id || user.id;
          const username = twitterProfile.username || user.name || 'Unknown';

          await User.findOneAndUpdate(
            { twitterId },
            {
              $set: {
                twitterId,
                username,
                createdAt: new Date(),
              },
            },
            { upsert: true, new: true }
          );

          if (process.env.NODE_ENV !== 'production') {
            console.log(`[SignIn] User upserted: ${twitterId}`);
          }
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('[SignIn Error]', error);
          }
          return false;
        }
      }
      return true;
    },

    async session({ session, token }) {
      try {
        await connectMongoose();
        const appUser = await User.findOne({ twitterId: token.id });

        if (appUser) {
          session.user.id = appUser.twitterId;
          session.user.name = appUser.username;

          if (process.env.NODE_ENV !== 'production') {
            console.log(`[Session] Loaded session for ${appUser.username}`);
          }
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[Session] No appUser found for twitterId:', token.id);
          }
        }

        return session;
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[Session Error]', error);
        }
        return session;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/spin',
    error: '/auth/error',
  },
};

// Rate-limited handler for NextAuth
interface RequestContext {
  params: Record<string, string>;
}

const handler = async (req: NextRequest, context: RequestContext) => {
  try {
    const rateLimitResult = await rateLimit(req);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const response = await NextAuth(authOptions)(req, context);
    return response || NextResponse.json({}, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[NextAuth Handler Error]', error);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export { handler as GET, handler as POST };
