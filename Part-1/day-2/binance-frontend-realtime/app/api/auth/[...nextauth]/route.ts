import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Example check:
        if (credentials.email === "demo@example.com" && credentials.password === "demo") {
          return {
            id: "1",
            email: "demo@example.com",
            name: "Demo User",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

// Pass our config to NextAuth, which returns a request handler
const handler = NextAuth(authOptions);

// Export that handler for both GET and POST:
export { handler as GET, handler as POST }; 