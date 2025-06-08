import NextAuth, { NextAuthOptions } from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { clientPromise } from '@/lib/mongo';
import { connectMongoose } from '@/lib/mongo';
import { User } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

interface TwitterProfile {
  data: {
    id: string;
    username: string;
    name: string;
    profile_image_url?: string;
  };
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
          const twitterProfile = profile as { data: TwitterProfile['data'] };
          const twitterId = twitterProfile.data.id;
          console.log('[SignIn] Full profile:', profile);

          if (!twitterId) {
            console.error('[SignIn] Missing twitterId in profile.data:', profile);
            return false;
          }

          const username = twitterProfile.data.username || user.name || 'Unknown';
          const existingUser = await User.findOne({ twitterId });
          if (!existingUser) {
            await User.create({
              twitterId,
              username,
              createdAt: new Date(),
            });
            console.log(`[SignIn] New user created: ${twitterId}`);
          } else {
            await User.findOneAndUpdate(
              { twitterId },
              { $set: { username } },
              { new: true }
            );
            console.log(`[SignIn] User updated: ${twitterId}`);
          }
        } catch (error) {
          console.error('[SignIn Error]', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (account?.provider === 'twitter' && profile) {
        const twitterProfile = profile as { data: TwitterProfile['data'] };
        token.id = twitterProfile.data.id;
        console.log('[JWT] Token updated with id:', token.id);
      }
      return token;
    },
    async session({ session, token }) {
      try {
        await connectMongoose();
        const appUser = await User.findOne({ twitterId: token.id as string });
        if (appUser) {
          session.user.id = appUser.twitterId;
          session.user.name = appUser.username;
          console.log(`[Session] Loaded session for ${appUser.username}, id: ${appUser.twitterId}`);
        } else {
          console.warn('[Session] No appUser found for twitterId:', token.id);
        }
      } catch (error) {
        console.error('[Session Error]', error);
      }
      return session;
    },
  },
  pages: {
    signIn: '/spin',
    error: '/auth/error',
  },
};

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