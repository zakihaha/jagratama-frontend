import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { API_V1_BASE_URL } from "./lib/config";

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

        const res = await fetch(`${API_V1_BASE_URL}/auth/login`, {
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

        return {
          id: user.data.id,
          name: user.data.name,
          email: user.data.email,
          token: user.data.token,
          position: user.data.position,
          role: user.data.role,
          // image: user.image || null, // Optional: if your API returns an image URL
        };
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user is not null, it means the user just logged in
      // and we can add the user information to the token (create a JWT)
      if (user) {
        token.accessToken = (user as any).token; // Store your API token inside the JWT
        token.role = (user as any).role; // Store user role
        token.id = (user as any).id; // Store user id
        token.position = (user as any).position; // Store user position
        // token.image = (user as any).image; // Optional: if your API returns an image URL
      }

      // // check jwt expiration
      // const isExpired = (token as any).exp < Date.now() / 1000;
      // if (isExpired) {
      //   console.log("Token expired, refreshing...");
      //   token = await refreshAccessToken(token);
      // }

      return token;
    },
    async session({ session, token }) {
      // custom data to be sent to the client
      if (session.user) {
        (session as any).user.id = token.id; // Add user id to session
        (session as any).accessToken = token.accessToken;
        (session as any).user.role = token.role; // Add user role to session
        (session as any).user.position = token.position; // Add user position to session
      }
      
      return session;
    },
  },
})

async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(`${API_V1_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const refreshed = await res.json();

    if (!res.ok) throw refreshed;

    return {
      ...token,
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken
    };
  } catch (err) {
    console.error("Failed to refresh token", err);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
