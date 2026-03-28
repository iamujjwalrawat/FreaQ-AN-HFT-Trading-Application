import { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || 'demo',
      clientSecret: process.env.GITHUB_SECRET || 'demo',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo',
    }),
    CredentialsProvider({
      name: 'Demo Account',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'demo@freaq.io' },
        password: { label: 'Password', type: 'password', placeholder: 'demo123' },
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          const demoAccounts = [
            { id: '1', email: 'demo@freaq.io', password: 'demo123', name: 'Demo Trader', image: null },
            { id: '2', email: 'trader@freaq.io', password: 'trade123', name: 'Pro Trader', image: null },
          ];

          const user = demoAccounts.find(
            (u) => u.email === credentials.email && u.password === credentials.password
          );

          if (user) {
            return { id: user.id, email: user.email, name: user.name, image: user.image };
          }

          // Allow any credentials for open demo
          return {
            id: Date.now().toString(),
            email: credentials.email,
            name: (credentials.email as string).split('@')[0],
            image: null,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.userId;
        (session.user as Record<string, unknown>).provider = token.provider;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || 'freaq-super-secret-key-change-in-production',
};
