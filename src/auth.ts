import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Input your email" },
        password: { label: "Password", type: "password", placeholder: "Input your password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        console.log("Credentials", JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }));

        const res = await fetch("http://localhost:8000/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });
        const user = await res.json();

        if (!res.ok) {
          throw new Error(user.message || "Login failed");
        }

        return user.data; // user should contain at least { id, name, email, token }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token; // Store your API token inside the JWT
        token.role = (user as any).role; // Store user role
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as any).accessToken = token.accessToken;
        (session as any).user.role = token.role; // Add user role to session
      }
      return session;
    },
  },
})
