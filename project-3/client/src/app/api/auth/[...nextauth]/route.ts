import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // Optional: Add custom sign-in logic
      // For example, you might want to restrict to specific email domains
      // if (profile?.email?.endsWith('@yourdomain.com')) {
      //   return true;
      // }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative redirects after sign-in
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin', // Optional: custom sign-in page
  },
  debug: true, // Add debug mode to see more information
});

export { handler as GET, handler as POST };